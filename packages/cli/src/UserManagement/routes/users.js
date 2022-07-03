"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersNamespace = void 0;
const typeorm_1 = require("typeorm");
const validator_1 = __importDefault(require("validator"));
const n8n_workflow_1 = require("n8n-workflow");
const __1 = require("../..");
const UserManagementHelper_1 = require("../UserManagementHelper");
const User_1 = require("../../databases/entities/User");
const SharedWorkflow_1 = require("../../databases/entities/SharedWorkflow");
const SharedCredentials_1 = require("../../databases/entities/SharedCredentials");
const UserManagementMailer = __importStar(require("../email/UserManagementMailer"));
const config = __importStar(require("../../../config"));
const jwt_1 = require("../auth/jwt");
function usersNamespace() {
    /**
     * Send email invite(s) to one or multiple users and create user shell(s).
     */
    this.app.post(`/${this.restEndpoint}/users`, __1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
        if (config.getEnv('userManagement.emails.mode') === '') {
            n8n_workflow_1.LoggerProxy.debug('Request to send email invite(s) to user(s) failed because emailing was not set up');
            throw new __1.ResponseHelper.ResponseError('Email sending must be set up in order to request a password reset email', undefined, 500);
        }
        let mailer;
        try {
            mailer = yield UserManagementMailer.getInstance();
        }
        catch (error) {
            if (error instanceof Error) {
                throw new __1.ResponseHelper.ResponseError(`There is a problem with your SMTP setup! ${error.message}`, undefined, 500);
            }
        }
        // TODO: this should be checked in the middleware rather than here
        if ((0, UserManagementHelper_1.isUserManagementDisabled)()) {
            n8n_workflow_1.LoggerProxy.debug('Request to send email invite(s) to user(s) failed because user management is disabled');
            throw new __1.ResponseHelper.ResponseError('User management is disabled');
        }
        if (!config.getEnv('userManagement.isInstanceOwnerSetUp')) {
            n8n_workflow_1.LoggerProxy.debug('Request to send email invite(s) to user(s) failed because the owner account is not set up');
            throw new __1.ResponseHelper.ResponseError('You must set up your own account before inviting others', undefined, 400);
        }
        if (!Array.isArray(req.body)) {
            n8n_workflow_1.LoggerProxy.debug('Request to send email invite(s) to user(s) failed because the payload is not an array', {
                payload: req.body,
            });
            throw new __1.ResponseHelper.ResponseError('Invalid payload', undefined, 400);
        }
        if (!req.body.length)
            return [];
        const createUsers = {};
        // Validate payload
        req.body.forEach((invite) => {
            if (typeof invite !== 'object' || !invite.email) {
                throw new __1.ResponseHelper.ResponseError('Request to send email invite(s) to user(s) failed because the payload is not an array shaped Array<{ email: string }>', undefined, 400);
            }
            if (!validator_1.default.isEmail(invite.email)) {
                n8n_workflow_1.LoggerProxy.debug('Invalid email in payload', { invalidEmail: invite.email });
                throw new __1.ResponseHelper.ResponseError(`Request to send email invite(s) to user(s) failed because of an invalid email address: ${invite.email}`, undefined, 400);
            }
            createUsers[invite.email.toLowerCase()] = null;
        });
        const role = yield __1.Db.collections.Role.findOne({ scope: 'global', name: 'member' });
        if (!role) {
            n8n_workflow_1.LoggerProxy.error('Request to send email invite(s) to user(s) failed because no global member role was found in database');
            throw new __1.ResponseHelper.ResponseError('Members role not found in database - inconsistent state', undefined, 500);
        }
        // remove/exclude existing users from creation
        const existingUsers = yield __1.Db.collections.User.find({
            where: { email: (0, typeorm_1.In)(Object.keys(createUsers)) },
        });
        existingUsers.forEach((user) => {
            if (user.password) {
                delete createUsers[user.email];
                return;
            }
            createUsers[user.email] = user.id;
        });
        const usersToSetUp = Object.keys(createUsers).filter((email) => createUsers[email] === null);
        const total = usersToSetUp.length;
        n8n_workflow_1.LoggerProxy.debug(total > 1 ? `Creating ${total} user shells...` : `Creating 1 user shell...`);
        try {
            yield __1.Db.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                return Promise.all(usersToSetUp.map((email) => __awaiter(this, void 0, void 0, function* () {
                    const newUser = Object.assign(new User_1.User(), {
                        email,
                        globalRole: role,
                    });
                    const savedUser = yield transactionManager.save(newUser);
                    createUsers[savedUser.email] = savedUser.id;
                    return savedUser;
                })));
            }));
            void __1.InternalHooksManager.getInstance().onUserInvite({
                user_id: req.user.id,
                target_user_id: Object.values(createUsers),
                public_api: false,
            });
        }
        catch (error) {
            n8n_workflow_1.LoggerProxy.error('Failed to create user shells', { userShells: createUsers });
            throw new __1.ResponseHelper.ResponseError('An error occurred during user creation');
        }
        n8n_workflow_1.LoggerProxy.info('Created user shell(s) successfully', { userId: req.user.id });
        n8n_workflow_1.LoggerProxy.verbose(total > 1 ? `${total} user shells created` : `1 user shell created`, {
            userShells: createUsers,
        });
        const baseUrl = (0, UserManagementHelper_1.getInstanceBaseUrl)();
        const usersPendingSetup = Object.entries(createUsers).filter(([email, id]) => id && email);
        // send invite email to new or not yet setup users
        const emailingResults = yield Promise.all(usersPendingSetup.map(([email, id]) => __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            const inviteAcceptUrl = `${baseUrl}/signup?inviterId=${req.user.id}&inviteeId=${id}`;
            const result = yield (mailer === null || mailer === void 0 ? void 0 : mailer.invite({
                email,
                inviteAcceptUrl,
                domain: baseUrl,
            }));
            const resp = {
                user: {
                    id,
                    email,
                },
            };
            if (result === null || result === void 0 ? void 0 : result.success) {
                void __1.InternalHooksManager.getInstance().onUserTransactionalEmail({
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    user_id: id,
                    message_type: 'New user invite',
                    public_api: false,
                });
            }
            else {
                void __1.InternalHooksManager.getInstance().onEmailFailed({
                    user_id: req.user.id,
                    message_type: 'New user invite',
                    public_api: false,
                });
                n8n_workflow_1.LoggerProxy.error('Failed to send email', {
                    userId: req.user.id,
                    inviteAcceptUrl,
                    domain: baseUrl,
                    email,
                });
                resp.error = `Email could not be sent`;
            }
            return resp;
        })));
        n8n_workflow_1.LoggerProxy.debug(usersPendingSetup.length > 1
            ? `Sent ${usersPendingSetup.length} invite emails successfully`
            : `Sent 1 invite email successfully`, { userShells: createUsers });
        return emailingResults;
    })));
    /**
     * Validate invite token to enable invitee to set up their account.
     *
     * Authless endpoint.
     */
    this.app.get(`/${this.restEndpoint}/resolve-signup-token`, __1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
        const { inviterId, inviteeId } = req.query;
        if (!inviterId || !inviteeId) {
            n8n_workflow_1.LoggerProxy.debug('Request to resolve signup token failed because of missing user IDs in query string', { inviterId, inviteeId });
            throw new __1.ResponseHelper.ResponseError('Invalid payload', undefined, 400);
        }
        // Postgres validates UUID format
        for (const userId of [inviterId, inviteeId]) {
            if (!validator_1.default.isUUID(userId)) {
                n8n_workflow_1.LoggerProxy.debug('Request to resolve signup token failed because of invalid user ID', {
                    userId,
                });
                throw new __1.ResponseHelper.ResponseError('Invalid userId', undefined, 400);
            }
        }
        const users = yield __1.Db.collections.User.find({ where: { id: (0, typeorm_1.In)([inviterId, inviteeId]) } });
        if (users.length !== 2) {
            n8n_workflow_1.LoggerProxy.debug('Request to resolve signup token failed because the ID of the inviter and/or the ID of the invitee were not found in database', { inviterId, inviteeId });
            throw new __1.ResponseHelper.ResponseError('Invalid invite URL', undefined, 400);
        }
        const invitee = users.find((user) => user.id === inviteeId);
        if (!invitee || invitee.password) {
            n8n_workflow_1.LoggerProxy.error('Invalid invite URL - invitee already setup', {
                inviterId,
                inviteeId,
            });
            throw new __1.ResponseHelper.ResponseError('The invitation was likely either deleted or already claimed', undefined, 400);
        }
        const inviter = users.find((user) => user.id === inviterId);
        if (!inviter || !inviter.email || !inviter.firstName) {
            n8n_workflow_1.LoggerProxy.error('Request to resolve signup token failed because inviter does not exist or is not set up', {
                inviterId: inviter === null || inviter === void 0 ? void 0 : inviter.id,
            });
            throw new __1.ResponseHelper.ResponseError('Invalid request', undefined, 400);
        }
        void __1.InternalHooksManager.getInstance().onUserInviteEmailClick({
            user_id: inviteeId,
        });
        const { firstName, lastName } = inviter;
        return { inviter: { firstName, lastName } };
    })));
    /**
     * Fill out user shell with first name, last name, and password.
     *
     * Authless endpoint.
     */
    this.app.post(`/${this.restEndpoint}/users/:id`, __1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
        const { id: inviteeId } = req.params;
        const { inviterId, firstName, lastName, password } = req.body;
        if (!inviterId || !inviteeId || !firstName || !lastName || !password) {
            n8n_workflow_1.LoggerProxy.debug('Request to fill out a user shell failed because of missing properties in payload', { payload: req.body });
            throw new __1.ResponseHelper.ResponseError('Invalid payload', undefined, 400);
        }
        const validPassword = (0, UserManagementHelper_1.validatePassword)(password);
        const users = yield __1.Db.collections.User.find({
            where: { id: (0, typeorm_1.In)([inviterId, inviteeId]) },
            relations: ['globalRole'],
        });
        if (users.length !== 2) {
            n8n_workflow_1.LoggerProxy.debug('Request to fill out a user shell failed because the inviter ID and/or invitee ID were not found in database', {
                inviterId,
                inviteeId,
            });
            throw new __1.ResponseHelper.ResponseError('Invalid payload or URL', undefined, 400);
        }
        const invitee = users.find((user) => user.id === inviteeId);
        if (invitee.password) {
            n8n_workflow_1.LoggerProxy.debug('Request to fill out a user shell failed because the invite had already been accepted', { inviteeId });
            throw new __1.ResponseHelper.ResponseError('This invite has been accepted already', undefined, 400);
        }
        invitee.firstName = firstName;
        invitee.lastName = lastName;
        invitee.password = yield (0, UserManagementHelper_1.hashPassword)(validPassword);
        const updatedUser = yield __1.Db.collections.User.save(invitee);
        yield (0, jwt_1.issueCookie)(res, updatedUser);
        void __1.InternalHooksManager.getInstance().onUserSignup({
            user_id: invitee.id,
        });
        return (0, UserManagementHelper_1.sanitizeUser)(updatedUser);
    })));
    this.app.get(`/${this.restEndpoint}/users`, __1.ResponseHelper.send(() => __awaiter(this, void 0, void 0, function* () {
        const users = yield __1.Db.collections.User.find({ relations: ['globalRole'] });
        return users.map((user) => (0, UserManagementHelper_1.sanitizeUser)(user, ['personalizationAnswers']));
    })));
    /**
     * Delete a user. Optionally, designate a transferee for their workflows and credentials.
     */
    this.app.delete(`/${this.restEndpoint}/users/:id`, 
    // @ts-ignore
    __1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
        const { id: idToDelete } = req.params;
        if (req.user.id === idToDelete) {
            n8n_workflow_1.LoggerProxy.debug('Request to delete a user failed because it attempted to delete the requesting user', { userId: req.user.id });
            throw new __1.ResponseHelper.ResponseError('Cannot delete your own user', undefined, 400);
        }
        const { transferId } = req.query;
        if (transferId === idToDelete) {
            throw new __1.ResponseHelper.ResponseError('Request to delete a user failed because the user to delete and the transferee are the same user', undefined, 400);
        }
        const users = yield __1.Db.collections.User.find({
            where: { id: (0, typeorm_1.In)([transferId, idToDelete]) },
        });
        if (!users.length || (transferId && users.length !== 2)) {
            throw new __1.ResponseHelper.ResponseError('Request to delete a user failed because the ID of the user to delete and/or the ID of the transferee were not found in DB', undefined, 404);
        }
        const userToDelete = users.find((user) => user.id === req.params.id);
        if (transferId) {
            const transferee = users.find((user) => user.id === transferId);
            yield __1.Db.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                yield transactionManager.update(SharedWorkflow_1.SharedWorkflow, { user: userToDelete }, { user: transferee });
                yield transactionManager.update(SharedCredentials_1.SharedCredentials, { user: userToDelete }, { user: transferee });
                yield transactionManager.delete(User_1.User, { id: userToDelete.id });
            }));
            return { success: true };
        }
        const [ownedSharedWorkflows, ownedSharedCredentials] = yield Promise.all([
            __1.Db.collections.SharedWorkflow.find({
                relations: ['workflow'],
                where: { user: userToDelete },
            }),
            __1.Db.collections.SharedCredentials.find({
                relations: ['credentials'],
                where: { user: userToDelete },
            }),
        ]);
        yield __1.Db.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
            const ownedWorkflows = yield Promise.all(ownedSharedWorkflows.map(({ workflow }) => __awaiter(this, void 0, void 0, function* () {
                if (workflow.active) {
                    // deactivate before deleting
                    yield this.activeWorkflowRunner.remove(workflow.id.toString());
                }
                return workflow;
            })));
            yield transactionManager.remove(ownedWorkflows);
            yield transactionManager.remove(ownedSharedCredentials.map(({ credentials }) => credentials));
            yield transactionManager.delete(User_1.User, { id: userToDelete.id });
        }));
        const telemetryData = {
            user_id: req.user.id,
            target_user_old_status: userToDelete.isPending ? 'invited' : 'active',
            target_user_id: idToDelete,
        };
        telemetryData.migration_strategy = transferId ? 'transfer_data' : 'delete_data';
        if (transferId) {
            telemetryData.migration_user_id = transferId;
        }
        void __1.InternalHooksManager.getInstance().onUserDeletion(req.user.id, telemetryData, false);
        return { success: true };
    })));
    /**
     * Resend email invite to user.
     */
    this.app.post(`/${this.restEndpoint}/users/:id/reinvite`, __1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
        const { id: idToReinvite } = req.params;
        if (!(0, UserManagementHelper_1.isEmailSetUp)()) {
            n8n_workflow_1.LoggerProxy.error('Request to reinvite a user failed because email sending was not set up');
            throw new __1.ResponseHelper.ResponseError('Email sending must be set up in order to invite other users', undefined, 500);
        }
        const reinvitee = yield __1.Db.collections.User.findOne({ id: idToReinvite });
        if (!reinvitee) {
            n8n_workflow_1.LoggerProxy.debug('Request to reinvite a user failed because the ID of the reinvitee was not found in database');
            throw new __1.ResponseHelper.ResponseError('Could not find user', undefined, 404);
        }
        if (reinvitee.password) {
            n8n_workflow_1.LoggerProxy.debug('Request to reinvite a user failed because the invite had already been accepted', { userId: reinvitee.id });
            throw new __1.ResponseHelper.ResponseError('User has already accepted the invite', undefined, 400);
        }
        const baseUrl = (0, UserManagementHelper_1.getInstanceBaseUrl)();
        const inviteAcceptUrl = `${baseUrl}/signup?inviterId=${req.user.id}&inviteeId=${reinvitee.id}`;
        let mailer;
        try {
            mailer = yield UserManagementMailer.getInstance();
        }
        catch (error) {
            if (error instanceof Error) {
                throw new __1.ResponseHelper.ResponseError(error.message, undefined, 500);
            }
        }
        const result = yield (mailer === null || mailer === void 0 ? void 0 : mailer.invite({
            email: reinvitee.email,
            inviteAcceptUrl,
            domain: baseUrl,
        }));
        if (!(result === null || result === void 0 ? void 0 : result.success)) {
            void __1.InternalHooksManager.getInstance().onEmailFailed({
                user_id: req.user.id,
                message_type: 'Resend invite',
                public_api: false,
            });
            n8n_workflow_1.LoggerProxy.error('Failed to send email', {
                email: reinvitee.email,
                inviteAcceptUrl,
                domain: baseUrl,
            });
            throw new __1.ResponseHelper.ResponseError(`Failed to send email to ${reinvitee.email}`, undefined, 500);
        }
        void __1.InternalHooksManager.getInstance().onUserReinvite({
            user_id: req.user.id,
            target_user_id: reinvitee.id,
            public_api: false,
        });
        void __1.InternalHooksManager.getInstance().onUserTransactionalEmail({
            user_id: reinvitee.id,
            message_type: 'Resend invite',
            public_api: false,
        });
        return { success: true };
    })));
}
exports.usersNamespace = usersNamespace;

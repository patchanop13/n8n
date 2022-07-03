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
exports.ownerNamespace = void 0;
const validator_1 = __importDefault(require("validator"));
const n8n_workflow_1 = require("n8n-workflow");
const __1 = require("../..");
const config = __importStar(require("../../../config"));
const GenericHelpers_1 = require("../../GenericHelpers");
const jwt_1 = require("../auth/jwt");
const UserManagementHelper_1 = require("../UserManagementHelper");
function ownerNamespace() {
    /**
     * Promote a shell into the owner of the n8n instance,
     * and enable `isInstanceOwnerSetUp` setting.
     */
    this.app.post(`/${this.restEndpoint}/owner`, __1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
        const { email, firstName, lastName, password } = req.body;
        const { id: userId } = req.user;
        if (config.getEnv('userManagement.isInstanceOwnerSetUp')) {
            n8n_workflow_1.LoggerProxy.debug('Request to claim instance ownership failed because instance owner already exists', {
                userId,
            });
            throw new __1.ResponseHelper.ResponseError('Invalid request', undefined, 400);
        }
        if (!email || !validator_1.default.isEmail(email)) {
            n8n_workflow_1.LoggerProxy.debug('Request to claim instance ownership failed because of invalid email', {
                userId,
                invalidEmail: email,
            });
            throw new __1.ResponseHelper.ResponseError('Invalid email address', undefined, 400);
        }
        const validPassword = (0, UserManagementHelper_1.validatePassword)(password);
        if (!firstName || !lastName) {
            n8n_workflow_1.LoggerProxy.debug('Request to claim instance ownership failed because of missing first name or last name in payload', { userId, payload: req.body });
            throw new __1.ResponseHelper.ResponseError('First and last names are mandatory', undefined, 400);
        }
        let owner = yield __1.Db.collections.User.findOne(userId, {
            relations: ['globalRole'],
        });
        if (!owner || (owner.globalRole.scope === 'global' && owner.globalRole.name !== 'owner')) {
            n8n_workflow_1.LoggerProxy.debug('Request to claim instance ownership failed because user shell does not exist or has wrong role!', {
                userId,
            });
            throw new __1.ResponseHelper.ResponseError('Invalid request', undefined, 400);
        }
        owner = Object.assign(owner, {
            email,
            firstName,
            lastName,
            password: yield (0, UserManagementHelper_1.hashPassword)(validPassword),
        });
        yield (0, GenericHelpers_1.validateEntity)(owner);
        owner = yield __1.Db.collections.User.save(owner);
        n8n_workflow_1.LoggerProxy.info('Owner was set up successfully', { userId: req.user.id });
        yield __1.Db.collections.Settings.update({ key: 'userManagement.isInstanceOwnerSetUp' }, { value: JSON.stringify(true) });
        config.set('userManagement.isInstanceOwnerSetUp', true);
        n8n_workflow_1.LoggerProxy.debug('Setting isInstanceOwnerSetUp updated successfully', { userId: req.user.id });
        yield (0, jwt_1.issueCookie)(res, owner);
        void __1.InternalHooksManager.getInstance().onInstanceOwnerSetup({
            user_id: userId,
        });
        return (0, UserManagementHelper_1.sanitizeUser)(owner);
    })));
    /**
     * Persist that the instance owner setup has been skipped
     */
    this.app.post(`/${this.restEndpoint}/owner/skip-setup`, 
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __1.ResponseHelper.send((_req, _res) => __awaiter(this, void 0, void 0, function* () {
        yield __1.Db.collections.Settings.update({ key: 'userManagement.skipInstanceOwnerSetup' }, { value: JSON.stringify(true) });
        config.set('userManagement.skipInstanceOwnerSetup', true);
        return { success: true };
    })));
}
exports.ownerNamespace = ownerNamespace;

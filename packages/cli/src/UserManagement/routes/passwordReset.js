"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/no-cycle */
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
exports.passwordResetNamespace = void 0;
const uuid_1 = require("uuid");
const url_1 = require("url");
const validator_1 = __importDefault(require("validator"));
const typeorm_1 = require("typeorm");
const n8n_workflow_1 = require("n8n-workflow");
const __1 = require("../..");
const UserManagementHelper_1 = require("../UserManagementHelper");
const UserManagementMailer = __importStar(require("../email"));
const jwt_1 = require("../auth/jwt");
const config = __importStar(require("../../../config"));
function passwordResetNamespace() {
    /**
     * Send a password reset email.
     *
     * Authless endpoint.
     */
    this.app.post(`/${this.restEndpoint}/forgot-password`, __1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
        if (config.getEnv('userManagement.emails.mode') === '') {
            n8n_workflow_1.LoggerProxy.debug('Request to send password reset email failed because emailing was not set up');
            throw new __1.ResponseHelper.ResponseError('Email sending must be set up in order to request a password reset email', undefined, 500);
        }
        const { email } = req.body;
        if (!email) {
            n8n_workflow_1.LoggerProxy.debug('Request to send password reset email failed because of missing email in payload', { payload: req.body });
            throw new __1.ResponseHelper.ResponseError('Email is mandatory', undefined, 400);
        }
        if (!validator_1.default.isEmail(email)) {
            n8n_workflow_1.LoggerProxy.debug('Request to send password reset email failed because of invalid email in payload', { invalidEmail: email });
            throw new __1.ResponseHelper.ResponseError('Invalid email address', undefined, 400);
        }
        // User should just be able to reset password if one is already present
        const user = yield __1.Db.collections.User.findOne({ email, password: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) });
        if (!user || !user.password) {
            n8n_workflow_1.LoggerProxy.debug('Request to send password reset email failed because no user was found for the provided email', { invalidEmail: email });
            return;
        }
        user.resetPasswordToken = (0, uuid_1.v4)();
        const { id, firstName, lastName, resetPasswordToken } = user;
        const resetPasswordTokenExpiration = Math.floor(Date.now() / 1000) + 7200;
        yield __1.Db.collections.User.update(id, { resetPasswordToken, resetPasswordTokenExpiration });
        const baseUrl = (0, UserManagementHelper_1.getInstanceBaseUrl)();
        const url = new url_1.URL(`${baseUrl}/change-password`);
        url.searchParams.append('userId', id);
        url.searchParams.append('token', resetPasswordToken);
        try {
            const mailer = yield UserManagementMailer.getInstance();
            yield mailer.passwordReset({
                email,
                firstName,
                lastName,
                passwordResetUrl: url.toString(),
                domain: baseUrl,
            });
        }
        catch (error) {
            void __1.InternalHooksManager.getInstance().onEmailFailed({
                user_id: user.id,
                message_type: 'Reset password',
                public_api: false,
            });
            if (error instanceof Error) {
                throw new __1.ResponseHelper.ResponseError(`Please contact your administrator: ${error.message}`, undefined, 500);
            }
        }
        n8n_workflow_1.LoggerProxy.info('Sent password reset email successfully', { userId: user.id, email });
        void __1.InternalHooksManager.getInstance().onUserTransactionalEmail({
            user_id: id,
            message_type: 'Reset password',
            public_api: false,
        });
        void __1.InternalHooksManager.getInstance().onUserPasswordResetRequestClick({
            user_id: id,
        });
    })));
    /**
     * Verify password reset token and user ID.
     *
     * Authless endpoint.
     */
    this.app.get(`/${this.restEndpoint}/resolve-password-token`, __1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
        const { token: resetPasswordToken, userId: id } = req.query;
        if (!resetPasswordToken || !id) {
            n8n_workflow_1.LoggerProxy.debug('Request to resolve password token failed because of missing password reset token or user ID in query string', {
                queryString: req.query,
            });
            throw new __1.ResponseHelper.ResponseError('', undefined, 400);
        }
        // Timestamp is saved in seconds
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const user = yield __1.Db.collections.User.findOne({
            id,
            resetPasswordToken,
            resetPasswordTokenExpiration: (0, typeorm_1.MoreThanOrEqual)(currentTimestamp),
        });
        if (!user) {
            n8n_workflow_1.LoggerProxy.debug('Request to resolve password token failed because no user was found for the provided user ID and reset password token', {
                userId: id,
                resetPasswordToken,
            });
            throw new __1.ResponseHelper.ResponseError('', undefined, 404);
        }
        n8n_workflow_1.LoggerProxy.info('Reset-password token resolved successfully', { userId: id });
        void __1.InternalHooksManager.getInstance().onUserPasswordResetEmailClick({
            user_id: id,
        });
    })));
    /**
     * Verify password reset token and user ID and update password.
     *
     * Authless endpoint.
     */
    this.app.post(`/${this.restEndpoint}/change-password`, __1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token: resetPasswordToken, userId, password } = req.body;
        if (!resetPasswordToken || !userId || !password) {
            n8n_workflow_1.LoggerProxy.debug('Request to change password failed because of missing user ID or password or reset password token in payload', {
                payload: req.body,
            });
            throw new __1.ResponseHelper.ResponseError('Missing user ID or password or reset password token', undefined, 400);
        }
        const validPassword = (0, UserManagementHelper_1.validatePassword)(password);
        // Timestamp is saved in seconds
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const user = yield __1.Db.collections.User.findOne({
            id: userId,
            resetPasswordToken,
            resetPasswordTokenExpiration: (0, typeorm_1.MoreThanOrEqual)(currentTimestamp),
        });
        if (!user) {
            n8n_workflow_1.LoggerProxy.debug('Request to resolve password token failed because no user was found for the provided user ID and reset password token', {
                userId,
                resetPasswordToken,
            });
            throw new __1.ResponseHelper.ResponseError('', undefined, 404);
        }
        yield __1.Db.collections.User.update(userId, {
            password: yield (0, UserManagementHelper_1.hashPassword)(validPassword),
            resetPasswordToken: null,
            resetPasswordTokenExpiration: null,
        });
        n8n_workflow_1.LoggerProxy.info('User password updated successfully', { userId });
        yield (0, jwt_1.issueCookie)(res, user);
    })));
}
exports.passwordResetNamespace = passwordResetNamespace;

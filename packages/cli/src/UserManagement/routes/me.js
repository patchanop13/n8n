"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
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
exports.meNamespace = void 0;
const validator_1 = __importDefault(require("validator"));
const n8n_workflow_1 = require("n8n-workflow");
const crypto_1 = require("crypto");
const __1 = require("../..");
const jwt_1 = require("../auth/jwt");
const UserManagementHelper_1 = require("../UserManagementHelper");
const GenericHelpers_1 = require("../../GenericHelpers");
const User_1 = require("../../databases/entities/User");
function meNamespace() {
    /**
     * Return the logged-in user.
     */
    this.app.get(`/${this.restEndpoint}/me`, __1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
        return (0, UserManagementHelper_1.sanitizeUser)(req.user);
    })));
    /**
     * Update the logged-in user's settings, except password.
     */
    this.app.patch(`/${this.restEndpoint}/me`, __1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
        if (!req.body.email) {
            n8n_workflow_1.LoggerProxy.debug('Request to update user email failed because of missing email in payload', {
                userId: req.user.id,
                payload: req.body,
            });
            throw new __1.ResponseHelper.ResponseError('Email is mandatory', undefined, 400);
        }
        if (!validator_1.default.isEmail(req.body.email)) {
            n8n_workflow_1.LoggerProxy.debug('Request to update user email failed because of invalid email in payload', {
                userId: req.user.id,
                invalidEmail: req.body.email,
            });
            throw new __1.ResponseHelper.ResponseError('Invalid email address', undefined, 400);
        }
        const newUser = new User_1.User();
        Object.assign(newUser, req.user, req.body);
        yield (0, GenericHelpers_1.validateEntity)(newUser);
        const user = yield __1.Db.collections.User.save(newUser);
        n8n_workflow_1.LoggerProxy.info('User updated successfully', { userId: user.id });
        yield (0, jwt_1.issueCookie)(res, user);
        const updatedkeys = Object.keys(req.body);
        void __1.InternalHooksManager.getInstance().onUserUpdate({
            user_id: req.user.id,
            fields_changed: updatedkeys,
        });
        return (0, UserManagementHelper_1.sanitizeUser)(user);
    })));
    /**
     * Update the logged-in user's password.
     */
    this.app.patch(`/${this.restEndpoint}/me/password`, __1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
        const { currentPassword, newPassword } = req.body;
        if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
            throw new __1.ResponseHelper.ResponseError('Invalid payload.', undefined, 400);
        }
        if (!req.user.password) {
            throw new __1.ResponseHelper.ResponseError('Requesting user not set up.');
        }
        const isCurrentPwCorrect = yield (0, UserManagementHelper_1.compareHash)(currentPassword, req.user.password);
        if (!isCurrentPwCorrect) {
            throw new __1.ResponseHelper.ResponseError('Provided current password is incorrect.', undefined, 400);
        }
        const validPassword = (0, UserManagementHelper_1.validatePassword)(newPassword);
        req.user.password = yield (0, UserManagementHelper_1.hashPassword)(validPassword);
        const user = yield __1.Db.collections.User.save(req.user);
        n8n_workflow_1.LoggerProxy.info('Password updated successfully', { userId: user.id });
        yield (0, jwt_1.issueCookie)(res, user);
        void __1.InternalHooksManager.getInstance().onUserUpdate({
            user_id: req.user.id,
            fields_changed: ['password'],
        });
        return { success: true };
    })));
    /**
     * Store the logged-in user's survey answers.
     */
    this.app.post(`/${this.restEndpoint}/me/survey`, __1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
        const { body: personalizationAnswers } = req;
        if (!personalizationAnswers) {
            n8n_workflow_1.LoggerProxy.debug('Request to store user personalization survey failed because of empty payload', {
                userId: req.user.id,
            });
            throw new __1.ResponseHelper.ResponseError('Personalization answers are mandatory', undefined, 400);
        }
        yield __1.Db.collections.User.save({
            id: req.user.id,
            personalizationAnswers,
        });
        n8n_workflow_1.LoggerProxy.info('User survey updated successfully', { userId: req.user.id });
        void __1.InternalHooksManager.getInstance().onPersonalizationSurveySubmitted(req.user.id, personalizationAnswers);
        return { success: true };
    })));
    /**
     * Creates an API Key
     */
    this.app.post(`/${this.restEndpoint}/me/api-key`, __1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
        const apiKey = `n8n_api_${(0, crypto_1.randomBytes)(40).toString('hex')}`;
        yield __1.Db.collections.User.update(req.user.id, {
            apiKey,
        });
        const telemetryData = {
            user_id: req.user.id,
            public_api: false,
        };
        void __1.InternalHooksManager.getInstance().onApiKeyCreated(telemetryData);
        return { apiKey };
    })));
    /**
     * Deletes an API Key
     */
    this.app.delete(`/${this.restEndpoint}/me/api-key`, __1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
        yield __1.Db.collections.User.update(req.user.id, {
            apiKey: null,
        });
        const telemetryData = {
            user_id: req.user.id,
            public_api: false,
        };
        void __1.InternalHooksManager.getInstance().onApiKeyDeleted(telemetryData);
        return { success: true };
    })));
    /**
     * Get an API Key
     */
    this.app.get(`/${this.restEndpoint}/me/api-key`, __1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
        return { apiKey: req.user.apiKey };
    })));
}
exports.meNamespace = meNamespace;

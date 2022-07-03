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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentialsController = void 0;
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/no-cycle */
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const Logger_1 = require("../Logger");
const __1 = require("..");
const constants_1 = require("../constants");
const CredentialsEntity_1 = require("../databases/entities/CredentialsEntity");
const SharedCredentials_1 = require("../databases/entities/SharedCredentials");
const GenericHelpers_1 = require("../GenericHelpers");
const CredentialsHelper_1 = require("../CredentialsHelper");
const config = __importStar(require("../../config"));
const Server_1 = require("../Server");
exports.credentialsController = express_1.default.Router();
/**
 * Initialize Logger if needed
 */
exports.credentialsController.use((req, res, next) => {
    try {
        n8n_workflow_1.LoggerProxy.getInstance();
    }
    catch (error) {
        n8n_workflow_1.LoggerProxy.init((0, Logger_1.getLogger)());
    }
    next();
});
/**
 * GET /credentials
 */
exports.credentialsController.get('/', __1.ResponseHelper.send((req) => __awaiter(void 0, void 0, void 0, function* () {
    let credentials = [];
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    try {
        if (req.user.globalRole.name === 'owner') {
            credentials = yield __1.Db.collections.Credentials.find({
                select: ['id', 'name', 'type', 'nodesAccess', 'createdAt', 'updatedAt'],
                where: filter,
            });
        }
        else {
            const shared = yield __1.Db.collections.SharedCredentials.find({
                where: (0, __1.whereClause)({
                    user: req.user,
                    entityType: 'credentials',
                }),
            });
            if (!shared.length)
                return [];
            credentials = yield __1.Db.collections.Credentials.find({
                select: ['id', 'name', 'type', 'nodesAccess', 'createdAt', 'updatedAt'],
                where: Object.assign({ id: (0, typeorm_1.In)(shared.map(({ credentialId }) => credentialId)) }, filter),
            });
        }
    }
    catch (error) {
        n8n_workflow_1.LoggerProxy.error('Request to list credentials failed', error);
        throw error;
    }
    return credentials.map((credential) => {
        // eslint-disable-next-line no-param-reassign
        credential.id = credential.id.toString();
        return credential;
    });
})));
/**
 * GET /credentials/new
 *
 * Generate a unique credential name.
 */
exports.credentialsController.get('/new', __1.ResponseHelper.send((req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name: newName } = req.query;
    return {
        name: yield __1.GenericHelpers.generateUniqueName(newName !== null && newName !== void 0 ? newName : config.getEnv('credentials.defaultName'), 'credentials'),
    };
})));
/**
 * POST /credentials/test
 *
 * Test if a credential is valid.
 */
exports.credentialsController.post('/test', __1.ResponseHelper.send((req) => __awaiter(void 0, void 0, void 0, function* () {
    const { credentials, nodeToTestWith } = req.body;
    let encryptionKey;
    try {
        encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
    }
    catch (error) {
        throw new __1.ResponseHelper.ResponseError(constants_1.RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY, undefined, 500);
    }
    const helper = new __1.CredentialsHelper(encryptionKey);
    return helper.testCredentials(req.user, credentials.type, credentials, nodeToTestWith);
})));
/**
 * POST /credentials
 */
exports.credentialsController.post('/', __1.ResponseHelper.send((req) => __awaiter(void 0, void 0, void 0, function* () {
    delete req.body.id; // delete if sent
    const newCredential = new CredentialsEntity_1.CredentialsEntity();
    Object.assign(newCredential, req.body);
    yield (0, GenericHelpers_1.validateEntity)(newCredential);
    // Add the added date for node access permissions
    for (const nodeAccess of newCredential.nodesAccess) {
        nodeAccess.date = new Date();
    }
    let encryptionKey;
    try {
        encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
    }
    catch (error) {
        throw new __1.ResponseHelper.ResponseError(constants_1.RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY, undefined, 500);
    }
    // Encrypt the data
    const coreCredential = (0, CredentialsHelper_1.createCredentiasFromCredentialsEntity)(newCredential, true);
    // @ts-ignore
    coreCredential.setData(newCredential.data, encryptionKey);
    const encryptedData = coreCredential.getDataToSave();
    Object.assign(newCredential, encryptedData);
    yield Server_1.externalHooks.run('credentials.create', [encryptedData]);
    const role = yield __1.Db.collections.Role.findOneOrFail({
        name: 'owner',
        scope: 'credential',
    });
    const _a = yield __1.Db.transaction((transactionManager) => __awaiter(void 0, void 0, void 0, function* () {
        const savedCredential = yield transactionManager.save(newCredential);
        savedCredential.data = newCredential.data;
        const newSharedCredential = new SharedCredentials_1.SharedCredentials();
        Object.assign(newSharedCredential, {
            role,
            user: req.user,
            credentials: savedCredential,
        });
        yield transactionManager.save(newSharedCredential);
        return savedCredential;
    })), { id } = _a, rest = __rest(_a, ["id"]);
    n8n_workflow_1.LoggerProxy.verbose('New credential created', {
        credentialId: newCredential.id,
        ownerId: req.user.id,
    });
    return Object.assign({ id: id.toString() }, rest);
})));
/**
 * DELETE /credentials/:id
 */
exports.credentialsController.delete('/:id', __1.ResponseHelper.send((req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: credentialId } = req.params;
    const shared = yield __1.Db.collections.SharedCredentials.findOne({
        relations: ['credentials'],
        where: (0, __1.whereClause)({
            user: req.user,
            entityType: 'credentials',
            entityId: credentialId,
        }),
    });
    if (!shared) {
        n8n_workflow_1.LoggerProxy.info('Attempt to delete credential blocked due to lack of permissions', {
            credentialId,
            userId: req.user.id,
        });
        throw new __1.ResponseHelper.ResponseError(`Credential with ID "${credentialId}" could not be found to be deleted.`, undefined, 404);
    }
    yield Server_1.externalHooks.run('credentials.delete', [credentialId]);
    yield __1.Db.collections.Credentials.remove(shared.credentials);
    return true;
})));
/**
 * PATCH /credentials/:id
 */
exports.credentialsController.patch('/:id', __1.ResponseHelper.send((req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: credentialId } = req.params;
    const updateData = new CredentialsEntity_1.CredentialsEntity();
    Object.assign(updateData, req.body);
    yield (0, GenericHelpers_1.validateEntity)(updateData);
    const shared = yield __1.Db.collections.SharedCredentials.findOne({
        relations: ['credentials'],
        where: (0, __1.whereClause)({
            user: req.user,
            entityType: 'credentials',
            entityId: credentialId,
        }),
    });
    if (!shared) {
        n8n_workflow_1.LoggerProxy.info('Attempt to update credential blocked due to lack of permissions', {
            credentialId,
            userId: req.user.id,
        });
        throw new __1.ResponseHelper.ResponseError(`Credential with ID "${credentialId}" could not be found to be updated.`, undefined, 404);
    }
    const { credentials: credential } = shared;
    // Add the date for newly added node access permissions
    for (const nodeAccess of updateData.nodesAccess) {
        if (!nodeAccess.date) {
            nodeAccess.date = new Date();
        }
    }
    let encryptionKey;
    try {
        encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
    }
    catch (error) {
        throw new __1.ResponseHelper.ResponseError(constants_1.RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY, undefined, 500);
    }
    const coreCredential = (0, CredentialsHelper_1.createCredentiasFromCredentialsEntity)(credential);
    const decryptedData = coreCredential.getData(encryptionKey);
    // Do not overwrite the oauth data else data like the access or refresh token would get lost
    // everytime anybody changes anything on the credentials even if it is just the name.
    if (decryptedData.oauthTokenData) {
        // @ts-ignore
        updateData.data.oauthTokenData = decryptedData.oauthTokenData;
    }
    // Encrypt the data
    const credentials = new n8n_core_1.Credentials({ id: credentialId, name: updateData.name }, updateData.type, updateData.nodesAccess);
    // @ts-ignore
    credentials.setData(updateData.data, encryptionKey);
    const newCredentialData = credentials.getDataToSave();
    // Add special database related data
    newCredentialData.updatedAt = new Date();
    yield Server_1.externalHooks.run('credentials.update', [newCredentialData]);
    // Update the credentials in DB
    yield __1.Db.collections.Credentials.update(credentialId, newCredentialData);
    // We sadly get nothing back from "update". Neither if it updated a record
    // nor the new value. So query now the updated entry.
    const responseData = yield __1.Db.collections.Credentials.findOne(credentialId);
    if (responseData === undefined) {
        throw new __1.ResponseHelper.ResponseError(`Credential ID "${credentialId}" could not be found to be updated.`, undefined, 404);
    }
    // Remove the encrypted data as it is not needed in the frontend
    const { id, data } = responseData, rest = __rest(responseData, ["id", "data"]);
    n8n_workflow_1.LoggerProxy.verbose('Credential updated', { credentialId });
    return Object.assign({ id: id.toString() }, rest);
})));
/**
 * GET /credentials/:id
 */
exports.credentialsController.get('/:id', __1.ResponseHelper.send((req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: credentialId } = req.params;
    const shared = yield __1.Db.collections.SharedCredentials.findOne({
        relations: ['credentials'],
        where: (0, __1.whereClause)({
            user: req.user,
            entityType: 'credentials',
            entityId: credentialId,
        }),
    });
    if (!shared) {
        throw new __1.ResponseHelper.ResponseError(`Credentials with ID "${credentialId}" could not be found.`, undefined, 404);
    }
    const { credentials: credential } = shared;
    if (req.query.includeData !== 'true') {
        const { data, id } = credential, rest = __rest(credential, ["data", "id"]);
        return Object.assign({ id: id.toString() }, rest);
    }
    const { data, id } = credential, rest = __rest(credential, ["data", "id"]);
    let encryptionKey;
    try {
        encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
    }
    catch (error) {
        throw new __1.ResponseHelper.ResponseError(constants_1.RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY, undefined, 500);
    }
    const coreCredential = (0, CredentialsHelper_1.createCredentiasFromCredentialsEntity)(credential);
    return Object.assign({ id: id.toString(), data: coreCredential.getData(encryptionKey) }, rest);
})));

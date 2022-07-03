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
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.hashPassword = exports.isAuthenticatedRequest = exports.isPostUsersId = exports.isAuthExcluded = exports.checkPermissionsForExecution = exports.getUserById = exports.sanitizeUser = exports.validatePassword = exports.getInstanceBaseUrl = exports.getInstanceOwner = exports.isUserManagementDisabled = exports.isUserManagementEnabled = exports.isEmailSetUp = exports.getWorkflowOwner = void 0;
const typeorm_1 = require("typeorm");
const bcryptjs_1 = require("bcryptjs");
const __1 = require("..");
const User_1 = require("../databases/entities/User");
const config = __importStar(require("../../config"));
const WebhookHelpers_1 = require("../WebhookHelpers");
function getWorkflowOwner(workflowId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sharedWorkflow = yield __1.Db.collections.SharedWorkflow.findOneOrFail({
            where: { workflow: { id: workflowId } },
            relations: ['user', 'user.globalRole'],
        });
        return sharedWorkflow.user;
    });
}
exports.getWorkflowOwner = getWorkflowOwner;
function isEmailSetUp() {
    const smtp = config.getEnv('userManagement.emails.mode') === 'smtp';
    const host = !!config.getEnv('userManagement.emails.smtp.host');
    const user = !!config.getEnv('userManagement.emails.smtp.auth.user');
    const pass = !!config.getEnv('userManagement.emails.smtp.auth.pass');
    return smtp && host && user && pass;
}
exports.isEmailSetUp = isEmailSetUp;
function isUserManagementEnabled() {
    return (!config.getEnv('userManagement.disabled') ||
        config.getEnv('userManagement.isInstanceOwnerSetUp'));
}
exports.isUserManagementEnabled = isUserManagementEnabled;
function isUserManagementDisabled() {
    return (config.getEnv('userManagement.disabled') &&
        !config.getEnv('userManagement.isInstanceOwnerSetUp'));
}
exports.isUserManagementDisabled = isUserManagementDisabled;
function getInstanceOwnerRole() {
    return __awaiter(this, void 0, void 0, function* () {
        const ownerRole = yield __1.Db.collections.Role.findOneOrFail({
            where: {
                name: 'owner',
                scope: 'global',
            },
        });
        return ownerRole;
    });
}
function getInstanceOwner() {
    return __awaiter(this, void 0, void 0, function* () {
        const ownerRole = yield getInstanceOwnerRole();
        const owner = yield __1.Db.collections.User.findOneOrFail({
            relations: ['globalRole'],
            where: {
                globalRole: ownerRole,
            },
        });
        return owner;
    });
}
exports.getInstanceOwner = getInstanceOwner;
/**
 * Return the n8n instance base URL without trailing slash.
 */
function getInstanceBaseUrl() {
    const n8nBaseUrl = config.getEnv('editorBaseUrl') || (0, WebhookHelpers_1.getWebhookBaseUrl)();
    return n8nBaseUrl.endsWith('/') ? n8nBaseUrl.slice(0, n8nBaseUrl.length - 1) : n8nBaseUrl;
}
exports.getInstanceBaseUrl = getInstanceBaseUrl;
// TODO: Enforce at model level
function validatePassword(password) {
    if (!password) {
        throw new __1.ResponseHelper.ResponseError('Password is mandatory', undefined, 400);
    }
    const hasInvalidLength = password.length < User_1.MIN_PASSWORD_LENGTH || password.length > User_1.MAX_PASSWORD_LENGTH;
    const hasNoNumber = !/\d/.test(password);
    const hasNoUppercase = !/[A-Z]/.test(password);
    if (hasInvalidLength || hasNoNumber || hasNoUppercase) {
        const message = [];
        if (hasInvalidLength) {
            message.push(`Password must be ${User_1.MIN_PASSWORD_LENGTH} to ${User_1.MAX_PASSWORD_LENGTH} characters long.`);
        }
        if (hasNoNumber) {
            message.push('Password must contain at least 1 number.');
        }
        if (hasNoUppercase) {
            message.push('Password must contain at least 1 uppercase letter.');
        }
        throw new __1.ResponseHelper.ResponseError(message.join(' '), undefined, 400);
    }
    return password;
}
exports.validatePassword = validatePassword;
/**
 * Remove sensitive properties from the user to return to the client.
 */
function sanitizeUser(user, withoutKeys) {
    const { password, resetPasswordToken, resetPasswordTokenExpiration, createdAt, updatedAt, apiKey } = user, sanitizedUser = __rest(user, ["password", "resetPasswordToken", "resetPasswordTokenExpiration", "createdAt", "updatedAt", "apiKey"]);
    if (withoutKeys) {
        withoutKeys.forEach((key) => {
            // @ts-ignore
            delete sanitizedUser[key];
        });
    }
    return sanitizedUser;
}
exports.sanitizeUser = sanitizeUser;
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield __1.Db.collections.User.findOneOrFail(userId, {
            relations: ['globalRole'],
        });
        return user;
    });
}
exports.getUserById = getUserById;
function checkPermissionsForExecution(workflow, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentialIds = new Set();
        const nodeNames = Object.keys(workflow.nodes);
        // Iterate over all nodes
        nodeNames.forEach((nodeName) => {
            const node = workflow.nodes[nodeName];
            if (node.disabled === true) {
                // If a node is disabled there is no need to check its credentials
                return;
            }
            // And check if any of the nodes uses credentials.
            if (node.credentials) {
                const credentialNames = Object.keys(node.credentials);
                // For every credential this node uses
                credentialNames.forEach((credentialName) => {
                    const credentialDetail = node.credentials[credentialName];
                    // If it does not contain an id, it means it is a very old
                    // workflow. Nowaways it should not happen anymore.
                    // Migrations should handle the case where a credential does
                    // not have an id.
                    if (credentialDetail.id === null) {
                        throw new Error(`The credential on node '${node.name}' is not valid. Please open the workflow and set it to a valid value.`);
                    }
                    if (!credentialDetail.id) {
                        throw new Error(`Error initializing workflow: credential ID not present. Please open the workflow and save it to fix this error. [Node: '${node.name}']`);
                    }
                    credentialIds.add(credentialDetail.id.toString());
                });
            }
        });
        // Now that we obtained all credential IDs used by this workflow, we can
        // now check if the owner of this workflow has access to all of them.
        const ids = Array.from(credentialIds);
        if (ids.length === 0) {
            // If the workflow does not use any credentials, then we're fine
            return true;
        }
        // If this check happens on top, we may get
        // unitialized db errors.
        // Db is certainly initialized if workflow uses credentials.
        const user = yield getUserById(userId);
        if (user.globalRole.name === 'owner') {
            return true;
        }
        // Check for the user's permission to all used credentials
        const credentialCount = yield __1.Db.collections.SharedCredentials.count({
            where: {
                user: { id: userId },
                credentials: (0, typeorm_1.In)(ids),
            },
        });
        // Considering the user needs to have access to all credentials
        // then both arrays (allowed credentials vs used credentials)
        // must be the same length
        if (ids.length !== credentialCount) {
            throw new Error('One or more of the used credentials are not accessible.');
        }
        return true;
    });
}
exports.checkPermissionsForExecution = checkPermissionsForExecution;
/**
 * Check if a URL contains an auth-excluded endpoint.
 */
function isAuthExcluded(url, ignoredEndpoints) {
    return !!ignoredEndpoints
        .filter(Boolean) // skip empty paths
        .find((ignoredEndpoint) => url.startsWith(`/${ignoredEndpoint}`));
}
exports.isAuthExcluded = isAuthExcluded;
/**
 * Check if the endpoint is `POST /users/:id`.
 */
function isPostUsersId(req, restEndpoint) {
    return (req.method === 'POST' &&
        new RegExp(`/${restEndpoint}/users/[\\w\\d-]*`).test(req.url) &&
        !req.url.includes('reinvite'));
}
exports.isPostUsersId = isPostUsersId;
function isAuthenticatedRequest(request) {
    return request.user !== undefined;
}
exports.isAuthenticatedRequest = isAuthenticatedRequest;
// ----------------------------------
//            hashing
// ----------------------------------
const hashPassword = (validPassword) => __awaiter(void 0, void 0, void 0, function* () { return (0, bcryptjs_1.hash)(validPassword, (0, bcryptjs_1.genSaltSync)(10)); });
exports.hashPassword = hashPassword;
function compareHash(plaintext, hashed) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, bcryptjs_1.compare)(plaintext, hashed);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Invalid salt version')) {
                error.message +=
                    '. Comparison against unhashed string. Please check that the value compared against has been hashed.';
            }
            throw new Error(error);
        }
    });
}
exports.compareHash = compareHash;

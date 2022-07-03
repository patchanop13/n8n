"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCredential = exports.oAuth2CredentialAuthorize = exports.oAuth1CredentialAuthorize = exports.getCredentialData = exports.updateCredential = exports.deleteCredential = exports.createNewCredential = exports.getAllCredentials = exports.getCredentialsNewName = exports.getCredentialTypes = void 0;
const helpers_1 = require("./helpers");
function getCredentialTypes(context) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.makeRestApiRequest)(context, 'GET', '/credential-types');
    });
}
exports.getCredentialTypes = getCredentialTypes;
function getCredentialsNewName(context, name) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.makeRestApiRequest)(context, 'GET', '/credentials/new', name ? { name } : {});
    });
}
exports.getCredentialsNewName = getCredentialsNewName;
function getAllCredentials(context) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.makeRestApiRequest)(context, 'GET', '/credentials');
    });
}
exports.getAllCredentials = getAllCredentials;
function createNewCredential(context, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, helpers_1.makeRestApiRequest)(context, 'POST', `/credentials`, data);
    });
}
exports.createNewCredential = createNewCredential;
function deleteCredential(context, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, helpers_1.makeRestApiRequest)(context, 'DELETE', `/credentials/${id}`);
    });
}
exports.deleteCredential = deleteCredential;
function updateCredential(context, id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, helpers_1.makeRestApiRequest)(context, 'PATCH', `/credentials/${id}`, data);
    });
}
exports.updateCredential = updateCredential;
function getCredentialData(context, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, helpers_1.makeRestApiRequest)(context, 'GET', `/credentials/${id}`, {
            includeData: true,
        });
    });
}
exports.getCredentialData = getCredentialData;
// Get OAuth1 Authorization URL using the stored credentials
function oAuth1CredentialAuthorize(context, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, helpers_1.makeRestApiRequest)(context, 'GET', `/oauth1-credential/auth`, data);
    });
}
exports.oAuth1CredentialAuthorize = oAuth1CredentialAuthorize;
// Get OAuth2 Authorization URL using the stored credentials
function oAuth2CredentialAuthorize(context, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, helpers_1.makeRestApiRequest)(context, 'GET', `/oauth2-credential/auth`, data);
    });
}
exports.oAuth2CredentialAuthorize = oAuth2CredentialAuthorize;
function testCredential(context, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, helpers_1.makeRestApiRequest)(context, 'POST', '/credentials/test', data);
    });
}
exports.testCredential = testCredential;

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
exports.apiRequest = exports.getAuthorization = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function getAuthorization(credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        if (credentials === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials got returned!');
        }
        const { password, username } = credentials;
        const options = {
            method: 'POST',
            form: {
                username,
                password,
            },
            uri: `${credentials.url}/users/login`,
            json: true,
        };
        try {
            const response = yield this.helpers.request(options);
            return { token: response.token, userId: response.id };
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.getAuthorization = getAuthorization;
function apiRequest(method, endpoint, body, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('wekanApi');
        query = query || {};
        const { token } = yield getAuthorization.call(this, credentials);
        const options = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            method,
            body,
            qs: query,
            uri: `${credentials.url}/api/${endpoint}`,
            json: true,
        };
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            if (error.statusCode === 401) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The Wekan credentials are not valid!');
            }
            throw error;
        }
    });
}
exports.apiRequest = apiRequest;

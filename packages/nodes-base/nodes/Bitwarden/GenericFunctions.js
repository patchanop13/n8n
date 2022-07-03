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
exports.loadResource = exports.handleGetAll = exports.getAccessToken = exports.bitwardenApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an authenticated API request to Bitwarden.
 */
function bitwardenApiRequest(method, endpoint, qs, body, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = yield getBaseUrl.call(this);
        const options = {
            headers: {
                'user-agent': 'n8n',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            method,
            qs,
            body,
            uri: `${baseUrl}${endpoint}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.bitwardenApiRequest = bitwardenApiRequest;
/**
 * Retrieve the access token needed for every API request to Bitwarden.
 */
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('bitwardenApi');
        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            form: {
                client_id: credentials.clientId,
                client_secret: credentials.clientSecret,
                grant_type: 'client_credentials',
                scope: 'api.organization',
                deviceName: 'n8n',
                deviceType: 2,
                deviceIdentifier: 'n8n',
            },
            uri: yield getTokenUrl.call(this),
            json: true,
        };
        try {
            const { access_token } = yield this.helpers.request(options);
            return access_token;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.getAccessToken = getAccessToken;
/**
 * Supplement a `getAll` operation with `returnAll` and `limit` parameters.
 */
function handleGetAll(i, method, endpoint, qs, body, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const responseData = yield bitwardenApiRequest.call(this, method, endpoint, qs, body, token);
        const returnAll = this.getNodeParameter('returnAll', i);
        if (returnAll) {
            return responseData.data;
        }
        else {
            const limit = this.getNodeParameter('limit', i);
            return responseData.data.slice(0, limit);
        }
    });
}
exports.handleGetAll = handleGetAll;
/**
 * Return the access token URL based on the user's environment.
 */
function getTokenUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment, domain } = yield this.getCredentials('bitwardenApi');
        return environment === 'cloudHosted'
            ? 'https://identity.bitwarden.com/connect/token'
            : `${domain}/identity/connect/token`;
    });
}
/**
 * Return the base API URL based on the user's environment.
 */
function getBaseUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment, domain } = yield this.getCredentials('bitwardenApi');
        return environment === 'cloudHosted'
            ? 'https://api.bitwarden.com'
            : `${domain}/api`;
    });
}
/**
 * Load a resource so that it can be selected by name from a dropdown.
 */
function loadResource(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const token = yield getAccessToken.call(this);
        const endpoint = `/public/${resource}`;
        const { data } = yield bitwardenApiRequest.call(this, 'GET', endpoint, {}, {}, token);
        data.forEach(({ id, name, externalId }) => {
            returnData.push({
                name: externalId || name || id,
                value: id,
            });
        });
        return returnData;
    });
}
exports.loadResource = loadResource;

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
exports.getVersionForUpdate = exports.throwOnEmptyUpdate = exports.toOptions = exports.handleListing = exports.getAutomaticSecret = exports.taigaApiRequestAllItems = exports.taigaApiRequest = exports.getAuthorization = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const crypto_1 = require("crypto");
function getAuthorization(credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        if (credentials === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials got returned!');
        }
        const { password, username } = credentials;
        const options = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: {
                type: 'normal',
                password,
                username,
            },
            uri: (credentials.url) ? `${credentials.url}/api/v1/auth` : 'https://api.taiga.io/api/v1/auth',
            json: true,
        };
        try {
            const response = yield this.helpers.request(options);
            return response.auth_token;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.getAuthorization = getAuthorization;
function taigaApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('taigaApi');
        const authToken = yield getAuthorization.call(this, credentials);
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                bearer: authToken,
            },
            qs: query,
            method,
            body,
            uri: uri || (credentials.url) ? `${credentials.url}/api/v1${resource}` : `https://api.taiga.io/api/v1${resource}`,
            json: true,
        };
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.taigaApiRequest = taigaApiRequest;
function taigaApiRequestAllItems(method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        do {
            responseData = yield taigaApiRequest.call(this, method, resource, body, query, uri, { resolveWithFullResponse: true });
            returnData.push.apply(returnData, responseData.body);
            uri = responseData.headers['x-pagination-next'];
            if (query.limit && returnData.length >= query.limit) {
                return returnData;
            }
        } while (responseData.headers['x-pagination-next'] !== undefined &&
            responseData.headers['x-pagination-next'] !== '');
        return returnData;
    });
}
exports.taigaApiRequestAllItems = taigaApiRequestAllItems;
function getAutomaticSecret(credentials) {
    const data = `${credentials.username},${credentials.password}`;
    return (0, crypto_1.createHash)('md5').update(data).digest('hex');
}
exports.getAutomaticSecret = getAutomaticSecret;
function handleListing(method, endpoint, body = {}, qs = {}, i) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseData;
        qs.project = this.getNodeParameter('projectId', i);
        const returnAll = this.getNodeParameter('returnAll', i);
        if (returnAll) {
            return yield taigaApiRequestAllItems.call(this, method, endpoint, body, qs);
        }
        else {
            qs.limit = this.getNodeParameter('limit', i);
            responseData = yield taigaApiRequestAllItems.call(this, method, endpoint, body, qs);
            return responseData.splice(0, qs.limit);
        }
    });
}
exports.handleListing = handleListing;
const toOptions = (items) => items.map(({ name, id }) => ({ name, value: id }));
exports.toOptions = toOptions;
function throwOnEmptyUpdate(resource) {
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
}
exports.throwOnEmptyUpdate = throwOnEmptyUpdate;
function getVersionForUpdate(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield taigaApiRequest.call(this, 'GET', endpoint).then(response => response.version);
    });
}
exports.getVersionForUpdate = getVersionForUpdate;

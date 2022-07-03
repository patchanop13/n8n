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
exports.validateCredentials = exports.validateJSON = exports.mauticApiRequestAllItems = exports.mauticApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function mauticApiRequest(method, endpoint, body = {}, query, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0, 'credentials');
        const options = {
            headers: {},
            method,
            qs: query,
            uri: uri || `/api${endpoint}`,
            body,
            json: true,
        };
        try {
            let returnData;
            if (authenticationMethod === 'credentials') {
                const credentials = yield this.getCredentials('mauticApi');
                const baseUrl = credentials.url;
                const base64Key = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
                options.headers.Authorization = `Basic ${base64Key}`;
                options.uri = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${options.uri}`;
                //@ts-ignore
                returnData = yield this.helpers.request(options);
            }
            else {
                const credentials = yield this.getCredentials('mauticOAuth2Api');
                const baseUrl = credentials.url;
                options.uri = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${options.uri}`;
                //@ts-ignore
                returnData = yield this.helpers.requestOAuth2.call(this, 'mauticOAuth2Api', options, { includeCredentialsOnRefreshOnBody: true });
            }
            if (returnData.errors) {
                // They seem to to sometimes return 200 status but still error.
                throw new n8n_workflow_1.NodeApiError(this.getNode(), returnData);
            }
            return returnData;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.mauticApiRequest = mauticApiRequest;
/**
 * Make an API request to paginated mautic endpoint
 * and return all results
 */
function mauticApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let data = [];
        query.limit = 30;
        query.start = 0;
        do {
            responseData = yield mauticApiRequest.call(this, method, endpoint, body, query);
            const values = Object.values(responseData[propertyName]);
            //@ts-ignore
            returnData.push.apply(returnData, values);
            query.start += query.limit;
            data = [];
        } while (responseData.total !== undefined &&
            (returnData.length - parseInt(responseData.total, 10)) < 0);
        return returnData;
    });
}
exports.mauticApiRequestAllItems = mauticApiRequestAllItems;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = undefined;
    }
    return result;
}
exports.validateJSON = validateJSON;
function validateCredentials(decryptedCredentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = decryptedCredentials;
        const { url, username, password, } = credentials;
        const base64Key = Buffer.from(`${username}:${password}`).toString('base64');
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Basic ${base64Key}`,
            },
            uri: url.endsWith('/') ? `${url}api/users/self` : `${url}/api/users/self`,
            json: true,
        };
        return yield this.helpers.request(options);
    });
}
exports.validateCredentials = validateCredentials;

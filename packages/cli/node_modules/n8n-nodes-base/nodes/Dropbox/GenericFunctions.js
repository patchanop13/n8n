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
exports.getCredentials = exports.simplify = exports.getRootDirectory = exports.dropboxpiRequestAllItems = exports.dropboxApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Dropbox
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function dropboxApiRequest(method, endpoint, body, query = {}, headers = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            headers,
            method,
            qs: query,
            body,
            uri: endpoint,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        Object.assign(options, option);
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        try {
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('dropboxApi');
                options.headers['Authorization'] = `Bearer ${credentials.accessToken}`;
                return yield this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'dropboxOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.dropboxApiRequest = dropboxApiRequest;
function dropboxpiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const resource = this.getNodeParameter('resource', 0);
        const returnData = [];
        const paginationEndpoint = {
            'folder': 'https://api.dropboxapi.com/2/files/list_folder/continue',
            'search': 'https://api.dropboxapi.com/2/files/search/continue_v2',
        };
        let responseData;
        do {
            responseData = yield dropboxApiRequest.call(this, method, endpoint, body, query, headers);
            const cursor = responseData.cursor;
            if (cursor !== undefined) {
                endpoint = paginationEndpoint[resource];
                body = { cursor };
            }
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.has_more !== false);
        return returnData;
    });
}
exports.dropboxpiRequestAllItems = dropboxpiRequestAllItems;
function getRootDirectory() {
    return dropboxApiRequest.call(this, 'POST', 'https://api.dropboxapi.com/2/users/get_current_account', {});
}
exports.getRootDirectory = getRootDirectory;
function simplify(data) {
    const results = [];
    for (const element of data) {
        const { '.tag': key } = element === null || element === void 0 ? void 0 : element.metadata;
        const metadata = (element === null || element === void 0 ? void 0 : element.metadata)[key];
        delete element.metadata;
        Object.assign(element, metadata);
        if ((element === null || element === void 0 ? void 0 : element.match_type)['.tag']) {
            element.match_type = (element === null || element === void 0 ? void 0 : element.match_type)['.tag'];
        }
        results.push(element);
    }
    return results;
}
exports.simplify = simplify;
function getCredentials() {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        if (authenticationMethod === 'accessToken') {
            return yield this.getCredentials('dropboxApi');
        }
        else {
            return yield this.getCredentials('dropboxOAuth2Api');
        }
    });
}
exports.getCredentials = getCredentials;

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
exports.validateJSON = exports.intercomApiRequestAllItems = exports.intercomApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function intercomApiRequest(endpoint, method, body = {}, query, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('intercomApi');
        const headerWithAuthentication = Object.assign({}, { Authorization: `Bearer ${credentials.apiKey}`, Accept: 'application/json' });
        const options = {
            headers: headerWithAuthentication,
            method,
            qs: query,
            uri: uri || `https://api.intercom.io${endpoint}`,
            body,
            json: true,
        };
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.intercomApiRequest = intercomApiRequest;
/**
 * Make an API request to paginated intercom endpoint
 * and return all results
 */
function intercomApiRequestAllItems(propertyName, endpoint, method, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.per_page = 60;
        let uri;
        do {
            responseData = yield intercomApiRequest.call(this, endpoint, method, body, query, uri);
            uri = responseData.pages.next;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.pages !== undefined &&
            responseData.pages.next !== undefined &&
            responseData.pages.next !== null);
        return returnData;
    });
}
exports.intercomApiRequestAllItems = intercomApiRequestAllItems;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = '';
    }
    return result;
}
exports.validateJSON = validateJSON;

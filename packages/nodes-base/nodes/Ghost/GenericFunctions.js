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
exports.validateJSON = exports.ghostApiRequestAllItems = exports.ghostApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function ghostApiRequest(method, endpoint, body = {}, query = {}, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const source = this.getNodeParameter('source', 0);
        let credentials;
        let version;
        let credentialType;
        if (source === 'contentApi') {
            //https://ghost.org/faq/api-versioning/
            version = 'v3';
            credentialType = 'ghostContentApi';
        }
        else {
            version = 'v2';
            credentialType = 'ghostAdminApi';
        }
        credentials = yield this.getCredentials(credentialType);
        const options = {
            method,
            qs: query,
            uri: uri || `${credentials.url}/ghost/api/${version}${endpoint}`,
            body,
            json: true,
        };
        try {
            return yield this.helpers.requestWithAuthentication.call(this, credentialType, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.ghostApiRequest = ghostApiRequest;
function ghostApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.limit = 50;
        query.page = 1;
        do {
            responseData = yield ghostApiRequest.call(this, method, endpoint, body, query);
            query.page = responseData.meta.pagination.next;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (query.page !== null);
        return returnData;
    });
}
exports.ghostApiRequestAllItems = ghostApiRequestAllItems;
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

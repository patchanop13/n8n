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
exports.bitlyApiRequestAllItems = exports.bitlyApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function bitlyApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        let options = {
            headers: {},
            method,
            qs,
            body,
            uri: uri || `https://api-ssl.bitly.com/v4${resource}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        try {
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('bitlyApi');
                options.headers = { Authorization: `Bearer ${credentials.accessToken}` };
                return yield this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'bitlyOAuth2Api', options, { tokenType: 'Bearer' });
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.bitlyApiRequest = bitlyApiRequest;
/**
 * Make an API request to paginated flow endpoint
 * and return all results
 */
function bitlyApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        query.size = 50;
        do {
            responseData = yield bitlyApiRequest.call(this, method, resource, body, query, uri);
            returnData.push.apply(returnData, responseData[propertyName]);
            if (responseData.pagination && responseData.pagination.next) {
                uri = responseData.pagination.next;
            }
        } while (responseData.pagination !== undefined &&
            responseData.pagination.next !== undefined);
        return returnData;
    });
}
exports.bitlyApiRequestAllItems = bitlyApiRequestAllItems;

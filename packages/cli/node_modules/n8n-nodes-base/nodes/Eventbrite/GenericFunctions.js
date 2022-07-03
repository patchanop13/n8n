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
exports.eventbriteApiRequestAllItems = exports.eventbriteApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function eventbriteApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            headers: {},
            method,
            qs,
            body,
            uri: uri || `https://www.eventbriteapi.com/v3${resource}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        try {
            if (authenticationMethod === 'privateKey') {
                const credentials = yield this.getCredentials('eventbriteApi');
                options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
                return yield this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'eventbriteOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.eventbriteApiRequest = eventbriteApiRequest;
/**
 * Make an API request to paginated flow endpoint
 * and return all results
 */
function eventbriteApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        do {
            responseData = yield eventbriteApiRequest.call(this, method, resource, body, query);
            query.continuation = responseData.pagination.continuation;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.pagination !== undefined &&
            responseData.pagination.has_more_items !== undefined &&
            responseData.pagination.has_more_items !== false);
        return returnData;
    });
}
exports.eventbriteApiRequestAllItems = eventbriteApiRequestAllItems;

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
exports.microsoftApiRequestAllItemsSkip = exports.microsoftApiRequestAllItems = exports.microsoftApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function microsoftApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://graph.microsoft.com${resource}`,
            json: true,
        };
        try {
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            //@ts-ignore
            return yield this.helpers.requestOAuth2.call(this, 'microsoftTeamsOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.microsoftApiRequest = microsoftApiRequest;
function microsoftApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        do {
            responseData = yield microsoftApiRequest.call(this, method, endpoint, body, query, uri);
            uri = responseData['@odata.nextLink'];
            returnData.push.apply(returnData, responseData[propertyName]);
            if (query.limit && query.limit <= returnData.length) {
                return returnData;
            }
        } while (responseData['@odata.nextLink'] !== undefined);
        return returnData;
    });
}
exports.microsoftApiRequestAllItems = microsoftApiRequestAllItems;
function microsoftApiRequestAllItemsSkip(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query['$top'] = 100;
        query['$skip'] = 0;
        do {
            responseData = yield microsoftApiRequest.call(this, method, endpoint, body, query);
            query['$skip'] += query['$top'];
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData['value'].length !== 0);
        return returnData;
    });
}
exports.microsoftApiRequestAllItemsSkip = microsoftApiRequestAllItemsSkip;

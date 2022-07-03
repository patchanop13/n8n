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
exports.hunterApiRequestAllItems = exports.hunterApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function hunterApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('hunterApi');
        qs = Object.assign({ api_key: credentials.apiKey }, qs);
        let options = {
            method,
            qs,
            body,
            uri: uri || `https://api.hunter.io/v2${resource}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.hunterApiRequest = hunterApiRequest;
/**
 * Make an API request to paginated flow endpoint
 * and return all results
 */
function hunterApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.offset = 0;
        query.limit = 100;
        do {
            responseData = yield hunterApiRequest.call(this, method, resource, body, query);
            returnData.push(responseData[propertyName]);
            query.offset += query.limit;
        } while (responseData.meta !== undefined &&
            responseData.meta.results !== undefined &&
            responseData.meta.offset <= responseData.meta.results);
        return returnData;
    });
}
exports.hunterApiRequestAllItems = hunterApiRequestAllItems;

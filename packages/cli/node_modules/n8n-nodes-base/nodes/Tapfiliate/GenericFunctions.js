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
exports.tapfiliateApiRequestAllItems = exports.tapfiliateApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function tapfiliateApiRequest(method, endpoint, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('tapfiliateApi');
        const options = {
            headers: {
                'Api-Key': credentials.apiKey,
            },
            method,
            qs,
            body,
            uri: uri || `https://api.tapfiliate.com/1.6${endpoint}`,
            json: true,
        };
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
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
exports.tapfiliateApiRequest = tapfiliateApiRequest;
function tapfiliateApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page = 1;
        do {
            responseData = yield tapfiliateApiRequest.call(this, method, endpoint, body, query, '', { resolveWithFullResponse: true });
            returnData.push.apply(returnData, responseData.body);
            query.page++;
        } while (responseData.headers.link.includes('next'));
        return returnData;
    });
}
exports.tapfiliateApiRequestAllItems = tapfiliateApiRequestAllItems;

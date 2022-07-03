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
exports.webflowApiRequestAllItems = exports.webflowApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function webflowApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        let options = {
            headers: {
                'accept-version': '1.0.0',
            },
            method,
            qs,
            body,
            uri: uri || `https://api.webflow.com${resource}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(options.qs).length === 0) {
            delete options.qs;
        }
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        try {
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('webflowApi');
                options.headers['authorization'] = `Bearer ${credentials.accessToken}`;
                return yield this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'webflowOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.webflowApiRequest = webflowApiRequest;
function webflowApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.limit = 100;
        query.offset = 0;
        do {
            responseData = yield webflowApiRequest.call(this, method, endpoint, body, query);
            if (responseData.offset !== undefined) {
                query.offset += query.limit;
            }
            returnData.push.apply(returnData, responseData.items);
        } while (returnData.length < responseData.total);
        return returnData;
    });
}
exports.webflowApiRequestAllItems = webflowApiRequestAllItems;

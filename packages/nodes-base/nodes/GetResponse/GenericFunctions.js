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
exports.getResponseApiRequestAllItems = exports.getresponseApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function getresponseApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authentication = this.getNodeParameter('authentication', 0, 'apiKey');
        let options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://api.getresponse.com/v3${resource}`,
            json: true,
        };
        try {
            options = Object.assign({}, options, option);
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            if (authentication === 'apiKey') {
                const credentials = yield this.getCredentials('getResponseApi');
                options.headers['X-Auth-Token'] = `api-key ${credentials.apiKey}`;
                //@ts-ignore
                return yield this.helpers.request.call(this, options);
            }
            else {
                //@ts-ignore
                return yield this.helpers.requestOAuth2.call(this, 'getResponseOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.getresponseApiRequest = getresponseApiRequest;
function getResponseApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page = 1;
        do {
            responseData = yield getresponseApiRequest.call(this, method, endpoint, body, query, undefined, { resolveWithFullResponse: true });
            query.page++;
            returnData.push.apply(returnData, responseData.body);
        } while (responseData.headers.TotalPages !== responseData.headers.CurrentPage);
        return returnData;
    });
}
exports.getResponseApiRequestAllItems = getResponseApiRequestAllItems;

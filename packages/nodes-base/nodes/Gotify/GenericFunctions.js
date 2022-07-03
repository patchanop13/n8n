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
exports.gotifyApiRequestAllItems = exports.gotifyApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function gotifyApiRequest(method, path, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('gotifyApi');
        const options = {
            method,
            headers: {
                'X-Gotify-Key': (method === 'POST') ? credentials.appApiToken : credentials.clientApiToken,
                accept: 'application/json',
            },
            body,
            qs,
            uri: uri || `${credentials.url}${path}`,
            json: true,
        };
        try {
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            //@ts-ignore
            return yield this.helpers.request.call(this, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.gotifyApiRequest = gotifyApiRequest;
function gotifyApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        query.limit = 100;
        do {
            responseData = yield gotifyApiRequest.call(this, method, endpoint, body, query, uri);
            if (responseData.paging.next) {
                uri = responseData.paging.next;
            }
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.paging.next);
        return returnData;
    });
}
exports.gotifyApiRequestAllItems = gotifyApiRequestAllItems;

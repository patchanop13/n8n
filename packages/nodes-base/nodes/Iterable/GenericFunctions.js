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
exports.iterableApiRequestAllItems = exports.iterableApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function iterableApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('iterableApi');
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Api_Key': credentials.apiKey,
            },
            method,
            body,
            qs,
            uri: uri || `https://api.iterable.com/api${resource}`,
            json: true,
        };
        try {
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
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
exports.iterableApiRequest = iterableApiRequest;
function iterableApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.maxResults = 100;
        do {
            responseData = yield iterableApiRequest.call(this, method, endpoint, body, query);
            query.pageToken = responseData['nextPageToken'];
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData['nextPageToken'] !== undefined &&
            responseData['nextPageToken'] !== '');
        return returnData;
    });
}
exports.iterableApiRequestAllItems = iterableApiRequestAllItems;

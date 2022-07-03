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
exports.codaApiRequestAllItems = exports.codaApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function codaApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('codaApi');
        let options = {
            headers: { 'Authorization': `Bearer ${credentials.accessToken}` },
            method,
            qs,
            body,
            uri: uri || `https://coda.io/apis/v1${resource}`,
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
exports.codaApiRequest = codaApiRequest;
/**
 * Make an API request to paginated coda endpoint
 * and return all results
 */
function codaApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.limit = 100;
        let uri;
        do {
            responseData = yield codaApiRequest.call(this, method, resource, body, query, uri);
            uri = responseData.nextPageLink;
            // @ts-ignore
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.nextPageLink !== undefined &&
            responseData.nextPageLink !== '');
        return returnData;
    });
}
exports.codaApiRequestAllItems = codaApiRequestAllItems;

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
exports.invoiceNinjaApiRequestAllItems = exports.invoiceNinjaApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
function invoiceNinjaApiRequest(method, endpoint, body = {}, query, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('invoiceNinjaApi');
        const baseUrl = credentials.url || 'https://app.invoiceninja.com';
        const options = {
            headers: {
                Accept: 'application/json',
                'X-Ninja-Token': credentials.apiToken,
            },
            method,
            qs: query,
            uri: uri || `${baseUrl}/api/v1${endpoint}`,
            body,
            json: true,
        };
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.invoiceNinjaApiRequest = invoiceNinjaApiRequest;
function invoiceNinjaApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        query.per_page = 100;
        do {
            responseData = yield invoiceNinjaApiRequest.call(this, method, endpoint, body, query, uri);
            const next = (0, lodash_1.get)(responseData, 'meta.pagination.links.next');
            if (next) {
                uri = next;
            }
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.meta !== undefined &&
            responseData.meta.pagination &&
            responseData.meta.pagination.links &&
            responseData.meta.pagination.links.next);
        return returnData;
    });
}
exports.invoiceNinjaApiRequestAllItems = invoiceNinjaApiRequestAllItems;

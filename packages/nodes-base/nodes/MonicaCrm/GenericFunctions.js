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
exports.toOptions = exports.getDateParts = exports.monicaCrmApiRequestAllItems = exports.monicaCrmApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function monicaCrmApiRequest(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('monicaCrmApi');
        if (credentials === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials got returned!');
        }
        let baseUrl = `https://app.monicahq.com`;
        if (credentials.environment === 'selfHosted') {
            baseUrl = credentials.domain;
        }
        const options = {
            headers: {
                Authorization: `Bearer ${credentials.apiToken}`,
            },
            method,
            body,
            qs,
            uri: `${baseUrl}/api${endpoint}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.monicaCrmApiRequest = monicaCrmApiRequest;
function monicaCrmApiRequestAllItems(method, endpoint, body = {}, qs = {}, { forLoader } = { forLoader: false }) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnAll = this.getNodeParameter('returnAll', 0, false);
        const limit = this.getNodeParameter('limit', 0, 0);
        let totalItems = 0;
        let responseData;
        const returnData = [];
        do {
            responseData = yield monicaCrmApiRequest.call(this, method, endpoint, body, qs);
            returnData.push(...responseData.data);
            if (!forLoader && !returnAll && returnData.length > limit) {
                return returnData.slice(0, limit);
            }
            totalItems = responseData.meta.total;
        } while (totalItems > returnData.length);
        return returnData;
    });
}
exports.monicaCrmApiRequestAllItems = monicaCrmApiRequestAllItems;
/**
 * Get day, month, and year from the n8n UI datepicker.
 */
const getDateParts = (date) => date.split('T')[0].split('-').map(Number).reverse();
exports.getDateParts = getDateParts;
const toOptions = (response) => response.data.map(({ id, name }) => ({ value: id, name }));
exports.toOptions = toOptions;

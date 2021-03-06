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
exports.keysToSnakeCase = exports.shopifyApiRequestAllItems = exports.shopifyApiRequest = void 0;
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const change_case_1 = require("change-case");
function shopifyApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('shopifyApi');
        const headerWithAuthentication = Object.assign({}, { Authorization: `Basic ${Buffer.from(`${credentials.apiKey}:${credentials.password}`).toString(n8n_core_1.BINARY_ENCODING)}` });
        const options = {
            headers: headerWithAuthentication,
            method,
            qs: query,
            uri: uri || `https://${credentials.shopSubdomain}.myshopify.com/admin/api/2019-10${resource}`,
            body,
            json: true,
        };
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(query).length === 0) {
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
exports.shopifyApiRequest = shopifyApiRequest;
function shopifyApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        do {
            responseData = yield shopifyApiRequest.call(this, method, resource, body, query, uri, { resolveWithFullResponse: true });
            if (responseData.headers.link) {
                uri = responseData.headers['link'].split(';')[0].replace('<', '').replace('>', '');
            }
            returnData.push.apply(returnData, responseData.body[propertyName]);
        } while (responseData.headers['link'] !== undefined &&
            responseData.headers['link'].includes('rel="next"'));
        return returnData;
    });
}
exports.shopifyApiRequestAllItems = shopifyApiRequestAllItems;
function keysToSnakeCase(elements) {
    if (elements === undefined) {
        return [];
    }
    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    for (const element of elements) {
        for (const key of Object.keys(element)) {
            if (key !== (0, change_case_1.snakeCase)(key)) {
                element[(0, change_case_1.snakeCase)(key)] = element[key];
                delete element[key];
            }
        }
    }
    return elements;
}
exports.keysToSnakeCase = keysToSnakeCase;

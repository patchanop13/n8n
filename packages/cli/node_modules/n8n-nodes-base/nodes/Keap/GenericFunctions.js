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
exports.keysToSnakeCase = exports.keapApiRequestAllItems = exports.keapApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const change_case_1 = require("change-case");
function keapApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://api.infusionsoft.com/crm/rest/v1${resource}`,
            json: true,
        };
        try {
            options = Object.assign({}, options, option);
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            //@ts-ignore
            return yield this.helpers.requestOAuth2.call(this, 'keapOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.keapApiRequest = keapApiRequest;
function keapApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        query.limit = 50;
        do {
            responseData = yield keapApiRequest.call(this, method, endpoint, body, query, uri);
            uri = responseData.next;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (returnData.length < responseData.count);
        return returnData;
    });
}
exports.keapApiRequestAllItems = keapApiRequestAllItems;
function keysToSnakeCase(elements) {
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

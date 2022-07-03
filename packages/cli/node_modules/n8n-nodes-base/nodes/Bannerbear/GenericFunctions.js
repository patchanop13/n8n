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
exports.keysToSnakeCase = exports.bannerbearApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const change_case_1 = require("change-case");
function bannerbearApiRequest(method, resource, body = {}, query = {}, uri, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('bannerbearApi');
        const options = {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${credentials.apiKey}`,
            },
            method,
            body,
            qs: query,
            uri: uri || `https://api.bannerbear.com/v2${resource}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.form;
        }
        if (!Object.keys(query).length) {
            delete options.qs;
        }
        options.headers = Object.assign({}, options.headers, headers);
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.bannerbearApiRequest = bannerbearApiRequest;
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

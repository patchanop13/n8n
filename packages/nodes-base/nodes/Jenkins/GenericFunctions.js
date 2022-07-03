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
exports.tolerateTrailingSlash = exports.jenkinsApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function jenkinsApiRequest(method, uri, qs = {}, body = '', option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('jenkinsApi');
        let options = {
            headers: {
                'Accept': 'application/json',
            },
            method,
            auth: {
                username: credentials.username,
                password: credentials.apiKey,
            },
            uri: `${tolerateTrailingSlash(credentials.baseUrl)}${uri}`,
            json: true,
            qs,
            body,
        };
        options = Object.assign({}, options, option);
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.jenkinsApiRequest = jenkinsApiRequest;
function tolerateTrailingSlash(baseUrl) {
    return baseUrl.endsWith('/')
        ? baseUrl.substr(0, baseUrl.length - 1)
        : baseUrl;
}
exports.tolerateTrailingSlash = tolerateTrailingSlash;

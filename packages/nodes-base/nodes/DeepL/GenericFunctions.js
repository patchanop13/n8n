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
exports.deepLApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function deepLApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const proApiEndpoint = 'https://api.deepl.com/v2';
        const freeApiEndpoint = 'https://api-free.deepl.com/v2';
        const credentials = yield this.getCredentials('deepLApi');
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `${credentials.apiPlan === 'pro' ? proApiEndpoint : freeApiEndpoint}${resource}`,
            json: true,
        };
        try {
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            const credentials = yield this.getCredentials('deepLApi');
            options.qs.auth_key = credentials.apiKey;
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.deepLApiRequest = deepLApiRequest;

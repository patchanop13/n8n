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
exports.humanticAiApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function humanticAiApiRequest(method, resource, body = {}, qs = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const credentials = yield this.getCredentials('humanticAiApi');
            let options = {
                headers: {
                    'Content-Type': 'application/json',
                },
                method,
                qs,
                body,
                uri: `https://api.humantic.ai/v1${resource}`,
                json: true,
            };
            options = Object.assign({}, options, option);
            options.qs.apikey = credentials.apiKey;
            if (Object.keys(options.body).length === 0) {
                delete options.body;
            }
            const response = yield this.helpers.request(options);
            if (response.data && response.data.status === 'error') {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), response.data);
            }
            return response;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.humanticAiApiRequest = humanticAiApiRequest;

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
exports.yourlsApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function yourlsApiRequest(method, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('yourlsApi');
        qs.signature = credentials.signature;
        qs.format = 'json';
        const options = {
            method,
            body,
            qs,
            uri: `${credentials.url}/yourls-api.php`,
            json: true,
        };
        try {
            //@ts-ignore
            const response = yield this.helpers.request.call(this, options);
            if (response.status === 'fail') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Yourls error response [400]: ${response.message}`);
            }
            return response;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.yourlsApiRequest = yourlsApiRequest;

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
exports.lingvaNexApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function lingvaNexApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const credentials = yield this.getCredentials('lingvaNexApi');
            let options = {
                headers: {
                    Authorization: `Bearer ${credentials.apiKey}`,
                },
                method,
                qs,
                body,
                uri: uri || `https://api-b2b.backenster.com/b1/api/v3${resource}`,
                json: true,
            };
            options = Object.assign({}, options, option);
            const response = yield this.helpers.request(options);
            if (response.err !== null) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), response);
            }
            return response;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.lingvaNexApiRequest = lingvaNexApiRequest;

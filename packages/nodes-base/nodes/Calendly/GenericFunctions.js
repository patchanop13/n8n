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
exports.calendlyApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function calendlyApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('calendlyApi');
        const endpoint = 'https://calendly.com/api/v1';
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'X-TOKEN': credentials.apiKey,
            },
            method,
            body,
            qs: query,
            uri: uri || `${endpoint}${resource}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.form;
        }
        if (!Object.keys(query).length) {
            delete options.qs;
        }
        options = Object.assign({}, options, option);
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.calendlyApiRequest = calendlyApiRequest;

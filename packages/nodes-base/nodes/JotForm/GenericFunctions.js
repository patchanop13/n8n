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
exports.jotformApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function jotformApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('jotFormApi');
        let options = {
            headers: {
                'APIKEY': credentials.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method,
            qs,
            form: body,
            uri: uri || `https://${credentials.apiDomain || 'api.jotform.com'}${resource}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.form;
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
exports.jotformApiRequest = jotformApiRequest;

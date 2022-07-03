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
exports.oneSimpleApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function oneSimpleApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('oneSimpleApi');
        const outputFormat = 'json';
        let options = {
            method,
            body,
            qs,
            uri: uri || `https://onesimpleapi.com/api${resource}?token=${credentials.apiToken}&output=${outputFormat}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        try {
            const responseData = yield this.helpers.request(options);
            return responseData;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.oneSimpleApiRequest = oneSimpleApiRequest;

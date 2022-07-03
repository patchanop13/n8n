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
exports.convertKitApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function convertKitApiRequest(method, endpoint, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('convertKitApi');
        let options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            qs,
            body,
            uri: uri || `https://api.convertkit.com/v3${endpoint}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        // it's a webhook so include the api secret on the body
        if (options.uri.includes('/automations/hooks')) {
            options.body['api_secret'] = credentials.apiSecret;
        }
        else {
            qs.api_secret = credentials.apiSecret;
        }
        if (Object.keys(options.qs).length === 0) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.convertKitApiRequest = convertKitApiRequest;

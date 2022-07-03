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
exports.sms77ApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Sms77
 *
 * @param {IHookFunctions | IExecuteFunctions} this
 * @param {string} method
 * @param {Endpoint} endpoint
 * @param {object | undefined} data
 * @returns {Promise<any>}
 */
function sms77ApiRequest(method, endpoint, body, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('sms77Api');
        const options = {
            headers: {
                SentWith: 'n8n',
                'X-Api-Key': credentials.apiKey,
            },
            qs,
            uri: `https://gateway.sms77.io/api${endpoint}`,
            json: true,
            method,
        };
        if (Object.keys(body).length) {
            options.form = body;
            body.json = 1;
        }
        const response = yield this.helpers.request(options);
        if (response.success !== '100') {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), response, { message: 'Invalid sms77 credentials or API error!' });
        }
        return response;
    });
}
exports.sms77ApiRequest = sms77ApiRequest;

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
exports.moceanApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Twilio
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function moceanApiRequest(method, endpoint, body, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('moceanApi');
        if (query === undefined) {
            query = {};
        }
        if (method === 'POST') {
            body['mocean-api-key'] = credentials['mocean-api-key'];
            body['mocean-api-secret'] = credentials['mocean-api-secret'];
            body['mocean-resp-format'] = 'JSON';
        }
        else if (method === 'GET') {
            query['mocean-api-key'] = credentials['mocean-api-key'];
            query['mocean-api-secret'] = credentials['mocean-api-secret'];
            query['mocean-resp-format'] = 'JSON';
        }
        const options = {
            method,
            form: body,
            qs: query,
            uri: `https://rest.moceanapi.com${endpoint}`,
            json: true,
        };
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.moceanApiRequest = moceanApiRequest;

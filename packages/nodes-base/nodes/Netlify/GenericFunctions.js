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
exports.netlifyRequestAllItems = exports.netlifyApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function netlifyApiRequest(method, endpoint, body = {}, query = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            qs: query,
            body,
            uri: uri || `https://api.netlify.com/api/v1${endpoint}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (Object.keys(option)) {
            Object.assign(options, option);
        }
        try {
            const credentials = yield this.getCredentials('netlifyApi');
            options.headers['Authorization'] = `Bearer ${credentials.accessToken}`;
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.netlifyApiRequest = netlifyApiRequest;
function netlifyRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page = 0;
        query.per_page = 100;
        do {
            responseData = yield netlifyApiRequest.call(this, method, endpoint, body, query, undefined, { resolveWithFullResponse: true });
            query.page++;
            returnData.push.apply(returnData, responseData.body);
        } while (responseData.headers.link.includes('next'));
        return returnData;
    });
}
exports.netlifyRequestAllItems = netlifyRequestAllItems;

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
exports.disqusApiRequestAllItems = exports.disqusApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function disqusApiRequest(method, qs = {}, uri, body = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('disqusApi');
        qs.api_key = credentials.accessToken;
        // Convert to query string into a format the API can read
        const queryStringElements = [];
        for (const key of Object.keys(qs)) {
            if (Array.isArray(qs[key])) {
                qs[key].forEach(value => {
                    queryStringElements.push(`${key}=${value}`);
                });
            }
            else {
                queryStringElements.push(`${key}=${qs[key]}`);
            }
        }
        let options = {
            method,
            body,
            uri: `https://disqus.com/api/3.0/${uri}?${queryStringElements.join('&')}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.disqusApiRequest = disqusApiRequest;
/**
 * Make an API request to paginated flow endpoint
 * and return all results
 */
function disqusApiRequestAllItems(method, qs = {}, uri, body = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        try {
            do {
                responseData = yield disqusApiRequest.call(this, method, qs, uri, body, option);
                qs.cursor = responseData.cursor.id;
                returnData.push.apply(returnData, responseData.response);
            } while (responseData.cursor.more === true &&
                responseData.cursor.hasNext === true);
            return returnData;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.disqusApiRequestAllItems = disqusApiRequestAllItems;

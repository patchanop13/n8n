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
exports.wordpressApiRequestAllItems = exports.wordpressApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function wordpressApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('wordpressApi');
        let options = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'n8n',
            },
            auth: {
                user: credentials.username,
                password: credentials.password,
            },
            method,
            qs,
            body,
            uri: uri || `${credentials.url}/wp-json/wp/v2${resource}`,
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
exports.wordpressApiRequest = wordpressApiRequest;
function wordpressApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.per_page = 10;
        query.page = 0;
        do {
            query.page++;
            responseData = yield wordpressApiRequest.call(this, method, endpoint, body, query, undefined, { resolveWithFullResponse: true });
            returnData.push.apply(returnData, responseData.body);
        } while (responseData.headers['x-wp-totalpages'] !== undefined &&
            responseData.headers['x-wp-totalpages'] !== '0' &&
            parseInt(responseData.headers['x-wp-totalpages'], 10) !== query.page);
        return returnData;
    });
}
exports.wordpressApiRequestAllItems = wordpressApiRequestAllItems;

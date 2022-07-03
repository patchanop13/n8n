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
exports.capitalize = exports.validateJSON = exports.freshdeskApiRequestAllItems = exports.freshdeskApiRequest = void 0;
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
function freshdeskApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('freshdeskApi');
        const apiKey = `${credentials.apiKey}:X`;
        const endpoint = 'freshdesk.com/api/v2';
        let options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${Buffer.from(apiKey).toString(n8n_core_1.BINARY_ENCODING)}`,
            },
            method,
            body,
            qs: query,
            uri: uri || `https://${credentials.domain}.${endpoint}${resource}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
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
exports.freshdeskApiRequest = freshdeskApiRequest;
function freshdeskApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        query.per_page = 100;
        do {
            responseData = yield freshdeskApiRequest.call(this, method, endpoint, body, query, uri, { resolveWithFullResponse: true });
            if (responseData.headers.link) {
                uri = responseData.headers['link'].split(';')[0].replace('<', '').replace('>', '');
            }
            returnData.push.apply(returnData, responseData.body);
        } while (responseData.headers['link'] !== undefined &&
            responseData.headers['link'].includes('rel="next"'));
        return returnData;
    });
}
exports.freshdeskApiRequestAllItems = freshdeskApiRequestAllItems;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = [];
    }
    return result;
}
exports.validateJSON = validateJSON;
function capitalize(s) {
    if (typeof s !== 'string')
        return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}
exports.capitalize = capitalize;

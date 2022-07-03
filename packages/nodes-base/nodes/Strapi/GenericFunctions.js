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
exports.validateJSON = exports.strapiApiRequestAllItems = exports.getToken = exports.strapiApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function strapiApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('strapiApi');
        try {
            const options = {
                headers: {},
                method,
                body,
                qs,
                uri: uri || credentials.apiVersion === 'v4' ? `${credentials.url}/api${resource}` : `${credentials.url}${resource}`,
                json: true,
                qsStringifyOptions: {
                    arrayFormat: 'indice',
                },
            };
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            //@ts-ignore
            return yield ((_a = this.helpers) === null || _a === void 0 ? void 0 : _a.request(options));
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.strapiApiRequest = strapiApiRequest;
function getToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('strapiApi');
        let options = {};
        options = {
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: {
                identifier: credentials.email,
                password: credentials.password,
            },
            uri: credentials.apiVersion === 'v4' ? `${credentials.url}/api/auth/local` : `${credentials.url}/auth/local`,
            json: true,
        };
        return this.helpers.request(options);
    });
}
exports.getToken = getToken;
function strapiApiRequestAllItems(method, resource, body = {}, query = {}, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const { apiVersion } = yield this.getCredentials('strapiApi');
        let responseData;
        if (apiVersion === 'v4') {
            query['pagination[pageSize]'] = 20;
            query['pagination[page]'] = 0;
            do {
                ({ data: responseData } = yield strapiApiRequest.call(this, method, resource, body, query, undefined, headers));
                query['pagination[page]'] += query['pagination[pageSize]'];
                returnData.push.apply(returnData, responseData);
            } while (responseData.length !== 0);
        }
        else {
            query._limit = 20;
            query._start = 0;
            do {
                responseData = yield strapiApiRequest.call(this, method, resource, body, query, undefined, headers);
                query._start += query._limit;
                returnData.push.apply(returnData, responseData);
            } while (responseData.length !== 0);
        }
        return returnData;
    });
}
exports.strapiApiRequestAllItems = strapiApiRequestAllItems;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = undefined;
    }
    return result;
}
exports.validateJSON = validateJSON;

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
exports.idsExist = exports.surveyMonkeyRequestAllItems = exports.surveyMonkeyApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function surveyMonkeyApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        const endpoint = 'https://api.surveymonkey.com/v3';
        let options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs: query,
            uri: uri || `${endpoint}${resource}`,
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
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('surveyMonkeyApi');
                // @ts-ignore
                options.headers['Authorization'] = `bearer ${credentials.accessToken}`;
                return yield this.helpers.request(options);
            }
            else {
                return yield ((_a = this.helpers.requestOAuth2) === null || _a === void 0 ? void 0 : _a.call(this, 'surveyMonkeyOAuth2Api', options));
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.surveyMonkeyApiRequest = surveyMonkeyApiRequest;
function surveyMonkeyRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page = 1;
        query.per_page = 100;
        let uri;
        do {
            responseData = yield surveyMonkeyApiRequest.call(this, method, endpoint, body, query, uri);
            uri = responseData.links.next;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.links.next);
        return returnData;
    });
}
exports.surveyMonkeyRequestAllItems = surveyMonkeyRequestAllItems;
function idsExist(ids, surveyIds) {
    for (const surveyId of surveyIds) {
        if (!ids.includes(surveyId)) {
            return false;
        }
    }
    return true;
}
exports.idsExist = idsExist;

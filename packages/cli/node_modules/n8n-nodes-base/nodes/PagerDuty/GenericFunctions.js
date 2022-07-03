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
exports.keysToSnakeCase = exports.pagerDutyApiRequestAllItems = exports.pagerDutyApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const change_case_1 = require("change-case");
function pagerDutyApiRequest(method, resource, body = {}, query = {}, uri, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        const options = {
            headers: {
                Accept: 'application/vnd.pagerduty+json;version=2',
            },
            method,
            body,
            qs: query,
            uri: uri || `https://api.pagerduty.com${resource}`,
            json: true,
            qsStringifyOptions: {
                arrayFormat: 'brackets',
            },
        };
        if (!Object.keys(body).length) {
            delete options.form;
        }
        if (!Object.keys(query).length) {
            delete options.qs;
        }
        options.headers = Object.assign({}, options.headers, headers);
        try {
            if (authenticationMethod === 'apiToken') {
                const credentials = yield this.getCredentials('pagerDutyApi');
                options.headers['Authorization'] = `Token token=${credentials.apiToken}`;
                return yield this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'pagerDutyOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.pagerDutyApiRequest = pagerDutyApiRequest;
function pagerDutyApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.limit = 100;
        query.offset = 0;
        do {
            responseData = yield pagerDutyApiRequest.call(this, method, endpoint, body, query);
            query.offset++;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.more);
        return returnData;
    });
}
exports.pagerDutyApiRequestAllItems = pagerDutyApiRequestAllItems;
function keysToSnakeCase(elements) {
    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    for (const element of elements) {
        for (const key of Object.keys(element)) {
            if (key !== (0, change_case_1.snakeCase)(key)) {
                element[(0, change_case_1.snakeCase)(key)] = element[key];
                delete element[key];
            }
        }
    }
    return elements;
}
exports.keysToSnakeCase = keysToSnakeCase;

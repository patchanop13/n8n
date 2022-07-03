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
exports.validateJSON = exports.bubbleApiRequestAllItems = exports.bubbleApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an authenticated API request to Bubble.
 */
function bubbleApiRequest(method, endpoint, body, qs) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiToken, appName, domain, environment, hosting } = yield this.getCredentials('bubbleApi');
        const rootUrl = hosting === 'bubbleHosted' ? `https://${appName}.bubbleapps.io` : domain;
        const urlSegment = environment === 'development' ? '/version-test/api/1.1' : '/api/1.1';
        const options = {
            headers: {
                'user-agent': 'n8n',
                'Authorization': `Bearer ${apiToken}`,
            },
            method,
            uri: `${rootUrl}${urlSegment}${endpoint}`,
            qs,
            body,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
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
exports.bubbleApiRequest = bubbleApiRequest;
/**
 * Make an authenticated API request to Bubble and return all results.
 */
function bubbleApiRequestAllItems(method, endpoint, body, qs) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        qs.limit = 100;
        do {
            responseData = yield bubbleApiRequest.call(this, method, endpoint, body, qs);
            qs.cursor = responseData.cursor;
            returnData.push.apply(returnData, responseData['response']['results']);
        } while (responseData.response.remaining !== 0);
        return returnData;
    });
}
exports.bubbleApiRequestAllItems = bubbleApiRequestAllItems;
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

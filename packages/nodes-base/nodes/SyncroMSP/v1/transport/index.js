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
exports.validateCredentials = exports.apiRequestAllItems = exports.apiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Mattermost
 */
function apiRequest(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('syncroMspApi');
        query['api_key'] = credentials.apiKey;
        const options = {
            method,
            body,
            qs: query,
            url: `https://${credentials.subdomain}.syncromsp.com/api/v1/${endpoint}`,
            headers: {},
        };
        try {
            return yield this.helpers.httpRequest(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.apiRequest = apiRequest;
function apiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let returnData = [];
        let responseData;
        query.page = 1;
        do {
            responseData = yield apiRequest.call(this, method, endpoint, body, query);
            query.page++;
            returnData = returnData.concat(responseData[endpoint]);
        } while (responseData[endpoint].length !== 0);
        return returnData;
    });
}
exports.apiRequestAllItems = apiRequestAllItems;
function validateCredentials(decryptedCredentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = decryptedCredentials;
        const { subdomain, apiKey, } = credentials;
        const options = {
            method: 'GET',
            qs: {
                api_key: apiKey,
            },
            url: `https://${subdomain}.syncromsp.com/api/v1//me`,
        };
        return this.helpers.request(options);
    });
}
exports.validateCredentials = validateCredentials;

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
exports.validateJSON = exports.paddleApiRequestAllItems = exports.paddleApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function paddleApiRequest(endpoint, method, body = {}, query, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('paddleApi');
        const productionUrl = 'https://vendors.paddle.com/api';
        const sandboxUrl = 'https://sandbox-vendors.paddle.com/api';
        const isSandbox = credentials.sandbox;
        const options = {
            method,
            headers: {
                'content-type': 'application/json',
            },
            uri: `${isSandbox === true ? sandboxUrl : productionUrl}${endpoint}`,
            body,
            json: true,
        };
        body['vendor_id'] = credentials.vendorId;
        body['vendor_auth_code'] = credentials.vendorAuthCode;
        try {
            const response = yield this.helpers.request(options);
            if (!response.success) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), response);
            }
            return response;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.paddleApiRequest = paddleApiRequest;
function paddleApiRequestAllItems(propertyName, endpoint, method, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        body.results_per_page = 200;
        body.page = 1;
        do {
            responseData = yield paddleApiRequest.call(this, endpoint, method, body, query);
            returnData.push.apply(returnData, responseData[propertyName]);
            body.page++;
        } while (responseData[propertyName].length !== 0 && responseData[propertyName].length === body.results_per_page);
        return returnData;
    });
}
exports.paddleApiRequestAllItems = paddleApiRequestAllItems;
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

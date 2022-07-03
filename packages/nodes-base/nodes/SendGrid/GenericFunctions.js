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
exports.sendGridApiRequestAllItems = exports.sendGridApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function sendGridApiRequest(endpoint, method, body = {}, qs = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('sendGridApi');
        const host = 'api.sendgrid.com/v3';
        const options = {
            headers: {
                Authorization: `Bearer ${credentials.apiKey}`,
            },
            method,
            qs,
            body,
            uri: `https://${host}${endpoint}`,
            json: true,
        };
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        try {
            //@ts-ignore
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.sendGridApiRequest = sendGridApiRequest;
function sendGridApiRequestAllItems(endpoint, method, propertyName, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        do {
            responseData = yield sendGridApiRequest.call(this, endpoint, method, body, query, uri);
            uri = responseData._metadata.next;
            returnData.push.apply(returnData, responseData[propertyName]);
            if (query.limit && returnData.length >= query.limit) {
                return returnData;
            }
        } while (responseData._metadata.next !== undefined);
        return returnData;
    });
}
exports.sendGridApiRequestAllItems = sendGridApiRequestAllItems;

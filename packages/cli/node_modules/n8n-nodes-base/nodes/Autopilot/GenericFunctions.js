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
exports.autopilotApiRequestAllItems = exports.autopilotApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function autopilotApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('autopilotApi');
        const apiKey = `${credentials.apiKey}`;
        const endpoint = 'https://api2.autopilothq.com/v1';
        const options = {
            headers: {
                'Content-Type': 'application/json',
                autopilotapikey: apiKey,
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
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.autopilotApiRequest = autopilotApiRequest;
function autopilotApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const returnAll = this.getNodeParameter('returnAll', 0, false);
        const base = endpoint;
        let responseData;
        do {
            responseData = yield autopilotApiRequest.call(this, method, endpoint, body, query);
            endpoint = `${base}/${responseData.bookmark}`;
            returnData.push.apply(returnData, responseData[propertyName]);
            if (query.limit && returnData.length >= query.limit && returnAll === false) {
                return returnData;
            }
        } while (responseData.bookmark !== undefined);
        return returnData;
    });
}
exports.autopilotApiRequestAllItems = autopilotApiRequestAllItems;

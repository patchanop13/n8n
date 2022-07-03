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
exports.clockifyApiRequestAllItems = exports.clockifyApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function clockifyApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const BASE_URL = 'https://api.clockify.me/api/v1';
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            qs,
            body,
            uri: `${BASE_URL}/${resource}`,
            json: true,
            useQuerystring: true,
        };
        try {
            return yield this.helpers.requestWithAuthentication.call(this, 'clockifyApi', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.clockifyApiRequest = clockifyApiRequest;
function clockifyApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query['page-size'] = 50;
        query.page = 1;
        do {
            responseData = yield clockifyApiRequest.call(this, method, endpoint, body, query);
            returnData.push.apply(returnData, responseData);
            if (query.limit && (returnData.length >= query.limit)) {
                return returnData;
            }
            query.page++;
        } while (responseData.length !== 0);
        return returnData;
    });
}
exports.clockifyApiRequestAllItems = clockifyApiRequestAllItems;

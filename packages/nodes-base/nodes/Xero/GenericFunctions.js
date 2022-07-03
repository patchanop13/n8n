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
exports.xeroApiRequestAllItems = exports.xeroApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function xeroApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://api.xero.com/api.xro/2.0${resource}`,
            json: true,
        };
        try {
            if (body.organizationId) {
                options.headers = Object.assign(Object.assign({}, options.headers), { 'Xero-tenant-id': body.organizationId });
                delete body.organizationId;
            }
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            //@ts-ignore
            return yield this.helpers.requestOAuth2.call(this, 'xeroOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.xeroApiRequest = xeroApiRequest;
function xeroApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page = 1;
        do {
            responseData = yield xeroApiRequest.call(this, method, endpoint, body, query);
            query.page++;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData[propertyName].length !== 0);
        return returnData;
    });
}
exports.xeroApiRequestAllItems = xeroApiRequestAllItems;

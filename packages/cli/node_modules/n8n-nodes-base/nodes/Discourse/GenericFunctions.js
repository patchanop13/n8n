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
exports.discourseApiRequestAllItems = exports.discourseApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function discourseApiRequest(method, path, body = {}, qs = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('discourseApi');
        const options = {
            method,
            body,
            qs,
            uri: `${credentials.url}${path}`,
            json: true,
        };
        try {
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            return yield this.helpers.requestWithAuthentication.call(this, 'discourseApi', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.discourseApiRequest = discourseApiRequest;
function discourseApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page = 1;
        do {
            responseData = yield discourseApiRequest.call(this, method, endpoint, body, query);
            returnData.push.apply(returnData, responseData);
            query.page++;
        } while (responseData.length !== 0);
        return returnData;
    });
}
exports.discourseApiRequestAllItems = discourseApiRequestAllItems;

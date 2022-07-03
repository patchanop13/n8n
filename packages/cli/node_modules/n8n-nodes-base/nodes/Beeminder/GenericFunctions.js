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
exports.beeminderApiRequestAllItems = exports.beeminderApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const BEEMINDER_URI = 'https://www.beeminder.com/api/v1';
function beeminderApiRequest(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('beeminderApi');
        Object.assign(body, { auth_token: credentials.authToken });
        const options = {
            method,
            body,
            qs: query,
            uri: `${BEEMINDER_URI}${endpoint}`,
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
exports.beeminderApiRequest = beeminderApiRequest;
function beeminderApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page = 1;
        do {
            responseData = yield beeminderApiRequest.call(this, method, endpoint, body, query);
            query.page++;
            returnData.push.apply(returnData, responseData);
        } while (responseData.length !== 0);
        return returnData;
    });
}
exports.beeminderApiRequestAllItems = beeminderApiRequestAllItems;

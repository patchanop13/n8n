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
exports.apiRequestAllItems = exports.apiRequest = void 0;
/**
 * Make an API request to Mattermost
 */
function apiRequest(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('mattermostApi');
        const options = {
            method,
            body,
            qs: query,
            url: `${credentials.baseUrl}/api/v4/${endpoint}`,
            headers: {
                'content-type': 'application/json; charset=utf-8',
            },
        };
        return this.helpers.httpRequestWithAuthentication.call(this, 'mattermostApi', options);
    });
}
exports.apiRequest = apiRequest;
function apiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page = 0;
        query.per_page = 100;
        do {
            responseData = yield apiRequest.call(this, method, endpoint, body, query);
            query.page++;
            returnData.push.apply(returnData, responseData);
        } while (responseData.length !== 0);
        return returnData;
    });
}
exports.apiRequestAllItems = apiRequestAllItems;

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
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Trello
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function apiRequest(method, endpoint, body, query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = query || {};
        const options = {
            method,
            body,
            qs: query,
            uri: `https://api.trello.com/1/${endpoint}`,
            json: true,
        };
        try {
            return yield this.helpers.requestWithAuthentication.call(this, 'trelloApi', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.apiRequest = apiRequest;
function apiRequestAllItems(method, endpoint, body, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        query.limit = 30;
        query.sort = '-id';
        const returnData = [];
        let responseData;
        do {
            responseData = yield apiRequest.call(this, method, endpoint, body, query);
            returnData.push.apply(returnData, responseData);
            if (responseData.length !== 0) {
                query.before = responseData[responseData.length - 1].id;
            }
        } while (query.limit <= responseData.length);
        return returnData;
    });
}
exports.apiRequestAllItems = apiRequestAllItems;

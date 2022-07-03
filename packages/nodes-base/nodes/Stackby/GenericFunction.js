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
 * Make an API request to Airtable
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function apiRequest(method, endpoint, body, query, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('stackbyApi');
        const options = {
            headers: {
                'api-key': credentials.apiKey,
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs: query,
            uri: uri || `https://stackby.com/api/betav1${endpoint}`,
            json: true,
        };
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.apiRequest = apiRequest;
/**
 * Make an API request to paginated Airtable endpoint
 * and return all results
 *
 * @export
 * @param {(IHookFunctions | IExecuteFunctions)} this
 * @param {string} method
 * @param {string} endpoint
 * @param {IDataObject} body
 * @param {IDataObject} [query]
 * @returns {Promise<any>}
 */
function apiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        query.maxrecord = 100;
        query.offset = 0;
        const returnData = [];
        let responseData;
        do {
            responseData = yield apiRequest.call(this, method, endpoint, body, query);
            returnData.push.apply(returnData, responseData);
            query.offset += query.maxrecord;
        } while (responseData.length !== 0);
        return returnData;
    });
}
exports.apiRequestAllItems = apiRequestAllItems;

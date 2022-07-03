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
exports.getForms = exports.apiRequestAllItems = exports.apiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Typeform
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function apiRequest(method, endpoint, body, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        const options = {
            headers: {},
            method,
            body,
            qs: query,
            uri: `https://api.typeform.com/${endpoint}`,
            json: true,
        };
        query = query || {};
        try {
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('typeformApi');
                options.headers['Authorization'] = `bearer ${credentials.accessToken}`;
                return yield this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'typeformOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.apiRequest = apiRequest;
/**
 * Make an API request to paginated Typeform endpoint
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
function apiRequestAllItems(method, endpoint, body, query, dataKey) {
    return __awaiter(this, void 0, void 0, function* () {
        if (query === undefined) {
            query = {};
        }
        query.page_size = 200;
        query.page = 0;
        const returnData = {
            items: [],
        };
        let responseData;
        do {
            query.page += 1;
            responseData = yield apiRequest.call(this, method, endpoint, body, query);
            returnData.items.push.apply(returnData.items, responseData.items);
        } while (responseData.page_count !== undefined &&
            responseData.page_count > query.page);
        return returnData;
    });
}
exports.apiRequestAllItems = apiRequestAllItems;
/**
 * Returns all the available forms
 *
 * @export
 * @param {ILoadOptionsFunctions} this
 * @returns {Promise<INodePropertyOptions[]>}
 */
function getForms() {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = 'forms';
        const responseData = yield apiRequestAllItems.call(this, 'GET', endpoint, {});
        if (responseData.items === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
        }
        const returnData = [];
        for (const baseData of responseData.items) {
            returnData.push({
                name: baseData.title,
                value: baseData.id,
            });
        }
        return returnData;
    });
}
exports.getForms = getForms;

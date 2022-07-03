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
exports.hackerNewsApiRequestAllItems = exports.hackerNewsApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to HackerNews
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} endpoint
 * @param {IDataObject} qs
 * @returns {Promise<any>}
 */
function hackerNewsApiRequest(method, endpoint, qs) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method,
            qs,
            uri: `http://hn.algolia.com/api/v1/${endpoint}`,
            json: true,
        };
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.hackerNewsApiRequest = hackerNewsApiRequest;
/**
 * Make an API request to HackerNews
 * and return all results
 *
 * @export
 * @param {(IHookFunctions | IExecuteFunctions)} this
 * @param {string} method
 * @param {string} endpoint
 * @param {IDataObject} qs
 * @returns {Promise<any>}
 */
function hackerNewsApiRequestAllItems(method, endpoint, qs) {
    return __awaiter(this, void 0, void 0, function* () {
        qs.hitsPerPage = 100;
        const returnData = [];
        let responseData;
        let itemsReceived = 0;
        do {
            responseData = yield hackerNewsApiRequest.call(this, method, endpoint, qs);
            returnData.push.apply(returnData, responseData.hits);
            if (returnData !== undefined) {
                itemsReceived += returnData.length;
            }
        } while (responseData.nbHits > itemsReceived);
        return returnData;
    });
}
exports.hackerNewsApiRequestAllItems = hackerNewsApiRequestAllItems;

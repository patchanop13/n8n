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
exports.handleListing = exports.redditApiRequestAllItems = exports.redditApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an authenticated or unauthenticated API request to Reddit.
 */
function redditApiRequest(method, endpoint, qs) {
    return __awaiter(this, void 0, void 0, function* () {
        const resource = this.getNodeParameter('resource', 0);
        const authRequired = ['profile', 'post', 'postComment'].includes(resource);
        qs.api_type = 'json';
        const options = {
            headers: {
                'user-agent': 'n8n',
            },
            method,
            uri: authRequired ? `https://oauth.reddit.com/${endpoint}` : `https://www.reddit.com/${endpoint}`,
            qs,
            json: true,
        };
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        if (authRequired) {
            try {
                return yield this.helpers.requestOAuth2.call(this, 'redditOAuth2Api', options);
            }
            catch (error) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
            }
        }
        else {
            try {
                return yield this.helpers.request.call(this, options);
            }
            catch (error) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
            }
        }
    });
}
exports.redditApiRequest = redditApiRequest;
/**
 * Make an unauthenticated API request to Reddit and return all results.
 */
function redditApiRequestAllItems(method, endpoint, qs) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseData;
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const returnAll = this.getNodeParameter('returnAll', 0, false);
        qs.limit = 100;
        do {
            responseData = yield redditApiRequest.call(this, method, endpoint, qs);
            if (!Array.isArray(responseData)) {
                qs.after = responseData.data.after;
            }
            if (endpoint === 'api/search_subreddits.json') {
                responseData.subreddits.forEach((child) => returnData.push(child)); // tslint:disable-line:no-any
            }
            else if (resource === 'postComment' && operation === 'getAll') {
                responseData[1].data.children.forEach((child) => returnData.push(child.data)); // tslint:disable-line:no-any
            }
            else {
                responseData.data.children.forEach((child) => returnData.push(child.data)); // tslint:disable-line:no-any
            }
            if (qs.limit && returnData.length >= qs.limit && returnAll === false) {
                return returnData;
            }
        } while (responseData.data && responseData.data.after);
        return returnData;
    });
}
exports.redditApiRequestAllItems = redditApiRequestAllItems;
/**
 * Handles a large Reddit listing by returning all items or up to a limit.
 */
function handleListing(i, endpoint, qs = {}, requestMethod = 'GET') {
    return __awaiter(this, void 0, void 0, function* () {
        let responseData;
        const returnAll = this.getNodeParameter('returnAll', i);
        if (returnAll) {
            responseData = yield redditApiRequestAllItems.call(this, requestMethod, endpoint, qs);
        }
        else {
            const limit = this.getNodeParameter('limit', i);
            qs.limit = limit;
            responseData = yield redditApiRequestAllItems.call(this, requestMethod, endpoint, qs);
            responseData = responseData.slice(0, limit);
        }
        return responseData;
    });
}
exports.handleListing = handleListing;

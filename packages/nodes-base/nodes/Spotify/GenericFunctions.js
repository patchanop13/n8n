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
exports.spotifyApiRequestAllItems = exports.spotifyApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
/**
 * Make an API request to Spotify
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function spotifyApiRequest(method, endpoint, body, query, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method,
            headers: {
                'User-Agent': 'n8n',
                'Content-Type': 'text/plain',
                'Accept': ' application/json',
            },
            qs: query,
            uri: uri || `https://api.spotify.com/v1${endpoint}`,
            json: true,
        };
        if (Object.keys(body).length > 0) {
            options.body = body;
        }
        try {
            return yield this.helpers.requestOAuth2.call(this, 'spotifyOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.spotifyApiRequest = spotifyApiRequest;
function spotifyApiRequestAllItems(propertyName, method, endpoint, body, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        do {
            responseData = yield spotifyApiRequest.call(this, method, endpoint, body, query, uri);
            returnData.push.apply(returnData, (0, lodash_1.get)(responseData, propertyName));
            uri = responseData.next || responseData[propertyName.split('.')[0]].next;
            //remove the query as the query parameters are already included in the next, else api throws error.
            query = {};
            if ((uri === null || uri === void 0 ? void 0 : uri.includes('offset=1000')) && endpoint === '/search') {
                // The search endpoint has a limit of 1000 so step before it returns a 404
                return returnData;
            }
        } while ((responseData['next'] !== null && responseData['next'] !== undefined) ||
            (responseData[propertyName.split('.')[0]].next !== null && responseData[propertyName.split('.')[0]].next !== undefined));
        return returnData;
    });
}
exports.spotifyApiRequestAllItems = spotifyApiRequestAllItems;

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
exports.gitlabApiRequestAllItems = exports.gitlabApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Gitlab
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function gitlabApiRequest(method, endpoint, body, query, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method,
            headers: {},
            body,
            qs: query,
            uri: '',
            json: true,
        };
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        if (query === undefined) {
            delete options.qs;
        }
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        try {
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('gitlabApi');
                options.headers['Private-Token'] = `${credentials.accessToken}`;
                options.uri = `${credentials.server.replace(/\/$/, '')}/api/v4${endpoint}`;
                return yield this.helpers.request(options);
            }
            else {
                const credentials = yield this.getCredentials('gitlabOAuth2Api');
                options.uri = `${credentials.server.replace(/\/$/, '')}/api/v4${endpoint}`;
                return yield this.helpers.requestOAuth2.call(this, 'gitlabOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.gitlabApiRequest = gitlabApiRequest;
function gitlabApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.per_page = 100;
        query.page = 1;
        do {
            responseData = yield gitlabApiRequest.call(this, method, endpoint, body, query, { resolveWithFullResponse: true });
            query.page++;
            returnData.push.apply(returnData, responseData.body);
        } while (responseData.headers.link && responseData.headers.link.includes('next'));
        return returnData;
    });
}
exports.gitlabApiRequestAllItems = gitlabApiRequestAllItems;

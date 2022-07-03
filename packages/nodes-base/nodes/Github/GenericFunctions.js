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
exports.githubApiRequestAllItems = exports.getFileSha = exports.githubApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Github
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function githubApiRequest(method, endpoint, body, query, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method,
            headers: {
                'User-Agent': 'n8n',
            },
            body,
            qs: query,
            uri: '',
            json: true,
        };
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        try {
            const authenticationMethod = this.getNodeParameter('authentication', 0, 'accessToken');
            let credentialType = '';
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('githubApi');
                credentialType = 'githubApi';
                const baseUrl = credentials.server || 'https://api.github.com';
                options.uri = `${baseUrl}${endpoint}`;
            }
            else {
                const credentials = yield this.getCredentials('githubOAuth2Api');
                credentialType = 'githubOAuth2Api';
                const baseUrl = credentials.server || 'https://api.github.com';
                options.uri = `${baseUrl}${endpoint}`;
            }
            return yield this.helpers.requestWithAuthentication.call(this, credentialType, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.githubApiRequest = githubApiRequest;
/**
 * Returns the SHA of the given file
 *
 * @export
 * @param {(IHookFunctions | IExecuteFunctions)} this
 * @param {string} owner
 * @param {string} repository
 * @param {string} filePath
 * @param {string} [branch]
 * @returns {Promise<any>}
 */
function getFileSha(owner, repository, filePath, branch) {
    return __awaiter(this, void 0, void 0, function* () {
        const getBody = {};
        if (branch !== undefined) {
            getBody.branch = branch;
        }
        const getEndpoint = `/repos/${owner}/${repository}/contents/${encodeURI(filePath)}`;
        const responseData = yield githubApiRequest.call(this, 'GET', getEndpoint, getBody, {});
        if (responseData.sha === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Could not get the SHA of the file.');
        }
        return responseData.sha;
    });
}
exports.getFileSha = getFileSha;
function githubApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.per_page = 100;
        query.page = 1;
        do {
            responseData = yield githubApiRequest.call(this, method, endpoint, body, query, { resolveWithFullResponse: true });
            query.page++;
            returnData.push.apply(returnData, responseData.body);
        } while (responseData.headers.link && responseData.headers.link.includes('next'));
        return returnData;
    });
}
exports.githubApiRequestAllItems = githubApiRequestAllItems;

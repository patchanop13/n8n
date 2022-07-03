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
exports.nextCloudApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to NextCloud
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function nextCloudApiRequest(method, endpoint, body, headers, encoding, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        let credentials;
        if (authenticationMethod === 'accessToken') {
            credentials = (yield this.getCredentials('nextCloudApi'));
        }
        else {
            credentials = (yield this.getCredentials('nextCloudOAuth2Api'));
        }
        const options = {
            headers,
            method,
            body,
            qs: query !== null && query !== void 0 ? query : {},
            uri: '',
            json: false,
        };
        if (encoding === null) {
            options.encoding = null;
        }
        options.uri = `${credentials.webDavUrl}/${encodeURI(endpoint)}`;
        if (resource === 'user' && operation === 'create') {
            options.uri = options.uri.replace('/remote.php/webdav', '');
        }
        const credentialType = authenticationMethod === 'accessToken' ? 'nextCloudApi' : 'nextCloudOAuth2Api';
        try {
            return yield this.helpers.requestWithAuthentication.call(this, credentialType, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.nextCloudApiRequest = nextCloudApiRequest;

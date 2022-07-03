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
exports.twakeApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Twake
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function twakeApiRequest(method, resource, body, query, uri) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('twakeVersion', 0, 'twakeCloudApi');
        const options = {
            headers: {},
            method,
            body,
            qs: query,
            uri: uri || `https://plugins.twake.app/plugins/n8n${resource}`,
            json: true,
        };
        // if (authenticationMethod === 'cloud') {
        // } else {
        // 	const credentials = await this.getCredentials('twakeServerApi');
        // 	options.auth = { user: credentials!.publicId as string, pass: credentials!.privateApiKey as string };
        // 	options.uri = `${credentials!.hostUrl}/api/v1${resource}`;
        // }
        try {
            return yield this.helpers.requestWithAuthentication.call(this, 'twakeCloudApi', options);
        }
        catch (error) {
            if (((_a = error.error) === null || _a === void 0 ? void 0 : _a.code) === 'ECONNREFUSED') {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { message: 'Twake host is not accessible!' });
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.twakeApiRequest = twakeApiRequest;

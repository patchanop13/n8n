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
exports.escapeXml = exports.twilioApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Twilio
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function twilioApiRequest(method, endpoint, body, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('twilioApi');
        if (query === undefined) {
            query = {};
        }
        const options = {
            method,
            form: body,
            qs: query,
            uri: `https://api.twilio.com/2010-04-01/Accounts/${credentials.accountSid}${endpoint}`,
            json: true,
        };
        if (credentials.authType === 'apiKey') {
            options.auth = {
                user: credentials.apiKeySid,
                password: credentials.apiKeySecret,
            };
        }
        else if (credentials.authType === 'authToken') {
            options.auth = {
                user: credentials.accountSid,
                pass: credentials.authToken,
            };
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.twilioApiRequest = twilioApiRequest;
const XML_CHAR_MAP = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&apos;',
};
function escapeXml(str) {
    return str.replace(/[<>&"']/g, (ch) => {
        return XML_CHAR_MAP[ch];
    });
}
exports.escapeXml = escapeXml;

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
exports.validateCredentials = exports.dropcontactApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an authenticated API request to Bubble.
 */
function dropcontactApiRequest(method, endpoint, body, qs) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey } = yield this.getCredentials('dropcontactApi');
        const options = {
            headers: {
                'user-agent': 'n8n',
                'X-Access-Token': apiKey,
            },
            method,
            uri: `https://api.dropcontact.io${endpoint}`,
            qs,
            body,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.dropcontactApiRequest = dropcontactApiRequest;
function validateCredentials(decryptedCredentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = decryptedCredentials;
        const { apiKey } = credentials;
        const options = {
            headers: {
                'user-agent': 'n8n',
                'X-Access-Token': apiKey,
            },
            method: 'POST',
            body: {
                data: [{ email: '' }],
            },
            uri: `https://api.dropcontact.io/batch`,
            json: true,
        };
        return this.helpers.request(options);
    });
}
exports.validateCredentials = validateCredentials;

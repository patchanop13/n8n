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
exports.mediumApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function mediumApiRequest(method, endpoint, body = {}, query = {}, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        const options = {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Charset': 'utf-8',
            },
            qs: query,
            uri: uri || `https://api.medium.com/v1${endpoint}`,
            body,
            json: true,
        };
        try {
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('mediumApi');
                options.headers['Authorization'] = `Bearer ${credentials.accessToken}`;
                return yield this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'mediumOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.mediumApiRequest = mediumApiRequest;

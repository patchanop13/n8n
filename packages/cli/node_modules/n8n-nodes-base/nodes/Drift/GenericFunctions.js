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
exports.driftApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function driftApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            headers: {},
            method,
            body,
            qs: query,
            uri: uri || `https://driftapi.com${resource}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.form;
        }
        if (!Object.keys(query).length) {
            delete options.qs;
        }
        options = Object.assign({}, options, option);
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        try {
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('driftApi');
                options.headers['Authorization'] = `Bearer ${credentials.accessToken}`;
                return yield this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'driftOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.driftApiRequest = driftApiRequest;

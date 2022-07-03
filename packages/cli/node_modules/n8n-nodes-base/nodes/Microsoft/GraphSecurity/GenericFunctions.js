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
exports.throwOnEmptyUpdate = exports.tolerateDoubleQuotes = exports.msGraphSecurityApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function msGraphSecurityApiRequest(method, endpoint, body = {}, qs = {}, headers = {}) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const { oauthTokenData: { access_token, // tslint:disable-line variable-name
         }, } = yield this.getCredentials('microsoftGraphSecurityOAuth2Api');
        const options = {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            method,
            body,
            qs,
            uri: `https://graph.microsoft.com/v1.0/security${endpoint}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        if (Object.keys(headers).length) {
            options.headers = Object.assign(Object.assign({}, options.headers), headers);
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            const nestedMessage = (_b = (_a = error === null || error === void 0 ? void 0 : error.error) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message;
            if (nestedMessage.startsWith('{"')) {
                error = JSON.parse(nestedMessage);
            }
            if (nestedMessage.startsWith('Http request failed with statusCode=BadRequest')) {
                error.error.error.message = 'Request failed with bad request';
            }
            else if (nestedMessage.startsWith('Http request failed with')) {
                const stringified = nestedMessage.split(': ').pop();
                if (stringified) {
                    error = JSON.parse(stringified);
                }
            }
            if (['Invalid filter clause', 'Invalid ODATA query filter'].includes(nestedMessage)) {
                error.error.error.message += ' - Please check that your query parameter syntax is correct: https://docs.microsoft.com/en-us/graph/query-parameters#filter-parameter';
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.msGraphSecurityApiRequest = msGraphSecurityApiRequest;
function tolerateDoubleQuotes(filterQueryParameter) {
    return filterQueryParameter.replace(/"/g, `'`);
}
exports.tolerateDoubleQuotes = tolerateDoubleQuotes;
function throwOnEmptyUpdate() {
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter at least one field to update');
}
exports.throwOnEmptyUpdate = throwOnEmptyUpdate;

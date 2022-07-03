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
exports.validateJSON = exports.mailjetApiRequestAllItems = exports.mailjetApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function mailjetApiRequest(method, path, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const resource = this.getNodeParameter('resource', 0);
        let credentialType;
        if (resource === 'email' || this.getNode().type.includes('Trigger')) {
            credentialType = 'mailjetEmailApi';
            const { sandboxMode } = yield this.getCredentials('mailjetEmailApi');
            if (!this.getNode().type.includes('Trigger')) {
                Object.assign(body, { SandboxMode: sandboxMode });
            }
        }
        else {
            credentialType = 'mailjetSmsApi';
        }
        let options = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method,
            qs,
            body,
            uri: uri || `https://api.mailjet.com${path}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        try {
            return yield this.helpers.requestWithAuthentication.call(this, credentialType, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.mailjetApiRequest = mailjetApiRequest;
function mailjetApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.Limit = 1000;
        query.Offset = 0;
        do {
            responseData = yield mailjetApiRequest.call(this, method, endpoint, body, query, undefined, { resolveWithFullResponse: true });
            returnData.push.apply(returnData, responseData.body);
            query.Offset = query.Offset + query.Limit;
        } while (responseData.length !== 0);
        return returnData;
    });
}
exports.mailjetApiRequestAllItems = mailjetApiRequestAllItems;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = undefined;
    }
    return result;
}
exports.validateJSON = validateJSON;

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
exports.validateJSON = exports.linkedInApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function linkedInApiRequest(method, endpoint, body = {}, binary, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            headers: {
                'Accept': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0',
            },
            method,
            body,
            url: binary ? endpoint : `https://api.linkedin.com/v2${endpoint}`,
            json: true,
        };
        // If uploading binary data
        if (binary) {
            delete options.json;
            options.encoding = null;
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        try {
            return yield this.helpers.requestOAuth2.call(this, 'linkedInOAuth2Api', options, { tokenType: 'Bearer' });
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.linkedInApiRequest = linkedInApiRequest;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = '';
    }
    return result;
}
exports.validateJSON = validateJSON;

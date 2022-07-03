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
exports.validateJSON = exports.rocketchatApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function rocketchatApiRequest(resource, method, operation, body = {}, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('rocketchatApi');
        const headerWithAuthentication = Object.assign({}, headers, {
            'X-Auth-Token': credentials.authKey,
            'X-User-Id': credentials.userId,
        });
        const options = {
            headers: headerWithAuthentication,
            method,
            body,
            uri: `${credentials.domain}/api/v1${resource}.${operation}`,
            json: true,
        };
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.rocketchatApiRequest = rocketchatApiRequest;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = [];
    }
    return result;
}
exports.validateJSON = validateJSON;

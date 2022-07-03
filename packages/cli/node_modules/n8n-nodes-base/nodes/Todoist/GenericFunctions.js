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
exports.todoistSyncRequest = exports.todoistApiRequest = exports.FormatDueDatetime = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function FormatDueDatetime(isoString) {
    // Assuming that the problem with incorrect date format was caused by milliseconds
    // Replacing the last 5 characters of ISO-formatted string with just Z char
    return isoString.replace(new RegExp('.000Z$'), 'Z');
}
exports.FormatDueDatetime = FormatDueDatetime;
function todoistApiRequest(method, resource, body = {}, // tslint:disable-line:no-any
qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authentication = this.getNodeParameter('authentication', 0);
        const endpoint = 'api.todoist.com/rest/v1';
        const options = {
            method,
            qs,
            uri: `https://${endpoint}${resource}`,
            json: true,
        };
        if (Object.keys(body).length !== 0) {
            options.body = body;
        }
        try {
            const credentialType = authentication === 'apiKey' ? 'todoistApi' : 'todoistOAuth2Api';
            return yield this.helpers.requestWithAuthentication.call(this, credentialType, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), (error));
        }
    });
}
exports.todoistApiRequest = todoistApiRequest;
function todoistSyncRequest(body = {}, // tslint:disable-line:no-any
qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authentication = this.getNodeParameter('authentication', 0, 'oAuth2');
        const options = {
            headers: {},
            method: 'POST',
            qs,
            uri: `https://api.todoist.com/sync/v8/sync`,
            json: true,
        };
        if (Object.keys(body).length !== 0) {
            options.body = body;
        }
        try {
            const credentialType = authentication === 'oAuth2' ? 'todoistOAuth2Api' : 'todoistApi';
            return yield this.helpers.requestWithAuthentication.call(this, credentialType, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), (error));
        }
    });
}
exports.todoistSyncRequest = todoistSyncRequest;

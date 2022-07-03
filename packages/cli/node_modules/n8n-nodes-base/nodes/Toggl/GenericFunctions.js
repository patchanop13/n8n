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
exports.togglApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function togglApiRequest(method, resource, body = {}, query, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('togglApi');
        const headerWithAuthentication = Object.assign({}, { Authorization: ` Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}` });
        const options = {
            headers: headerWithAuthentication,
            method,
            qs: query,
            uri: uri || `https://api.track.toggl.com/api/v8${resource}`,
            body,
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
exports.togglApiRequest = togglApiRequest;

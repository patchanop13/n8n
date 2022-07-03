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
exports.uprocApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function uprocApiRequest(method, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('uprocApi');
        const token = Buffer.from(`${credentials.email}:${credentials.apiKey}`).toString('base64');
        const options = {
            headers: {
                Authorization: `Basic ${token}`,
                'User-agent': 'n8n',
            },
            method,
            qs,
            body,
            uri: uri || `https://api.uproc.io/api/v2/process`,
            json: true,
        };
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.uprocApiRequest = uprocApiRequest;

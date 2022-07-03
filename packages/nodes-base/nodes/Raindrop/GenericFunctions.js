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
exports.raindropApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an authenticated API request to Raindrop.
 */
function raindropApiRequest(method, endpoint, qs, body, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            headers: {
                'user-agent': 'n8n',
                'Content-Type': 'application/json',
            },
            method,
            uri: `https://api.raindrop.io/rest/v1${endpoint}`,
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
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        try {
            return yield this.helpers.requestOAuth2.call(this, 'raindropOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.raindropApiRequest = raindropApiRequest;

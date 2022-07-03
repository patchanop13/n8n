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
exports.twistApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function twistApiRequest(method, endpoint, body = {}, qs = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method,
            body,
            qs,
            uri: `https://api.twist.com/api/v3${endpoint}`,
            json: true,
        };
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(qs).length === 0) {
            delete options.qs;
        }
        Object.assign(options, option);
        try {
            //@ts-ignore
            return yield this.helpers.requestOAuth2.call(this, 'twistOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.twistApiRequest = twistApiRequest;

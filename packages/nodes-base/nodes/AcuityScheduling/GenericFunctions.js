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
exports.acuitySchedulingApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function acuitySchedulingApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {},
            method,
            qs,
            body,
            uri: uri || `https://acuityscheduling.com/api/v1${resource}`,
            json: true,
        };
        try {
            if (authenticationMethod === 'apiKey') {
                const credentials = yield this.getCredentials('acuitySchedulingApi');
                options.auth = {
                    user: credentials.userId,
                    password: credentials.apiKey,
                };
                return yield this.helpers.request(options);
            }
            else {
                delete options.auth;
                //@ts-ignore
                return yield this.helpers.requestOAuth2.call(this, 'acuitySchedulingOAuth2Api', options, true);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.acuitySchedulingApiRequest = acuitySchedulingApiRequest;

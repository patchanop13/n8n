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
exports.formIoApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Method has the logic to get jwt token from Form.io
 * @param this
 */
function getToken(credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const base = credentials.domain || 'https://formio.form.io';
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: {
                data: {
                    email: credentials.email,
                    password: credentials.password,
                },
            },
            uri: `${base}/user/login`,
            json: true,
            resolveWithFullResponse: true,
        };
        try {
            const responseObject = yield this.helpers.request(options);
            return responseObject.headers['x-jwt-token'];
        }
        catch (error) {
            throw new Error(`Authentication Failed for Form.io. Please provide valid credentails/ endpoint details`);
        }
    });
}
/**
 * Method will call register or list webhooks based on the passed method in the parameter
 * @param this
 * @param method
 */
function formIoApiRequest(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('formIoApi');
        const token = yield getToken.call(this, credentials);
        const base = credentials.domain || 'https://api.form.io';
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'x-jwt-token': token,
            },
            method,
            body,
            qs,
            uri: `${base}${endpoint}`,
            json: true,
        };
        try {
            return yield this.helpers.request.call(this, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.formIoApiRequest = formIoApiRequest;

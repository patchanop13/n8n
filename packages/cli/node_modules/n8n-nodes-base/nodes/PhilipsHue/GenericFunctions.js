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
exports.getUser = exports.philipsHueApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function philipsHueApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://api.meethue.com/route${resource}`,
            json: true,
        };
        try {
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            if (Object.keys(qs).length === 0) {
                delete options.qs;
            }
            //@ts-ignore
            const response = yield this.helpers.requestOAuth2.call(this, 'philipsHueOAuth2Api', options, { tokenType: 'Bearer' });
            return response;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.philipsHueApiRequest = philipsHueApiRequest;
function getUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const { whitelist } = yield philipsHueApiRequest.call(this, 'GET', '/api/0/config', {}, {});
        //check if there is a n8n user
        for (const user of Object.keys(whitelist)) {
            if (whitelist[user].name === 'n8n') {
                return user;
            }
        }
        // n8n user was not fount then create the user
        yield philipsHueApiRequest.call(this, 'PUT', '/api/0/config', { linkbutton: true });
        const { success } = yield philipsHueApiRequest.call(this, 'POST', '/api', { devicetype: 'n8n' });
        return success.username;
    });
}
exports.getUser = getUser;

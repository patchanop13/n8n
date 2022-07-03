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
exports.mailCheckApiRequest = void 0;
function mailCheckApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('mailcheckApi');
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.apiKey}`,
            },
            method,
            body,
            qs,
            uri: uri || `https://api.mailcheck.co/v1${resource}`,
            json: true,
        };
        try {
            options = Object.assign({}, options, option);
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            //@ts-ignore
            return yield this.helpers.request.call(this, options);
        }
        catch (error) {
            if (error.response && error.response.body && error.response.body.message) {
                // Try to return the error prettier
                throw new Error(`Mailcheck error response [${error.statusCode}]: ${error.response.body.message}`);
            }
            throw error;
        }
    });
}
exports.mailCheckApiRequest = mailCheckApiRequest;

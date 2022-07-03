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
exports.PushoverApi = void 0;
class PushoverApi {
    constructor() {
        this.name = 'pushoverApi';
        this.displayName = 'Pushover API';
        this.documentationUrl = 'pushover';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
        this.test = {
            request: {
                baseURL: 'https://api.pushover.net/1',
                url: '=/licenses.json?token={{$credentials?.apiKey}}',
                method: 'GET',
            },
        };
    }
    authenticate(credentials, requestOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestOptions.method === 'GET') {
                Object.assign(requestOptions.qs, { token: credentials.apiKey });
            }
            else {
                Object.assign(requestOptions.body, { token: credentials.apiKey });
            }
            return requestOptions;
        });
    }
}
exports.PushoverApi = PushoverApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalApi = void 0;
class CalApi {
    constructor() {
        this.name = 'calApi';
        this.displayName = 'Cal API';
        this.documentationUrl = 'cal';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: 'https://api.cal.com',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                qs: {
                    apiKey: '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.host}}',
                url: '=/v1/memberships',
            },
        };
    }
}
exports.CalApi = CalApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JotFormApi = void 0;
class JotFormApi {
    constructor() {
        this.name = 'jotFormApi';
        this.displayName = 'JotForm API';
        this.documentationUrl = 'jotForm';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'API Domain',
                name: 'apiDomain',
                type: 'options',
                options: [
                    {
                        name: 'api.jotform.com',
                        value: 'api.jotform.com',
                    },
                    {
                        name: 'eu-api.jotform.com',
                        value: 'eu-api.jotform.com',
                    },
                ],
                default: 'api.jotform.com',
                description: 'The API domain to use. Use "eu-api.jotform.com" if your account is in based in Europe.',
            },
        ];
    }
}
exports.JotFormApi = JotFormApi;

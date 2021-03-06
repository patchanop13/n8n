"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailjetEmailApi = void 0;
class MailjetEmailApi {
    constructor() {
        this.name = 'mailjetEmailApi';
        this.displayName = 'Mailjet Email API';
        this.documentationUrl = 'mailjet';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Secret Key',
                name: 'secretKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Sandbox Mode',
                name: 'sandboxMode',
                type: 'boolean',
                default: false,
                description: 'Whether to allow to run the API call in a Sandbox mode, where all validations of the payload will be done without delivering the message',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                auth: {
                    username: '={{$credentials.apiKey}}',
                    password: '={{$credentials.secretKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: `https://api.mailjet.com`,
                url: '/v3/REST/template',
                method: 'GET',
            },
        };
    }
}
exports.MailjetEmailApi = MailjetEmailApi;

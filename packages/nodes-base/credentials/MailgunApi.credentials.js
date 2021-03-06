"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailgunApi = void 0;
class MailgunApi {
    constructor() {
        this.name = 'mailgunApi';
        this.displayName = 'Mailgun API';
        this.documentationUrl = 'mailgun';
        this.properties = [
            {
                displayName: 'API Domain',
                name: 'apiDomain',
                type: 'options',
                options: [
                    {
                        name: 'api.eu.mailgun.net',
                        value: 'api.eu.mailgun.net',
                    },
                    {
                        name: 'api.mailgun.net',
                        value: 'api.mailgun.net',
                    },
                ],
                default: 'api.mailgun.net',
                description: 'The configured mailgun API domain',
            },
            {
                displayName: 'Email Domain',
                name: 'emailDomain',
                type: 'string',
                default: '',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.MailgunApi = MailgunApi;

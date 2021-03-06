"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerLiteApi = void 0;
class MailerLiteApi {
    constructor() {
        this.name = 'mailerLiteApi';
        this.displayName = 'Mailer Lite API';
        this.documentationUrl = 'mailerLite';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.MailerLiteApi = MailerLiteApi;

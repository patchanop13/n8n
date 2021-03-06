"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridApi = void 0;
class SendGridApi {
    constructor() {
        this.name = 'sendGridApi';
        this.displayName = 'SendGrid API';
        this.documentationUrl = 'sendgrid';
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
exports.SendGridApi = SendGridApi;

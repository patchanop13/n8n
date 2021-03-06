"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailcheckApi = void 0;
class MailcheckApi {
    constructor() {
        this.name = 'mailcheckApi';
        this.displayName = 'Mailcheck API';
        this.documentationUrl = 'mailcheck';
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
exports.MailcheckApi = MailcheckApi;

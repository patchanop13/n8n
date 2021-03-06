"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailchimpApi = void 0;
class MailchimpApi {
    constructor() {
        this.name = 'mailchimpApi';
        this.displayName = 'Mailchimp API';
        this.documentationUrl = 'mailchimp';
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
exports.MailchimpApi = MailchimpApi;

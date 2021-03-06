"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailjetSmsApi = void 0;
class MailjetSmsApi {
    constructor() {
        this.name = 'mailjetSmsApi';
        this.displayName = 'Mailjet SMS API';
        this.documentationUrl = 'mailjet';
        this.properties = [
            {
                displayName: 'Token',
                name: 'token',
                type: 'string',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.token}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: `https://api.mailjet.com`,
                url: '/v4/sms',
                method: 'GET',
            },
        };
    }
}
exports.MailjetSmsApi = MailjetSmsApi;

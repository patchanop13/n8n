"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/gmail.labels',
    'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
    'https://www.googleapis.com/auth/gmail.addons.current.message.action',
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
];
class GmailOAuth2Api {
    constructor() {
        this.name = 'gmailOAuth2';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Gmail OAuth2 API';
        this.documentationUrl = 'google';
        this.properties = [
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: scopes.join(' '),
            },
        ];
    }
}
exports.GmailOAuth2Api = GmailOAuth2Api;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleContactsOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/contacts',
];
class GoogleContactsOAuth2Api {
    constructor() {
        this.name = 'googleContactsOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Contacts OAuth2 API';
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
exports.GoogleContactsOAuth2Api = GoogleContactsOAuth2Api;

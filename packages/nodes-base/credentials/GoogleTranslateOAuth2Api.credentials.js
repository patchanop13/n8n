"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleTranslateOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/cloud-translation',
];
class GoogleTranslateOAuth2Api {
    constructor() {
        this.name = 'googleTranslateOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Translate OAuth2 API';
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
exports.GoogleTranslateOAuth2Api = GoogleTranslateOAuth2Api;

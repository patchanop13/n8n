"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCloudNaturalLanguageOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/cloud-language',
    'https://www.googleapis.com/auth/cloud-platform',
];
class GoogleCloudNaturalLanguageOAuth2Api {
    constructor() {
        this.name = 'googleCloudNaturalLanguageOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Cloud Natural Language OAuth2 API';
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
exports.GoogleCloudNaturalLanguageOAuth2Api = GoogleCloudNaturalLanguageOAuth2Api;

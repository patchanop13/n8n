"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDocsOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
];
class GoogleDocsOAuth2Api {
    constructor() {
        this.name = 'googleDocsOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Docs OAuth2 API';
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
exports.GoogleDocsOAuth2Api = GoogleDocsOAuth2Api;

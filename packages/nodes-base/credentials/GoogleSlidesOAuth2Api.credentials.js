"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSlidesOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/presentations',
];
class GoogleSlidesOAuth2Api {
    constructor() {
        this.name = 'googleSlidesOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Slides OAuth2 API';
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
exports.GoogleSlidesOAuth2Api = GoogleSlidesOAuth2Api;

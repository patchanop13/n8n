"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GooglePerspectiveOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
];
class GooglePerspectiveOAuth2Api {
    constructor() {
        this.name = 'googlePerspectiveOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Perspective OAuth2 API';
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
exports.GooglePerspectiveOAuth2Api = GooglePerspectiveOAuth2Api;

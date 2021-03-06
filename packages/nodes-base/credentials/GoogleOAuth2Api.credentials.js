"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOAuth2Api = void 0;
class GoogleOAuth2Api {
    constructor() {
        this.name = 'googleOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Google OAuth2 API';
        this.documentationUrl = 'google';
        this.icon = 'file:Google.svg';
        this.properties = [
            {
                displayName: 'Grant Type',
                name: 'grantType',
                type: 'hidden',
                default: 'authorizationCode',
            },
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'hidden',
                default: 'https://accounts.google.com/o/oauth2/v2/auth',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://oauth2.googleapis.com/token',
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'hidden',
                default: 'access_type=offline&prompt=consent',
            },
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'hidden',
                default: 'body',
            },
        ];
    }
}
exports.GoogleOAuth2Api = GoogleOAuth2Api;

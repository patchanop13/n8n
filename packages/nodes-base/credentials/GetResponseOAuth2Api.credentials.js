"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetResponseOAuth2Api = void 0;
class GetResponseOAuth2Api {
    constructor() {
        this.name = 'getResponseOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'GetResponse OAuth2 API';
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
                default: 'https://app.getresponse.com/oauth2_authorize.html',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.getresponse.com/v3/token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: '',
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'hidden',
                default: '',
            },
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'hidden',
                default: 'header',
            },
        ];
    }
}
exports.GetResponseOAuth2Api = GetResponseOAuth2Api;

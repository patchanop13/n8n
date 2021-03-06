"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoxOAuth2Api = void 0;
class BoxOAuth2Api {
    constructor() {
        this.name = 'boxOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Box OAuth2 API';
        this.documentationUrl = 'box';
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
                default: 'https://account.box.com/api/oauth2/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.box.com/oauth2/token',
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
                default: 'body',
            },
        ];
    }
}
exports.BoxOAuth2Api = BoxOAuth2Api;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaindropOAuth2Api = void 0;
// https://developer.raindrop.io/v1/authentication
class RaindropOAuth2Api {
    constructor() {
        this.name = 'raindropOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Raindrop OAuth2 API';
        this.documentationUrl = 'raindrop';
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
                default: 'https://raindrop.io/oauth/authorize',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://raindrop.io/oauth/access_token',
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
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: '',
            },
        ];
    }
}
exports.RaindropOAuth2Api = RaindropOAuth2Api;

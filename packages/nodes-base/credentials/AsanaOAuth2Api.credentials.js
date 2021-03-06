"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsanaOAuth2Api = void 0;
class AsanaOAuth2Api {
    constructor() {
        this.name = 'asanaOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Asana OAuth2 API';
        this.documentationUrl = 'asana';
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
                default: 'https://app.asana.com/-/oauth_authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://app.asana.com/-/oauth_token',
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
exports.AsanaOAuth2Api = AsanaOAuth2Api;

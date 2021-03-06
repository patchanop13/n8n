"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoToWebinarOAuth2Api = void 0;
class GoToWebinarOAuth2Api {
    constructor() {
        this.name = 'goToWebinarOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'GoToWebinar OAuth2 API';
        this.documentationUrl = 'goToWebinar';
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
                default: 'https://api.getgo.com/oauth/v2/authorize',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.getgo.com/oauth/v2/token',
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: '', // set when creating the OAuth client
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
exports.GoToWebinarOAuth2Api = GoToWebinarOAuth2Api;

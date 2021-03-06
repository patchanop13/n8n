"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebflowOAuth2Api = void 0;
class WebflowOAuth2Api {
    constructor() {
        this.name = 'webflowOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Webflow OAuth2 API';
        this.documentationUrl = 'webflow';
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
                default: 'https://webflow.com/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.webflow.com/oauth/access_token',
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
                description: 'For some services additional query parameters have to be set which can be defined here',
                placeholder: '',
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
exports.WebflowOAuth2Api = WebflowOAuth2Api;

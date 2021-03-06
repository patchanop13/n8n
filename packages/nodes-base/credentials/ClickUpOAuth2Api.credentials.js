"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickUpOAuth2Api = void 0;
class ClickUpOAuth2Api {
    constructor() {
        this.name = 'clickUpOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'ClickUp OAuth2 API';
        this.documentationUrl = 'clickUp';
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
                default: 'https://app.clickup.com/api',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.clickup.com/api/v2/oauth/token',
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
exports.ClickUpOAuth2Api = ClickUpOAuth2Api;

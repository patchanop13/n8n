"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediumOAuth2Api = void 0;
class MediumOAuth2Api {
    constructor() {
        this.name = 'mediumOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Medium OAuth2 API';
        this.documentationUrl = 'medium';
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
                default: 'https://medium.com/m/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://medium.com/v1/tokens',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'basicProfile,publishPost,listPublications',
            },
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Client Secret',
                name: 'clientSecret',
                type: 'string',
                default: '',
                required: true,
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
exports.MediumOAuth2Api = MediumOAuth2Api;

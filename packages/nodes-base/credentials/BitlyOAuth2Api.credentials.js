"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitlyOAuth2Api = void 0;
class BitlyOAuth2Api {
    constructor() {
        this.name = 'bitlyOAuth2Api';
        this.displayName = 'Bitly OAuth2 API';
        this.documentationUrl = 'bitly';
        this.extends = [
            'oAuth2Api',
        ];
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
                default: 'https://bitly.com/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api-ssl.bitly.com/oauth/access_token',
                required: true,
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
                typeOptions: {
                    password: true,
                },
                default: '',
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
exports.BitlyOAuth2Api = BitlyOAuth2Api;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeapOAuth2Api = void 0;
const scopes = [
    'full',
];
class KeapOAuth2Api {
    constructor() {
        this.name = 'keapOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Keap OAuth2 API';
        this.documentationUrl = 'keap';
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
                default: 'https://signin.infusionsoft.com/app/oauth/authorize',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.infusionsoft.com/token',
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: scopes.join(' '),
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
exports.KeapOAuth2Api = KeapOAuth2Api;

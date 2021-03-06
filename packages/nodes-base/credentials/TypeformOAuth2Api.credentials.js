"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeformOAuth2Api = void 0;
const scopes = [
    'webhooks:write',
    'webhooks:read',
    'forms:read',
];
class TypeformOAuth2Api {
    constructor() {
        this.name = 'typeformOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Typeform OAuth2 API';
        this.documentationUrl = 'typeform';
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
                default: 'https://api.typeform.com/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.typeform.com/oauth/token',
                required: true,
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
                default: 'header',
            },
        ];
    }
}
exports.TypeformOAuth2Api = TypeformOAuth2Api;

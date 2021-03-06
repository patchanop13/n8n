"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MondayComOAuth2Api = void 0;
const scopes = [
    'boards:write',
    'boards:read',
];
class MondayComOAuth2Api {
    constructor() {
        this.name = 'mondayComOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Monday.com OAuth2 API';
        this.documentationUrl = 'monday';
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
                default: 'https://auth.monday.com/oauth2/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://auth.monday.com/oauth2/token',
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
                default: 'body',
            },
        ];
    }
}
exports.MondayComOAuth2Api = MondayComOAuth2Api;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormstackOAuth2Api = void 0;
const scopes = [];
class FormstackOAuth2Api {
    constructor() {
        this.name = 'formstackOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Formstack OAuth2 API';
        this.documentationUrl = 'formstackTrigger';
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
                default: 'https://www.formstack.com/api/v2/oauth2/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://www.formstack.com/api/v2/oauth2/token',
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
exports.FormstackOAuth2Api = FormstackOAuth2Api;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickBooksOAuth2Api = void 0;
// https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization
class QuickBooksOAuth2Api {
    constructor() {
        this.name = 'quickBooksOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'QuickBooks Online OAuth2 API';
        this.documentationUrl = 'quickbooks';
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
                default: 'https://appcenter.intuit.com/connect/oauth2',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'com.intuit.quickbooks.accounting',
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
            {
                displayName: 'Environment',
                name: 'environment',
                type: 'options',
                default: 'production',
                options: [
                    {
                        name: 'Production',
                        value: 'production',
                    },
                    {
                        name: 'Sandbox',
                        value: 'sandbox',
                    },
                ],
            },
        ];
    }
}
exports.QuickBooksOAuth2Api = QuickBooksOAuth2Api;

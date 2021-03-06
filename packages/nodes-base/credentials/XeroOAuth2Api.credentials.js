"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XeroOAuth2Api = void 0;
const scopes = [
    'offline_access',
    'accounting.transactions',
    'accounting.settings',
    'accounting.contacts',
];
class XeroOAuth2Api {
    constructor() {
        this.name = 'xeroOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Xero OAuth2 API';
        this.documentationUrl = 'xero';
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
                default: 'https://login.xero.com/identity/connect/authorize',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://identity.xero.com/connect/token',
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
exports.XeroOAuth2Api = XeroOAuth2Api;

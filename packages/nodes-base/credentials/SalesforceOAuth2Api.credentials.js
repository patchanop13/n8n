"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesforceOAuth2Api = void 0;
class SalesforceOAuth2Api {
    constructor() {
        this.name = 'salesforceOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Salesforce OAuth2 API';
        this.documentationUrl = 'salesforce';
        this.properties = [
            {
                displayName: 'Environment Type',
                name: 'environment',
                type: 'options',
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
                default: 'production',
            },
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
                required: true,
                default: '={{ $self["environment"] === "sandbox" ? "https://test.salesforce.com/services/oauth2/authorize" : "https://login.salesforce.com/services/oauth2/authorize" }}',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                required: true,
                default: '={{ $self["environment"] === "sandbox" ? "https://test.salesforce.com/services/oauth2/token" : "https://login.salesforce.com/services/oauth2/token" }}',
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'full refresh_token',
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
exports.SalesforceOAuth2Api = SalesforceOAuth2Api;

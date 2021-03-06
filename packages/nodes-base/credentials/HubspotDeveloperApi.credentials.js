"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubspotDeveloperApi = void 0;
const scopes = [
    'crm.objects.contacts.read',
    'crm.schemas.contacts.read',
    'crm.objects.companies.read',
    'crm.schemas.companies.read',
    'crm.objects.deals.read',
    'crm.schemas.deals.read',
];
class HubspotDeveloperApi {
    constructor() {
        this.name = 'hubspotDeveloperApi';
        this.displayName = 'HubSpot Developer API';
        this.documentationUrl = 'hubspot';
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
                default: 'https://app.hubspot.com/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.hubapi.com/oauth/v1/token',
                required: true,
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'hidden',
                default: 'grant_type=authorization_code',
            },
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'hidden',
                default: 'body',
            },
            {
                displayName: 'Developer API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'APP ID',
                name: 'appId',
                type: 'string',
                required: true,
                default: '',
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: scopes.join(' '),
            },
        ];
    }
}
exports.HubspotDeveloperApi = HubspotDeveloperApi;

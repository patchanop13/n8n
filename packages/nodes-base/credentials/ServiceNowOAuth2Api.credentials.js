"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceNowOAuth2Api = void 0;
class ServiceNowOAuth2Api {
    constructor() {
        this.name = 'serviceNowOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'ServiceNow OAuth2 API';
        this.documentationUrl = 'serviceNow';
        this.properties = [
            {
                displayName: 'Subdomain',
                name: 'subdomain',
                type: 'string',
                default: '',
                hint: 'The subdomain can be extracted from the URL. If the URL is: https://dev99890.service-now.com the subdomain is dev99890',
                required: true,
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
                default: '=https://{{$self["subdomain"]}}.service-now.com/oauth_auth.do',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: '=https://{{$self["subdomain"]}}.service-now.com/oauth_token.do',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'useraccount',
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'hidden',
                default: 'response_type=code',
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
                default: 'header',
            },
        ];
    }
}
exports.ServiceNowOAuth2Api = ServiceNowOAuth2Api;

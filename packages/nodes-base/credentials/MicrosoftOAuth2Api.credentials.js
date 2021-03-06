"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftOAuth2Api = void 0;
class MicrosoftOAuth2Api {
    constructor() {
        this.name = 'microsoftOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.icon = 'file:Microsoft.svg';
        this.displayName = 'Microsoft OAuth2 API';
        this.documentationUrl = 'microsoft';
        this.properties = [
            {
                displayName: 'Grant Type',
                name: 'grantType',
                type: 'hidden',
                default: 'authorizationCode',
            },
            //info about the tenantID
            //https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols#endpoints
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'string',
                default: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'string',
                default: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'hidden',
                default: 'response_mode=query',
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
exports.MicrosoftOAuth2Api = MicrosoftOAuth2Api;

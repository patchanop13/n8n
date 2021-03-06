"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpScoutOAuth2Api = void 0;
class HelpScoutOAuth2Api {
    constructor() {
        this.name = 'helpScoutOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'HelpScout OAuth2 API';
        this.documentationUrl = 'helpScout';
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
                default: 'https://secure.helpscout.net/authentication/authorizeClientApplication',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.helpscout.net/v2/oauth2/token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: '',
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
exports.HelpScoutOAuth2Api = HelpScoutOAuth2Api;

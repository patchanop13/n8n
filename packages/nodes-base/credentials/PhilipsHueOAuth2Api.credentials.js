"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhilipsHueOAuth2Api = void 0;
class PhilipsHueOAuth2Api {
    constructor() {
        this.name = 'philipsHueOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'PhilipHue OAuth2 API';
        this.documentationUrl = 'philipsHue';
        this.properties = [
            {
                displayName: 'Grant Type',
                name: 'grantType',
                type: 'hidden',
                default: 'authorizationCode',
            },
            {
                displayName: 'APP ID',
                name: 'appId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'hidden',
                default: 'https://api.meethue.com/v2/oauth2/authorize',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.meethue.com/v2/oauth2/token',
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'hidden',
                default: '={{"appid="+$self["appId"]}}',
            },
            {
                displayName: 'Scope',
                name: 'scope',
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
exports.PhilipsHueOAuth2Api = PhilipsHueOAuth2Api;

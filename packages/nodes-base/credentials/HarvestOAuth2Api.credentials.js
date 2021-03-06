"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestOAuth2Api = void 0;
class HarvestOAuth2Api {
    constructor() {
        this.name = 'harvestOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Harvest OAuth2 API';
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
                default: 'https://id.getharvest.com/oauth2/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://id.getharvest.com/api/v2/oauth2/token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'all',
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
exports.HarvestOAuth2Api = HarvestOAuth2Api;

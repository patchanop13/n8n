"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcuitySchedulingOAuth2Api = void 0;
class AcuitySchedulingOAuth2Api {
    constructor() {
        this.name = 'acuitySchedulingOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'AcuityScheduling OAuth2 API';
        this.documentationUrl = 'acuityScheduling';
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
                default: 'https://acuityscheduling.com/oauth2/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://acuityscheduling.com/oauth2/token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'api-v1',
                required: true,
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
exports.AcuitySchedulingOAuth2Api = AcuitySchedulingOAuth2Api;

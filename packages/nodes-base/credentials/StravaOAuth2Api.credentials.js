"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StravaOAuth2Api = void 0;
class StravaOAuth2Api {
    constructor() {
        this.name = 'stravaOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Strava OAuth2 API';
        this.documentationUrl = 'strava';
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
                default: 'https://www.strava.com/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://www.strava.com/oauth/token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'activity:read_all,activity:write',
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
exports.StravaOAuth2Api = StravaOAuth2Api;

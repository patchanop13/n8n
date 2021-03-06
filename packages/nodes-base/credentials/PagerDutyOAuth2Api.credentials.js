"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagerDutyOAuth2Api = void 0;
class PagerDutyOAuth2Api {
    constructor() {
        this.name = 'pagerDutyOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'PagerDuty OAuth2 API';
        this.documentationUrl = 'pagerDuty';
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
                default: 'https://app.pagerduty.com/oauth/authorize',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://app.pagerduty.com/oauth/token',
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'hidden',
                default: '',
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'write',
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
exports.PagerDutyOAuth2Api = PagerDutyOAuth2Api;

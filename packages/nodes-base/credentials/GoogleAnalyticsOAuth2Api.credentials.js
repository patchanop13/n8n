"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAnalyticsOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/analytics',
    'https://www.googleapis.com/auth/analytics.readonly',
];
class GoogleAnalyticsOAuth2Api {
    constructor() {
        this.name = 'googleAnalyticsOAuth2';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Analytics OAuth2 API';
        this.documentationUrl = 'google';
        this.properties = [
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: scopes.join(' '),
            },
        ];
    }
}
exports.GoogleAnalyticsOAuth2Api = GoogleAnalyticsOAuth2Api;

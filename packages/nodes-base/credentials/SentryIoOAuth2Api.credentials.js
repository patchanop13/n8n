"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryIoOAuth2Api = void 0;
class SentryIoOAuth2Api {
    constructor() {
        this.name = 'sentryIoOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Sentry.io OAuth2 API';
        this.documentationUrl = 'sentryIo';
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
                default: 'https://sentry.io/oauth/authorize/',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://sentry.io/oauth/token/',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'event:admin event:read org:read project:read project:releases team:read event:write org:admin project:write team:write project:admin team:admin',
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
exports.SentryIoOAuth2Api = SentryIoOAuth2Api;

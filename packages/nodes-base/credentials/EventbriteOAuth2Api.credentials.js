"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventbriteOAuth2Api = void 0;
class EventbriteOAuth2Api {
    constructor() {
        this.name = 'eventbriteOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Eventbrite OAuth2 API';
        this.documentationUrl = 'eventbrite';
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
                default: 'https://www.eventbrite.com/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://www.eventbrite.com/oauth/token',
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
exports.EventbriteOAuth2Api = EventbriteOAuth2Api;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushbulletOAuth2Api = void 0;
class PushbulletOAuth2Api {
    constructor() {
        this.name = 'pushbulletOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Pushbullet OAuth2 API';
        this.documentationUrl = 'pushbullet';
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
                default: 'https://www.pushbullet.com/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.pushbullet.com/oauth2/token',
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
exports.PushbulletOAuth2Api = PushbulletOAuth2Api;

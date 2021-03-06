"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineNotifyOAuth2Api = void 0;
class LineNotifyOAuth2Api {
    constructor() {
        this.name = 'lineNotifyOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Line Notify OAuth2 API';
        this.documentationUrl = 'line';
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
                default: 'https://notify-bot.line.me/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://notify-bot.line.me/oauth/token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'notify',
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
exports.LineNotifyOAuth2Api = LineNotifyOAuth2Api;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MauticOAuth2Api = void 0;
class MauticOAuth2Api {
    constructor() {
        this.name = 'mauticOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Mautic OAuth2 API';
        this.documentationUrl = 'mautic';
        this.properties = [
            {
                displayName: 'Grant Type',
                name: 'grantType',
                type: 'hidden',
                default: 'authorizationCode',
            },
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://name.mautic.net',
            },
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'hidden',
                default: '={{$self["url"].endsWith("/") ? $self["url"].slice(0, -1) : $self["url"]}}/oauth/v2/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: '={{$self["url"].endsWith("/") ? $self["url"].slice(0, -1) : $self["url"]}}/oauth/v2/token',
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
exports.MauticOAuth2Api = MauticOAuth2Api;

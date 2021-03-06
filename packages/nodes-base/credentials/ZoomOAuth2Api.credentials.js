"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomOAuth2Api = void 0;
class ZoomOAuth2Api {
    constructor() {
        this.name = 'zoomOAuth2Api';
        this.extends = ['oAuth2Api'];
        this.displayName = 'Zoom OAuth2 API';
        this.documentationUrl = 'zoom';
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
                default: 'https://zoom.us/oauth/authorize',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://zoom.us/oauth/token',
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
                default: 'header',
            },
        ];
    }
}
exports.ZoomOAuth2Api = ZoomOAuth2Api;

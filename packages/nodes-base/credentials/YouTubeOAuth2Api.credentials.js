"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeOAuth2Api = void 0;
//https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps#identify-access-scopes
const scopes = [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtubepartner-channel-audit',
];
class YouTubeOAuth2Api {
    constructor() {
        this.name = 'youTubeOAuth2Api';
        this.icon = 'node:n8n-nodes-base.youTube';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'YouTube OAuth2 API';
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
exports.YouTubeOAuth2Api = YouTubeOAuth2Api;

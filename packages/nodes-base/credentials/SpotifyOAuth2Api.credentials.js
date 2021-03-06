"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyOAuth2Api = void 0;
class SpotifyOAuth2Api {
    constructor() {
        this.name = 'spotifyOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Spotify OAuth2 API';
        this.documentationUrl = 'spotify';
        this.properties = [
            {
                displayName: 'Spotify Server',
                name: 'server',
                type: 'hidden',
                default: 'https://api.spotify.com/',
            },
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
                default: 'https://accounts.spotify.com/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://accounts.spotify.com/api/token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'user-read-playback-state playlist-read-collaborative user-modify-playback-state playlist-modify-public user-read-currently-playing playlist-read-private user-read-recently-played playlist-modify-private user-library-read user-follow-read',
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
exports.SpotifyOAuth2Api = SpotifyOAuth2Api;

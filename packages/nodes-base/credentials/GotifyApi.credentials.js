"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GotifyApi = void 0;
class GotifyApi {
    constructor() {
        this.name = 'gotifyApi';
        this.displayName = 'Gotify API';
        this.documentationUrl = 'gotify';
        this.properties = [
            {
                displayName: 'App API Token',
                name: 'appApiToken',
                type: 'string',
                default: '',
                description: '(Optional) Needed for message creation',
            },
            {
                displayName: 'Client API Token',
                name: 'clientApiToken',
                type: 'string',
                default: '',
                description: '(Optional) Needed for everything (delete, getAll) but message creation',
            },
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                description: 'The URL of the Gotify host',
            },
        ];
    }
}
exports.GotifyApi = GotifyApi;

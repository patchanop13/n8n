"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleBooksOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/books',
];
class GoogleBooksOAuth2Api {
    constructor() {
        this.name = 'googleBooksOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Books OAuth2 API';
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
exports.GoogleBooksOAuth2Api = GoogleBooksOAuth2Api;

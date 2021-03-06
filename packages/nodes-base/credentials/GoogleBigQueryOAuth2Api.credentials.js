"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleBigQueryOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/bigquery',
];
class GoogleBigQueryOAuth2Api {
    constructor() {
        this.name = 'googleBigQueryOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google BigQuery OAuth2 API';
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
exports.GoogleBigQueryOAuth2Api = GoogleBigQueryOAuth2Api;

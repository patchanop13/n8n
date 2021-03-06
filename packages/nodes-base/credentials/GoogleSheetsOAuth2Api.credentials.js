"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
];
class GoogleSheetsOAuth2Api {
    constructor() {
        this.name = 'googleSheetsOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Sheets OAuth2 API';
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
exports.GoogleSheetsOAuth2Api = GoogleSheetsOAuth2Api;

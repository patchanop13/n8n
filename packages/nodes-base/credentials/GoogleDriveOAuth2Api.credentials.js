"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDriveOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.photos.readonly',
];
class GoogleDriveOAuth2Api {
    constructor() {
        this.name = 'googleDriveOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Drive OAuth2 API';
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
exports.GoogleDriveOAuth2Api = GoogleDriveOAuth2Api;

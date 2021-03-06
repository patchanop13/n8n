"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleFirebaseCloudFirestoreOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/datastore',
    'https://www.googleapis.com/auth/firebase',
];
class GoogleFirebaseCloudFirestoreOAuth2Api {
    constructor() {
        this.name = 'googleFirebaseCloudFirestoreOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Firebase Cloud Firestore OAuth2 API';
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
exports.GoogleFirebaseCloudFirestoreOAuth2Api = GoogleFirebaseCloudFirestoreOAuth2Api;

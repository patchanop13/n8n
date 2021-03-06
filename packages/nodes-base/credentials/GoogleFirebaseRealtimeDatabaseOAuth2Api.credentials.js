"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleFirebaseRealtimeDatabaseOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/firebase.database',
    'https://www.googleapis.com/auth/firebase',
];
class GoogleFirebaseRealtimeDatabaseOAuth2Api {
    constructor() {
        this.name = 'googleFirebaseRealtimeDatabaseOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Firebase Realtime Database OAuth2 API';
        this.documentationUrl = 'google';
        this.properties = [
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: scopes.join(' '),
            },
            {
                displayName: 'Region',
                name: 'region',
                type: 'options',
                default: 'firebaseio.com',
                options: [
                    {
                        name: 'us-central1',
                        value: 'firebaseio.com',
                    },
                    {
                        name: 'europe-west1',
                        value: 'europe-west1.firebasedatabase.app',
                    },
                    {
                        name: 'asia-southeast1',
                        value: 'asia-southeast1.firebasedatabase.app',
                    },
                ],
            },
        ];
    }
}
exports.GoogleFirebaseRealtimeDatabaseOAuth2Api = GoogleFirebaseRealtimeDatabaseOAuth2Api;

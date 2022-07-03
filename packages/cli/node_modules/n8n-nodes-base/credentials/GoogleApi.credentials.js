"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleApi = void 0;
class GoogleApi {
    constructor() {
        this.name = 'googleApi';
        this.displayName = 'Google API';
        this.documentationUrl = 'google';
        this.icon = 'file:Google.svg';
        this.properties = [
            {
                displayName: 'Service Account Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@email.com',
                default: '',
                description: 'The Google Service account similar to user-808@project.iam.gserviceaccount.com',
                required: true,
            },
            {
                displayName: 'Private Key',
                name: 'privateKey',
                type: 'string',
                default: '',
                placeholder: '-----BEGIN PRIVATE KEY-----\nXIYEvQIBADANBg<...>0IhA7TMoGYPQc=\n-----END PRIVATE KEY-----\n',
                description: 'Enter the private key located in the JSON file downloaded from Google Cloud Console',
                required: true,
            },
            {
                displayName: 'Impersonate a User',
                name: 'inpersonate',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Email',
                name: 'delegatedEmail',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        inpersonate: [
                            true,
                        ],
                    },
                },
                description: 'The email address of the user for which the application is requesting delegated access',
            },
        ];
    }
}
exports.GoogleApi = GoogleApi;

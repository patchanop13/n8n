"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleTasksOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/tasks',
];
class GoogleTasksOAuth2Api {
    constructor() {
        this.name = 'googleTasksOAuth2Api';
        this.extends = ['googleOAuth2Api'];
        this.displayName = 'Google Tasks OAuth2 API';
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
exports.GoogleTasksOAuth2Api = GoogleTasksOAuth2Api;

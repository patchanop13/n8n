"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCalendarOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
];
class GoogleCalendarOAuth2Api {
    constructor() {
        this.name = 'googleCalendarOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'Google Calendar OAuth2 API';
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
exports.GoogleCalendarOAuth2Api = GoogleCalendarOAuth2Api;

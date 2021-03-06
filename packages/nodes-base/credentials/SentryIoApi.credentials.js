"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryIoApi = void 0;
class SentryIoApi {
    constructor() {
        this.name = 'sentryIoApi';
        this.displayName = 'Sentry.io API';
        this.documentationUrl = 'sentryIo';
        this.properties = [
            {
                displayName: 'Token',
                name: 'token',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.SentryIoApi = SentryIoApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryIoServerApi = void 0;
class SentryIoServerApi {
    constructor() {
        this.name = 'sentryIoServerApi';
        this.displayName = 'Sentry.io Server API';
        this.documentationUrl = 'sentryIo';
        this.properties = [
            {
                displayName: 'Token',
                name: 'token',
                type: 'string',
                default: '',
            }, {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://example.com',
            },
        ];
    }
}
exports.SentryIoServerApi = SentryIoServerApi;

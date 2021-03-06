"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostHogApi = void 0;
class PostHogApi {
    constructor() {
        this.name = 'postHogApi';
        this.displayName = 'PostHog API';
        this.documentationUrl = 'postHog';
        this.properties = [
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: 'https://app.posthog.com',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.PostHogApi = PostHogApi;

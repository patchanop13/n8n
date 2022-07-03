"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketstackApi = void 0;
class MarketstackApi {
    constructor() {
        this.name = 'marketstackApi';
        this.displayName = 'Marketstack API';
        this.documentationUrl = 'marketstack';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Use HTTPS',
                name: 'useHttps',
                type: 'boolean',
                default: false,
                description: 'Whether to use HTTPS (paid plans only)',
            },
        ];
    }
}
exports.MarketstackApi = MarketstackApi;

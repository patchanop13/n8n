"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MispApi = void 0;
class MispApi {
    constructor() {
        this.name = 'mispApi';
        this.displayName = 'MISP API';
        this.documentationUrl = 'misp';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Allow Unauthorized Certificates',
                name: 'allowUnauthorizedCerts',
                type: 'boolean',
                description: 'Whether to connect even if SSL certificate validation is not possible',
                default: false,
            },
        ];
    }
}
exports.MispApi = MispApi;

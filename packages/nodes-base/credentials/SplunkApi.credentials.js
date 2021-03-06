"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplunkApi = void 0;
class SplunkApi {
    constructor() {
        this.name = 'splunkApi';
        this.displayName = 'Splunk API';
        this.documentationUrl = 'splunk';
        this.properties = [
            {
                displayName: 'Auth Token',
                name: 'authToken',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                description: 'Protocol, domain and port',
                placeholder: 'e.g. https://localhost:8089',
                default: '',
            },
            {
                displayName: 'Allow Self-Signed Certificates',
                name: 'allowUnauthorizedCerts',
                type: 'boolean',
                description: 'Whether to connect even if SSL certificate validation is not possible',
                default: false,
            },
        ];
    }
}
exports.SplunkApi = SplunkApi;

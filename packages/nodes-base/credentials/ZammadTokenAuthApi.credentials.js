"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZammadTokenAuthApi = void 0;
class ZammadTokenAuthApi {
    constructor() {
        this.name = 'zammadTokenAuthApi';
        this.displayName = 'Zammad Token Auth API';
        this.documentationUrl = 'zammad';
        this.properties = [
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: '',
                placeholder: 'https://n8n-helpdesk.zammad.com',
                required: true,
            },
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
            },
            {
                displayName: 'Ignore SSL Issues',
                name: 'allowUnauthorizedCerts',
                type: 'boolean',
                description: 'Whether to connect even if SSL certificate validation is not possible',
                default: false,
            },
        ];
    }
}
exports.ZammadTokenAuthApi = ZammadTokenAuthApi;

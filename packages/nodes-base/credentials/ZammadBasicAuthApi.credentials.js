"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZammadBasicAuthApi = void 0;
class ZammadBasicAuthApi {
    constructor() {
        this.name = 'zammadBasicAuthApi';
        this.displayName = 'Zammad Basic Auth API';
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
                displayName: 'Email',
                name: 'username',
                type: 'string',
                default: '',
                placeholder: 'helpdesk@n8n.io',
                required: true,
            },
            {
                displayName: 'Password',
                name: 'password',
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
exports.ZammadBasicAuthApi = ZammadBasicAuthApi;

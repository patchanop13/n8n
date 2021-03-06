"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreshserviceApi = void 0;
class FreshserviceApi {
    constructor() {
        this.name = 'freshserviceApi';
        this.displayName = 'Freshservice API';
        this.documentationUrl = 'freshservice';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                placeholder: 'atuH3AbeH9HsKvgHuxg',
            },
            {
                displayName: 'Domain',
                name: 'domain',
                type: 'string',
                default: '',
                placeholder: 'n8n',
                description: 'Domain in the Freshservice org URL. For example, in <code>https://n8n.freshservice.com</code>, the domain is <code>n8n</code>',
            },
        ];
    }
}
exports.FreshserviceApi = FreshserviceApi;

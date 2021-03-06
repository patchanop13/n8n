"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERPNextApi = void 0;
class ERPNextApi {
    constructor() {
        this.name = 'erpNextApi';
        this.displayName = 'ERPNext API';
        this.documentationUrl = 'erpnext';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'API Secret',
                name: 'apiSecret',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Environment',
                name: 'environment',
                type: 'options',
                default: 'cloudHosted',
                options: [
                    {
                        name: 'Cloud-Hosted',
                        value: 'cloudHosted',
                    },
                    {
                        name: 'Self-Hosted',
                        value: 'selfHosted',
                    },
                ],
            },
            {
                displayName: 'Subdomain',
                name: 'subdomain',
                type: 'string',
                default: '',
                placeholder: 'n8n',
                description: 'Subdomain of cloud-hosted ERPNext instance. For example, "n8n" is the subdomain in: <code>https://n8n.erpnext.com</code>',
                displayOptions: {
                    show: {
                        environment: [
                            'cloudHosted',
                        ],
                    },
                },
            },
            {
                displayName: 'Domain',
                name: 'domain',
                type: 'string',
                default: '',
                placeholder: 'https://www.mydomain.com',
                description: 'Fully qualified domain name of self-hosted ERPNext instance',
                displayOptions: {
                    show: {
                        environment: [
                            'selfHosted',
                        ],
                    },
                },
            },
        ];
    }
}
exports.ERPNextApi = ERPNextApi;

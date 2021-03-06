"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GristApi = void 0;
class GristApi {
    constructor() {
        this.name = 'gristApi';
        this.displayName = 'Grist API';
        this.documentationUrl = 'grist';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Plan Type',
                name: 'planType',
                type: 'options',
                default: 'free',
                options: [
                    {
                        name: 'Free',
                        value: 'free',
                    },
                    {
                        name: 'Paid',
                        value: 'paid',
                    },
                    {
                        name: 'Self-Hosted',
                        value: 'selfHosted',
                    },
                ],
            },
            {
                displayName: 'Custom Subdomain',
                name: 'customSubdomain',
                type: 'string',
                default: '',
                required: true,
                description: 'Custom subdomain of your team',
                displayOptions: {
                    show: {
                        planType: [
                            'paid',
                        ],
                    },
                },
            },
            {
                displayName: 'Self-Hosted URL',
                name: 'selfHostedUrl',
                type: 'string',
                default: '',
                placeholder: 'http://localhost:8484',
                required: true,
                description: 'URL of your Grist instance. Include http/https without /api and no trailing slash.',
                displayOptions: {
                    show: {
                        planType: [
                            'selfHosted',
                        ],
                    },
                },
            },
        ];
    }
}
exports.GristApi = GristApi;

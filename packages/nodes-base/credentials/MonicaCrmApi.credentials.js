"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonicaCrmApi = void 0;
class MonicaCrmApi {
    constructor() {
        this.name = 'monicaCrmApi';
        this.displayName = 'Monica CRM API';
        this.documentationUrl = 'monicaCrm';
        this.properties = [
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
                displayName: 'Self-Hosted Domain',
                name: 'domain',
                type: 'string',
                default: '',
                placeholder: 'https://www.mydomain.com',
                displayOptions: {
                    show: {
                        environment: [
                            'selfHosted',
                        ],
                    },
                },
            },
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.MonicaCrmApi = MonicaCrmApi;

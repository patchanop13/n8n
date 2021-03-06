"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitwardenApi = void 0;
// https://bitwarden.com/help/article/public-api/#authentication
class BitwardenApi {
    constructor() {
        this.name = 'bitwardenApi';
        this.displayName = 'Bitwarden API';
        this.documentationUrl = 'bitwarden';
        this.properties = [
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Client Secret',
                name: 'clientSecret',
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
        ];
    }
}
exports.BitwardenApi = BitwardenApi;

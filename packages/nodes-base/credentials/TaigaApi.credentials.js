"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaigaApi = void 0;
class TaigaApi {
    constructor() {
        this.name = 'taigaApi';
        this.displayName = 'Taiga API';
        this.documentationUrl = 'taiga';
        this.properties = [
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Environment',
                name: 'environment',
                type: 'options',
                default: 'cloud',
                options: [
                    {
                        name: 'Cloud',
                        value: 'cloud',
                    },
                    {
                        name: 'Self-Hosted',
                        value: 'selfHosted',
                    },
                ],
            },
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://taiga.yourdomain.com',
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
exports.TaigaApi = TaigaApi;

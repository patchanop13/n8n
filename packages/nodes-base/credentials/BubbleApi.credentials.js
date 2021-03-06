"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BubbleApi = void 0;
class BubbleApi {
    constructor() {
        this.name = 'bubbleApi';
        this.displayName = 'Bubble API';
        this.documentationUrl = 'bubble';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
            {
                displayName: 'App Name',
                name: 'appName',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Environment',
                name: 'environment',
                type: 'options',
                default: 'live',
                options: [
                    {
                        name: 'Development',
                        value: 'development',
                    },
                    {
                        name: 'Live',
                        value: 'live',
                    },
                ],
            },
            {
                displayName: 'Hosting',
                name: 'hosting',
                type: 'options',
                default: 'bubbleHosted',
                options: [
                    {
                        name: 'Bubble-Hosted',
                        value: 'bubbleHosted',
                    },
                    {
                        name: 'Self-Hosted',
                        value: 'selfHosted',
                    },
                ],
            },
            {
                displayName: 'Domain',
                name: 'domain',
                type: 'string',
                placeholder: 'mydomain.com',
                default: '',
                displayOptions: {
                    show: {
                        hosting: [
                            'selfHosted',
                        ],
                    },
                },
            },
        ];
    }
}
exports.BubbleApi = BubbleApi;

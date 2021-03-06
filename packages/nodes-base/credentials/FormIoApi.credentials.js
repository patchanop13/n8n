"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormIoApi = void 0;
class FormIoApi {
    constructor() {
        this.name = 'formIoApi';
        this.displayName = 'Form.io API';
        this.documentationUrl = 'formIoTrigger';
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
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@email.com',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
            },
        ];
    }
}
exports.FormIoApi = FormIoApi;

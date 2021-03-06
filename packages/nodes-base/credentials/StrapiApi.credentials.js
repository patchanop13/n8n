"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrapiApi = void 0;
class StrapiApi {
    constructor() {
        this.name = 'strapiApi';
        this.displayName = 'Strapi API';
        this.documentationUrl = 'strapi';
        this.properties = [
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
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://api.example.com',
            },
            {
                displayName: 'API Version',
                name: 'apiVersion',
                default: 'v3',
                type: 'options',
                description: 'The version of api to be used',
                options: [
                    {
                        name: 'Version 4',
                        value: 'v4',
                        description: 'API version supported by Strapi 4',
                    },
                    {
                        name: 'Version 3',
                        value: 'v3',
                        description: 'API version supported by Strapi 3',
                    },
                ],
            },
        ];
    }
}
exports.StrapiApi = StrapiApi;

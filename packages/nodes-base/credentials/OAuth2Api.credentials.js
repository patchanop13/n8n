"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Api = void 0;
class OAuth2Api {
    constructor() {
        this.name = 'oAuth2Api';
        this.displayName = 'OAuth2 API';
        this.documentationUrl = 'httpRequest';
        this.genericAuth = true;
        this.properties = [
            {
                displayName: 'Grant Type',
                name: 'grantType',
                type: 'options',
                options: [
                    {
                        name: 'Authorization Code',
                        value: 'authorizationCode',
                    },
                    {
                        name: 'Client Credentials',
                        value: 'clientCredentials',
                    },
                ],
                default: 'authorizationCode',
            },
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'string',
                displayOptions: {
                    show: {
                        grantType: [
                            'authorizationCode',
                        ],
                    },
                },
                default: '',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Client Secret',
                name: 'clientSecret',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'string',
                displayOptions: {
                    show: {
                        grantType: [
                            'authorizationCode',
                        ],
                    },
                },
                default: '',
                description: 'For some services additional query parameters have to be set which can be defined here',
                placeholder: 'access_type=offline',
            },
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'options',
                displayOptions: {
                    show: {
                        grantType: [
                            'authorizationCode',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Body',
                        value: 'body',
                        description: 'Send credentials in body',
                    },
                    {
                        name: 'Header',
                        value: 'header',
                        description: 'Send credentials as Basic Auth header',
                    },
                ],
                default: 'header',
            },
        ];
    }
}
exports.OAuth2Api = OAuth2Api;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth1Api = void 0;
class OAuth1Api {
    constructor() {
        this.name = 'oAuth1Api';
        this.displayName = 'OAuth1 API';
        this.documentationUrl = 'httpRequest';
        this.genericAuth = true;
        this.properties = [
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'string',
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
                displayName: 'Consumer Key',
                name: 'consumerKey',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Consumer Secret',
                name: 'consumerSecret',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Request Token URL',
                name: 'requestTokenUrl',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Signature Method',
                name: 'signatureMethod',
                type: 'options',
                options: [
                    {
                        name: 'HMAC-SHA1',
                        value: 'HMAC-SHA1',
                    },
                    {
                        name: 'HMAC-SHA256',
                        value: 'HMAC-SHA256',
                    },
                    {
                        name: 'HMAC-SHA512',
                        value: 'HMAC-SHA512',
                    },
                ],
                default: 'HMAC-SHA1',
                required: true,
            },
        ];
    }
}
exports.OAuth1Api = OAuth1Api;

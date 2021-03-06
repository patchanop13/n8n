"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordpressApi = void 0;
class WordpressApi {
    constructor() {
        this.name = 'wordpressApi';
        this.displayName = 'Wordpress API';
        this.documentationUrl = 'wordpress';
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
                typeOptions: {
                    password: true,
                },
                default: '',
            },
            {
                displayName: 'Wordpress URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://example.com',
            },
        ];
    }
}
exports.WordpressApi = WordpressApi;

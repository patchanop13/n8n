"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WekanApi = void 0;
class WekanApi {
    constructor() {
        this.name = 'wekanApi';
        this.displayName = 'Wekan API';
        this.documentationUrl = 'wekan';
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
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://wekan.yourdomain.com',
            },
        ];
    }
}
exports.WekanApi = WekanApi;

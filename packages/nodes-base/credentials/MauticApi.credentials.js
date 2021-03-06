"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MauticApi = void 0;
class MauticApi {
    constructor() {
        this.name = 'mauticApi';
        this.displayName = 'Mautic API';
        this.documentationUrl = 'mautic';
        this.properties = [
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://name.mautic.net',
            },
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
        ];
    }
}
exports.MauticApi = MauticApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZulipApi = void 0;
class ZulipApi {
    constructor() {
        this.name = 'zulipApi';
        this.displayName = 'Zulip API';
        this.documentationUrl = 'zulip';
        this.properties = [
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://yourZulipDomain.zulipchat.com',
            },
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@email.com',
                default: '',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.ZulipApi = ZulipApi;

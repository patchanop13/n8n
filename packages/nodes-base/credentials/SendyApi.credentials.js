"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendyApi = void 0;
class SendyApi {
    constructor() {
        this.name = 'sendyApi';
        this.displayName = 'Sendy API';
        this.documentationUrl = 'sendy';
        this.properties = [
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://yourdomain.com',
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
exports.SendyApi = SendyApi;

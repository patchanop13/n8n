"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magento2Api = void 0;
class Magento2Api {
    constructor() {
        this.name = 'magento2Api';
        this.displayName = 'Magento 2 API';
        this.documentationUrl = 'magento2';
        this.properties = [
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
        this.test = {
            request: {
                baseURL: '={{$credentials.host}}',
                url: '/rest/default/V1/modules',
            },
        };
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.accessToken}}',
                },
            },
        };
    }
}
exports.Magento2Api = Magento2Api;

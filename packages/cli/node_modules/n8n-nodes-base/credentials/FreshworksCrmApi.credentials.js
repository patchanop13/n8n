"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreshworksCrmApi = void 0;
class FreshworksCrmApi {
    constructor() {
        this.name = 'freshworksCrmApi';
        this.displayName = 'Freshworks CRM API';
        this.documentationUrl = 'freshdesk';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                placeholder: 'BDsTn15vHezBlt_XGp3Tig',
            },
            {
                displayName: 'Domain',
                name: 'domain',
                type: 'string',
                default: '',
                placeholder: 'n8n-org',
                description: 'Domain in the Freshworks CRM org URL. For example, in <code>https://n8n-org.myfreshworks.com</code>, the domain is <code>n8n-org</code>.',
            },
        ];
    }
}
exports.FreshworksCrmApi = FreshworksCrmApi;

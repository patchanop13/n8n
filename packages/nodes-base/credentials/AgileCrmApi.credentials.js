"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgileCrmApi = void 0;
class AgileCrmApi {
    constructor() {
        this.name = 'agileCrmApi';
        this.displayName = 'AgileCRM API';
        this.documentationUrl = 'agileCrm';
        this.properties = [
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
            {
                displayName: 'Subdomain',
                name: 'subdomain',
                type: 'string',
                default: '',
                placeholder: 'example',
                description: 'If the domain is https://example.agilecrm.com "example" would have to be entered',
            },
        ];
    }
}
exports.AgileCrmApi = AgileCrmApi;

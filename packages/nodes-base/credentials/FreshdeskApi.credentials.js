"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreshdeskApi = void 0;
class FreshdeskApi {
    constructor() {
        this.name = 'freshdeskApi';
        this.displayName = 'Freshdesk API';
        this.documentationUrl = 'freshdesk';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Domain',
                name: 'domain',
                type: 'string',
                placeholder: 'company',
                description: 'If the URL you get displayed on Freshdesk is "https://company.freshdesk.com" enter "company"',
                default: '',
            },
        ];
    }
}
exports.FreshdeskApi = FreshdeskApi;

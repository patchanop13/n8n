"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesmateApi = void 0;
class SalesmateApi {
    constructor() {
        this.name = 'salesmateApi';
        this.displayName = 'Salesmate API';
        this.documentationUrl = 'salesmate';
        this.properties = [
            {
                displayName: 'Session Token',
                name: 'sessionToken',
                type: 'string',
                default: '',
            },
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'n8n.salesmate.io',
            },
        ];
    }
}
exports.SalesmateApi = SalesmateApi;

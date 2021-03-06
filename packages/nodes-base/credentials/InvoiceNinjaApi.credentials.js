"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceNinjaApi = void 0;
class InvoiceNinjaApi {
    constructor() {
        this.name = 'invoiceNinjaApi';
        this.displayName = 'Invoice Ninja API';
        this.documentationUrl = 'invoiceNinja';
        this.properties = [
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: 'https://app.invoiceninja.com',
            },
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.InvoiceNinjaApi = InvoiceNinjaApi;

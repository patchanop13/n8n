"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MindeeInvoiceApi = void 0;
class MindeeInvoiceApi {
    constructor() {
        this.name = 'mindeeInvoiceApi';
        this.displayName = 'Mindee Invoice API';
        this.documentationUrl = 'mindee';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.MindeeInvoiceApi = MindeeInvoiceApi;

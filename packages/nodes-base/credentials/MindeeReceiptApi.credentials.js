"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MindeeReceiptApi = void 0;
class MindeeReceiptApi {
    constructor() {
        this.name = 'mindeeReceiptApi';
        this.displayName = 'Mindee Receipt API';
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
exports.MindeeReceiptApi = MindeeReceiptApi;

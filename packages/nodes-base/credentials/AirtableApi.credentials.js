"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirtableApi = void 0;
class AirtableApi {
    constructor() {
        this.name = 'airtableApi';
        this.displayName = 'Airtable API';
        this.documentationUrl = 'airtable';
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
exports.AirtableApi = AirtableApi;

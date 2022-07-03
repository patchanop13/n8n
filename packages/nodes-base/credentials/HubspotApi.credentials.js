"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubspotApi = void 0;
class HubspotApi {
    constructor() {
        this.name = 'hubspotApi';
        this.displayName = 'HubSpot API';
        this.documentationUrl = 'hubspot';
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
exports.HubspotApi = HubspotApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VonageApi = void 0;
class VonageApi {
    constructor() {
        this.name = 'vonageApi';
        this.displayName = 'Vonage API';
        this.documentationUrl = 'vonage';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'API Secret',
                name: 'apiSecret',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.VonageApi = VonageApi;

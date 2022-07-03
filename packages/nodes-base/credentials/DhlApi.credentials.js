"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DhlApi = void 0;
class DhlApi {
    constructor() {
        this.name = 'dhlApi';
        this.displayName = 'DHL API';
        this.documentationUrl = 'dhl';
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
exports.DhlApi = DhlApi;

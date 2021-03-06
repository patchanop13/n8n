"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemioApi = void 0;
class DemioApi {
    constructor() {
        this.name = 'demioApi';
        this.displayName = 'Demio API';
        this.documentationUrl = 'demio';
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
exports.DemioApi = DemioApi;

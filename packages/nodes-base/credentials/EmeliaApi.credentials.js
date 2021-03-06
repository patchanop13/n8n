"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmeliaApi = void 0;
class EmeliaApi {
    constructor() {
        this.name = 'emeliaApi';
        this.displayName = 'Emelia API';
        this.documentationUrl = 'emelia';
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
exports.EmeliaApi = EmeliaApi;

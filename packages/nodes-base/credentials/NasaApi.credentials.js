"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NasaApi = void 0;
class NasaApi {
    constructor() {
        this.name = 'nasaApi';
        this.displayName = 'NASA API';
        this.documentationUrl = 'nasa';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'api_key',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.NasaApi = NasaApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandfetchApi = void 0;
class BrandfetchApi {
    constructor() {
        this.name = 'brandfetchApi';
        this.displayName = 'Brandfetch API';
        this.documentationUrl = 'brandfetch';
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
exports.BrandfetchApi = BrandfetchApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WufooApi = void 0;
class WufooApi {
    constructor() {
        this.name = 'wufooApi';
        this.displayName = 'Wufoo API';
        this.documentationUrl = 'wufoo';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Subdomain',
                name: 'subdomain',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.WufooApi = WufooApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HunterApi = void 0;
class HunterApi {
    constructor() {
        this.name = 'hunterApi';
        this.displayName = 'Hunter API';
        this.documentationUrl = 'hunter';
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
exports.HunterApi = HunterApi;

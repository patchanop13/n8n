"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackbyApi = void 0;
class StackbyApi {
    constructor() {
        this.name = 'stackbyApi';
        this.displayName = 'Stackby API';
        this.documentationUrl = 'stackby';
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
exports.StackbyApi = StackbyApi;

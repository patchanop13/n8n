"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YourlsApi = void 0;
class YourlsApi {
    constructor() {
        this.name = 'yourlsApi';
        this.displayName = 'Yourls API';
        this.documentationUrl = 'yourls';
        this.properties = [
            {
                displayName: 'Signature',
                name: 'signature',
                type: 'string',
                default: '',
            },
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'http://localhost:8080',
            },
        ];
    }
}
exports.YourlsApi = YourlsApi;

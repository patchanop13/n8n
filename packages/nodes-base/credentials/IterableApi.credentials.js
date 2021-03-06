"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IterableApi = void 0;
class IterableApi {
    constructor() {
        this.name = 'iterableApi';
        this.displayName = 'Iterable API';
        this.documentationUrl = 'iterable';
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
exports.IterableApi = IterableApi;

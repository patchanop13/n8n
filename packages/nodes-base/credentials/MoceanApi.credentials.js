"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoceanApi = void 0;
class MoceanApi {
    constructor() {
        this.name = 'moceanApi';
        this.displayName = 'Mocean Api';
        this.documentationUrl = 'mocean';
        this.properties = [
            // The credentials to get from user and save encrypted.
            // Properties can be defined exactly in the same way
            // as node properties.
            {
                displayName: 'API Key',
                name: 'mocean-api-key',
                type: 'string',
                default: '',
            },
            {
                displayName: 'API Secret',
                name: 'mocean-api-secret',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.MoceanApi = MoceanApi;

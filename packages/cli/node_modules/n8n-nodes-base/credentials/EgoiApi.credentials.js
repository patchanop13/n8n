"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EgoiApi = void 0;
class EgoiApi {
    constructor() {
        this.name = 'egoiApi';
        this.displayName = 'E-goi API';
        this.documentationUrl = 'egoi';
        this.properties = [
            // The credentials to get from user and save encrypted.
            // Properties can be defined exactly in the same way
            // as node properties.
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.EgoiApi = EgoiApi;

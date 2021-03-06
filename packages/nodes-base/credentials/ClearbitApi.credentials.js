"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearbitApi = void 0;
class ClearbitApi {
    constructor() {
        this.name = 'clearbitApi';
        this.displayName = 'Clearbit API';
        this.documentationUrl = 'clearbit';
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
exports.ClearbitApi = ClearbitApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpontitApi = void 0;
class SpontitApi {
    constructor() {
        this.name = 'spontitApi';
        this.displayName = 'Spontit API';
        this.documentationUrl = 'spontit';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.SpontitApi = SpontitApi;

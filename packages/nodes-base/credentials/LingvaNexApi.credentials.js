"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LingvaNexApi = void 0;
class LingvaNexApi {
    constructor() {
        this.name = 'lingvaNexApi';
        this.displayName = 'LingvaNex API';
        this.documentationUrl = 'lingvaNex';
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
exports.LingvaNexApi = LingvaNexApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeekalinkApi = void 0;
class PeekalinkApi {
    constructor() {
        this.name = 'peekalinkApi';
        this.displayName = 'Peekalink API';
        this.documentationUrl = 'peekalink';
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
exports.PeekalinkApi = PeekalinkApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitlyApi = void 0;
class BitlyApi {
    constructor() {
        this.name = 'bitlyApi';
        this.displayName = 'Bitly API';
        this.documentationUrl = 'bitly';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.BitlyApi = BitlyApi;

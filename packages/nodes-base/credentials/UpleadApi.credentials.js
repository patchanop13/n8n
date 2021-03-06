"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpleadApi = void 0;
class UpleadApi {
    constructor() {
        this.name = 'upleadApi';
        this.displayName = 'Uplead API';
        this.documentationUrl = 'uplead';
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
exports.UpleadApi = UpleadApi;

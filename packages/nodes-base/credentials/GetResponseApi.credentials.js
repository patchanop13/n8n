"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetResponseApi = void 0;
class GetResponseApi {
    constructor() {
        this.name = 'getResponseApi';
        this.displayName = 'GetResponse API';
        this.documentationUrl = 'getResponse';
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
exports.GetResponseApi = GetResponseApi;

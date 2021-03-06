"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodaApi = void 0;
class CodaApi {
    constructor() {
        this.name = 'codaApi';
        this.displayName = 'Coda API';
        this.documentationUrl = 'coda';
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
exports.CodaApi = CodaApi;

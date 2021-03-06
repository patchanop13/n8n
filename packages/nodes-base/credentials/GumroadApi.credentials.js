"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GumroadApi = void 0;
class GumroadApi {
    constructor() {
        this.name = 'gumroadApi';
        this.displayName = 'Gumroad API';
        this.documentationUrl = 'gumroad';
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
exports.GumroadApi = GumroadApi;

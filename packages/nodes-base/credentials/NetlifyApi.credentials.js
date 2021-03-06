"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetlifyApi = void 0;
class NetlifyApi {
    constructor() {
        this.name = 'netlifyApi';
        this.displayName = 'Netlify API';
        this.documentationUrl = 'netlify';
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
exports.NetlifyApi = NetlifyApi;

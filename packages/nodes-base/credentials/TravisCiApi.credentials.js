"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravisCiApi = void 0;
class TravisCiApi {
    constructor() {
        this.name = 'travisCiApi';
        this.displayName = 'Travis API';
        this.documentationUrl = 'travisCi';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.TravisCiApi = TravisCiApi;

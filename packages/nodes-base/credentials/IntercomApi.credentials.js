"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntercomApi = void 0;
class IntercomApi {
    constructor() {
        this.name = 'intercomApi';
        this.displayName = 'Intercom API';
        this.documentationUrl = 'intercom';
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
exports.IntercomApi = IntercomApi;

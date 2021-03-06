"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MandrillApi = void 0;
class MandrillApi {
    constructor() {
        this.name = 'mandrillApi';
        this.displayName = 'Mandrill API';
        this.documentationUrl = 'mandrill';
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
exports.MandrillApi = MandrillApi;

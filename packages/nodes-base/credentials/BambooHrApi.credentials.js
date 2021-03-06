"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BambooHrApi = void 0;
class BambooHrApi {
    constructor() {
        this.name = 'bambooHrApi';
        this.displayName = 'BambooHR API';
        this.documentationUrl = 'bambooHr';
        this.properties = [
            {
                displayName: 'Subdomain',
                name: 'subdomain',
                type: 'string',
                default: '',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.BambooHrApi = BambooHrApi;

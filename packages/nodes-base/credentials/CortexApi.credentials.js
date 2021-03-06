"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CortexApi = void 0;
class CortexApi {
    constructor() {
        this.name = 'cortexApi';
        this.displayName = 'Cortex API';
        this.documentationUrl = 'cortex';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'cortexApiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Cortex Instance',
                name: 'host',
                type: 'string',
                description: 'The URL of the Cortex instance',
                default: '',
                placeholder: 'https://localhost:9001',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.cortexApiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.host}}',
                url: '/api/analyzer',
            },
        };
    }
}
exports.CortexApi = CortexApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockifyApi = void 0;
class ClockifyApi {
    constructor() {
        this.name = 'clockifyApi';
        this.displayName = 'Clockify API';
        this.documentationUrl = 'clockify';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'X-Api-Key': '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://api.clockify.me/api/v1',
                url: '/workspaces',
            },
        };
    }
}
exports.ClockifyApi = ClockifyApi;

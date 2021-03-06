"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipedriveApi = void 0;
class PipedriveApi {
    constructor() {
        this.name = 'pipedriveApi';
        this.displayName = 'Pipedrive API';
        this.documentationUrl = 'pipedrive';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                qs: {
                    api_token: '={{$credentials.apiToken}}',
                },
            },
        };
    }
}
exports.PipedriveApi = PipedriveApi;

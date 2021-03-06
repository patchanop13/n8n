"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwakeCloudApi = void 0;
class TwakeCloudApi {
    constructor() {
        this.name = 'twakeCloudApi';
        this.displayName = 'Twake Cloud API';
        this.documentationUrl = 'twake';
        this.properties = [
            {
                displayName: 'Workspace Key',
                name: 'workspaceKey',
                type: 'string',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.workspaceKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://plugins.twake.app/plugins/n8n',
                url: '/channel',
                method: 'POST',
            },
        };
    }
}
exports.TwakeCloudApi = TwakeCloudApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackApi = void 0;
class SlackApi {
    constructor() {
        this.name = 'slackApi';
        this.displayName = 'Slack API';
        this.documentationUrl = 'slack';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                required: true,
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.accessToken}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://slack.com',
                url: '/api/users.profile.get',
            },
            rules: [
                {
                    type: 'responseSuccessBody',
                    properties: {
                        key: 'error',
                        value: 'invalid_auth',
                        message: 'Invalid access token',
                    },
                },
            ],
        };
    }
}
exports.SlackApi = SlackApi;

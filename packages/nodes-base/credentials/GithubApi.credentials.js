"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubApi = void 0;
class GithubApi {
    constructor() {
        this.name = 'githubApi';
        this.displayName = 'GitHub API';
        this.documentationUrl = 'github';
        this.properties = [
            {
                displayName: 'Github Server',
                name: 'server',
                type: 'string',
                default: 'https://api.github.com',
                description: 'The server to connect to. Only has to be set if Github Enterprise is used.',
            },
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=token {{$credentials?.accessToken}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials?.server}}',
                url: '/user',
                method: 'GET',
            },
        };
    }
}
exports.GithubApi = GithubApi;

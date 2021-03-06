"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitlabOAuth2Api = void 0;
class GitlabOAuth2Api {
    constructor() {
        this.name = 'gitlabOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'GitLab OAuth2 API';
        this.documentationUrl = 'gitlab';
        this.properties = [
            {
                displayName: 'Grant Type',
                name: 'grantType',
                type: 'hidden',
                default: 'authorizationCode',
            },
            {
                displayName: 'Gitlab Server',
                name: 'server',
                type: 'string',
                default: 'https://gitlab.com',
            },
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'hidden',
                default: '={{$self["server"]}}/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: '={{$self["server"]}}/oauth/token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'api',
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'hidden',
                default: '',
            },
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'hidden',
                default: 'body',
            },
        ];
    }
}
exports.GitlabOAuth2Api = GitlabOAuth2Api;

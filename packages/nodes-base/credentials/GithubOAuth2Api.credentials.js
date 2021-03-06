"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubOAuth2Api = void 0;
class GithubOAuth2Api {
    constructor() {
        this.name = 'githubOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'GitHub OAuth2 API';
        this.documentationUrl = 'github';
        this.properties = [
            {
                displayName: 'Grant Type',
                name: 'grantType',
                type: 'hidden',
                default: 'authorizationCode',
            },
            {
                displayName: 'Github Server',
                name: 'server',
                type: 'string',
                default: 'https://api.github.com',
                description: 'The server to connect to. Only has to be set if Github Enterprise is used.',
            },
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'hidden',
                default: '={{$self["server"] === "https://api.github.com" ? "https://github.com" : $self["server"]}}/login/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: '={{$self["server"] === "https://api.github.com" ? "https://github.com" : $self["server"]}}/login/oauth/access_token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'repo,admin:repo_hook,admin:org,admin:org_hook,gist,notifications,user,write:packages,read:packages,delete:packages,worfklow',
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
                default: 'header',
            },
        ];
    }
}
exports.GithubOAuth2Api = GithubOAuth2Api;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitlabApi = void 0;
class GitlabApi {
    constructor() {
        this.name = 'gitlabApi';
        this.displayName = 'GitLab API';
        this.documentationUrl = 'gitlab';
        this.properties = [
            {
                displayName: 'Gitlab Server',
                name: 'server',
                type: 'string',
                default: 'https://gitlab.com',
            },
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.GitlabApi = GitlabApi;

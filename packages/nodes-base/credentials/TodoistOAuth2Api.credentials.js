"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoistOAuth2Api = void 0;
class TodoistOAuth2Api {
    constructor() {
        this.name = 'todoistOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Todoist OAuth2 API';
        this.documentationUrl = 'todoist';
        this.properties = [
            {
                displayName: 'Grant Type',
                name: 'grantType',
                type: 'hidden',
                default: 'authorizationCode',
            },
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'hidden',
                default: 'https://todoist.com/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://todoist.com/oauth/access_token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'data:read_write,data:delete',
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
exports.TodoistOAuth2Api = TodoistOAuth2Api;

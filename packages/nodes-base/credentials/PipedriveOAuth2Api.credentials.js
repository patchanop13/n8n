"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipedriveOAuth2Api = void 0;
class PipedriveOAuth2Api {
    constructor() {
        this.name = 'pipedriveOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Pipedrive OAuth2 API';
        this.documentationUrl = 'pipedrive';
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
                default: 'https://oauth.pipedrive.com/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://oauth.pipedrive.com/oauth/token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: '',
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
exports.PipedriveOAuth2Api = PipedriveOAuth2Api;

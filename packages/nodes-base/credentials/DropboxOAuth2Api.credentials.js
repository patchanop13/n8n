"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropboxOAuth2Api = void 0;
const scopes = [
    'files.content.write',
    'files.content.read',
    'sharing.read',
    'account_info.read',
];
class DropboxOAuth2Api {
    constructor() {
        this.name = 'dropboxOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Dropbox OAuth2 API';
        this.documentationUrl = 'dropbox';
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
                default: 'https://www.dropbox.com/oauth2/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.dropboxapi.com/oauth2/token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: scopes.join(' '),
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'hidden',
                default: 'token_access_type=offline&force_reapprove=true',
            },
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'hidden',
                default: 'header',
            },
            {
                displayName: 'APP Access Type',
                name: 'accessType',
                type: 'options',
                options: [
                    {
                        name: 'App Folder',
                        value: 'folder',
                    },
                    {
                        name: 'Full Dropbox',
                        value: 'full',
                    },
                ],
                default: 'full',
            },
        ];
    }
}
exports.DropboxOAuth2Api = DropboxOAuth2Api;

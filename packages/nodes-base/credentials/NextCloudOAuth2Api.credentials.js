"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextCloudOAuth2Api = void 0;
class NextCloudOAuth2Api {
    constructor() {
        this.name = 'nextCloudOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'NextCloud OAuth2 API';
        this.documentationUrl = 'nextCloud';
        this.properties = [
            {
                displayName: 'Grant Type',
                name: 'grantType',
                type: 'hidden',
                default: 'authorizationCode',
            },
            {
                displayName: 'Web DAV URL',
                name: 'webDavUrl',
                type: 'string',
                placeholder: 'https://nextcloud.example.com/remote.php/webdav',
                default: '',
            },
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'string',
                default: 'https://nextcloud.example.com/apps/oauth2/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'string',
                default: 'https://nextcloud.example.com/apps/oauth2/api/v1/token',
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
                default: 'body',
            },
        ];
    }
}
exports.NextCloudOAuth2Api = NextCloudOAuth2Api;

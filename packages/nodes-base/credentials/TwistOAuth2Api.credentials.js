"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwistOAuth2Api = void 0;
const scopes = [
    'attachments:write',
    'channels:remove',
    'comments:remove',
    'messages:remove',
    'threads:remove',
    'workspaces:read',
];
class TwistOAuth2Api {
    constructor() {
        this.name = 'twistOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Twist OAuth2 API';
        this.documentationUrl = 'twist';
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
                default: 'https://twist.com/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://twist.com/oauth/access_token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: scopes.join(','),
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
exports.TwistOAuth2Api = TwistOAuth2Api;

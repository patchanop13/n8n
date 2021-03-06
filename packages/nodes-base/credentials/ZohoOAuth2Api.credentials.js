"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZohoOAuth2Api = void 0;
class ZohoOAuth2Api {
    constructor() {
        this.name = 'zohoOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Zoho OAuth2 API';
        this.documentationUrl = 'zoho';
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
                type: 'options',
                options: [
                    {
                        name: 'https://accounts.zoho.com/oauth/v2/auth',
                        value: 'https://accounts.zoho.com/oauth/v2/auth',
                        description: 'For the EU, AU, and IN domains',
                    },
                    {
                        name: 'https://accounts.zoho.com.cn/oauth/v2/auth',
                        value: 'https://accounts.zoho.com.cn/oauth/v2/auth',
                        description: 'For the CN domain',
                    },
                ],
                default: 'https://accounts.zoho.com/oauth/v2/auth',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'options',
                options: [
                    {
                        name: 'AU - https://accounts.zoho.com.au/oauth/v2/token',
                        value: 'https://accounts.zoho.com.au/oauth/v2/token',
                    },
                    {
                        name: 'CN - https://accounts.zoho.com.cn/oauth/v2/token',
                        value: 'https://accounts.zoho.com.cn/oauth/v2/token',
                    },
                    {
                        name: 'EU - https://accounts.zoho.eu/oauth/v2/token',
                        value: 'https://accounts.zoho.eu/oauth/v2/token',
                    },
                    {
                        name: 'IN - https://accounts.zoho.in/oauth/v2/token',
                        value: 'https://accounts.zoho.in/oauth/v2/token',
                    },
                    {
                        name: 'US - https://accounts.zoho.com/oauth/v2/token',
                        value: 'https://accounts.zoho.com/oauth/v2/token',
                    },
                ],
                default: 'https://accounts.zoho.com/oauth/v2/token',
                required: true,
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'ZohoCRM.modules.ALL,ZohoCRM.settings.all,ZohoCRM.users.all',
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'hidden',
                default: 'access_type=offline',
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
exports.ZohoOAuth2Api = ZohoOAuth2Api;

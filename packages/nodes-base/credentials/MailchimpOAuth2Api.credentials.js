"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailchimpOAuth2Api = void 0;
class MailchimpOAuth2Api {
    constructor() {
        this.name = 'mailchimpOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'Mailchimp OAuth2 API';
        this.documentationUrl = 'mailchimp';
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
                default: 'https://login.mailchimp.com/oauth2/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://login.mailchimp.com/oauth2/token',
                required: true,
            },
            {
                displayName: 'Metadata',
                name: 'metadataUrl',
                type: 'hidden',
                default: 'https://login.mailchimp.com/oauth2/metadata',
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
exports.MailchimpOAuth2Api = MailchimpOAuth2Api;

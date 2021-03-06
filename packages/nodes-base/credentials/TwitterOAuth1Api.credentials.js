"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterOAuth1Api = void 0;
class TwitterOAuth1Api {
    constructor() {
        this.name = 'twitterOAuth1Api';
        this.extends = [
            'oAuth1Api',
        ];
        this.displayName = 'Twitter OAuth API';
        this.documentationUrl = 'twitter';
        this.properties = [
            {
                displayName: 'Request Token URL',
                name: 'requestTokenUrl',
                type: 'hidden',
                default: 'https://api.twitter.com/oauth/request_token',
            },
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'hidden',
                default: 'https://api.twitter.com/oauth/authorize',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.twitter.com/oauth/access_token',
            },
            {
                displayName: 'Signature Method',
                name: 'signatureMethod',
                type: 'hidden',
                default: 'HMAC-SHA1',
            },
        ];
    }
}
exports.TwitterOAuth1Api = TwitterOAuth1Api;

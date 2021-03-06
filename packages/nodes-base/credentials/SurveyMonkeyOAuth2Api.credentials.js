"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyMonkeyOAuth2Api = void 0;
const scopes = [
    'surveys_read',
    'collectors_read',
    'responses_read',
    'responses_read_detail',
    'webhooks_write',
    'webhooks_read',
];
class SurveyMonkeyOAuth2Api {
    constructor() {
        this.name = 'surveyMonkeyOAuth2Api';
        this.extends = [
            'oAuth2Api',
        ];
        this.displayName = 'SurveyMonkey OAuth2 API';
        this.documentationUrl = 'surveyMonkey';
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
                default: 'https://api.surveymonkey.com/oauth/authorize',
                required: true,
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://api.surveymonkey.com/oauth/token',
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
exports.SurveyMonkeyOAuth2Api = SurveyMonkeyOAuth2Api;

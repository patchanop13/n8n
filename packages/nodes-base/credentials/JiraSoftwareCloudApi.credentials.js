"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraSoftwareCloudApi = void 0;
class JiraSoftwareCloudApi {
    constructor() {
        this.name = 'jiraSoftwareCloudApi';
        this.displayName = 'Jira SW Cloud API';
        this.documentationUrl = 'jira';
        this.properties = [
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@email.com',
                default: '',
            },
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Domain',
                name: 'domain',
                type: 'string',
                default: '',
                placeholder: 'https://example.atlassian.net',
            },
        ];
    }
}
exports.JiraSoftwareCloudApi = JiraSoftwareCloudApi;

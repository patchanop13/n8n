"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraSoftwareServerApi = void 0;
class JiraSoftwareServerApi {
    constructor() {
        this.name = 'jiraSoftwareServerApi';
        this.displayName = 'Jira SW Server API';
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
                displayName: 'Password',
                name: 'password',
                typeOptions: {
                    password: true,
                },
                type: 'string',
                default: '',
            },
            {
                displayName: 'Domain',
                name: 'domain',
                type: 'string',
                default: '',
                placeholder: 'https://example.com',
            },
        ];
    }
}
exports.JiraSoftwareServerApi = JiraSoftwareServerApi;

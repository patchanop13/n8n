"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceNowBasicApi = void 0;
class ServiceNowBasicApi {
    constructor() {
        this.name = 'serviceNowBasicApi';
        this.extends = [
            'httpBasicAuth',
        ];
        this.displayName = 'ServiceNow Basic Auth API';
        this.documentationUrl = 'serviceNow';
        this.properties = [
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                required: true,
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                required: true,
                typeOptions: {
                    password: true,
                },
                default: '',
            },
            {
                displayName: 'Subdomain',
                name: 'subdomain',
                type: 'string',
                default: '',
                hint: 'The subdomain can be extracted from the URL. If the URL is: https://dev99890.service-now.com the subdomain is dev99890',
                required: true,
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                auth: {
                    username: '={{$credentials.user}}',
                    password: '={{$credentials.password}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '=https://{{$credentials?.subdomain}}.service-now.com',
                url: '/api/now/table/sys_user_role',
            },
        };
    }
}
exports.ServiceNowBasicApi = ServiceNowBasicApi;

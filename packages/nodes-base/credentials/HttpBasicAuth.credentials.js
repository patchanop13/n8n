"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpBasicAuth = void 0;
class HttpBasicAuth {
    constructor() {
        this.name = 'httpBasicAuth';
        this.displayName = 'Basic Auth';
        this.documentationUrl = 'httpRequest';
        this.genericAuth = true;
        this.icon = 'node:n8n-nodes-base.httpRequest';
        this.properties = [
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
            },
        ];
    }
}
exports.HttpBasicAuth = HttpBasicAuth;

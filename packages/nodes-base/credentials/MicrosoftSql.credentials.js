"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftSql = void 0;
class MicrosoftSql {
    constructor() {
        this.name = 'microsoftSql';
        this.displayName = 'Microsoft SQL';
        this.documentationUrl = 'microsoftSql';
        this.properties = [
            {
                displayName: 'Server',
                name: 'server',
                type: 'string',
                default: 'localhost',
            },
            {
                displayName: 'Database',
                name: 'database',
                type: 'string',
                default: 'master',
            },
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                default: 'sa',
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
            {
                displayName: 'Port',
                name: 'port',
                type: 'number',
                default: 1433,
            },
            {
                displayName: 'Domain',
                name: 'domain',
                type: 'string',
                default: '',
            },
            {
                displayName: 'TLS',
                name: 'tls',
                type: 'boolean',
                default: true,
            },
            {
                displayName: 'Connect Timeout',
                name: 'connectTimeout',
                type: 'number',
                default: 15000,
                description: 'Connection timeout in ms',
            },
            {
                displayName: 'Request Timeout',
                name: 'requestTimeout',
                type: 'number',
                default: 15000,
                description: 'Request timeout in ms',
            },
        ];
    }
}
exports.MicrosoftSql = MicrosoftSql;

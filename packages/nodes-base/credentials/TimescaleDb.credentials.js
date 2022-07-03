"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimescaleDb = void 0;
class TimescaleDb {
    constructor() {
        this.name = 'timescaleDb';
        this.displayName = 'TimescaleDB';
        this.documentationUrl = 'timescaleDb';
        this.properties = [
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: 'localhost',
            },
            {
                displayName: 'Database',
                name: 'database',
                type: 'string',
                default: 'postgres',
            },
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                default: 'postgres',
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
                displayName: 'Ignore SSL Issues',
                name: 'allowUnauthorizedCerts',
                type: 'boolean',
                default: false,
                description: 'Whether to connect even if SSL certificate validation is not possible',
            },
            {
                displayName: 'SSL',
                name: 'ssl',
                type: 'options',
                displayOptions: {
                    show: {
                        allowUnauthorizedCerts: [
                            false,
                        ],
                    },
                },
                options: [
                    {
                        name: 'Allow',
                        value: 'allow',
                    },
                    {
                        name: 'Disable',
                        value: 'disable',
                    },
                    {
                        name: 'Require',
                        value: 'require',
                    },
                    {
                        name: 'Verify (Not Implemented)',
                        value: 'verify',
                    },
                    {
                        name: 'Verify-Full (Not Implemented)',
                        value: 'verify-full',
                    },
                ],
                default: 'disable',
            },
            {
                displayName: 'Port',
                name: 'port',
                type: 'number',
                default: 5432,
            },
        ];
    }
}
exports.TimescaleDb = TimescaleDb;

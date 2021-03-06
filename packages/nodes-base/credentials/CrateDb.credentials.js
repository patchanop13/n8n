"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrateDb = void 0;
class CrateDb {
    constructor() {
        this.name = 'crateDb';
        this.displayName = 'CrateDB';
        this.documentationUrl = 'crateDb';
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
                default: 'doc',
            },
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                default: 'crate',
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
                displayName: 'SSL',
                name: 'ssl',
                type: 'options',
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
exports.CrateDb = CrateDb;

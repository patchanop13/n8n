"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestDb = void 0;
class QuestDb {
    constructor() {
        this.name = 'questDb';
        this.displayName = 'QuestDB';
        this.documentationUrl = 'questDb';
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
                default: 'qdb',
            },
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                default: 'admin',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: 'quest',
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
                default: 8812,
            },
        ];
    }
}
exports.QuestDb = QuestDb;

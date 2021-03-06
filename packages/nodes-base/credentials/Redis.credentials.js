"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = void 0;
class Redis {
    constructor() {
        this.name = 'redis';
        this.displayName = 'Redis';
        this.documentationUrl = 'redis';
        this.properties = [
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
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: 'localhost',
            },
            {
                displayName: 'Port',
                name: 'port',
                type: 'number',
                default: 6379,
            },
            {
                displayName: 'Database Number',
                name: 'database',
                type: 'number',
                default: 0,
            },
        ];
    }
}
exports.Redis = Redis;

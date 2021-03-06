"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Smtp = void 0;
class Smtp {
    constructor() {
        this.name = 'smtp';
        this.displayName = 'SMTP';
        this.documentationUrl = 'smtp';
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
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Port',
                name: 'port',
                type: 'number',
                default: 465,
            },
            {
                displayName: 'SSL/TLS',
                name: 'secure',
                type: 'boolean',
                default: true,
            },
        ];
    }
}
exports.Smtp = Smtp;

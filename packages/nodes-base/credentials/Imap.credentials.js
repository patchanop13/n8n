"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Imap = void 0;
class Imap {
    constructor() {
        this.name = 'imap';
        this.displayName = 'IMAP';
        this.documentationUrl = 'imap';
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
                default: 993,
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
exports.Imap = Imap;

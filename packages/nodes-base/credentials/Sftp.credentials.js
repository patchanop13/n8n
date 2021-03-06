"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sftp = void 0;
class Sftp {
    constructor() {
        this.name = 'sftp';
        this.displayName = 'SFTP';
        this.documentationUrl = 'ftp';
        this.properties = [
            {
                displayName: 'Host',
                name: 'host',
                required: true,
                type: 'string',
                default: '',
            },
            {
                displayName: 'Port',
                name: 'port',
                required: true,
                type: 'number',
                default: 22,
            },
            {
                displayName: 'Username',
                name: 'username',
                required: true,
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
                displayName: 'Private Key',
                name: 'privateKey',
                type: 'string',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                },
                default: '',
                description: 'String that contains a private key for either key-based or hostbased user authentication (OpenSSH format)',
            },
            {
                displayName: 'Passphrase',
                name: 'passphrase',
                typeOptions: {
                    password: true,
                },
                type: 'string',
                default: '',
                description: 'For an encrypted private key, this is the passphrase used to decrypt it',
            },
        ];
    }
}
exports.Sftp = Sftp;

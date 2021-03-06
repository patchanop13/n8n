"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SshPrivateKey = void 0;
class SshPrivateKey {
    constructor() {
        this.name = 'sshPrivateKey';
        this.displayName = 'SSH Private Key';
        this.properties = [
            {
                displayName: 'Host',
                name: 'host',
                required: true,
                type: 'string',
                default: '',
                placeholder: 'localhost',
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
                type: 'string',
                default: '',
            },
            {
                displayName: 'Private Key',
                name: 'privateKey',
                type: 'string',
                typeOptions: {
                    rows: 4,
                },
                default: '',
            },
            {
                displayName: 'Passphrase',
                name: 'passphrase',
                type: 'string',
                default: '',
                description: 'Passphase used to create the key, if no passphase was used leave empty',
            },
        ];
    }
}
exports.SshPrivateKey = SshPrivateKey;

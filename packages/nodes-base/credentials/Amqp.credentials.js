"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amqp = void 0;
class Amqp {
    constructor() {
        this.name = 'amqp';
        this.displayName = 'AMQP';
        this.documentationUrl = 'amqp';
        this.properties = [
            {
                displayName: 'Hostname',
                name: 'hostname',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Port',
                name: 'port',
                type: 'number',
                default: 5672,
            },
            {
                displayName: 'User',
                name: 'username',
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
                displayName: 'Transport Type',
                name: 'transportType',
                type: 'string',
                default: '',
                description: 'Optional Transport Type to use',
            },
        ];
    }
}
exports.Amqp = Amqp;

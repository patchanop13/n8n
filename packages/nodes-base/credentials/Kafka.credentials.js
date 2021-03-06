"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kafka = void 0;
class Kafka {
    constructor() {
        this.name = 'kafka';
        this.displayName = 'Kafka';
        this.documentationUrl = 'kafka';
        this.properties = [
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                default: '',
                placeholder: 'my-app',
            },
            {
                displayName: 'Brokers',
                name: 'brokers',
                type: 'string',
                default: '',
                placeholder: 'kafka1:9092,kafka2:9092',
            },
            {
                displayName: 'SSL',
                name: 'ssl',
                type: 'boolean',
                default: true,
            },
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                displayOptions: {
                    show: {
                        authentication: [
                            true,
                        ],
                    },
                },
                default: '',
                description: 'Optional username if authenticated is required',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                displayOptions: {
                    show: {
                        authentication: [
                            true,
                        ],
                    },
                },
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'Optional password if authenticated is required',
            },
            {
                displayName: 'SASL Mechanism',
                name: 'saslMechanism',
                type: 'options',
                displayOptions: {
                    show: {
                        authentication: [
                            true,
                        ],
                    },
                },
                options: [
                    {
                        name: 'Plain',
                        value: 'plain',
                    },
                    {
                        name: 'scram-sha-256',
                        value: 'scram-sha-256',
                    },
                    {
                        name: 'scram-sha-512',
                        value: 'scram-sha-512',
                    },
                ],
                default: 'plain',
            },
        ];
    }
}
exports.Kafka = Kafka;

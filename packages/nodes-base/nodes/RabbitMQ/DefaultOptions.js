"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbitDefaultOptions = void 0;
exports.rabbitDefaultOptions = [
    {
        displayName: 'Arguments',
        name: 'arguments',
        placeholder: 'Add Argument',
        description: 'Arguments to add',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        default: {},
        options: [
            {
                name: 'argument',
                displayName: 'Argument',
                values: [
                    {
                        displayName: 'Key',
                        name: 'key',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Headers',
        name: 'headers',
        placeholder: 'Add Header',
        description: 'Headers to add',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        default: {},
        options: [
            {
                name: 'header',
                displayName: 'Header',
                values: [
                    {
                        displayName: 'Key',
                        name: 'key',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Auto Delete Queue',
        name: 'autoDelete',
        type: 'boolean',
        default: false,
        description: 'Whether the queue will be deleted when the number of consumers drops to zero',
    },
    {
        displayName: 'Durable',
        name: 'durable',
        type: 'boolean',
        default: true,
        description: 'Whether the queue will survive broker restarts',
    },
    {
        displayName: 'Exclusive',
        name: 'exclusive',
        type: 'boolean',
        default: false,
        description: 'Whether to scope the queue to the connection',
    },
];

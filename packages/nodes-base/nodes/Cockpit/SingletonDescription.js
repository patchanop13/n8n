"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singletonFields = exports.singletonOperations = void 0;
exports.singletonOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'singleton',
                ],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get a singleton',
            },
        ],
        default: 'get',
    },
];
exports.singletonFields = [
    {
        displayName: 'Singleton Name or ID',
        name: 'singleton',
        type: 'options',
        default: '',
        typeOptions: {
            loadOptionsMethod: 'getSingletons',
        },
        displayOptions: {
            show: {
                resource: [
                    'singleton',
                ],
            },
        },
        required: true,
        description: 'Name of the singleton to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
    },
];

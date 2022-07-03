"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configOperations = void 0;
exports.configOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'config',
                ],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get the configuration',
            },
            {
                name: 'Check Configuration',
                value: 'check',
                description: 'Check the configuration',
            },
        ],
        default: 'get',
    },
];

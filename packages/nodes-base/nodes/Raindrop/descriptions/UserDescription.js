"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFields = exports.userOperations = void 0;
exports.userOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'get',
        options: [
            {
                name: 'Get',
                value: 'get',
            },
        ],
        displayOptions: {
            show: {
                resource: [
                    'user',
                ],
            },
        },
    },
];
exports.userFields = [
    // ----------------------------------
    //          user: get
    // ----------------------------------
    {
        displayName: 'Self',
        name: 'self',
        type: 'boolean',
        default: true,
        required: true,
        description: 'Whether to return details on the logged-in user',
        displayOptions: {
            show: {
                resource: [
                    'user',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        required: true,
        description: 'The ID of the user to retrieve',
        displayOptions: {
            show: {
                resource: [
                    'user',
                ],
                operation: [
                    'get',
                ],
                self: [
                    false,
                ],
            },
        },
    },
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFields = exports.userOperations = void 0;
exports.userOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'user',
                ],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get a user',
            },
        ],
        default: 'get',
    },
];
exports.userFields = [
    /* -------------------------------------------------------------------------- */
    /*                                 user:get                                   */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        required: true,
        default: '',
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
        description: 'Unique identifier for the user',
    },
];

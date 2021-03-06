"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipientFields = exports.recipientOperations = void 0;
exports.recipientOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'getAll',
        options: [
            {
                name: 'Get All',
                value: 'getAll',
            },
        ],
        displayOptions: {
            show: {
                resource: [
                    'recipient',
                ],
            },
        },
    },
];
exports.recipientFields = [
    // ----------------------------------
    //        recipient: getAll
    // ----------------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
            show: {
                resource: [
                    'recipient',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 5,
        description: 'Max number of results to return',
        typeOptions: {
            minValue: 1,
            maxValue: 1000,
        },
        displayOptions: {
            show: {
                resource: [
                    'recipient',
                ],
                operation: [
                    'getAll',
                ],
                returnAll: [
                    false,
                ],
            },
        },
    },
];

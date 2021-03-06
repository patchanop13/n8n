"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerSourceFields = exports.customerSourceOperations = void 0;
exports.customerSourceOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'customerSource',
                ],
            },
        },
        options: [
            {
                name: 'Get All',
                value: 'getAll',
            },
        ],
        default: 'getAll',
    },
];
exports.customerSourceFields = [
    // ----------------------------------------
    //        customerSource: getAll
    // ----------------------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
            show: {
                resource: [
                    'customerSource',
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
                    'customerSource',
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFields = exports.listOperations = void 0;
exports.listOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'list',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a list',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all lists',
            },
        ],
        default: 'create',
    },
];
exports.listFields = [
    /* -------------------------------------------------------------------------- */
    /*                                 list:create                                */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Name',
        name: 'name',
        required: true,
        type: 'string',
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'list',
                ],
            },
        },
        default: '',
        description: 'Name of the list to create',
    },
    /* -------------------------------------------------------------------------- */
    /*                                 list:getAll                                */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                operation: [
                    'getAll',
                ],
                resource: [
                    'list',
                ],
            },
        },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
            show: {
                operation: [
                    'getAll',
                ],
                resource: [
                    'list',
                ],
                returnAll: [
                    false,
                ],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 500,
        },
        default: 100,
        description: 'Max number of results to return',
    },
];

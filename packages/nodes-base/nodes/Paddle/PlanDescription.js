"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planFields = exports.planOperations = void 0;
exports.planOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'plan',
                ],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get a plan',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all plans',
            },
        ],
        default: 'get',
    },
];
exports.planFields = [
    /* -------------------------------------------------------------------------- */
    /*                                 plan:get                                   */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Plan ID',
        name: 'planId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'plan',
                ],
                operation: [
                    'get',
                ],
            },
        },
        description: 'Filter: The subscription plan ID',
    },
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
                    'plan',
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
                    'plan',
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

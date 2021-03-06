"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderFields = exports.orderOperations = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
exports.orderOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'order',
                ],
            },
        },
        options: [
            {
                name: 'Cancel',
                value: 'cancel',
                description: 'Cancel an order',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get an order',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all orders',
            },
            {
                name: 'Ship',
                value: 'ship',
                description: 'Ship an order',
            },
        ],
        default: 'cancel',
    },
];
exports.orderFields = [
    /* -------------------------------------------------------------------------- */
    /*                                   order:cancel			                  */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'order',
                ],
                operation: [
                    'cancel',
                    'get',
                    'ship',
                ],
            },
        },
    },
    /* -------------------------------------------------------------------------- */
    /*                                   order:getAll			                  */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: [
                    'order',
                ],
                operation: [
                    'getAll',
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
                resource: [
                    'order',
                ],
                operation: [
                    'getAll',
                ],
                returnAll: [
                    false,
                ],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 10,
        },
        default: 5,
        description: 'Max number of results to return',
    },
    ...(0, GenericFunctions_1.getSearchFilters)('order', 'getOrderAttributes', 'getOrderAttributes'),
];

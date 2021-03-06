"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderFields = exports.orderOperations = void 0;
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
                name: 'Get',
                value: 'get',
                description: 'Get an order',
            },
        ],
        default: 'get',
    },
];
exports.orderFields = [
    /* -------------------------------------------------------------------------- */
    /*                                 order:get                         */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Checkout ID',
        name: 'checkoutId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'order',
                ],
                operation: [
                    'get',
                ],
            },
        },
        description: 'The identifier of the buyer’s checkout',
    },
];

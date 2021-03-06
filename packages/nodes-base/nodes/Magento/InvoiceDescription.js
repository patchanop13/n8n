"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceFields = exports.invoiceOperations = void 0;
exports.invoiceOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'invoice',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create an invoice',
            },
        ],
        default: 'create',
    },
];
exports.invoiceFields = [
    /* -------------------------------------------------------------------------- */
    /*                                   invoice:create                           */
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
                    'invoice',
                ],
                operation: [
                    'create',
                ],
            },
        },
    },
];

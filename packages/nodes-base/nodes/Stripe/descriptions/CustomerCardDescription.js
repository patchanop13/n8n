"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerCardFields = exports.customerCardOperations = void 0;
exports.customerCardOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'get',
        options: [
            {
                name: 'Add',
                value: 'add',
                description: 'Add a customer card',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a customer card',
            },
            {
                name: 'Remove',
                value: 'remove',
                description: 'Remove a customer card',
            },
        ],
        displayOptions: {
            show: {
                resource: [
                    'customerCard',
                ],
            },
        },
    },
];
exports.customerCardFields = [
    // ----------------------------------
    //        customerCard: add
    // ----------------------------------
    {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the customer to be associated with this card',
        displayOptions: {
            show: {
                resource: [
                    'customerCard',
                ],
                operation: [
                    'add',
                ],
            },
        },
    },
    {
        displayName: 'Card Token',
        name: 'token',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'tok_1IMfKdJhRTnqS5TKQVG1LI9o',
        description: 'Token representing sensitive card information',
        displayOptions: {
            show: {
                resource: [
                    'customerCard',
                ],
                operation: [
                    'add',
                ],
            },
        },
    },
    // ----------------------------------
    //       customerCard: remove
    // ----------------------------------
    {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the customer whose card to remove',
        displayOptions: {
            show: {
                resource: [
                    'customerCard',
                ],
                operation: [
                    'remove',
                ],
            },
        },
    },
    {
        displayName: 'Card ID',
        name: 'cardId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the card to remove',
        displayOptions: {
            show: {
                resource: [
                    'customerCard',
                ],
                operation: [
                    'remove',
                ],
            },
        },
    },
    // ----------------------------------
    //         customerCard: get
    // ----------------------------------
    {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the customer whose card to retrieve',
        displayOptions: {
            show: {
                resource: [
                    'customerCard',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    {
        displayName: 'Source ID',
        name: 'sourceId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the source to retrieve',
        displayOptions: {
            show: {
                resource: [
                    'customerCard',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
];

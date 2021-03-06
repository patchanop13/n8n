"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribeFields = exports.unsubscribeOperations = void 0;
exports.unsubscribeOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'add',
        options: [
            {
                name: 'Add',
                value: 'add',
            },
            {
                name: 'Delete',
                value: 'delete',
            },
            {
                name: 'Get All',
                value: 'getAll',
            },
        ],
        displayOptions: {
            show: {
                resource: [
                    'unsubscribe',
                ],
            },
        },
    },
];
exports.unsubscribeFields = [
    // ----------------------------------
    //        unsubscribe: add
    // ----------------------------------
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        description: 'Email to add to the unsubscribes',
        displayOptions: {
            show: {
                resource: [
                    'unsubscribe',
                ],
                operation: [
                    'add',
                ],
            },
        },
    },
    // ----------------------------------
    //        unsubscribe: delete
    // ----------------------------------
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        description: 'Email to delete from the unsubscribes',
        displayOptions: {
            show: {
                resource: [
                    'unsubscribe',
                ],
                operation: [
                    'delete',
                ],
            },
        },
    },
    // ----------------------------------
    //       unsubscribe: getAll
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
                    'unsubscribe',
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
                    'unsubscribe',
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

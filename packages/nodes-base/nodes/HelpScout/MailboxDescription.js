"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailboxFields = exports.mailboxOperations = void 0;
exports.mailboxOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'mailbox',
                ],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get data of a mailbox',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all mailboxes',
            },
        ],
        default: 'get',
    },
];
exports.mailboxFields = [
    /* -------------------------------------------------------------------------- */
    /*                                mailbox:get                                 */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Mailbox ID',
        name: 'mailboxId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'mailbox',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    /* -------------------------------------------------------------------------- */
    /*                                mailbox:getAll                              */
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
                    'mailbox',
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
                    'mailbox',
                ],
                returnAll: [
                    false,
                ],
            },
        },
        typeOptions: {
            minValue: 1,
        },
        default: 50,
        description: 'Max number of results to return',
    },
];

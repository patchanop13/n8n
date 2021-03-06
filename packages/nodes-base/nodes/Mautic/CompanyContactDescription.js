"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyContactFields = exports.companyContactOperations = void 0;
exports.companyContactOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'companyContact',
                ],
            },
        },
        options: [
            {
                name: 'Add',
                value: 'add',
                description: 'Add contact to a company',
            },
            {
                name: 'Remove',
                value: 'remove',
                description: 'Remove a contact from a company',
            },
        ],
        default: 'create',
    },
];
exports.companyContactFields = [
    /* -------------------------------------------------------------------------- */
    /*                                companyContact:add                          */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Contact ID',
        name: 'contactId',
        type: 'string',
        displayOptions: {
            show: {
                resource: [
                    'companyContact',
                ],
                operation: [
                    'add',
                    'remove',
                ],
            },
        },
        default: '',
        description: 'The ID of the contact',
    },
    {
        displayName: 'Company ID',
        name: 'companyId',
        type: 'string',
        displayOptions: {
            show: {
                resource: [
                    'companyContact',
                ],
                operation: [
                    'add',
                    'remove',
                ],
            },
        },
        default: '',
        description: 'The ID of the company',
    },
];

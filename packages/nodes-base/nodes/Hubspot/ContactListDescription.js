"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactListFields = exports.contactListOperations = void 0;
exports.contactListOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'contactList',
                ],
            },
        },
        options: [
            {
                name: 'Add',
                value: 'add',
                description: 'Add contact to a list',
            },
            {
                name: 'Remove',
                value: 'remove',
                description: 'Remove a contact from a list',
            },
        ],
        default: 'add',
    },
];
exports.contactListFields = [
    /* -------------------------------------------------------------------------- */
    /*                                contactList:add                             */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'By',
        name: 'by',
        type: 'options',
        options: [
            {
                name: 'Contact ID',
                value: 'id',
            },
            {
                name: 'Email',
                value: 'email',
            },
        ],
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'contactList',
                ],
                operation: [
                    'add',
                ],
            },
        },
        default: 'email',
    },
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'contactList',
                ],
                operation: [
                    'add',
                ],
                by: [
                    'email',
                ],
            },
        },
        default: '',
    },
    {
        displayName: 'Contact ID',
        name: 'id',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'contactList',
                ],
                operation: [
                    'add',
                ],
                by: [
                    'id',
                ],
            },
        },
        default: '',
    },
    {
        displayName: 'List ID',
        name: 'listId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'contactList',
                ],
                operation: [
                    'add',
                ],
            },
        },
        default: '',
    },
    /* -------------------------------------------------------------------------- */
    /*                                contactList:remove                          */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Contact ID',
        name: 'id',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'contactList',
                ],
                operation: [
                    'remove',
                ],
            },
        },
        default: '',
    },
    {
        displayName: 'List ID',
        name: 'listId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'contactList',
                ],
                operation: [
                    'remove',
                ],
            },
        },
        default: '',
    },
];

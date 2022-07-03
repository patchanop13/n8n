"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFields = exports.userOperations = void 0;
exports.userOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'user',
                ],
            },
        },
        options: [
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a user from the current organization',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Retrieve all users in the current organization',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a user in the current organization',
            },
        ],
        default: 'getAll',
    },
];
exports.userFields = [
    // ----------------------------------------
    //              user: update
    // ----------------------------------------
    {
        displayName: 'User ID',
        name: 'userId',
        description: 'ID of the user to update',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'user',
                ],
                operation: [
                    'update',
                ],
            },
        },
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'user',
                ],
                operation: [
                    'update',
                ],
            },
        },
        options: [
            {
                displayName: 'Role',
                name: 'role',
                type: 'options',
                default: 'Admin',
                description: 'New role for the user',
                options: [
                    {
                        name: 'Admin',
                        value: 'Admin',
                    },
                    {
                        name: 'Editor',
                        value: 'Editor',
                    },
                    {
                        name: 'Viewer',
                        value: 'Viewer',
                    },
                ],
            },
        ],
    },
    // ----------------------------------------
    //                user: delete
    // ----------------------------------------
    {
        displayName: 'User ID',
        name: 'userId',
        description: 'ID of the user to delete',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'user',
                ],
                operation: [
                    'delete',
                ],
            },
        },
    },
    // ----------------------------------------
    //              user: getAll
    // ----------------------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
            show: {
                resource: [
                    'user',
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
        default: 50,
        description: 'Max number of results to return',
        typeOptions: {
            minValue: 1,
        },
        displayOptions: {
            show: {
                resource: [
                    'user',
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

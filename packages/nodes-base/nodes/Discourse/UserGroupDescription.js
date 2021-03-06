"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGroupFields = exports.userGroupOperations = void 0;
exports.userGroupOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        description: 'Choose an operation',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'userGroup',
                ],
            },
        },
        options: [
            {
                name: 'Add',
                value: 'add',
                description: 'Create a user to group',
            },
            {
                name: 'Remove',
                value: 'remove',
                description: 'Remove user from group',
            },
        ],
        default: 'add',
    },
];
exports.userGroupFields = [
    /* -------------------------------------------------------------------------- */
    /*                                userGroup:add                               */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Usernames',
        name: 'usernames',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'userGroup',
                ],
                operation: [
                    'add',
                ],
            },
        },
        default: '',
        description: 'Usernames to add to group. Multiples can be defined separated by comma.',
    },
    {
        displayName: 'Group ID',
        name: 'groupId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'userGroup',
                ],
                operation: [
                    'add',
                ],
            },
        },
        default: '',
        description: 'ID of the group',
    },
    /* -------------------------------------------------------------------------- */
    /*                                userGroup:remove                            */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Usernames',
        name: 'usernames',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'userGroup',
                ],
                operation: [
                    'remove',
                ],
            },
        },
        default: '',
        description: 'Usernames to remove from group. Multiples can be defined separated by comma.',
    },
    {
        displayName: 'Group ID',
        name: 'groupId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'userGroup',
                ],
                operation: [
                    'remove',
                ],
            },
        },
        default: '',
        description: 'ID of the group to remove',
    },
];

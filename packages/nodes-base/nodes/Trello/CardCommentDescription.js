"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardCommentFields = exports.cardCommentOperations = void 0;
exports.cardCommentOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'cardComment',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a comment on a card',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a comment from a card',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a comment on a card',
            },
        ],
        default: 'create',
    },
];
exports.cardCommentFields = [
    // ----------------------------------
    //         cardComment:create
    // ----------------------------------
    {
        displayName: 'Card ID',
        name: 'cardId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'cardComment',
                ],
            },
        },
        description: 'The ID of the card',
    },
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'cardComment',
                ],
            },
        },
        description: 'Text of the comment',
    },
    // ----------------------------------
    //         cardComment:remove
    // ----------------------------------
    {
        displayName: 'Card ID',
        name: 'cardId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'delete',
                ],
                resource: [
                    'cardComment',
                ],
            },
        },
        description: 'The ID of the card',
    },
    {
        displayName: 'Comment ID',
        name: 'commentId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'delete',
                ],
                resource: [
                    'cardComment',
                ],
            },
        },
        description: 'The ID of the comment to delete',
    },
    // ----------------------------------
    //         cardComment:update
    // ----------------------------------
    {
        displayName: 'Card ID',
        name: 'cardId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'update',
                ],
                resource: [
                    'cardComment',
                ],
            },
        },
        description: 'The ID of the card to update',
    },
    {
        displayName: 'Comment ID',
        name: 'commentId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'update',
                ],
                resource: [
                    'cardComment',
                ],
            },
        },
        description: 'The ID of the comment to delete',
    },
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'update',
                ],
                resource: [
                    'cardComment',
                ],
            },
        },
        description: 'Text of the comment',
    },
];

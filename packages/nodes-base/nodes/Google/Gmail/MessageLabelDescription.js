"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageLabelFields = exports.messageLabelOperations = void 0;
exports.messageLabelOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'messageLabel',
                ],
            },
        },
        options: [
            {
                name: 'Add',
                value: 'add',
                description: 'Add a label to a message',
            },
            {
                name: 'Remove',
                value: 'remove',
                description: 'Remove a label from a message',
            },
        ],
        default: 'add',
    },
];
exports.messageLabelFields = [
    {
        displayName: 'Message ID',
        name: 'messageId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'messageLabel',
                ],
                operation: [
                    'add',
                    'remove',
                ],
            },
        },
        placeholder: '172ce2c4a72cc243',
        description: 'The message ID of your email',
    },
    {
        displayName: 'Label Names or IDs',
        name: 'labelIds',
        type: 'multiOptions',
        typeOptions: {
            loadOptionsMethod: 'getLabels',
        },
        default: [],
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'messageLabel',
                ],
                operation: [
                    'add',
                    'remove',
                ],
            },
        },
        description: 'The ID of the label. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
    },
];

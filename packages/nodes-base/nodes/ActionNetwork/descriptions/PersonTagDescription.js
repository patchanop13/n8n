"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personTagFields = exports.personTagOperations = void 0;
exports.personTagOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'personTag',
                ],
            },
        },
        options: [
            {
                name: 'Add',
                value: 'add',
            },
            {
                name: 'Remove',
                value: 'remove',
            },
        ],
        default: 'add',
    },
];
exports.personTagFields = [
    // ----------------------------------------
    //             personTag: add
    // ----------------------------------------
    {
        displayName: 'Tag Name or ID',
        name: 'tagId',
        description: 'ID of the tag to add. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getTags',
        },
        required: true,
        default: [],
        displayOptions: {
            show: {
                resource: [
                    'personTag',
                ],
                operation: [
                    'add',
                ],
            },
        },
    },
    {
        displayName: 'Person ID',
        name: 'personId',
        description: 'ID of the person to add the tag to',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'personTag',
                ],
                operation: [
                    'add',
                ],
            },
        },
    },
    // ----------------------------------------
    //             personTag: remove
    // ----------------------------------------
    {
        displayName: 'Tag Name or ID',
        name: 'tagId',
        description: 'ID of the tag whose tagging to delete. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getTags',
        },
        default: [],
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'personTag',
                ],
                operation: [
                    'remove',
                ],
            },
        },
    },
    {
        displayName: 'Tagging Name or ID',
        name: 'taggingId',
        description: 'ID of the tagging to remove. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
        type: 'options',
        typeOptions: {
            loadOptionsDependsOn: [
                'tagId',
            ],
            loadOptionsMethod: 'getTaggings',
        },
        required: true,
        default: [],
        displayOptions: {
            show: {
                resource: [
                    'personTag',
                ],
                operation: [
                    'remove',
                ],
            },
        },
    },
];

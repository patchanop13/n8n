"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caseTagFields = exports.caseTagOperations = void 0;
exports.caseTagOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'caseTag',
                ],
            },
        },
        options: [
            {
                name: 'Add',
                value: 'add',
                description: 'Add a tag to a case',
            },
            {
                name: 'Remove',
                value: 'remove',
                description: 'Remove a tag from a case',
            },
        ],
        default: 'add',
    },
];
exports.caseTagFields = [
    // ----------------------------------------
    //             caseTag: add
    // ----------------------------------------
    {
        displayName: 'Case ID',
        name: 'caseId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'caseTag',
                ],
                operation: [
                    'add',
                ],
            },
        },
    },
    {
        displayName: 'Tag Name or ID',
        name: 'tag',
        type: 'options',
        description: 'Tag to attach to the case. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
        required: true,
        default: '',
        typeOptions: {
            loadOptionsMethod: 'getTags',
        },
        displayOptions: {
            show: {
                resource: [
                    'caseTag',
                ],
                operation: [
                    'add',
                ],
            },
        },
    },
    // ----------------------------------------
    //            caseTag: remove
    // ----------------------------------------
    {
        displayName: 'Case ID',
        name: 'caseId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'caseTag',
                ],
                operation: [
                    'remove',
                ],
            },
        },
    },
    {
        displayName: 'Tag Name or ID',
        name: 'tag',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
        required: true,
        default: '',
        typeOptions: {
            loadOptionsMethod: 'getTags',
        },
        displayOptions: {
            show: {
                resource: [
                    'caseTag',
                ],
                operation: [
                    'remove',
                ],
            },
        },
    },
];

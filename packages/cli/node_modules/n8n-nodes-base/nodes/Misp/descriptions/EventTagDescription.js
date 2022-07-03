"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventTagFields = exports.eventTagOperations = void 0;
exports.eventTagOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
            show: {
                resource: [
                    'eventTag',
                ],
            },
        },
        noDataExpression: true,
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
exports.eventTagFields = [
    // ----------------------------------------
    //             eventTag: add
    // ----------------------------------------
    {
        displayName: 'Event ID',
        name: 'eventId',
        description: 'UUID or numeric ID of the event',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'eventTag',
                ],
                operation: [
                    'add',
                ],
            },
        },
    },
    {
        displayName: 'Tag Name or ID',
        name: 'tagId',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
        type: 'options',
        required: true,
        default: '',
        typeOptions: {
            loadOptionsMethod: 'getTags',
        },
        displayOptions: {
            show: {
                resource: [
                    'eventTag',
                ],
                operation: [
                    'add',
                ],
            },
        },
    },
    // ----------------------------------------
    //            eventTag: remove
    // ----------------------------------------
    {
        displayName: 'Event ID',
        name: 'eventId',
        description: 'UUID or numeric ID of the event',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'eventTag',
                ],
                operation: [
                    'remove',
                ],
            },
        },
    },
    {
        displayName: 'Tag Name or ID',
        name: 'tagId',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
        type: 'options',
        required: true,
        default: '',
        typeOptions: {
            loadOptionsMethod: 'getTags',
        },
        displayOptions: {
            show: {
                resource: [
                    'eventTag',
                ],
                operation: [
                    'remove',
                ],
            },
        },
    },
];

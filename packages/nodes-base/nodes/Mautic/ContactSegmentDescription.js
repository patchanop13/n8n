"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSegmentFields = exports.contactSegmentOperations = void 0;
exports.contactSegmentOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'contactSegment',
                ],
            },
        },
        options: [
            {
                name: 'Add',
                value: 'add',
                description: 'Add contact to a segment',
            },
            {
                name: 'Remove',
                value: 'remove',
                description: 'Remove contact from a segment',
            },
        ],
        default: 'add',
    },
];
exports.contactSegmentFields = [
    /* -------------------------------------------------------------------------- */
    /*                               contactSegment:add                           */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Contact ID',
        name: 'contactId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'contactSegment',
                ],
                operation: [
                    'add',
                    'remove',
                ],
            },
        },
        default: '',
    },
    {
        displayName: 'Segment Name or ID',
        name: 'segmentId',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'contactSegment',
                ],
                operation: [
                    'add',
                    'remove',
                ],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getSegments',
        },
        default: '',
    },
];

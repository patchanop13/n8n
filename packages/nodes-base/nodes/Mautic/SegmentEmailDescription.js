"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.segmentEmailFields = exports.segmentEmailOperations = void 0;
exports.segmentEmailOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'segmentEmail',
                ],
            },
        },
        options: [
            {
                name: 'Send',
                value: 'send',
            },
        ],
        default: 'send',
    },
];
exports.segmentEmailFields = [
    /* -------------------------------------------------------------------------- */
    /*                               segmentEmail:send                            */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Segment Email Name or ID',
        name: 'segmentEmailId',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'segmentEmail',
                ],
                operation: [
                    'send',
                ],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getSegmentEmails',
        },
        default: '',
    },
];

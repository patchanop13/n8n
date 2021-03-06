"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.segmentFields = exports.segmentOperations = void 0;
exports.segmentOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'segment',
                ],
            },
        },
        options: [
            {
                name: 'Add Customer',
                value: 'add',
            },
            {
                name: 'Remove Customer',
                value: 'remove',
            },
        ],
        default: 'add',
    },
];
exports.segmentFields = [
    /* -------------------------------------------------------------------------- */
    /*                                   segment:add                              */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Segment ID',
        name: 'segmentId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: {
            show: {
                resource: [
                    'segment',
                ],
                operation: [
                    'add',
                    'remove',
                ],
            },
        },
        description: 'The unique identifier of the segment',
    },
    {
        displayName: 'Customer IDs',
        name: 'customerIds',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'segment',
                ],
                operation: [
                    'add',
                    'remove',
                ],
            },
        },
        description: 'A list of customer IDs to add to the segment',
    },
];

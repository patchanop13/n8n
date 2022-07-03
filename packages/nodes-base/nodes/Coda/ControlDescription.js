"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlFields = exports.controlOperations = void 0;
exports.controlOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'control',
                ],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get a control',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all controls',
            },
        ],
        default: 'get',
    },
];
exports.controlFields = [
    /* -------------------------------------------------------------------------- */
    /*                                   control:get                              */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Doc Name or ID',
        name: 'docId',
        type: 'options',
        required: true,
        typeOptions: {
            loadOptionsMethod: 'getDocs',
        },
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'control',
                ],
                operation: [
                    'get',
                ],
            },
        },
        description: 'ID of the doc. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
    },
    {
        displayName: 'Control ID',
        name: 'controlId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'control',
                ],
                operation: [
                    'get',
                ],
            },
        },
        description: 'The control to get the row from',
    },
    /* -------------------------------------------------------------------------- */
    /*                                   control:getAll                           */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Doc Name or ID',
        name: 'docId',
        type: 'options',
        required: true,
        typeOptions: {
            loadOptionsMethod: 'getDocs',
        },
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'control',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
        description: 'ID of the doc. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: [
                    'control',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
            show: {
                resource: [
                    'control',
                ],
                operation: [
                    'getAll',
                ],
                returnAll: [
                    false,
                ],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 100,
        },
        default: 50,
        description: 'Max number of results to return',
    },
];
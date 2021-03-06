"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noticelistFields = exports.noticelistOperations = void 0;
exports.noticelistOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
            show: {
                resource: [
                    'noticelist',
                ],
            },
        },
        noDataExpression: true,
        options: [
            {
                name: 'Get',
                value: 'get',
            },
            {
                name: 'Get All',
                value: 'getAll',
            },
        ],
        default: 'get',
    },
];
exports.noticelistFields = [
    // ----------------------------------------
    //             noticelist: get
    // ----------------------------------------
    {
        displayName: 'Noticelist ID',
        name: 'noticelistId',
        description: 'Numeric ID of the noticelist',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'noticelist',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
            show: {
                resource: [
                    'noticelist',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        description: 'Max number of results to return',
        typeOptions: {
            minValue: 1,
        },
        displayOptions: {
            show: {
                resource: [
                    'noticelist',
                ],
                operation: [
                    'getAll',
                ],
                returnAll: [
                    false,
                ],
            },
        },
    },
];

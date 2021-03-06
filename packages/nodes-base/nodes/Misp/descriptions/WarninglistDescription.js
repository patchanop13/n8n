"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warninglistFields = exports.warninglistOperations = void 0;
exports.warninglistOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
            show: {
                resource: [
                    'warninglist',
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
exports.warninglistFields = [
    // ----------------------------------------
    //             warninglist: get
    // ----------------------------------------
    {
        displayName: 'Warninglist ID',
        name: 'warninglistId',
        description: 'Numeric ID of the warninglist',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'warninglist',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    // ----------------------------------------
    //           warninglist: getAll
    // ----------------------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
            show: {
                resource: [
                    'warninglist',
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
                    'warninglist',
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

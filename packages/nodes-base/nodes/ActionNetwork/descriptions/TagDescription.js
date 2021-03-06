"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagFields = exports.tagOperations = void 0;
const SharedFields_1 = require("./SharedFields");
exports.tagOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'tag',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
            },
            {
                name: 'Get',
                value: 'get',
            },
            {
                name: 'Get All',
                value: 'getAll',
            },
        ],
        default: 'create',
    },
];
exports.tagFields = [
    // ----------------------------------------
    //               tag: create
    // ----------------------------------------
    {
        displayName: 'Name',
        name: 'name',
        description: 'Name of the tag to create',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'tag',
                ],
                operation: [
                    'create',
                ],
            },
        },
    },
    (0, SharedFields_1.makeSimpleField)('tag', 'create'),
    // ----------------------------------------
    //                 tag: get
    // ----------------------------------------
    {
        displayName: 'Tag ID',
        name: 'tagId',
        description: 'ID of the tag to retrieve',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'tag',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    (0, SharedFields_1.makeSimpleField)('tag', 'get'),
    // ----------------------------------------
    //               tag: getAll
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
                    'tag',
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
                    'tag',
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
    (0, SharedFields_1.makeSimpleField)('tag', 'getAll'),
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagFields = exports.tagOperations = void 0;
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
                description: 'Create a tag',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a tag',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Retrieve a tag',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Retrieve all tags',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a tag',
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
        description: 'Name of the tag - max 250 characters',
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
    // ----------------------------------------
    //               tag: delete
    // ----------------------------------------
    {
        displayName: 'Tag ID',
        name: 'tagId',
        description: 'ID of the tag to delete',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'tag',
                ],
                operation: [
                    'delete',
                ],
            },
        },
    },
    // ----------------------------------------
    //                 tag: get
    // ----------------------------------------
    {
        displayName: 'Tag ID',
        name: 'tagId',
        description: 'ID of the tag to retrieve',
        type: 'string',
        required: true,
        default: '',
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
    // ----------------------------------------
    //               tag: update
    // ----------------------------------------
    {
        displayName: 'Tag ID',
        name: 'tagId',
        description: 'ID of the tag to update',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'tag',
                ],
                operation: [
                    'update',
                ],
            },
        },
    },
    {
        displayName: 'Name',
        name: 'name',
        description: 'Name of the tag - max 250 characters',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'tag',
                ],
                operation: [
                    'update',
                ],
            },
        },
    },
];

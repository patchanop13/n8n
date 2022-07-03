"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyContentFields = exports.storyContentOperations = void 0;
exports.storyContentOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                source: [
                    'contentApi',
                ],
                resource: [
                    'story',
                ],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get a story',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all stories',
            },
        ],
        default: 'get',
    },
];
exports.storyContentFields = [
    /* -------------------------------------------------------------------------- */
    /*                                story:get                                   */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Identifier',
        name: 'identifier',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                source: [
                    'contentApi',
                ],
                resource: [
                    'story',
                ],
                operation: [
                    'get',
                ],
            },
        },
        description: 'The ID or slug of the story to get',
    },
    /* -------------------------------------------------------------------------- */
    /*                                story:getAll                                */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                source: [
                    'contentApi',
                ],
                resource: [
                    'story',
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
                source: [
                    'contentApi',
                ],
                resource: [
                    'story',
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
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
            show: {
                source: [
                    'contentApi',
                ],
                resource: [
                    'story',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
        options: [
            {
                displayName: 'Starts With',
                name: 'starts_with',
                type: 'string',
                default: '',
                description: 'Filter by slug',
            },
        ],
    },
];
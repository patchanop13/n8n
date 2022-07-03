"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postFields = exports.postOperations = void 0;
exports.postOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        description: 'Choose an operation',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'post',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a post',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a post',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all posts',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a post',
            },
        ],
        default: 'create',
    },
];
exports.postFields = [
    /* -------------------------------------------------------------------------- */
    /*                                post:create                                 */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        displayOptions: {
            show: {
                resource: [
                    'post',
                ],
                operation: [
                    'create',
                ],
            },
        },
        default: '',
        description: 'Title of the post',
    },
    {
        displayName: 'Content',
        name: 'content',
        type: 'string',
        required: true,
        typeOptions: {
            alwaysOpenEditWindow: true,
        },
        displayOptions: {
            show: {
                resource: [
                    'post',
                ],
                operation: [
                    'create',
                ],
            },
        },
        default: '',
        description: 'Content of the post',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'post',
                ],
            },
        },
        default: {},
        options: [
            {
                displayName: 'Category Name or ID',
                name: 'category',
                type: 'options',
                typeOptions: {
                    loadOptionsMethod: 'getCategories',
                },
                default: '',
                description: 'ID of the category. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
            },
            {
                displayName: 'Reply To Post Number',
                name: 'reply_to_post_number',
                type: 'string',
                default: '',
                description: 'The number of the post to reply to',
            },
            {
                displayName: 'Topic ID',
                name: 'topic_id',
                type: 'string',
                default: '',
                description: 'ID of the topic',
            },
        ],
    },
    /* -------------------------------------------------------------------------- */
    /*                                post:get                                    */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Post ID',
        name: 'postId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'post',
                ],
                operation: [
                    'get',
                ],
            },
        },
        default: '',
        description: 'ID of the post',
    },
    /* -------------------------------------------------------------------------- */
    /*                                post:getAll                                 */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: [
                    'post',
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
                    'post',
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
    /* -------------------------------------------------------------------------- */
    /*                                post:update                                 */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Post ID',
        name: 'postId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'post',
                ],
                operation: [
                    'update',
                ],
            },
        },
        default: '',
        description: 'ID of the post',
    },
    {
        displayName: 'Content',
        name: 'content',
        type: 'string',
        typeOptions: {
            alwaysOpenEditWindow: true,
        },
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'post',
                ],
                operation: [
                    'update',
                ],
            },
        },
        default: '',
        description: 'Content of the post. HTML is supported.',
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'post',
                ],
                operation: [
                    'update',
                ],
            },
        },
        options: [
            {
                displayName: 'Edit Reason',
                name: 'edit_reason',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Cooked',
                name: 'cooked',
                type: 'boolean',
                default: false,
            },
        ],
    },
];

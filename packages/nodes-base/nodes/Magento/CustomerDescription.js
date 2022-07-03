"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerFields = exports.customerOperations = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
exports.customerOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'customer',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new customer',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a customer',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a customer',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all customers',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a customer',
            },
        ],
        default: 'create',
    },
];
exports.customerFields = [
    /* -------------------------------------------------------------------------- */
    /*                                   customer:create                          */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'customer',
                ],
                operation: [
                    'create',
                ],
            },
        },
        description: 'Email address of the user to create',
    },
    {
        displayName: 'First Name',
        name: 'firstname',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'customer',
                ],
                operation: [
                    'create',
                ],
            },
        },
        description: 'First name of the user to create',
    },
    {
        displayName: 'Last Name',
        name: 'lastname',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'customer',
                ],
                operation: [
                    'create',
                ],
            },
        },
        description: 'Last name of the user to create',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'customer',
                ],
                operation: [
                    'create',
                ],
            },
        },
        options: [
            ...(0, GenericFunctions_1.getCustomerOptionalFields)(),
        ],
    },
    /* -------------------------------------------------------------------------- */
    /*                                   customer:update                          */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'customer',
                ],
                operation: [
                    'update',
                ],
            },
        },
        description: 'ID of the customer to update',
    },
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'customer',
                ],
                operation: [
                    'update',
                ],
            },
        },
    },
    {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'customer',
                ],
                operation: [
                    'update',
                ],
            },
        },
    },
    {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'customer',
                ],
                operation: [
                    'update',
                ],
            },
        },
    },
    {
        displayName: 'Website Name or ID',
        name: 'website_id',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
        displayOptions: {
            show: {
                resource: [
                    'customer',
                ],
                operation: [
                    'update',
                ],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getWebsites',
        },
        default: '',
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
                    'customer',
                ],
                operation: [
                    'update',
                ],
            },
        },
        options: [
            ...(0, GenericFunctions_1.getCustomerOptionalFields)(),
        ],
    },
    /* -------------------------------------------------------------------------- */
    /*                                   customer:delete			              */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'customer',
                ],
                operation: [
                    'delete',
                    'get',
                ],
            },
        },
    },
    /* -------------------------------------------------------------------------- */
    /*                                   customer:getAll			              */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: [
                    'customer',
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
                    'customer',
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
            maxValue: 10,
        },
        default: 5,
        description: 'Max number of results to return',
    },
    ...(0, GenericFunctions_1.getSearchFilters)('customer', 'getSystemAttributes', 'getSystemAttributes'),
];

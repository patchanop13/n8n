"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecomCustomerFields = exports.ecomCustomerOperations = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
exports.ecomCustomerOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'ecommerceCustomer',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a E-commerce Customer',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a E-commerce Customer',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get data of a E-commerce Customer',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get data of all E-commerce Customer',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a E-commerce Customer',
            },
        ],
        default: 'create',
    },
];
exports.ecomCustomerFields = [
    // ----------------------------------
    //         ecommerceCustomer:create
    // ----------------------------------
    {
        displayName: 'Service ID',
        name: 'connectionid',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'ecommerceCustomer',
                ],
            },
        },
        description: 'The ID of the connection object for the service where the customer originates',
    },
    {
        displayName: 'Customer ID',
        name: 'externalid',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'ecommerceCustomer',
                ],
            },
        },
        description: 'The ID of the customer in the external service',
    },
    {
        displayName: 'Customer Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'ecommerceCustomer',
                ],
            },
        },
        description: 'The email address of the customer',
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
                    'ecommerceCustomer',
                ],
            },
        },
        default: {},
        options: [
            {
                displayName: 'Accepts Marketing',
                name: 'acceptsMarketing',
                type: 'boolean',
                default: false,
                description: 'Whether customer has opt-ed in to marketing communications',
            },
        ],
    },
    // ----------------------------------
    //         ecommerceCustomer:update
    // ----------------------------------
    {
        displayName: 'Customer ID',
        name: 'ecommerceCustomerId',
        type: 'number',
        displayOptions: {
            show: {
                operation: [
                    'update',
                ],
                resource: [
                    'ecommerceCustomer',
                ],
            },
        },
        default: 0,
        required: true,
        description: 'ID of the E-commerce customer to update',
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        description: 'The fields to update',
        placeholder: 'Add Field',
        displayOptions: {
            show: {
                operation: [
                    'update',
                ],
                resource: [
                    'ecommerceCustomer',
                ],
            },
        },
        default: {},
        options: [
            {
                displayName: 'Service ID',
                name: 'connectionid',
                type: 'string',
                default: '',
                description: 'The ID of the connection object for the service where the customer originates',
            },
            {
                displayName: 'Customer ID',
                name: 'externalid',
                type: 'string',
                default: '',
                description: 'The ID of the customer in the external service',
            },
            {
                displayName: 'Customer Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@email.com',
                default: '',
                description: 'The email address of the customer',
            },
            {
                displayName: 'Accepts Marketing',
                name: 'acceptsMarketing',
                type: 'boolean',
                default: false,
                description: 'Whether customer has opt-ed in to marketing communications',
            },
        ],
    },
    // ----------------------------------
    //         ecommerceCustomer:delete
    // ----------------------------------
    {
        displayName: 'Customer ID',
        name: 'ecommerceCustomerId',
        type: 'number',
        displayOptions: {
            show: {
                operation: [
                    'delete',
                ],
                resource: [
                    'ecommerceCustomer',
                ],
            },
        },
        default: 0,
        required: true,
        description: 'ID of the E-commerce customer to delete',
    },
    // ----------------------------------
    //         ecommerceCustomer:get
    // ----------------------------------
    {
        displayName: 'Customer ID',
        name: 'ecommerceCustomerId',
        type: 'number',
        displayOptions: {
            show: {
                operation: [
                    'get',
                ],
                resource: [
                    'ecommerceCustomer',
                ],
            },
        },
        default: 0,
        required: true,
        description: 'ID of the E-commerce customer to get',
    },
    // ----------------------------------
    //         ecommerceCustomer:getAll
    // ----------------------------------
    ...(0, GenericFunctions_1.activeCampaignDefaultGetAllProperties)('ecommerceCustomer', 'getAll'),
];

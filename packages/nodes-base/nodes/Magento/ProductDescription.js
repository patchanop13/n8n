"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productFields = exports.productOperations = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
exports.productOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'product',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a product',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a product',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a product',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all producs',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a product',
            },
        ],
        default: 'create',
    },
];
exports.productFields = [
    /* -------------------------------------------------------------------------- */
    /*                                   product:create			                  */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'SKU',
        name: 'sku',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'product',
                ],
                operation: [
                    'create',
                    'update',
                ],
            },
        },
        description: 'Stock-keeping unit of the product',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'product',
                ],
                operation: [
                    'create',
                ],
            },
        },
        default: '',
    },
    {
        displayName: 'Attribute Set Name or ID',
        name: 'attributeSetId',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
        displayOptions: {
            show: {
                resource: [
                    'product',
                ],
                operation: [
                    'create',
                ],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getAttributeSets',
        },
        default: '',
    },
    {
        displayName: 'Price',
        name: 'price',
        type: 'number',
        displayOptions: {
            show: {
                resource: [
                    'product',
                ],
                operation: [
                    'create',
                ],
            },
        },
        default: 0,
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
                    'product',
                ],
                operation: [
                    'create',
                ],
            },
        },
        options: [
            ...(0, GenericFunctions_1.getProductOptionalFields)(),
        ],
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
                    'product',
                ],
                operation: [
                    'update',
                ],
            },
        },
        options: [
            ...(0, GenericFunctions_1.getProductOptionalFields)(),
        ],
    },
    /* -------------------------------------------------------------------------- */
    /*                                   product:delete			                  */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'SKU',
        name: 'sku',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'product',
                ],
                operation: [
                    'delete',
                    'get',
                ],
            },
        },
        description: 'Stock-keeping unit of the product',
    },
    /* -------------------------------------------------------------------------- */
    /*                                   product:getAll			                  */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: [
                    'product',
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
                    'product',
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
    ...(0, GenericFunctions_1.getSearchFilters)('product', 
    //'getProductAttributesFields',
    'getFilterableProductAttributes', 'getSortableProductAttributes'),
];

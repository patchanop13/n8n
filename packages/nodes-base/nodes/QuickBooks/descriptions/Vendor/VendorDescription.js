"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorFields = exports.vendorOperations = void 0;
const VendorAdditionalFieldsOptions_1 = require("./VendorAdditionalFieldsOptions");
exports.vendorOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'get',
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
            {
                name: 'Update',
                value: 'update',
            },
        ],
        displayOptions: {
            show: {
                resource: [
                    'vendor',
                ],
            },
        },
    },
];
exports.vendorFields = [
    // ----------------------------------
    //         vendor: create
    // ----------------------------------
    {
        displayName: 'Display Name',
        name: 'displayName',
        type: 'string',
        required: true,
        default: '',
        description: 'The display name of the vendor to create',
        displayOptions: {
            show: {
                resource: [
                    'vendor',
                ],
                operation: [
                    'create',
                ],
            },
        },
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
                    'vendor',
                ],
                operation: [
                    'create',
                ],
            },
        },
        options: VendorAdditionalFieldsOptions_1.vendorAdditionalFieldsOptions,
    },
    // ----------------------------------
    //         vendor: get
    // ----------------------------------
    {
        displayName: 'Vendor ID',
        name: 'vendorId',
        type: 'string',
        required: true,
        default: '',
        description: 'The ID of the vendor to retrieve',
        displayOptions: {
            show: {
                resource: [
                    'vendor',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    // ----------------------------------
    //         vendor: getAll
    // ----------------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
            show: {
                resource: [
                    'vendor',
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
            maxValue: 1000,
        },
        displayOptions: {
            show: {
                resource: [
                    'vendor',
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
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        options: [
            {
                displayName: 'Query',
                name: 'query',
                type: 'string',
                default: '',
                placeholder: 'WHERE Metadata.LastUpdatedTime > \'2021-01-01\'',
                description: 'The condition for selecting vendors. See the <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/data-queries">guide</a> for supported syntax.',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                },
            },
        ],
        displayOptions: {
            show: {
                resource: [
                    'vendor',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
    },
    // ----------------------------------
    //         vendor: update
    // ----------------------------------
    {
        displayName: 'Vendor ID',
        name: 'vendorId',
        type: 'string',
        required: true,
        default: '',
        description: 'The ID of the vendor to update',
        displayOptions: {
            show: {
                resource: [
                    'vendor',
                ],
                operation: [
                    'update',
                ],
            },
        },
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'vendor',
                ],
                operation: [
                    'update',
                ],
            },
        },
        options: VendorAdditionalFieldsOptions_1.vendorAdditionalFieldsOptions,
    },
];

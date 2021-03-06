"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyFields = exports.companyOperations = void 0;
const isoCountryCodes_1 = require("../utils/isoCountryCodes");
const sharedFields_1 = require("../utils/sharedFields");
exports.companyOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'company',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
            },
            {
                name: 'Delete',
                value: 'delete',
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
        default: 'create',
    },
];
exports.companyFields = [
    // ----------------------------------------
    //             company: create
    // ----------------------------------------
    {
        displayName: 'Name',
        name: 'name',
        description: 'Name of the company to create',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'company',
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
                    'company',
                ],
                operation: [
                    'create',
                ],
            },
        },
        options: [
            sharedFields_1.addressFixedCollection,
            {
                displayName: 'Details',
                name: 'details',
                type: 'string',
                default: '',
                description: 'Description of the company to create',
            },
            {
                displayName: 'Email Domain',
                name: 'email_domain',
                type: 'string',
                default: '',
            },
            sharedFields_1.phoneNumbersFixedCollection,
        ],
    },
    // ----------------------------------------
    //             company: delete
    // ----------------------------------------
    {
        displayName: 'Company ID',
        name: 'companyId',
        description: 'ID of the company to delete',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'company',
                ],
                operation: [
                    'delete',
                ],
            },
        },
    },
    // ----------------------------------------
    //               company: get
    // ----------------------------------------
    {
        displayName: 'Company ID',
        name: 'companyId',
        description: 'ID of the company to retrieve',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'company',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    // ----------------------------------------
    //             company: getAll
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
                    'company',
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
        default: 5,
        description: 'Max number of results to return',
        typeOptions: {
            minValue: 1,
            maxValue: 1000,
        },
        displayOptions: {
            show: {
                resource: [
                    'company',
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
        name: 'filterFields',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'company',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
        options: [
            {
                displayName: 'Country',
                name: 'country',
                type: 'options',
                options: isoCountryCodes_1.isoCountryCodes.map(({ name, alpha2 }) => ({ name, value: alpha2 })),
                default: '',
                description: 'Country of the company to filter by',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Name of the company to filter by',
            },
        ],
    },
    // ----------------------------------------
    //             company: update
    // ----------------------------------------
    {
        displayName: 'Company ID',
        name: 'companyId',
        description: 'ID of the company to update',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'company',
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
        displayOptions: {
            show: {
                resource: [
                    'company',
                ],
                operation: [
                    'update',
                ],
            },
        },
        options: [
            sharedFields_1.addressFixedCollection,
            {
                displayName: 'Details',
                name: 'details',
                type: 'string',
                default: '',
                description: 'Description to set for the company',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Name to set for the company',
            },
            sharedFields_1.phoneNumbersFixedCollection,
        ],
    },
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadFields = exports.leadOperations = void 0;
const sharedFields_1 = require("../utils/sharedFields");
exports.leadOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'lead',
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
exports.leadFields = [
    // ----------------------------------------
    //               lead: create
    // ----------------------------------------
    {
        displayName: 'Name',
        name: 'name',
        description: 'Name of the lead to create',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'lead',
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
        default: {},
        placeholder: 'Add Field',
        displayOptions: {
            show: {
                resource: [
                    'lead',
                ],
                operation: [
                    'create',
                ],
            },
        },
        options: [
            sharedFields_1.addressFixedCollection,
            sharedFields_1.emailFixedCollection,
            sharedFields_1.phoneNumbersFixedCollection,
        ],
    },
    // ----------------------------------------
    //               lead: delete
    // ----------------------------------------
    {
        displayName: 'Lead ID',
        name: 'leadId',
        description: 'ID of the lead to delete',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'lead',
                ],
                operation: [
                    'delete',
                ],
            },
        },
    },
    // ----------------------------------------
    //                lead: get
    // ----------------------------------------
    {
        displayName: 'Lead ID',
        name: 'leadId',
        description: 'ID of the lead to retrieve',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'lead',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    // ----------------------------------------
    //               lead: getAll
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
                    'lead',
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
                    'lead',
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
                    'lead',
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
                type: 'string',
                default: '',
                description: 'Name of the country to filter by',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Name of the lead to filter by',
            },
        ],
    },
    // ----------------------------------------
    //               lead: update
    // ----------------------------------------
    {
        displayName: 'Lead ID',
        name: 'leadId',
        description: 'ID of the lead to update',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'lead',
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
                    'lead',
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
                description: 'Description to set for the lead',
            },
            sharedFields_1.emailFixedCollection,
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Name to set for the lead',
            },
            sharedFields_1.phoneNumbersFixedCollection,
        ],
    },
];

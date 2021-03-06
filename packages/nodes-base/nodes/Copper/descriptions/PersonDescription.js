"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personFields = exports.personOperations = void 0;
const sharedFields_1 = require("../utils/sharedFields");
exports.personOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'person',
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
exports.personFields = [
    // ----------------------------------------
    //              person: create
    // ----------------------------------------
    {
        displayName: 'Name',
        name: 'name',
        description: 'Name of the person to create',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'person',
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
                    'person',
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
                description: 'Description to set for the person',
            },
            {
                displayName: 'Email Domain',
                name: 'email_domain',
                type: 'string',
                default: '',
            },
            sharedFields_1.emailsFixedCollection,
            sharedFields_1.phoneNumbersFixedCollection,
        ],
    },
    // ----------------------------------------
    //              person: delete
    // ----------------------------------------
    {
        displayName: 'Person ID',
        name: 'personId',
        description: 'ID of the person to delete',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'person',
                ],
                operation: [
                    'delete',
                ],
            },
        },
    },
    // ----------------------------------------
    //               person: get
    // ----------------------------------------
    {
        displayName: 'Person ID',
        name: 'personId',
        description: 'ID of the person to retrieve',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'person',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    // ----------------------------------------
    //              person: getAll
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
                    'person',
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
                    'person',
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
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'person',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
        options: [
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Name of the person to filter by',
            },
        ],
    },
    // ----------------------------------------
    //              person: update
    // ----------------------------------------
    {
        displayName: 'Person ID',
        name: 'personId',
        description: 'ID of the person to update',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'person',
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
                    'person',
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
                description: 'Description to set for the person',
            },
            {
                displayName: 'Email Domain',
                name: 'email_domain',
                type: 'string',
                default: '',
            },
            sharedFields_1.emailsFixedCollection,
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Name to set for the person',
            },
            sharedFields_1.phoneNumbersFixedCollection,
        ],
    },
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountFields = exports.accountOperations = void 0;
const SharedFields_1 = require("./SharedFields");
exports.accountOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'account',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create an account',
            },
            {
                name: 'Create or Update',
                value: 'upsert',
                description: 'Create a new record, or update the current one if it already exists (upsert)',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete an account',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get an account',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all accounts',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update an account',
            },
        ],
        default: 'create',
    },
];
exports.accountFields = [
    // ----------------------------------------
    //            account: create
    // ----------------------------------------
    {
        displayName: 'Account Name',
        name: 'accountName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'account',
                ],
                operation: [
                    'create',
                ],
            },
        },
    },
    // ----------------------------------------
    //          account: upsert
    // ----------------------------------------
    {
        displayName: 'Account Name',
        name: 'accountName',
        description: 'Name of the account. If a record with this account name exists it will be updated, otherwise a new one will be created.',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'account',
                ],
                operation: [
                    'upsert',
                ],
            },
        },
    },
    // ----------------------------------------
    //        account: create + upsert
    // ----------------------------------------
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'account',
                ],
                operation: [
                    'create',
                    'upsert',
                ],
            },
        },
        options: [
            {
                displayName: 'Account Number',
                name: 'Account_Number',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Account Site',
                name: 'Account_Site',
                type: 'string',
                default: '',
                description: 'Name of the account???s location, e.g. Headquarters or London',
            },
            {
                displayName: 'Account Type Name or ID',
                name: 'Account_Type',
                type: 'options',
                description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                typeOptions: {
                    loadOptionsMethod: 'getAccountType',
                },
                default: [],
            },
            {
                displayName: 'Annual Revenue',
                name: 'Annual_Revenue',
                type: 'number',
                default: '',
            },
            SharedFields_1.billingAddress,
            {
                displayName: 'Contact Details',
                name: 'Contact_Details',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Currency',
                name: 'Currency',
                type: 'options',
                default: 'USD',
                description: 'Symbol of the currency in which revenue is generated',
                options: SharedFields_1.currencies,
            },
            (0, SharedFields_1.makeCustomFieldsFixedCollection)('account'),
            {
                displayName: 'Description',
                name: 'Description',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Employees',
                name: 'Employees',
                type: 'number',
                default: '',
                description: 'Number of employees in the account???s company',
            },
            {
                displayName: 'Exchange Rate',
                name: 'Exchange_Rate',
                type: 'number',
                default: '',
                description: 'Exchange rate of the default currency to the home currency',
            },
            {
                displayName: 'Fax',
                name: 'Fax',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Industry',
                name: 'Industry',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Phone',
                name: 'Phone',
                type: 'string',
                default: '',
            },
            SharedFields_1.shippingAddress,
            {
                displayName: 'Ticker Symbol',
                name: 'Ticker_Symbol',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Website',
                name: 'Website',
                type: 'string',
                default: '',
            },
        ],
    },
    // ----------------------------------------
    //             account: delete
    // ----------------------------------------
    {
        displayName: 'Account ID',
        name: 'accountId',
        description: 'ID of the account to delete. Can be found at the end of the URL.',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'account',
                ],
                operation: [
                    'delete',
                ],
            },
        },
    },
    // ----------------------------------------
    //               account: get
    // ----------------------------------------
    {
        displayName: 'Account ID',
        name: 'accountId',
        description: 'ID of the account to retrieve. Can be found at the end of the URL.',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'account',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    // ----------------------------------------
    //             account: getAll
    // ----------------------------------------
    ...(0, SharedFields_1.makeGetAllFields)('account'),
    // ----------------------------------------
    //             account: update
    // ----------------------------------------
    {
        displayName: 'Account ID',
        name: 'accountId',
        description: 'ID of the account to update. Can be found at the end of the URL.',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'account',
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
                    'account',
                ],
                operation: [
                    'update',
                ],
            },
        },
        options: [
            {
                displayName: 'Account Name',
                name: 'Account_Name',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Account Number',
                name: 'Account_Number',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Account Site',
                name: 'Account_Site',
                type: 'string',
                default: '',
                description: 'Name of the account???s location, e.g. Headquarters or London',
            },
            {
                displayName: 'Account Type Name or ID',
                name: 'Account_Type',
                type: 'options',
                description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                typeOptions: {
                    loadOptionsMethod: 'getAccountType',
                },
                default: [],
            },
            {
                displayName: 'Annual Revenue',
                name: 'Annual_Revenue',
                type: 'number',
                default: '',
            },
            SharedFields_1.billingAddress,
            {
                displayName: 'Contact Details',
                name: 'Contact_Details',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Currency',
                name: 'Currency',
                type: 'options',
                default: 'USD',
                description: 'Symbol of the currency in which revenue is generated',
                options: SharedFields_1.currencies,
            },
            (0, SharedFields_1.makeCustomFieldsFixedCollection)('account'),
            {
                displayName: 'Description',
                name: 'Description',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Employees',
                name: 'Employees',
                type: 'number',
                default: '',
                description: 'Number of employees in the account???s company',
            },
            {
                displayName: 'Exchange Rate',
                name: 'Exchange_Rate',
                type: 'number',
                default: '',
                description: 'Exchange rate of the default currency to the home currency',
            },
            {
                displayName: 'Fax',
                name: 'Fax',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Industry',
                name: 'Industry',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Phone',
                name: 'Phone',
                type: 'string',
                default: '',
            },
            SharedFields_1.shippingAddress,
            {
                displayName: 'Ticker Symbol',
                name: 'Ticker_Symbol',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Website',
                name: 'Website',
                type: 'string',
                default: '',
            },
        ],
    },
];

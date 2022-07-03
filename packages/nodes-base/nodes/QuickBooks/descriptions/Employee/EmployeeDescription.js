"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeFields = exports.employeeOperations = void 0;
const EmployeeAdditionalFieldsOptions_1 = require("./EmployeeAdditionalFieldsOptions");
exports.employeeOperations = [
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
                    'employee',
                ],
            },
        },
    },
];
exports.employeeFields = [
    // ----------------------------------
    //         employee: create
    // ----------------------------------
    {
        displayName: 'Family Name',
        name: 'FamilyName',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'employee',
                ],
                operation: [
                    'create',
                ],
            },
        },
    },
    {
        displayName: 'Given Name',
        name: 'GivenName',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'employee',
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
                    'employee',
                ],
                operation: [
                    'create',
                ],
            },
        },
        options: EmployeeAdditionalFieldsOptions_1.employeeAdditionalFieldsOptions,
    },
    // ----------------------------------
    //         employee: get
    // ----------------------------------
    {
        displayName: 'Employee ID',
        name: 'employeeId',
        type: 'string',
        required: true,
        default: '',
        description: 'The ID of the employee to retrieve',
        displayOptions: {
            show: {
                resource: [
                    'employee',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    // ----------------------------------
    //         employee: getAll
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
                    'employee',
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
                    'employee',
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
                description: 'The condition for selecting employees. See the <a href="https://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/data-queries">guide</a> for supported syntax.',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                },
            },
        ],
        displayOptions: {
            show: {
                resource: [
                    'employee',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
    },
    // ----------------------------------
    //         employee: update
    // ----------------------------------
    {
        displayName: 'Employee ID',
        name: 'employeeId',
        type: 'string',
        required: true,
        default: '',
        description: 'The ID of the employee to update',
        displayOptions: {
            show: {
                resource: [
                    'employee',
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
                    'employee',
                ],
                operation: [
                    'update',
                ],
            },
        },
        options: EmployeeAdditionalFieldsOptions_1.employeeAdditionalFieldsOptions,
    },
];
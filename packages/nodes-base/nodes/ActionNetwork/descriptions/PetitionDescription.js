"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petitionFields = exports.petitionOperations = void 0;
const SharedFields_1 = require("./SharedFields");
exports.petitionOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'petition',
                ],
            },
        },
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
        default: 'create',
    },
];
exports.petitionFields = [
    // ----------------------------------------
    //             petition: create
    // ----------------------------------------
    {
        displayName: 'Origin System',
        name: 'originSystem',
        description: 'Source where the petition originated',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'petition',
                ],
                operation: [
                    'create',
                ],
            },
        },
    },
    {
        displayName: 'Title',
        name: 'title',
        description: 'Title of the petition to create',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'petition',
                ],
                operation: [
                    'create',
                ],
            },
        },
    },
    (0, SharedFields_1.makeSimpleField)('petition', 'create'),
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'petition',
                ],
                operation: [
                    'create',
                ],
            },
        },
        options: SharedFields_1.petitionAdditionalFieldsOptions,
    },
    // ----------------------------------------
    //              petition: get
    // ----------------------------------------
    {
        displayName: 'Petition ID',
        name: 'petitionId',
        description: 'ID of the petition to retrieve',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'petition',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    (0, SharedFields_1.makeSimpleField)('petition', 'get'),
    // ----------------------------------------
    //             petition: getAll
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
                    'petition',
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
        },
        displayOptions: {
            show: {
                resource: [
                    'petition',
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
    (0, SharedFields_1.makeSimpleField)('petition', 'getAll'),
    // ----------------------------------------
    //             petition: update
    // ----------------------------------------
    {
        displayName: 'Petition ID',
        name: 'petitionId',
        description: 'ID of the petition to update',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'petition',
                ],
                operation: [
                    'update',
                ],
            },
        },
    },
    (0, SharedFields_1.makeSimpleField)('petition', 'update'),
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'petition',
                ],
                operation: [
                    'update',
                ],
            },
        },
        options: SharedFields_1.petitionAdditionalFieldsOptions,
    },
];

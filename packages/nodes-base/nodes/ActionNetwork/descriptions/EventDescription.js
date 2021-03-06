"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventFields = exports.eventOperations = void 0;
const SharedFields_1 = require("./SharedFields");
exports.eventOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'event',
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
        ],
        default: 'create',
    },
];
exports.eventFields = [
    // ----------------------------------------
    //              event: create
    // ----------------------------------------
    {
        displayName: 'Origin System',
        name: 'originSystem',
        description: 'Source where the event originated',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'event',
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
        description: 'Title of the event to create',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'event',
                ],
                operation: [
                    'create',
                ],
            },
        },
    },
    (0, SharedFields_1.makeSimpleField)('event', 'create'),
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'event',
                ],
                operation: [
                    'create',
                ],
            },
        },
        options: SharedFields_1.eventAdditionalFieldsOptions,
    },
    // ----------------------------------------
    //                event: get
    // ----------------------------------------
    {
        displayName: 'Event ID',
        name: 'eventId',
        description: 'ID of the event to retrieve',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'event',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    (0, SharedFields_1.makeSimpleField)('event', 'get'),
    // ----------------------------------------
    //              event: getAll
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
                    'event',
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
                    'event',
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
    (0, SharedFields_1.makeSimpleField)('event', 'getAll'),
];

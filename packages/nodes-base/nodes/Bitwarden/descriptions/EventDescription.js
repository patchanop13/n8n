"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventFields = exports.eventOperations = void 0;
exports.eventOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'get',
        options: [
            {
                name: 'Get All',
                value: 'getAll',
            },
        ],
        displayOptions: {
            show: {
                resource: [
                    'event',
                ],
            },
        },
    },
];
exports.eventFields = [
    // ----------------------------------
    //       event: getAll
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
        typeOptions: {
            minValue: 1,
        },
        default: 10,
        description: 'Max number of results to return',
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
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        options: [
            {
                displayName: 'Acting User ID',
                name: 'actingUserId',
                type: 'string',
                default: '',
                description: 'The unique identifier of the acting user',
                placeholder: '4a59c8c7-e05a-4d17-8e85-acc301343926',
            },
            {
                displayName: 'End Date',
                name: 'end',
                type: 'dateTime',
                default: '',
                description: 'The end date for the search',
            },
            {
                displayName: 'Item ID',
                name: 'itemID',
                type: 'string',
                default: '',
                description: 'The unique identifier of the item that the event describes',
                placeholder: '5e59c8c7-e05a-4d17-8e85-acc301343926',
            },
            {
                displayName: 'Start Date',
                name: 'start',
                type: 'dateTime',
                default: '',
                description: 'The start date for the search',
            },
        ],
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
];

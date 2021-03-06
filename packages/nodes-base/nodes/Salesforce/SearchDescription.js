"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFields = exports.searchOperations = void 0;
exports.searchOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'search',
                ],
            },
        },
        options: [
            {
                name: 'Query',
                value: 'query',
                description: 'Execute a SOQL query that returns all the results in a single response',
            },
        ],
        default: 'query',
    },
];
exports.searchFields = [
    /* -------------------------------------------------------------------------- */
    /*                                search:query                                */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'search',
                ],
                operation: [
                    'query',
                ],
            },
        },
        description: 'A SOQL query. An example query parameter string might look like: “SELECT+Name+FROM+MyObject”. If the SOQL query string is invalid, a MALFORMED_QUERY response is returned.',
    },
];

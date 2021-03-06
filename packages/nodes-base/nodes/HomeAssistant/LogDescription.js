"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logFields = exports.logOperations = void 0;
exports.logOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'log',
                ],
            },
        },
        options: [
            {
                name: 'Get Error Logs',
                value: 'getErroLogs',
                description: 'Get a log for a specific entity',
            },
            {
                name: 'Get Logbook Entries',
                value: 'getLogbookEntries',
                description: 'Get all logs',
            },
        ],
        default: 'getErroLogs',
    },
];
exports.logFields = [
    /* -------------------------------------------------------------------------- */
    /*                                log:getLogbookEntries                       */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'log',
                ],
                operation: [
                    'getLogbookEntries',
                ],
            },
        },
        options: [
            {
                displayName: 'End Time',
                name: 'endTime',
                type: 'dateTime',
                default: '',
                description: 'The end of the period',
            },
            {
                displayName: 'Entity ID',
                name: 'entityId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Start Time',
                name: 'startTime',
                type: 'dateTime',
                default: '',
                description: 'The beginning of the period',
            },
        ],
    },
];

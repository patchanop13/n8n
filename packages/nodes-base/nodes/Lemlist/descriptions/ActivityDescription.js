"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityFields = exports.activityOperations = void 0;
exports.activityOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'getAll',
        options: [
            {
                name: 'Get All',
                value: 'getAll',
            },
        ],
        displayOptions: {
            show: {
                resource: [
                    'activity',
                ],
            },
        },
    },
];
exports.activityFields = [
    // ----------------------------------
    //        activity: getAll
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
                    'activity',
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
                    'activity',
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
        displayOptions: {
            show: {
                resource: [
                    'activity',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
        options: [
            {
                displayName: 'Campaign Name or ID',
                name: 'campaignId',
                type: 'options',
                default: '',
                typeOptions: {
                    loadOptionsMethod: 'getCampaigns',
                },
                description: 'ID of the campaign to retrieve activity for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
            },
            {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                default: 'emailsOpened',
                description: 'Type of activity to retrieve',
                options: [
                    {
                        name: 'Emails Bounced',
                        value: 'emailsBounced',
                    },
                    {
                        name: 'Emails Clicked',
                        value: 'emailsClicked',
                    },
                    {
                        name: 'Emails Opened',
                        value: 'emailsOpened',
                    },
                    {
                        name: 'Emails Replied',
                        value: 'emailsReplied',
                    },
                    {
                        name: 'Emails Send Failed',
                        value: 'emailsSendFailed',
                    },
                    {
                        name: 'Emails Sent',
                        value: 'emailsSent',
                    },
                    {
                        name: 'Emails Unsubscribed',
                        value: 'emailsUnsubscribed',
                    },
                ],
            },
        ],
    },
];

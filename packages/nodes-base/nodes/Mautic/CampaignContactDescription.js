"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignContactFields = exports.campaignContactOperations = void 0;
exports.campaignContactOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'campaignContact',
                ],
            },
        },
        options: [
            {
                name: 'Add',
                value: 'add',
                description: 'Add contact to a campaign',
            },
            {
                name: 'Remove',
                value: 'remove',
                description: 'Remove contact from a campaign',
            },
        ],
        default: 'add',
    },
];
exports.campaignContactFields = [
    /* -------------------------------------------------------------------------- */
    /*                               campaignContact:add                           */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Contact ID',
        name: 'contactId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'campaignContact',
                ],
                operation: [
                    'add',
                    'remove',
                ],
            },
        },
        default: '',
    },
    {
        displayName: 'Campaign Name or ID',
        name: 'campaignId',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'campaignContact',
                ],
                operation: [
                    'add',
                    'remove',
                ],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getCampaigns',
        },
        default: '',
    },
];

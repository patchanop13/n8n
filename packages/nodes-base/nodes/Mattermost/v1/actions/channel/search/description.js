"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelSearchDescription = void 0;
exports.channelSearchDescription = [
    {
        displayName: 'Team Name or ID',
        name: 'teamId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getTeams',
        },
        options: [],
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'search',
                ],
                resource: [
                    'channel',
                ],
            },
        },
        description: 'The Mattermost Team. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
    },
    {
        displayName: 'Search Term',
        name: 'term',
        type: 'string',
        default: '',
        placeholder: 'General',
        displayOptions: {
            show: {
                operation: [
                    'search',
                ],
                resource: [
                    'channel',
                ],
            },
        },
        required: true,
        description: 'The search term for Channels in a Team',
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
            show: {
                operation: [
                    'search',
                ],
                resource: [
                    'channel',
                ],
            },
        },
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 100,
        description: 'Max number of results to return',
        typeOptions: {
            minValue: 1,
            maxValue: 100,
        },
        displayOptions: {
            show: {
                operation: [
                    'search',
                ],
                resource: [
                    'channel',
                ],
                returnAll: [
                    false,
                ],
            },
        },
    },
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelDeleteDescription = void 0;
exports.channelDeleteDescription = [
    {
        displayName: 'Channel Name or ID',
        name: 'channelId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getChannels',
        },
        options: [],
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'delete',
                ],
                resource: [
                    'channel',
                ],
            },
        },
        description: 'The ID of the channel to soft delete. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
    },
];

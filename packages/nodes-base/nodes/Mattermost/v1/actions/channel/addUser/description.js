"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelAddUserDescription = void 0;
exports.channelAddUserDescription = [
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
                    'addUser',
                ],
                resource: [
                    'channel',
                ],
            },
        },
        description: 'The ID of the channel to invite user to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
    },
    {
        displayName: 'User Name or ID',
        name: 'userId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getUsers',
        },
        options: [],
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'addUser',
                ],
                resource: [
                    'channel',
                ],
            },
        },
        description: 'The ID of the user to invite into channel. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
    },
];

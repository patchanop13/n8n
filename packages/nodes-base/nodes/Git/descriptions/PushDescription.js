"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushFields = void 0;
exports.pushFields = [
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        displayOptions: {
            show: {
                operation: [
                    'push',
                ],
            },
        },
        placeholder: 'Add Option',
        default: {},
        options: [
            {
                displayName: 'Target Repository',
                name: 'targetRepository',
                type: 'string',
                default: '',
                placeholder: 'https://github.com/n8n-io/n8n',
                description: 'The URL or path of the repository to push to',
            },
        ],
    },
];

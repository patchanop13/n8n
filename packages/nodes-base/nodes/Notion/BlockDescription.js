"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockFields = exports.blockOperations = void 0;
const Blocks_1 = require("./Blocks");
exports.blockOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'block',
                ],
            },
        },
        options: [
            {
                name: 'Append After',
                value: 'append',
                description: 'Append a block',
            },
            {
                // eslint-disable-next-line n8n-nodes-base/node-param-option-name-wrong-for-get-all
                name: 'Get Child Blocks',
                value: 'getAll',
                description: 'Get all children blocks',
            },
        ],
        default: 'append',
    },
];
exports.blockFields = [
    /* -------------------------------------------------------------------------- */
    /*                                block:append                                 */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Block ID or Link',
        name: 'blockId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'block',
                ],
                operation: [
                    'append',
                ],
            },
        },
        description: 'The Block URL from Notion\'s \'copy link\' functionality (or just the ID contained within the URL). Pages are also blocks, so you can use a page URL/ID here too.',
    },
    ...(0, Blocks_1.blocks)('block', 'append'),
    /* -------------------------------------------------------------------------- */
    /*                                block:getAll                                */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Block ID or Link',
        name: 'blockId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'block',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
        description: 'The Block URL from Notion\'s \'copy link\' functionality (or just the ID contained within the URL). Pages are also blocks, so you can use a page URL/ID here too.',
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: [
                    'block',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
            show: {
                resource: [
                    'block',
                ],
                operation: [
                    'getAll',
                ],
                returnAll: [
                    false,
                ],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 100,
        },
        default: 50,
        description: 'Max number of results to return',
    },
];

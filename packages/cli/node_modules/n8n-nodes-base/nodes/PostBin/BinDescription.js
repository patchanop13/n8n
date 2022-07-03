"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.binFields = exports.binOperations = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
// Operations for the `Bin` resource:
exports.binOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'bin',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create bin',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/developers/postbin/api/bin',
                    },
                    output: {
                        postReceive: [
                            GenericFunctions_1.transformBinReponse,
                        ],
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a bin',
                routing: {
                    request: {
                        method: 'GET',
                    },
                    output: {
                        postReceive: [
                            GenericFunctions_1.transformBinReponse,
                        ],
                    },
                    send: {
                        preSend: [
                            // Parse binId before sending to make sure it's in the right format
                            GenericFunctions_1.buildBinAPIURL,
                        ],
                    },
                },
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a bin',
                routing: {
                    request: {
                        method: 'DELETE',
                    },
                    send: {
                        preSend: [
                            // Parse binId before sending to make sure it's in the right format
                            GenericFunctions_1.buildBinAPIURL,
                        ],
                    },
                },
            },
        ],
        default: 'create',
    },
];
// Properties of the `Bin` resource
exports.binFields = [
    {
        name: 'binId',
        displayName: 'Bin ID',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'bin',
                ],
                operation: [
                    'get',
                    'delete',
                ],
            },
        },
        description: 'Unique identifier for each bin',
    },
];

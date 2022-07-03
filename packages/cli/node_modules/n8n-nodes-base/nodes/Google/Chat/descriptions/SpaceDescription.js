"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceFields = exports.spaceOperations = void 0;
const GenericFunctions_1 = require("../GenericFunctions");
exports.spaceOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        noDataExpression: true,
        type: 'options',
        displayOptions: {
            show: {
                resource: [
                    'space',
                ],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get a space',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all spaces the caller is a member of',
            },
        ],
        default: 'get',
    },
];
exports.spaceFields = [
    /* -------------------------------------------------------------------------- */
    /*                                 space:get                                  */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Space ID',
        name: 'spaceId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'space',
                ],
                operation: [
                    'get',
                ],
            },
        },
        default: '',
        description: 'Resource name of the space, in the form "spaces/*"',
    },
    /* -------------------------------------------------------------------------- */
    /*                                 space:getAll                               */
    /* -------------------------------------------------------------------------- */
    ...(0, GenericFunctions_1.getPagingParameters)('space'),
];

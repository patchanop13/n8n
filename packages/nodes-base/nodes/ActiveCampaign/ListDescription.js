"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFields = exports.listOperations = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
exports.listOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'list',
                ],
            },
        },
        options: [
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all lists',
            },
        ],
        default: 'getAll',
    },
];
exports.listFields = [
    // ----------------------------------
    //         list:getAll
    // ----------------------------------
    ...(0, GenericFunctions_1.activeCampaignDefaultGetAllProperties)('list', 'getAll'),
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamFields = exports.teamOperations = void 0;
exports.teamOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'get',
        options: [
            {
                name: 'Get',
                value: 'get',
            },
        ],
        displayOptions: {
            show: {
                resource: [
                    'team',
                ],
            },
        },
    },
];
exports.teamFields = [
// ----------------------------------
//        team: get
// ----------------------------------
];

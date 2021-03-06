"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyOperations = void 0;
exports.companyOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'company',
                ],
            },
        },
        options: [
            {
                name: 'Get Settings',
                value: 'getSetting',
                description: 'Get your companys ProfitWell account settings',
            },
        ],
        default: 'getSetting',
    },
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyFields = exports.companyOperations = void 0;
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
                name: 'Enrich',
                value: 'enrich',
            },
        ],
        default: 'enrich',
    },
];
exports.companyFields = [
    /* -------------------------------------------------------------------------- */
    /*                                 company:enrich                             */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Company',
        name: 'company',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'company',
                ],
                operation: [
                    'enrich',
                ],
            },
        },
        description: 'The name of the company (e.g – amazon)',
    },
    {
        displayName: 'Domain',
        name: 'domain',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'company',
                ],
                operation: [
                    'enrich',
                ],
            },
        },
        description: 'The domain name (e.g – amazon.com)',
    },
];

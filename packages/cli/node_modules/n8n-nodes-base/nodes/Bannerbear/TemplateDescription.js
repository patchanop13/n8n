"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateFields = exports.templateOperations = void 0;
exports.templateOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'template',
                ],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get a template',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all templates',
            },
        ],
        default: 'get',
    },
];
exports.templateFields = [
    /* -------------------------------------------------------------------------- */
    /*                                 template:get                               */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Template ID',
        name: 'templateId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'template',
                ],
                operation: [
                    'get',
                ],
            },
        },
        description: 'Unique identifier for the template',
    },
];

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
                name: 'Create',
                value: 'create',
                description: 'Create a template',
            },
        ],
        default: 'create',
    },
];
exports.templateFields = [
    /* -------------------------------------------------------------------------- */
    /*                                template:create                             */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Template',
        name: 'template',
        type: 'string',
        displayOptions: {
            show: {
                resource: [
                    'template',
                ],
                operation: [
                    'create',
                ],
            },
        },
        required: true,
        default: '',
        description: 'Render a Home Assistant template. <a href="https://www.home-assistant.io/docs/configuration/templating/">See template docs for more information.</a>.',
    },
];

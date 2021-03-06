"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskListFields = exports.taskListOperations = void 0;
exports.taskListOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'taskList',
                ],
            },
        },
        options: [
            {
                name: 'Add',
                value: 'add',
                description: 'Add a task to a list',
            },
            {
                name: 'Remove',
                value: 'remove',
                description: 'Remove a task from a list',
            },
        ],
        default: 'add',
    },
];
exports.taskListFields = [
    /* -------------------------------------------------------------------------- */
    /*                                taskList:add                                */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Task ID',
        name: 'taskId',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'taskList',
                ],
                operation: [
                    'remove',
                    'add',
                ],
            },
        },
        required: true,
    },
    {
        displayName: 'List ID',
        name: 'listId',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'taskList',
                ],
                operation: [
                    'remove',
                    'add',
                ],
            },
        },
        required: true,
    },
];

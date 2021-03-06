"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskDependencyFields = exports.taskDependencyOperations = void 0;
exports.taskDependencyOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'taskDependency',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a task dependency',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a task dependency',
            },
        ],
        default: 'create',
    },
];
exports.taskDependencyFields = [
    /* -------------------------------------------------------------------------- */
    /*                                taskDependency:create                        */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Task ID',
        name: 'task',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'taskDependency',
                ],
                operation: [
                    'create',
                ],
            },
        },
        required: true,
    },
    {
        displayName: 'Depends On Task ID',
        name: 'dependsOnTask',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'taskDependency',
                ],
                operation: [
                    'create',
                ],
            },
        },
        required: true,
    },
    /* -------------------------------------------------------------------------- */
    /*                                taskDependency:delete                        */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Task ID',
        name: 'task',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'taskDependency',
                ],
                operation: [
                    'delete',
                ],
            },
        },
        required: true,
    },
    {
        displayName: 'Depends On Task ID',
        name: 'dependsOnTask',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [
                    'taskDependency',
                ],
                operation: [
                    'delete',
                ],
            },
        },
        required: true,
    },
];

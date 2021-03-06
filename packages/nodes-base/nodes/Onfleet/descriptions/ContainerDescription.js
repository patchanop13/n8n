"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.containerFields = exports.containerOperations = void 0;
exports.containerOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'container',
                ],
            },
        },
        options: [
            {
                name: 'Add Tasks',
                value: 'addTask',
                description: 'Add task at index (or append)',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get container information',
            },
            {
                name: 'Update Tasks',
                value: 'updateTask',
                description: 'Fully replace a container\'s tasks',
            },
        ],
        default: 'get',
    },
];
const containerTypeField = {
    displayName: 'Container Type',
    name: 'containerType',
    type: 'options',
    options: [
        {
            name: 'Organizations',
            value: 'organizations',
        },
        {
            name: 'Teams',
            value: 'teams',
        },
        {
            name: 'Workers',
            value: 'workers',
        },
    ],
    default: '',
};
const containerIdField = {
    displayName: 'Container ID',
    name: 'containerId',
    type: 'string',
    default: '',
    description: 'The object ID according to the container chosen',
};
const insertTypeField = {
    displayName: 'Insert Type',
    name: 'type',
    type: 'options',
    options: [
        {
            name: 'Append',
            value: -1,
        },
        {
            name: 'Prepend',
            value: 0,
        },
        {
            name: 'At Specific Index',
            value: 1,
        },
    ],
    default: '',
};
const indexField = {
    displayName: 'Index',
    name: 'index',
    type: 'number',
    default: 0,
    description: 'The index given indicates the position where the tasks are going to be inserted',
};
const tasksField = {
    displayName: 'Task IDs',
    name: 'tasks',
    type: 'string',
    typeOptions: {
        multipleValues: true,
        multipleValueButtonText: 'Add Task',
    },
    default: [],
    description: 'Task\'s ID that are going to be used',
};
const considerDependenciesField = {
    displayName: 'Consider Dependencies',
    name: 'considerDependencies',
    type: 'boolean',
    default: false,
    description: 'Whether to include the target task\'s dependency family (parent and child tasks) in the resulting assignment operation',
};
exports.containerFields = [
    Object.assign(Object.assign({}, containerTypeField), { displayOptions: {
            show: {
                resource: [
                    'container',
                ],
                operation: [
                    'get',
                    'addTask',
                ],
            },
        }, required: true }),
    Object.assign(Object.assign({}, containerIdField), { displayOptions: {
            show: {
                resource: [
                    'container',
                ],
                operation: [
                    'get',
                    'addTask',
                    'updateTask',
                ],
            },
        }, required: true }),
    Object.assign(Object.assign({}, insertTypeField), { displayOptions: {
            show: {
                resource: [
                    'container',
                ],
                operation: [
                    'addTask',
                ],
            },
        }, required: true }),
    Object.assign(Object.assign({}, indexField), { displayOptions: {
            show: {
                resource: [
                    'container',
                ],
                operation: [
                    'addTask',
                ],
                type: [
                    1,
                ],
            },
        }, required: true }),
    Object.assign(Object.assign({}, tasksField), { displayOptions: {
            show: {
                resource: [
                    'container',
                ],
                operation: [
                    'addTask',
                    'updateTask',
                ],
            },
        }, required: true }),
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'container',
                ],
                operation: [
                    'addTask',
                    'updateTask',
                ],
            },
        },
        options: [
            Object.assign(Object.assign({}, considerDependenciesField), { required: false }),
        ],
    },
];

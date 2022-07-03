"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asana = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const change_case_1 = require("change-case");
class Asana {
    constructor() {
        this.description = {
            displayName: 'Asana',
            name: 'asana',
            icon: 'file:asana.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Asana REST API',
            defaults: {
                name: 'Asana',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'asanaApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'accessToken',
                            ],
                        },
                    },
                    testedBy: {
                        request: {
                            method: 'GET',
                            url: '/users/me',
                        },
                    },
                },
                {
                    name: 'asanaOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
                },
            ],
            requestDefaults: {
                baseURL: 'https://app.asana.com/api/1.0',
                url: '',
            },
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Access Token',
                            value: 'accessToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'accessToken',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Project',
                            value: 'project',
                        },
                        {
                            name: 'Subtask',
                            value: 'subtask',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                        {
                            name: 'Task Comment',
                            value: 'taskComment',
                        },
                        {
                            name: 'Task Project',
                            value: 'taskProject',
                        },
                        {
                            name: 'Task Tag',
                            value: 'taskTag',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'task',
                },
                // ----------------------------------
                //         subtask
                // ----------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'subtask',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a subtask',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all substasks',
                        },
                    ],
                    default: 'create',
                },
                // ----------------------------------
                //         subtask:create
                // ----------------------------------
                {
                    displayName: 'Parent Task ID',
                    name: 'taskId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                            resource: [
                                'subtask',
                            ],
                        },
                    },
                    description: 'The task to operate on',
                },
                {
                    displayName: 'Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                            resource: [
                                'subtask',
                            ],
                        },
                    },
                    description: 'The name of the subtask to create',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'otherProperties',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            resource: [
                                'subtask',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    default: {},
                    placeholder: 'Add Field',
                    options: [
                        {
                            displayName: 'Assignee Name or ID',
                            name: 'assignee',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getUsers',
                            },
                            default: '',
                            description: 'Set Assignee on the subtask. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Assignee Status',
                            name: 'assignee_status',
                            type: 'options',
                            options: [
                                {
                                    name: 'Inbox',
                                    value: 'inbox',
                                },
                                {
                                    name: 'Today',
                                    value: 'today',
                                },
                                {
                                    name: 'Upcoming',
                                    value: 'upcoming',
                                },
                                {
                                    name: 'Later',
                                    value: 'later',
                                },
                            ],
                            default: 'inbox',
                            description: 'Set Assignee status on the subtask (requires Assignee)',
                        },
                        {
                            displayName: 'Completed',
                            name: 'completed',
                            type: 'boolean',
                            default: false,
                            description: 'Whether the subtask should be marked completed',
                        },
                        {
                            displayName: 'Due On',
                            name: 'due_on',
                            type: 'dateTime',
                            default: '',
                            description: 'Date on which the time is due',
                        },
                        {
                            displayName: 'Liked',
                            name: 'liked',
                            type: 'boolean',
                            default: false,
                            description: 'Whether the task is liked by the authorized user',
                        },
                        {
                            displayName: 'Notes',
                            name: 'notes',
                            type: 'string',
                            typeOptions: {
                                alwaysOpenEditWindow: true,
                                rows: 5,
                            },
                            default: '',
                            description: 'The task notes',
                        },
                        {
                            displayName: 'Workspace Name or ID',
                            name: 'workspace',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getWorkspaces',
                            },
                            default: '',
                            description: 'The workspace to create the subtask in. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                    ],
                },
                // ----------------------------------
                //         subtask:getAll
                // ----------------------------------
                {
                    displayName: 'Parent Task ID',
                    name: 'taskId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'subtask',
                            ],
                        },
                    },
                    description: 'The task to operate on',
                },
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'subtask',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether to return all results or only up to a given limit',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'subtask',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                        maxValue: 500,
                    },
                    default: 100,
                    description: 'Max number of results to return',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'subtask',
                            ],
                        },
                    },
                    default: {},
                    placeholder: 'Add Field',
                    options: [
                        {
                            displayName: 'Field Names or IDs',
                            name: 'opt_fields',
                            type: 'multiOptions',
                            typeOptions: {
                                loadOptionsMethod: 'getTaskFields',
                            },
                            default: [
                                'gid',
                                'name',
                                'resource_type',
                            ],
                            description: 'Defines fields to return. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Pretty',
                            name: 'opt_pretty',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to provide “pretty” output',
                        },
                    ],
                },
                // ----------------------------------
                //         task
                // ----------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'task',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a task',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete a task',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get a task',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all tasks',
                        },
                        {
                            name: 'Move',
                            value: 'move',
                            description: 'Move a task',
                        },
                        {
                            name: 'Search',
                            value: 'search',
                            description: 'Search for tasks',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update a task',
                        },
                    ],
                    default: 'create',
                },
                // ----------------------------------
                //         task:create
                // ----------------------------------
                {
                    displayName: 'Workspace Name or ID',
                    name: 'workspace',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getWorkspaces',
                    },
                    options: [],
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                            resource: [
                                'task',
                            ],
                        },
                    },
                    description: 'The workspace to create the task in. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                            resource: [
                                'task',
                            ],
                        },
                    },
                    description: 'The name of the task to create',
                },
                // ----------------------------------
                //         task:delete
                // ----------------------------------
                {
                    displayName: 'Task ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'delete',
                            ],
                            resource: [
                                'task',
                            ],
                        },
                    },
                    description: 'The ID of the task to delete',
                },
                // ----------------------------------
                //         task:get
                // ----------------------------------
                {
                    displayName: 'Task ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                            ],
                            resource: [
                                'task',
                            ],
                        },
                    },
                    description: 'The ID of the task to get the data of',
                },
                // ----------------------------------
                //         task:getAll
                // ----------------------------------
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'task',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether to return all results or only up to a given limit',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'task',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                        maxValue: 500,
                    },
                    default: 100,
                    description: 'Max number of results to return',
                },
                {
                    displayName: 'Filters',
                    name: 'filters',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'task',
                            ],
                        },
                    },
                    default: {},
                    description: 'Properties to search for',
                    placeholder: 'Add Filter',
                    options: [
                        {
                            displayName: 'Assignee Name or ID',
                            name: 'assignee',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getUsers',
                            },
                            default: '',
                            description: 'The assignee to filter tasks on. Note: If you specify assignee, you must also specify the workspace to filter on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Field Names or IDs',
                            name: 'opt_fields',
                            type: 'multiOptions',
                            typeOptions: {
                                loadOptionsMethod: 'getTaskFields',
                            },
                            default: [
                                'gid',
                                'name',
                                'resource_type',
                            ],
                            description: 'Defines fields to return. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Pretty',
                            name: 'opt_pretty',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to provide “pretty” output',
                        },
                        {
                            displayName: 'Project Name or ID',
                            name: 'project',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getProjects',
                            },
                            default: '',
                            description: 'The project to filter tasks on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Section Name or ID',
                            name: 'section',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getSections',
                            },
                            default: '',
                            description: 'The section to filter tasks on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Workspace Name or ID',
                            name: 'workspace',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getWorkspaces',
                            },
                            default: '',
                            description: 'The workspace to filter tasks on. Note: If you specify workspace, you must also specify the assignee to filter on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Completed Since',
                            name: 'completed_since',
                            type: 'dateTime',
                            default: '',
                            description: 'Only return tasks that are either incomplete or that have been completed since this time',
                        },
                        {
                            displayName: 'Modified Since',
                            name: 'modified_since',
                            type: 'dateTime',
                            default: '',
                            description: 'Only return tasks that have been modified since the given time',
                        },
                    ],
                },
                // ----------------------------------
                //         task:move
                // ----------------------------------
                {
                    displayName: 'Task ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'move',
                            ],
                            resource: [
                                'task',
                            ],
                        },
                    },
                    description: 'The ID of the task to be moved',
                },
                {
                    displayName: 'Project Name or ID',
                    name: 'projectId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getProjects',
                    },
                    options: [],
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'move',
                            ],
                            resource: [
                                'task',
                            ],
                        },
                    },
                    description: 'Project to show the sections of. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Section Name or ID',
                    name: 'section',
                    type: 'options',
                    typeOptions: {
                        loadOptionsDependsOn: [
                            'projectId',
                        ],
                        loadOptionsMethod: 'getSections',
                    },
                    options: [],
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'move',
                            ],
                            resource: [
                                'task',
                            ],
                        },
                    },
                    description: 'The Section to move the task to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                // ----------------------------------
                //         task:update
                // ----------------------------------
                {
                    displayName: 'Task ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'update',
                            ],
                            resource: [
                                'task',
                            ],
                        },
                    },
                    description: 'The ID of the task to update the data of',
                },
                // ----------------------------------
                //         task:search
                // ----------------------------------
                {
                    displayName: 'Workspace Name or ID',
                    name: 'workspace',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getWorkspaces',
                    },
                    options: [],
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'search',
                            ],
                            resource: [
                                'task',
                            ],
                        },
                    },
                    description: 'The workspace in which the task is searched. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Filters',
                    name: 'searchTaskProperties',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            operation: [
                                'search',
                            ],
                            resource: [
                                'task',
                            ],
                        },
                    },
                    default: {},
                    description: 'Properties to search for',
                    placeholder: 'Add Filter',
                    options: [
                        {
                            displayName: 'Completed',
                            name: 'completed',
                            type: 'boolean',
                            default: false,
                            description: 'Whether the task is marked completed',
                        },
                        {
                            displayName: 'Text',
                            name: 'text',
                            type: 'string',
                            typeOptions: {
                                alwaysOpenEditWindow: true,
                                rows: 5,
                            },
                            default: '',
                            description: 'Text to search for in name or notes',
                        },
                    ],
                },
                // ----------------------------------
                //         task:create/update
                // ----------------------------------
                {
                    displayName: 'Additional Fields',
                    name: 'otherProperties',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            resource: [
                                'task',
                            ],
                            operation: [
                                'create',
                                'update',
                            ],
                        },
                    },
                    default: {},
                    placeholder: 'Add Field',
                    options: [
                        {
                            displayName: 'Assignee Name or ID',
                            name: 'assignee',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getUsers',
                            },
                            default: '',
                            description: 'Set Assignee on the task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Assignee Status',
                            name: 'assignee_status',
                            type: 'options',
                            options: [
                                {
                                    name: 'Inbox',
                                    value: 'inbox',
                                },
                                {
                                    name: 'Today',
                                    value: 'today',
                                },
                                {
                                    name: 'Upcoming',
                                    value: 'upcoming',
                                },
                                {
                                    name: 'Later',
                                    value: 'later',
                                },
                            ],
                            default: 'inbox',
                            description: 'Set Assignee status on the task (requires Assignee)',
                        },
                        {
                            displayName: 'Completed',
                            name: 'completed',
                            type: 'boolean',
                            default: false,
                            description: 'Whether the task should be marked completed',
                        },
                        {
                            displayName: 'Due On',
                            name: 'due_on',
                            type: 'dateTime',
                            default: '',
                            description: 'Date on which the time is due',
                        },
                        {
                            displayName: 'Name',
                            name: 'name',
                            type: 'string',
                            default: '',
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'update',
                                    ],
                                },
                            },
                            description: 'The new name of the task',
                        },
                        {
                            displayName: 'Liked',
                            name: 'liked',
                            type: 'boolean',
                            default: false,
                            description: 'Whether the task is liked by the authorized user',
                        },
                        {
                            displayName: 'Notes',
                            name: 'notes',
                            type: 'string',
                            typeOptions: {
                                alwaysOpenEditWindow: true,
                                rows: 5,
                            },
                            default: '',
                            description: 'The task notes',
                        },
                        {
                            displayName: 'Project Names or IDs',
                            name: 'projects',
                            type: 'multiOptions',
                            typeOptions: {
                                loadOptionsMethod: 'getProjects',
                            },
                            default: [],
                            description: 'The project to filter tasks on. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                    ],
                },
                // ----------------------------------
                //         taskComment
                // ----------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'taskComment',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Add',
                            value: 'add',
                            description: 'Add a comment to a task',
                        },
                        {
                            name: 'Remove',
                            value: 'remove',
                            description: 'Remove a comment from a task',
                        },
                    ],
                    default: 'add',
                },
                // ----------------------------------
                //         taskComment:add
                // ----------------------------------
                {
                    displayName: 'Task ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'add',
                            ],
                            resource: [
                                'taskComment',
                            ],
                        },
                    },
                    description: 'The ID of the task to add the comment to',
                },
                {
                    displayName: 'Is Text HTML',
                    name: 'isTextHtml',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'add',
                            ],
                            resource: [
                                'taskComment',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether body is HTML or simple text',
                },
                {
                    displayName: 'Text',
                    name: 'text',
                    type: 'string',
                    default: '',
                    required: true,
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    displayOptions: {
                        show: {
                            operation: [
                                'add',
                            ],
                            resource: [
                                'taskComment',
                            ],
                            isTextHtml: [
                                false,
                            ],
                        },
                    },
                    description: 'The plain text of the comment to add',
                },
                {
                    displayName: 'HTML Text',
                    name: 'text',
                    type: 'string',
                    default: '',
                    required: true,
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    displayOptions: {
                        show: {
                            operation: [
                                'add',
                            ],
                            resource: [
                                'taskComment',
                            ],
                            isTextHtml: [
                                true,
                            ],
                        },
                    },
                    description: 'Comment as HTML string. Do not use together with plain text.',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            operation: [
                                'add',
                            ],
                            resource: [
                                'taskComment',
                            ],
                        },
                    },
                    default: {},
                    description: 'Properties of the task comment',
                    placeholder: 'Add Field',
                    options: [
                        {
                            displayName: 'Pinned',
                            name: 'is_pinned',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to pin the comment',
                        },
                    ],
                },
                // ----------------------------------
                //         taskComment:remove
                // ----------------------------------
                {
                    displayName: 'Comment ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'remove',
                            ],
                            resource: [
                                'taskComment',
                            ],
                        },
                    },
                    description: 'The ID of the comment to be removed',
                },
                // ----------------------------------
                //         taskProject
                // ----------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'taskProject',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Add',
                            value: 'add',
                            description: 'Add a task to a project',
                        },
                        {
                            name: 'Remove',
                            value: 'remove',
                            description: 'Remove a task from a project',
                        },
                    ],
                    default: 'add',
                },
                // ----------------------------------
                //         taskProject:add
                // ----------------------------------
                {
                    displayName: 'Task ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'add',
                            ],
                            resource: [
                                'taskProject',
                            ],
                        },
                    },
                    description: 'The ID of the task to add the project to',
                },
                {
                    displayName: 'Project Name or ID',
                    name: 'project',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getProjects',
                    },
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'add',
                            ],
                            resource: [
                                'taskProject',
                            ],
                        },
                    },
                    description: 'The project where the task will be added. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            resource: [
                                'taskProject',
                            ],
                            operation: [
                                'add',
                            ],
                        },
                    },
                    default: {},
                    description: 'Other properties to set',
                    placeholder: 'Add Field',
                    options: [
                        {
                            displayName: 'Insert After',
                            name: 'insert_after',
                            type: 'string',
                            default: '',
                            description: 'A task in the project to insert the task after, or null to insert at the beginning of the list',
                        },
                        {
                            displayName: 'Insert Before',
                            name: 'insert_before',
                            type: 'string',
                            default: '',
                            description: 'A task in the project to insert the task before, or null to insert at the end of the list',
                        },
                        {
                            displayName: 'Section',
                            name: 'section',
                            type: 'string',
                            default: '',
                            description: 'A section in the project to insert the task into. The task will be inserted at the bottom of the section.',
                        },
                    ],
                },
                // ----------------------------------
                //         taskProject:remove
                // ----------------------------------
                {
                    displayName: 'Task ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'remove',
                            ],
                            resource: [
                                'taskProject',
                            ],
                        },
                    },
                    description: 'The ID of the task to add the project to',
                },
                {
                    displayName: 'Project Name or ID',
                    name: 'project',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getProjects',
                    },
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'remove',
                            ],
                            resource: [
                                'taskProject',
                            ],
                        },
                    },
                    description: 'The project where the task will be removed from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                // ----------------------------------
                //         taskTag
                // ----------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'taskTag',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Add',
                            value: 'add',
                            description: 'Add a tag to a task',
                        },
                        {
                            name: 'Remove',
                            value: 'remove',
                            description: 'Remove a tag from a task',
                        },
                    ],
                    default: 'add',
                },
                // ----------------------------------
                //         taskTag:add
                // ----------------------------------
                {
                    displayName: 'Task ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'add',
                            ],
                            resource: [
                                'taskTag',
                            ],
                        },
                    },
                    description: 'The ID of the task to add the tag to',
                },
                {
                    displayName: 'Tags Name or ID',
                    name: 'tag',
                    type: 'options',
                    typeOptions: {
                        loadOptionsDependsOn: [
                            'id',
                        ],
                        loadOptionsMethod: 'getTags',
                    },
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'add',
                            ],
                            resource: [
                                'taskTag',
                            ],
                        },
                    },
                    description: 'The tag that should be added. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                // ----------------------------------
                //         taskTag:remove
                // ----------------------------------
                {
                    displayName: 'Task ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'remove',
                            ],
                            resource: [
                                'taskTag',
                            ],
                        },
                    },
                    description: 'The ID of the task to add the tag to',
                },
                {
                    displayName: 'Tags Name or ID',
                    name: 'tag',
                    type: 'options',
                    typeOptions: {
                        loadOptionsDependsOn: [
                            'id',
                        ],
                        loadOptionsMethod: 'getTags',
                    },
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'remove',
                            ],
                            resource: [
                                'taskTag',
                            ],
                        },
                    },
                    description: 'The tag that should be added. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                // ----------------------------------
                //         user
                // ----------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'user',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get a user',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all users',
                        },
                    ],
                    default: 'get',
                },
                // ----------------------------------
                //         user:get
                // ----------------------------------
                {
                    displayName: 'User ID',
                    name: 'userId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                            ],
                            resource: [
                                'user',
                            ],
                        },
                    },
                    description: 'An identifier for the user to get data of. Can be one of an email address,the globally unique identifier for the user, or the keyword me to indicate the current user making the request.',
                },
                // ----------------------------------
                //         user:getAll
                // ----------------------------------
                {
                    displayName: 'Workspace Name or ID',
                    name: 'workspace',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getWorkspaces',
                    },
                    options: [],
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'user',
                            ],
                        },
                    },
                    description: 'The workspace in which to get users. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                // ----------------------------------
                //         Project
                // ----------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'project',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a new project',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete a project',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get a project',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all projects',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update a project',
                        },
                    ],
                    default: 'get',
                },
                // ----------------------------------
                //         project:create
                // ----------------------------------
                {
                    displayName: 'Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                            resource: [
                                'project',
                            ],
                        },
                    },
                    description: 'The name of the project to create',
                },
                {
                    displayName: 'Workspace Name or ID',
                    name: 'workspace',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getWorkspaces',
                    },
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                            resource: [
                                'project',
                            ],
                        },
                    },
                    description: 'The workspace to create the project in. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Team Name or ID',
                    name: 'team',
                    type: 'options',
                    typeOptions: {
                        loadOptionsDependsOn: [
                            'workspace',
                        ],
                        loadOptionsMethod: 'getTeams',
                    },
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                            resource: [
                                'project',
                            ],
                        },
                    },
                    default: '',
                    description: 'The team this project will be assigned to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            resource: [
                                'project',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    default: {},
                    description: 'Other properties to set',
                    placeholder: 'Add Property',
                    options: [
                        {
                            displayName: 'Color',
                            name: 'color',
                            type: 'options',
                            options: (0, GenericFunctions_1.getColorOptions)(),
                            default: 'none',
                            description: 'Color of the project',
                        },
                        {
                            displayName: 'Due On',
                            name: 'due_on',
                            type: 'dateTime',
                            default: '',
                            description: 'The day on which this project is due. This takes a date with format YYYY-MM-DD.',
                        },
                        {
                            displayName: 'Notes',
                            name: 'notes',
                            type: 'string',
                            default: '',
                            description: 'Basic description or notes for the project',
                        },
                    ],
                },
                // ----------------------------------
                //         project:delete
                // ----------------------------------
                {
                    displayName: 'Project ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'delete',
                            ],
                            resource: [
                                'project',
                            ],
                        },
                    },
                },
                // ----------------------------------
                //         project:get
                // ----------------------------------
                {
                    displayName: 'Project ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                            ],
                            resource: [
                                'project',
                            ],
                        },
                    },
                },
                // ----------------------------------
                //         project:getAll
                // ----------------------------------
                {
                    displayName: 'Workspace Name or ID',
                    name: 'workspace',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getWorkspaces',
                    },
                    options: [],
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'project',
                            ],
                        },
                    },
                    description: 'The workspace in which to get users. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'project',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether to return all results or only up to a given limit',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'project',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                        maxValue: 500,
                    },
                    default: 100,
                    description: 'Max number of results to return',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            resource: [
                                'project',
                            ],
                            operation: [
                                'getAll',
                            ],
                        },
                    },
                    default: {},
                    description: 'Other properties to set',
                    placeholder: 'Add Property',
                    options: [
                        {
                            displayName: 'Archived',
                            name: 'archived',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to only return projects whose archived field takes on the value of this parameter',
                        },
                        {
                            displayName: 'Teams Name or ID',
                            name: 'team',
                            type: 'options',
                            typeOptions: {
                                loadOptionsDependsOn: [
                                    'workspace',
                                ],
                                loadOptionsMethod: 'getTeams',
                            },
                            default: '',
                            description: 'The new name of the task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                    ],
                },
                // ----------------------------------
                //         project:update
                // ----------------------------------
                {
                    displayName: 'Workspace Name or ID',
                    name: 'workspace',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getWorkspaces',
                    },
                    options: [],
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'update',
                            ],
                            resource: [
                                'project',
                            ],
                        },
                    },
                    description: 'The workspace in which to get users. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Project ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'update',
                            ],
                            resource: [
                                'project',
                            ],
                        },
                    },
                    description: 'The ID of the project to update the data of',
                },
                {
                    displayName: 'Update Fields',
                    name: 'updateFields',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            resource: [
                                'project',
                            ],
                            operation: [
                                'update',
                            ],
                        },
                    },
                    default: {},
                    description: 'Other properties to set',
                    placeholder: 'Add Property',
                    options: [
                        {
                            displayName: 'Color',
                            name: 'color',
                            type: 'options',
                            options: (0, GenericFunctions_1.getColorOptions)(),
                            default: 'none',
                            description: 'Color of the project',
                        },
                        {
                            displayName: 'Due On',
                            name: 'due_on',
                            type: 'dateTime',
                            default: '',
                            description: 'The day on which this project is due. This takes a date with format YYYY-MM-DD.',
                        },
                        {
                            displayName: 'Name',
                            name: 'name',
                            type: 'string',
                            default: '',
                            description: 'The name of the project',
                        },
                        {
                            displayName: 'Notes',
                            name: 'notes',
                            type: 'string',
                            default: '',
                            description: 'Basic description or notes for the project',
                        },
                        {
                            displayName: 'Owner',
                            name: 'owner',
                            type: 'string',
                            default: '',
                            description: 'The new assignee/cardinal for this project',
                        },
                        {
                            displayName: 'Team Name or ID',
                            name: 'team',
                            type: 'options',
                            typeOptions: {
                                loadOptionsDependsOn: [
                                    'workspace',
                                ],
                                loadOptionsMethod: 'getTeams',
                            },
                            default: '',
                            description: 'The team this project will be assigned to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available workspaces to display them to user so that he can
                // select them easily
                getWorkspaces: GenericFunctions_1.getWorkspaces,
                // Get all the available projects to display them to user so that they can be
                // selected easily
                getProjects() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const endpoint = '/projects';
                        const responseData = yield GenericFunctions_1.asanaApiRequest.call(this, 'GET', endpoint, {});
                        if (responseData.data === undefined) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, { message: 'No data got returned' });
                        }
                        const returnData = [];
                        for (const projectData of responseData.data) {
                            if (projectData.resource_type !== 'project') {
                                // Not sure if for some reason also ever other resources
                                // get returned but just in case filter them out
                                continue;
                            }
                            const projectName = projectData.name;
                            const projectId = projectData.gid;
                            returnData.push({
                                name: projectName,
                                value: projectId,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                // Get all the available sections in a project to display them to user so that they
                // can be selected easily
                getSections() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const projectId = this.getNodeParameter('projectId');
                        const endpoint = `/projects/${projectId}/sections`;
                        const responseData = yield GenericFunctions_1.asanaApiRequest.call(this, 'GET', endpoint, {});
                        if (responseData.data === undefined) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, { message: 'No data got returned' });
                        }
                        const returnData = [];
                        for (const sectionData of responseData.data) {
                            if (sectionData.resource_type !== 'section') {
                                // Not sure if for some reason also ever other resources
                                // get returned but just in case filter them out
                                continue;
                            }
                            returnData.push({
                                name: sectionData.name,
                                value: sectionData.gid,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                // Get all the available teams to display them to user so that he can
                // select them easily
                getTeams() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const workspaceId = this.getCurrentNodeParameter('workspace');
                        const workspace = yield GenericFunctions_1.asanaApiRequest.call(this, 'GET', `/workspaces/${workspaceId}`, {});
                        // if the workspace selected it's not an organization then error as they endpoint
                        // to retrieve the teams from an organization just work with workspaces that are an organization
                        if (workspace.is_organization === false) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'To filter by team, the workspace selected has to be an organization');
                        }
                        const endpoint = `/organizations/${workspaceId}/teams`;
                        const responseData = yield GenericFunctions_1.asanaApiRequestAllItems.call(this, 'GET', endpoint, {});
                        const returnData = [];
                        for (const teamData of responseData) {
                            if (teamData.resource_type !== 'team') {
                                // Not sure if for some reason also ever other resources
                                // get returned but just in case filter them out
                                continue;
                            }
                            returnData.push({
                                name: teamData.name,
                                value: teamData.gid,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                // Get all tags to display them to user so that they can be selected easily
                // See: https://developers.asana.com/docs/get-multiple-tags
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const endpoint = '/tags';
                        const taskId = this.getNodeParameter('id');
                        let taskData;
                        try {
                            taskData = yield GenericFunctions_1.asanaApiRequest.call(this, 'GET', `/tasks/${taskId}`, {});
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { message: `Could not find task with id "${taskId}" so tags could not be loaded.` });
                        }
                        const workspace = taskData.data.workspace.gid;
                        const responseData = yield GenericFunctions_1.asanaApiRequest.call(this, 'GET', endpoint, {}, { workspace });
                        if (responseData.data === undefined) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, { message: 'No data got returned' });
                        }
                        const returnData = [];
                        for (const tagData of responseData.data) {
                            if (tagData.resource_type !== 'tag') {
                                // Not sure if for some reason also ever other resources
                                // get returned but just in case filter them out
                                continue;
                            }
                            returnData.push({
                                name: tagData.name,
                                value: tagData.gid,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                // Get all users to display them to user so that they can be selected easily
                // See: https://developers.asana.com/docs/get-multiple-users
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const endpoint = `/users`;
                        const responseData = yield GenericFunctions_1.asanaApiRequest.call(this, 'GET', endpoint, {});
                        if (responseData.data === undefined) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, { message: 'No data got returned' });
                        }
                        const returnData = [];
                        for (const userData of responseData.data) {
                            if (userData.resource_type !== 'user') {
                                // Not sure if for some reason also ever other resources
                                // get returned but just in case filter them out
                                continue;
                            }
                            returnData.push({
                                name: userData.name,
                                value: userData.gid,
                            });
                        }
                        return returnData;
                    });
                },
                getTaskFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        for (const field of (0, GenericFunctions_1.getTaskFields)()) {
                            const value = (0, change_case_1.snakeCase)(field);
                            returnData.push({
                                name: field,
                                value: (value === '') ? '*' : value,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const timezone = this.getTimezone();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let endpoint = '';
            let requestMethod = 'GET';
            let body;
            let qs;
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    body = {};
                    qs = {};
                    if (resource === 'subtask') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         subtask:create
                            // ----------------------------------
                            const taskId = this.getNodeParameter('taskId', i);
                            requestMethod = 'POST';
                            endpoint = `/tasks/${taskId}/subtasks`;
                            body.name = this.getNodeParameter('name', i);
                            const otherProperties = this.getNodeParameter('otherProperties', i);
                            Object.assign(body, otherProperties);
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            // ----------------------------------
                            //        subtask:getAll
                            // ----------------------------------
                            const taskId = this.getNodeParameter('taskId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            requestMethod = 'GET';
                            endpoint = `/tasks/${taskId}/subtasks`;
                            Object.assign(qs, options);
                            if (qs.opt_fields) {
                                const fields = qs.opt_fields;
                                if (fields.includes('*')) {
                                    qs.opt_fields = (0, GenericFunctions_1.getTaskFields)().map((e) => (0, change_case_1.snakeCase)(e)).join(',');
                                }
                                else {
                                    qs.opt_fields = qs.opt_fields.join(',');
                                }
                            }
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                    }
                    if (resource === 'task') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         task:create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = '/tasks';
                            body.name = this.getNodeParameter('name', i);
                            // body.notes = this.getNodeParameter('taskNotes', 0) as string;
                            body.workspace = this.getNodeParameter('workspace', i);
                            const otherProperties = this.getNodeParameter('otherProperties', i);
                            Object.assign(body, otherProperties);
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         task:delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            endpoint = '/tasks/' + this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         task:get
                            // ----------------------------------
                            requestMethod = 'GET';
                            endpoint = '/tasks/' + this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //        task:getAll
                            // ----------------------------------
                            const filters = this.getNodeParameter('filters', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            requestMethod = 'GET';
                            endpoint = `/tasks`;
                            Object.assign(qs, filters);
                            if (qs.opt_fields) {
                                const fields = qs.opt_fields;
                                if (fields.includes('*')) {
                                    qs.opt_fields = (0, GenericFunctions_1.getTaskFields)().map((e) => (0, change_case_1.snakeCase)(e)).join(',');
                                }
                                else {
                                    qs.opt_fields = qs.opt_fields.join(',');
                                }
                            }
                            if (qs.modified_since) {
                                qs.modified_since = moment_timezone_1.default.tz(qs.modified_since, timezone).format();
                            }
                            if (qs.completed_since) {
                                qs.completed_since = moment_timezone_1.default.tz(qs.completed_since, timezone).format();
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.asanaApiRequestAllItems.call(this, requestMethod, endpoint, body, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                                responseData = responseData.data;
                            }
                        }
                        else if (operation === 'move') {
                            // ----------------------------------
                            //         task:move
                            // ----------------------------------
                            const sectionId = this.getNodeParameter('section', i);
                            requestMethod = 'POST';
                            endpoint = `/sections/${sectionId}/addTask`;
                            body.task = this.getNodeParameter('id', i);
                            Object.assign(body);
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = { success: true };
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         task:update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            endpoint = '/tasks/' + this.getNodeParameter('id', i);
                            const otherProperties = this.getNodeParameter('otherProperties', i);
                            Object.assign(body, otherProperties);
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                        }
                        else if (operation === 'search') {
                            // ----------------------------------
                            //         tasksearch
                            // ----------------------------------
                            const workspaceId = this.getNodeParameter('workspace', i);
                            requestMethod = 'GET';
                            endpoint = `/workspaces/${workspaceId}/tasks/search`;
                            const searchTaskProperties = this.getNodeParameter('searchTaskProperties', i);
                            Object.assign(qs, searchTaskProperties);
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                        }
                    }
                    if (resource === 'taskComment') {
                        if (operation === 'add') {
                            // ----------------------------------
                            //         taskComment:add
                            // ----------------------------------
                            const taskId = this.getNodeParameter('id', i);
                            const isTextHtml = this.getNodeParameter('isTextHtml', i);
                            if (!isTextHtml) {
                                body.text = this.getNodeParameter('text', i);
                            }
                            else {
                                body.html_text = this.getNodeParameter('text', i);
                            }
                            requestMethod = 'POST';
                            endpoint = `/tasks/${taskId}/stories`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                        }
                        if (operation === 'remove') {
                            // ----------------------------------
                            //         taskComment:remove
                            // ----------------------------------
                            const commentId = this.getNodeParameter('id', i);
                            requestMethod = 'DELETE';
                            endpoint = `/stories/${commentId}`;
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'taskTag') {
                        if (operation === 'add') {
                            // ----------------------------------
                            //         taskTag:add
                            // ----------------------------------
                            const taskId = this.getNodeParameter('id', i);
                            requestMethod = 'POST';
                            endpoint = `/tasks/${taskId}/addTag`;
                            body.tag = this.getNodeParameter('tag', i);
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = { success: true };
                        }
                        if (operation === 'remove') {
                            // ----------------------------------
                            //         taskTag:remove
                            // ----------------------------------
                            const taskId = this.getNodeParameter('id', i);
                            requestMethod = 'POST';
                            endpoint = `/tasks/${taskId}/removeTag`;
                            body.tag = this.getNodeParameter('tag', i);
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'taskProject') {
                        if (operation === 'add') {
                            // ----------------------------------
                            //         taskProject:add
                            // ----------------------------------
                            const taskId = this.getNodeParameter('id', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            requestMethod = 'POST';
                            endpoint = `/tasks/${taskId}/addProject`;
                            body.project = this.getNodeParameter('project', i);
                            Object.assign(body, additionalFields);
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = { success: true };
                        }
                        if (operation === 'remove') {
                            // ----------------------------------
                            //         taskProject:remove
                            // ----------------------------------
                            const taskId = this.getNodeParameter('id', i);
                            requestMethod = 'POST';
                            endpoint = `/tasks/${taskId}/removeProject`;
                            body.project = this.getNodeParameter('project', i);
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'user') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            const userId = this.getNodeParameter('userId', i);
                            requestMethod = 'GET';
                            endpoint = `/users/${userId}`;
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            const workspaceId = this.getNodeParameter('workspace', i);
                            requestMethod = 'GET';
                            endpoint = `/workspaces/${workspaceId}/users`;
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                        }
                    }
                    if (resource === 'project') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         project:create
                            // ----------------------------------
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const teamId = this.getNodeParameter('team', i);
                            // request parameters
                            requestMethod = 'POST';
                            endpoint = `/teams/${teamId}/projects`;
                            // required parameters
                            body.name = this.getNodeParameter('name', i);
                            body.workspace = this.getNodeParameter('workspace', i);
                            // optional parameters
                            if (additionalFields.color) {
                                qs.color = additionalFields.color;
                            }
                            if (additionalFields.due_on) {
                                qs.due_on = additionalFields.due_on;
                            }
                            if (additionalFields.notes) {
                                qs.notes = additionalFields.notes;
                            }
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                        }
                        if (operation === 'delete') {
                            // ----------------------------------
                            //         project:delete
                            // ----------------------------------
                            const projectId = this.getNodeParameter('id', i);
                            requestMethod = 'DELETE';
                            endpoint = `/projects/${projectId}`;
                            GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            // ----------------------------------
                            //         project:get
                            // ----------------------------------
                            const projectId = this.getNodeParameter('id', i);
                            requestMethod = 'GET';
                            endpoint = `/projects/${projectId}`;
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            // ----------------------------------
                            //        project:getAll
                            // ----------------------------------
                            const workspaceId = this.getNodeParameter('workspace', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            requestMethod = 'GET';
                            endpoint = `/projects`;
                            if (additionalFields.team) {
                                qs.team = additionalFields.team;
                            }
                            else {
                                qs.workspace = workspaceId;
                            }
                            if (additionalFields.archived) {
                                qs.archived = additionalFields.archived;
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.asanaApiRequestAllItems.call(this, requestMethod, endpoint, body, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                                responseData = responseData.data;
                            }
                        }
                        if (operation === 'update') {
                            // ----------------------------------
                            //        project:update
                            // ----------------------------------
                            const projectId = this.getNodeParameter('id', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            // request parameters
                            requestMethod = 'PUT';
                            endpoint = `/projects/${projectId}`;
                            // optional parameters
                            if (updateFields.color) {
                                qs.color = updateFields.color;
                            }
                            if (updateFields.due_on) {
                                qs.due_on = updateFields.due_on;
                            }
                            if (updateFields.name) {
                                body.name = updateFields.name;
                            }
                            if (updateFields.notes) {
                                qs.notes = updateFields.notes;
                            }
                            if (updateFields.owner) {
                                body.owner = updateFields.owner;
                            }
                            if (updateFields.team) {
                                body.team = updateFields.team;
                            }
                            responseData = yield GenericFunctions_1.asanaApiRequest.call(this, requestMethod, endpoint, body, qs);
                            responseData = responseData.data;
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
                        returnData.push(responseData);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Asana = Asana;
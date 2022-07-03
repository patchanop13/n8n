"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hubFields = exports.hubOperations = void 0;
const DestinationDescription_1 = require("./DestinationDescription");
exports.hubOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'hub',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new Onfleet hub',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all Onfleet hubs',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update an Onfleet hub',
            },
        ],
        default: 'getAll',
    },
];
const nameField = {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    description: 'A name to identify the hub',
};
const teamsField = {
    displayName: 'Team Names or IDs',
    name: 'teams',
    type: 'multiOptions',
    typeOptions: {
        loadOptionsMethod: 'getTeams',
    },
    default: [],
    description: 'These are the teams that this Hub will be assigned to. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
};
exports.hubFields = [
    {
        displayName: 'Hub ID',
        name: 'id',
        type: 'string',
        displayOptions: {
            show: {
                resource: [
                    'hub',
                ],
                operation: [
                    'update',
                ],
            },
        },
        default: '',
        required: true,
        description: 'The ID of the hub object for lookup',
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: [
                    'hub',
                ],
                operation: [
                    'getAll',
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
                resource: [
                    'hub',
                ],
                operation: [
                    'getAll',
                ],
                returnAll: [
                    false,
                ],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 64,
        },
        default: 64,
        description: 'Max number of results to return',
    },
    Object.assign(Object.assign({}, nameField), { displayOptions: {
            show: {
                resource: [
                    'hub',
                ],
                operation: [
                    'create',
                ],
            },
        }, required: true }),
    Object.assign(Object.assign({}, DestinationDescription_1.destinationExternalField), { displayOptions: {
            show: {
                resource: [
                    'hub',
                ],
                operation: [
                    'create',
                ],
            },
        } }),
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'hub',
                ],
                operation: [
                    'create',
                ],
            },
        },
        options: [
            Object.assign(Object.assign({}, teamsField), { required: false }),
        ],
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'hub',
                ],
                operation: [
                    'update',
                ],
            },
        },
        options: [
            Object.assign(Object.assign({}, DestinationDescription_1.destinationExternalField), { required: false }),
            nameField,
            Object.assign(Object.assign({}, teamsField), { required: false }),
        ],
    },
];

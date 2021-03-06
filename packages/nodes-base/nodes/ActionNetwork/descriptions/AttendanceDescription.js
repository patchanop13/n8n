"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceFields = exports.attendanceOperations = void 0;
const SharedFields_1 = require("./SharedFields");
exports.attendanceOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'attendance',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
            },
            {
                name: 'Get',
                value: 'get',
            },
            {
                name: 'Get All',
                value: 'getAll',
            },
        ],
        default: 'create',
    },
];
exports.attendanceFields = [
    // ----------------------------------------
    //            attendance: create
    // ----------------------------------------
    {
        displayName: 'Person ID',
        name: 'personId',
        description: 'ID of the person to create an attendance for',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'attendance',
                ],
                operation: [
                    'create',
                ],
            },
        },
    },
    {
        displayName: 'Event ID',
        name: 'eventId',
        description: 'ID of the event to create an attendance for',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'attendance',
                ],
                operation: [
                    'create',
                ],
            },
        },
    },
    (0, SharedFields_1.makeSimpleField)('attendance', 'create'),
    // ----------------------------------------
    //             attendance: get
    // ----------------------------------------
    {
        displayName: 'Event ID',
        name: 'eventId',
        description: 'ID of the event whose attendance to retrieve',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'attendance',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    {
        displayName: 'Attendance ID',
        name: 'attendanceId',
        description: 'ID of the attendance to retrieve',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'attendance',
                ],
                operation: [
                    'get',
                ],
            },
        },
    },
    (0, SharedFields_1.makeSimpleField)('attendance', 'get'),
    // ----------------------------------------
    //            attendance: getAll
    // ----------------------------------------
    {
        displayName: 'Event ID',
        name: 'eventId',
        description: 'ID of the event to create an attendance for',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'attendance',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
            show: {
                resource: [
                    'attendance',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        description: 'Max number of results to return',
        typeOptions: {
            minValue: 1,
        },
        displayOptions: {
            show: {
                resource: [
                    'attendance',
                ],
                operation: [
                    'getAll',
                ],
                returnAll: [
                    false,
                ],
            },
        },
    },
    (0, SharedFields_1.makeSimpleField)('attendance', 'getAll'),
];

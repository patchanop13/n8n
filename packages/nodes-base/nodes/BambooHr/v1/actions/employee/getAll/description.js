"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeGetAllDescription = void 0;
exports.employeeGetAllDescription = [
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: [
                    'employee',
                ],
                operation: [
                    'getAll',
                ],
            },
        },
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 5,
        typeOptions: {
            minValue: 1,
            maxValue: 1000,
        },
        displayOptions: {
            show: {
                resource: [
                    'employee',
                ],
                operation: [
                    'getAll',
                ],
                returnAll: [
                    false,
                ],
            },
        },
        description: 'Max number of results to return',
    },
];
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsFields = exports.smsOperations = void 0;
exports.smsOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'sms',
                ],
            },
        },
        options: [
            {
                name: 'Send',
                value: 'send',
                description: 'Send an SMS message',
            },
        ],
        default: 'send',
    },
];
exports.smsFields = [
    // ----------------------------------
    //           sms: send
    // ----------------------------------
    {
        displayName: 'From',
        name: 'from',
        type: 'string',
        default: '',
        description: 'Plivo Number to send the SMS from',
        placeholder: '+14156667777',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'sms',
                ],
                operation: [
                    'send',
                ],
            },
        },
    },
    {
        displayName: 'To',
        name: 'to',
        type: 'string',
        default: '',
        description: 'Phone number to send the message to',
        placeholder: '+14156667778',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'sms',
                ],
                operation: [
                    'send',
                ],
            },
        },
    },
    {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
        description: 'Message to send',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'send',
                ],
                resource: [
                    'sms',
                ],
            },
        },
    },
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentFields = exports.attachmentOperations = void 0;
exports.attachmentOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        noDataExpression: true,
        type: 'options',
        displayOptions: {
            show: {
                resource: [
                    'attachment',
                ],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Gets the metadata of a message attachment. The attachment data is fetched using the media API.',
            },
        ],
        default: 'get',
    },
];
exports.attachmentFields = [
    /* -------------------------------------------------------------------------- */
    /*                                 attachments:get                              */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Attachment Name',
        name: 'attachmentName',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'attachment',
                ],
                operation: [
                    'get',
                ],
            },
        },
        default: '',
        description: 'Resource name of the attachment, in the form "spaces/*/messages/*/attachments/*"',
    },
];

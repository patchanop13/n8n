"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailFields = exports.emailOperations = void 0;
exports.emailOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'email',
                ],
            },
        },
        options: [
            {
                name: 'Create Record',
                value: 'createRecord',
                description: 'Create a record of an email sent to a contact',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Retrieve all sent emails',
            },
            {
                name: 'Send',
                value: 'send',
                description: 'Send Email',
            },
        ],
        default: 'createRecord',
    },
];
exports.emailFields = [
    /* -------------------------------------------------------------------------- */
    /*                                 email:createRecord                         */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Sent To Address',
        name: 'sentToAddress',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'createRecord',
                ],
                resource: [
                    'email',
                ],
            },
        },
        default: '',
    },
    {
        displayName: 'Sent From Address',
        name: 'sentFromAddress',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'createRecord',
                ],
                resource: [
                    'email',
                ],
            },
        },
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                operation: [
                    'createRecord',
                ],
                resource: [
                    'email',
                ],
            },
        },
        options: [
            {
                displayName: 'Clicked Date',
                name: 'clickedDate',
                type: 'dateTime',
                default: '',
            },
            {
                displayName: 'Contact ID',
                name: 'contactId',
                type: 'number',
                typeOptions: {
                    minValue: 0,
                },
                default: 0,
            },
            {
                displayName: 'Headers',
                name: 'headers',
                type: 'string',
                default: '',
            },
            {
                displayName: 'HTML Content',
                name: 'htmlContent',
                type: 'string',
                default: '',
                description: 'Base64 encoded HTML',
            },
            {
                displayName: 'Opened Date',
                name: 'openedDate',
                type: 'dateTime',
                default: '',
            },
            {
                displayName: 'Original Provider',
                name: 'originalProvider',
                type: 'options',
                options: [
                    {
                        name: 'Unknown',
                        value: 'UNKNOWN',
                    },
                    {
                        name: 'Infusionsoft',
                        value: 'INFUSIONSOFT',
                    },
                    {
                        name: 'Microsoft',
                        value: 'MICROSOFT',
                    },
                    {
                        name: 'Google',
                        value: 'GOOGLE',
                    },
                ],
                default: 'UNKNOWN',
                description: 'Provider that sent the email case insensitive, must be in list',
            },
            {
                displayName: 'Original Provider ID',
                name: 'originalProviderId',
                type: 'string',
                default: '',
                description: 'Provider ID that sent the email, must be unique when combined with provider. If omitted a UUID without dashes is autogenerated for the record.',
            },
            {
                displayName: 'Plain Content',
                name: 'plainContent',
                type: 'string',
                default: '',
                description: 'Base64 encoded text',
            },
            {
                displayName: 'Provider Source ID',
                name: 'providerSourceId',
                type: 'string',
                default: 'The email address of the synced email account that generated this message.',
            },
            {
                displayName: 'Received Date',
                name: 'receivedDate',
                type: 'dateTime',
                default: '',
            },
            {
                displayName: 'Sent Date',
                name: 'sentDate',
                type: 'dateTime',
                default: '',
            },
            {
                displayName: 'Sent From Reply Address',
                name: 'sentFromReplyAddress',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Sent To Bcc Addresses',
                name: 'sentToBccAddresses',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Sent To CC Addresses',
                name: 'sentToCCAddresses',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Subject',
                name: 'subject',
                type: 'string',
                default: '',
            },
        ],
    },
    /* -------------------------------------------------------------------------- */
    /*                                 email:getAll                               */
    /* -------------------------------------------------------------------------- */
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
                    'email',
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
                    'email',
                ],
                returnAll: [
                    false,
                ],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 200,
        },
        default: 100,
        description: 'Max number of results to return',
    },
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
            show: {
                operation: [
                    'getAll',
                ],
                resource: [
                    'email',
                ],
            },
        },
        options: [
            {
                displayName: 'Contact ID',
                name: 'contactId',
                type: 'number',
                typeOptions: {
                    minValue: 0,
                },
                default: 0,
            },
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@email.com',
                default: '',
            },
            {
                displayName: 'Since Sent Date',
                name: 'sinceSentDate',
                type: 'dateTime',
                default: '',
                description: 'Emails sent since the provided date, must be present if untilDate is provided',
            },
            {
                displayName: 'Until Sent Date',
                name: 'untilSentDate',
                type: 'dateTime',
                default: '',
                description: 'Email sent until the provided date',
            },
        ],
    },
    /* -------------------------------------------------------------------------- */
    /*                                 email:send                                 */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'User Name or ID',
        name: 'userId',
        type: 'options',
        required: true,
        typeOptions: {
            loadOptionsMethod: 'getUsers',
        },
        displayOptions: {
            show: {
                operation: [
                    'send',
                ],
                resource: [
                    'email',
                ],
            },
        },
        default: '',
        description: 'The infusionsoft user to send the email on behalf of. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
    },
    {
        displayName: 'Contact IDs',
        name: 'contactIds',
        type: 'string',
        displayOptions: {
            show: {
                operation: [
                    'send',
                ],
                resource: [
                    'email',
                ],
            },
        },
        default: '',
        description: 'Contact IDs to receive the email. Multiple can be added seperated by comma.',
    },
    {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        displayOptions: {
            show: {
                operation: [
                    'send',
                ],
                resource: [
                    'email',
                ],
            },
        },
        default: '',
        description: 'The subject line of the email',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                operation: [
                    'send',
                ],
                resource: [
                    'email',
                ],
            },
        },
        options: [
            {
                displayName: 'Address Field',
                name: 'addressField',
                type: 'string',
                default: '',
                description: 'Email field of each Contact record to address the email to, such as \'EmailAddress1\', \'EmailAddress2\', \'EmailAddress3\', defaulting to the contact\'s primary email',
            },
            {
                displayName: 'HTML Content',
                name: 'htmlContent',
                type: 'string',
                default: '',
                description: 'The HTML-formatted content of the email, encoded in Base64',
            },
            {
                displayName: 'Plain Content',
                name: 'plainContent',
                type: 'string',
                default: '',
                description: 'The plain-text content of the email, encoded in Base64',
            },
        ],
    },
    {
        displayName: 'Attachments',
        name: 'attachmentsUi',
        placeholder: 'Add Attachments',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        displayOptions: {
            show: {
                operation: [
                    'send',
                ],
                resource: [
                    'email',
                ],
            },
        },
        options: [
            {
                name: 'attachmentsValues',
                displayName: 'Attachments Values',
                values: [
                    {
                        displayName: 'File Data',
                        name: 'fileData',
                        type: 'string',
                        typeOptions: {
                            alwaysOpenEditWindow: true,
                        },
                        default: '',
                        description: 'The content of the attachment, encoded in Base64',
                    },
                    {
                        displayName: 'File Name',
                        name: 'fileName',
                        type: 'string',
                        default: '',
                        description: 'The filename of the attached file, including extension',
                    },
                ],
            },
            {
                name: 'attachmentsBinary',
                displayName: 'Attachments Binary',
                values: [
                    {
                        displayName: 'Property',
                        name: 'property',
                        type: 'string',
                        default: '',
                        description: 'Name of the binary properties which contain data which should be added to email as attachment',
                    },
                ],
            },
        ],
        default: {},
        description: 'Attachments to be sent with each copy of the email, maximum of 10 with size of 1MB each',
    },
];

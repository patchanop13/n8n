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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsSes = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
function setParameter(params, base, values) {
    for (let i = 0; i < values.length; i++) {
        params.push(`${base}.${i + 1}=${values[i]}`);
    }
}
class AwsSes {
    constructor() {
        this.description = {
            displayName: 'AWS SES',
            name: 'awsSes',
            icon: 'file:ses.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Sends data to AWS SES',
            defaults: {
                name: 'AWS SES',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'aws',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Custom Verification Email',
                            value: 'customVerificationEmail',
                        },
                        {
                            name: 'Email',
                            value: 'email',
                        },
                        {
                            name: 'Template',
                            value: 'template',
                        },
                    ],
                    default: 'email',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a new custom verification email template',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete an existing custom verification email template',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get the custom email verification template',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all the existing custom verification email templates for your account',
                        },
                        {
                            name: 'Send',
                            value: 'send',
                            description: 'Add an email address to the list of identities',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update an existing custom verification email template',
                        },
                    ],
                    default: 'create',
                },
                {
                    displayName: 'From Email',
                    name: 'fromEmailAddress',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    required: true,
                    description: 'The email address that the custom verification email is sent from',
                    default: '',
                },
                {
                    displayName: 'Template Name',
                    name: 'templateName',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    default: '',
                    description: 'The name of the custom verification email template',
                },
                {
                    displayName: 'Template Content',
                    name: 'templateContent',
                    type: 'string',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    description: 'The content of the custom verification email. The total size of the email must be less than 10 MB. The message body may contain HTML',
                    default: '',
                },
                {
                    displayName: 'Template Subject',
                    name: 'templateSubject',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The subject line of the custom verification email',
                },
                {
                    displayName: 'Success Redirection URL',
                    name: 'successRedirectionURL',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    required: true,
                    description: 'The URL that the recipient of the verification email is sent to if his or her address is successfully verified',
                    default: '',
                },
                {
                    displayName: 'Failure Redirection URL',
                    name: 'failureRedirectionURL',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    required: true,
                    description: 'The URL that the recipient of the verification email is sent to if his or her address is not successfully verified',
                    default: '',
                },
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    placeholder: 'name@email.com',
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
                            ],
                            operation: [
                                'send',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The email address to verify',
                },
                {
                    displayName: 'Template Name',
                    name: 'templateName',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
                            ],
                            operation: [
                                'send',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The name of the custom verification email template to use when sending the verification email',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
                            ],
                            operation: [
                                'send',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Configuration Set Name',
                            name: 'configurationSetName',
                            type: 'string',
                            description: 'Name of a configuration set to use when sending the verification email',
                            default: '',
                        },
                    ],
                },
                {
                    displayName: 'Template Name',
                    name: 'templateName',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
                            ],
                            operation: [
                                'update',
                                'delete',
                                'get',
                            ],
                        },
                    },
                    default: '',
                    description: 'The name of the custom verification email template',
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
                                'customVerificationEmail',
                            ],
                            operation: [
                                'update',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Failure Redirection URL',
                            name: 'failureRedirectionURL',
                            type: 'string',
                            description: 'The URL that the recipient of the verification email is sent to if his or her address is not successfully verified',
                            default: '',
                        },
                        {
                            displayName: 'From Email',
                            name: 'fromEmailAddress',
                            type: 'string',
                            description: 'The email address that the custom verification email is sent from',
                            default: '',
                        },
                        {
                            displayName: 'Success Redirection URL',
                            name: 'successRedirectionURL',
                            type: 'string',
                            description: 'The URL that the recipient of the verification email is sent to if his or her address is successfully verified',
                            default: '',
                        },
                        {
                            displayName: 'Template Content',
                            name: 'templateContent',
                            type: 'string',
                            typeOptions: {
                                alwaysOpenEditWindow: true,
                            },
                            description: 'The content of the custom verification email. The total size of the email must be less than 10 MB. The message body may contain HTML',
                            default: '',
                        },
                        {
                            displayName: 'Template Subject',
                            name: 'templateSubject',
                            type: 'string',
                            default: '',
                            description: 'The subject line of the custom verification email',
                        },
                    ],
                },
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
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
                    typeOptions: {
                        minValue: 1,
                    },
                    description: 'Max number of results to return',
                    default: 20,
                    displayOptions: {
                        show: {
                            resource: [
                                'customVerificationEmail',
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
                            name: 'Send',
                            value: 'send',
                        },
                        {
                            name: 'Send Template',
                            value: 'sendTemplate',
                        },
                    ],
                    default: 'send',
                },
                {
                    displayName: 'Is Body HTML',
                    name: 'isBodyHtml',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                            operation: [
                                'send',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether body is HTML or simple text',
                },
                {
                    displayName: 'Subject',
                    name: 'subject',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                            operation: [
                                'send',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                },
                {
                    displayName: 'Body',
                    name: 'body',
                    type: 'string',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                            operation: [
                                'send',
                            ],
                        },
                    },
                    default: '',
                    description: 'The message to be sent',
                    required: true,
                },
                {
                    displayName: 'From Email',
                    name: 'fromEmail',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                            operation: [
                                'send',
                            ],
                        },
                    },
                    required: true,
                    description: 'Email address of the sender',
                    placeholder: 'admin@example.com',
                    default: '',
                },
                {
                    displayName: 'To Addresses',
                    name: 'toAddresses',
                    type: 'string',
                    description: 'Email addresses of the recipients',
                    typeOptions: {
                        multipleValues: true,
                        multipleValueButtonText: 'Add To Email',
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                            operation: [
                                'send',
                            ],
                        },
                    },
                    placeholder: 'info@example.com',
                    default: [],
                },
                {
                    displayName: 'Template Name or ID',
                    name: 'templateName',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getTemplates',
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                            operation: [
                                'sendTemplate',
                            ],
                        },
                    },
                    default: '',
                    description: 'The ARN of the template to use when sending this email. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'From Email',
                    name: 'fromEmail',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                            operation: [
                                'sendTemplate',
                            ],
                        },
                    },
                    required: true,
                    description: 'Email address of the sender',
                    placeholder: 'admin@example.com',
                    default: '',
                },
                {
                    displayName: 'To Addresses',
                    name: 'toAddresses',
                    type: 'string',
                    description: 'Email addresses of the recipients',
                    typeOptions: {
                        multipleValues: true,
                        multipleValueButtonText: 'Add To Email',
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                            operation: [
                                'sendTemplate',
                            ],
                        },
                    },
                    placeholder: 'info@example.com',
                    default: [],
                },
                {
                    displayName: 'Template Data',
                    name: 'templateDataUi',
                    type: 'fixedCollection',
                    placeholder: 'Add Data',
                    typeOptions: {
                        multipleValues: true,
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                            operation: [
                                'sendTemplate',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Data',
                            name: 'templateDataValues',
                            values: [
                                {
                                    displayName: 'Key',
                                    name: 'key',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'string',
                                    default: '',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                            operation: [
                                'send',
                                'sendTemplate',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Bcc Addresses',
                            name: 'bccAddresses',
                            type: 'string',
                            typeOptions: {
                                multipleValues: true,
                                multipleValueButtonText: 'Add Bcc Email',
                            },
                            description: 'Bcc Recipients of the email',
                            default: [],
                        },
                        {
                            displayName: 'Cc Addresses',
                            name: 'ccAddresses',
                            type: 'string',
                            typeOptions: {
                                multipleValues: true,
                                multipleValueButtonText: 'Add Cc Email',
                            },
                            description: 'Cc recipients of the email',
                            default: [],
                        },
                        {
                            displayName: 'Configuration Set Name',
                            name: 'configurationSetName',
                            type: 'string',
                            description: 'Name of the configuration set to use when you send an email using send',
                            default: '',
                        },
                        {
                            displayName: 'Reply To Addresses',
                            name: 'replyToAddresses',
                            type: 'string',
                            typeOptions: {
                                multipleValues: true,
                                multipleValueButtonText: 'Add Reply To Email',
                            },
                            placeholder: 'Add Reply Address',
                            description: 'Reply-to email address(es) for the message',
                            default: [],
                        },
                        {
                            displayName: 'Return Path',
                            name: 'returnPath',
                            type: 'string',
                            description: 'Email address that bounces and complaints will be forwarded to when feedback forwarding is enabled',
                            default: '',
                        },
                        {
                            displayName: 'Return Path ARN',
                            name: 'returnPathArn',
                            type: 'string',
                            default: '',
                            description: 'This parameter is used only for sending authorization',
                        },
                        {
                            displayName: 'Source ARN',
                            name: 'sourceArn',
                            type: 'string',
                            description: 'This parameter is used only for sending authorization',
                            default: '',
                        },
                    ],
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'template',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a template',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete a template',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get a template',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all templates',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update a template',
                        },
                    ],
                    default: 'create',
                },
                {
                    displayName: 'Template Name',
                    name: 'templateName',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'template',
                            ],
                            operation: [
                                'update',
                                'create',
                                'get',
                                'delete',
                            ],
                        },
                    },
                    required: true,
                    description: 'The name of the template',
                    default: '',
                },
                {
                    displayName: 'Subject Part',
                    name: 'subjectPart',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'template',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    description: 'The subject line of the email',
                    default: '',
                },
                {
                    displayName: 'Html Part',
                    name: 'htmlPart',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'template',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    description: 'The HTML body of the email',
                    default: '',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'template',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Text Part',
                            name: 'textPart',
                            type: 'string',
                            description: 'The email body that will be visible to recipients whose email clients do not display HTML',
                            default: '',
                        },
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
                                'template',
                            ],
                            operation: [
                                'update',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Text Part',
                            name: 'textPart',
                            type: 'string',
                            description: 'The email body that will be visible to recipients whose email clients do not display HTML',
                            default: '',
                        },
                        {
                            displayName: 'Subject Part',
                            name: 'subjectPart',
                            type: 'string',
                            description: 'The subject line of the email',
                            default: '',
                        },
                        {
                            displayName: 'Html Part',
                            name: 'htmlPart',
                            type: 'string',
                            description: 'The HTML body of the email',
                            default: '',
                        },
                    ],
                },
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            resource: [
                                'template',
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
                    typeOptions: {
                        minValue: 1,
                    },
                    description: 'Max number of results to return',
                    default: 20,
                    displayOptions: {
                        show: {
                            resource: [
                                'template',
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
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available templates to display them to user so that he can
                // select them easily
                getTemplates() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const templates = yield GenericFunctions_1.awsApiRequestSOAPAllItems.call(this, 'ListTemplatesResponse.ListTemplatesResult.TemplatesMetadata.member', 'email', 'POST', '/?Action=ListTemplates');
                        for (const template of templates) {
                            const templateName = template.Name;
                            const templateId = template.Name;
                            returnData.push({
                                name: templateName,
                                value: templateId,
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
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'customVerificationEmail') {
                        if (operation === 'create') {
                            const failureRedirectionURL = this.getNodeParameter('failureRedirectionURL', i);
                            const email = this.getNodeParameter('fromEmailAddress', i);
                            const successRedirectionURL = this.getNodeParameter('successRedirectionURL', i);
                            const templateContent = this.getNodeParameter('templateContent', i);
                            const templateName = this.getNodeParameter('templateName', i);
                            const templateSubject = this.getNodeParameter('templateSubject', i);
                            const params = [
                                `Action=CreateCustomVerificationEmailTemplate`,
                                `FailureRedirectionURL=${failureRedirectionURL}`,
                                `FromEmailAddress=${email}`,
                                `SuccessRedirectionURL=${successRedirectionURL}`,
                                `TemplateContent=${templateContent}`,
                                `TemplateName=${templateName}`,
                                `TemplateSubject=${templateSubject}`,
                            ];
                            responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'POST', '', params.join('&'));
                            responseData = responseData.CreateCustomVerificationEmailTemplateResponse;
                        }
                        if (operation === 'delete') {
                            const templateName = this.getNodeParameter('templateName', i);
                            const params = [
                                `Action=DeleteCustomVerificationEmailTemplate`,
                                `TemplateName=${templateName}`,
                            ];
                            responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'POST', '', params.join('&'));
                            responseData = responseData.DeleteCustomVerificationEmailTemplateResponse;
                        }
                        if (operation === 'get') {
                            const templateName = this.getNodeParameter('templateName', i);
                            const params = [
                                `TemplateName=${templateName}`,
                            ];
                            responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'POST', '/?Action=GetCustomVerificationEmailTemplate&' + params.join('&'));
                            responseData = responseData.GetCustomVerificationEmailTemplateResponse;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.awsApiRequestSOAPAllItems.call(this, 'ListCustomVerificationEmailTemplatesResponse.ListCustomVerificationEmailTemplatesResult.CustomVerificationEmailTemplates.member', 'email', 'POST', '/?Action=ListCustomVerificationEmailTemplates');
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'GET', `/?Action=ListCustomVerificationEmailTemplates&MaxResults=${limit}`);
                                responseData = responseData.ListCustomVerificationEmailTemplatesResponse.ListCustomVerificationEmailTemplatesResult.CustomVerificationEmailTemplates.member;
                            }
                        }
                        if (operation === 'send') {
                            const email = this.getNodeParameter('email', i);
                            const templateName = this.getNodeParameter('templateName', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const params = [
                                `Action=SendCustomVerificationEmail`,
                                `TemplateName=${templateName}`,
                                `EmailAddress=${email}`,
                            ];
                            if (additionalFields.configurationSetName) {
                                params.push(`ConfigurationSetName=${additionalFields.configurationSetName}`);
                            }
                            responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'POST', '', params.join('&'));
                            responseData = responseData.SendCustomVerificationEmailResponse;
                        }
                        if (operation === 'update') {
                            const templateName = this.getNodeParameter('templateName', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const params = [
                                `Action=UpdateCustomVerificationEmailTemplate`,
                                `TemplateName=${templateName}`,
                            ];
                            if (updateFields.FailureRedirectionURL) {
                                params.push(`FailureRedirectionURL=${updateFields.FailureRedirectionURL}`);
                            }
                            if (updateFields.email) {
                                params.push(`FromEmailAddress=${updateFields.email}`);
                            }
                            if (updateFields.successRedirectionURL) {
                                params.push(`SuccessRedirectionURL=${updateFields.successRedirectionURL}`);
                            }
                            if (updateFields.templateContent) {
                                params.push(`TemplateContent=${updateFields.templateContent}`);
                            }
                            if (updateFields.templateSubject) {
                                params.push(`TemplateSubject=${updateFields.templateSubject}`);
                            }
                            responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'POST', '', params.join('&'));
                            responseData = responseData.UpdateCustomVerificationEmailTemplateResponse;
                        }
                    }
                    if (resource === 'email') {
                        if (operation === 'send') {
                            const toAddresses = this.getNodeParameter('toAddresses', i);
                            const message = this.getNodeParameter('body', i);
                            const subject = this.getNodeParameter('subject', i);
                            const fromEmail = this.getNodeParameter('fromEmail', i);
                            const isBodyHtml = this.getNodeParameter('isBodyHtml', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const params = [
                                `Message.Subject.Data=${subject}`,
                                `Source=${fromEmail}`,
                            ];
                            if (isBodyHtml) {
                                params.push(`Message.Body.Html.Data=${encodeURIComponent(message)}`);
                                params.push(`Message.Body.Html.Charset=UTF-8`);
                            }
                            else {
                                params.push(`Message.Body.Text.Data=${encodeURIComponent(message)}`);
                            }
                            if (toAddresses.length) {
                                setParameter(params, 'Destination.ToAddresses.member', toAddresses);
                            }
                            else {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one "To Address" has to be added!');
                            }
                            if (additionalFields.configurationSetName) {
                                params.push(`ConfigurationSetName=${additionalFields.configurationSetName}`);
                            }
                            if (additionalFields.returnPath) {
                                params.push(`ReturnPath=${additionalFields.returnPath}`);
                            }
                            if (additionalFields.returnPathArn) {
                                params.push(`ReturnPathArn=${additionalFields.returnPathArn}`);
                            }
                            if (additionalFields.sourceArn) {
                                params.push(`SourceArn=${additionalFields.sourceArn}`);
                            }
                            if (additionalFields.replyToAddresses) {
                                setParameter(params, 'ReplyToAddresses.member', additionalFields.replyToAddresses);
                            }
                            if (additionalFields.bccAddresses) {
                                setParameter(params, 'Destination.BccAddresses.member', additionalFields.bccAddresses);
                            }
                            if (additionalFields.ccAddresses) {
                                setParameter(params, 'Destination.CcAddresses.member', additionalFields.ccAddresses);
                            }
                            responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'POST', '/?Action=SendEmail&' + params.join('&'));
                        }
                        if (operation === 'sendTemplate') {
                            const toAddresses = this.getNodeParameter('toAddresses', i);
                            const template = this.getNodeParameter('templateName', i);
                            const fromEmail = this.getNodeParameter('fromEmail', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const templateDataUi = this.getNodeParameter('templateDataUi', i);
                            const params = [
                                `Template=${template}`,
                                `Source=${fromEmail}`,
                            ];
                            if (toAddresses.length) {
                                setParameter(params, 'Destination.ToAddresses.member', toAddresses);
                            }
                            else {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one "To Address" has to be added!');
                            }
                            if (additionalFields.configurationSetName) {
                                params.push(`ConfigurationSetName=${additionalFields.configurationSetName}`);
                            }
                            if (additionalFields.returnPath) {
                                params.push(`ReturnPath=${additionalFields.returnPath}`);
                            }
                            if (additionalFields.returnPathArn) {
                                params.push(`ReturnPathArn=${additionalFields.returnPathArn}`);
                            }
                            if (additionalFields.sourceArn) {
                                params.push(`SourceArn=${additionalFields.sourceArn}`);
                            }
                            if (additionalFields.replyToAddresses) {
                                setParameter(params, 'ReplyToAddresses.member', additionalFields.replyToAddresses);
                            }
                            if (additionalFields.bccAddresses) {
                                setParameter(params, 'Destination.BccAddresses.member', additionalFields.bccAddresses);
                            }
                            if (additionalFields.ccAddresses) {
                                setParameter(params, 'Destination.CcAddresses.member', additionalFields.ccAddresses);
                            }
                            if (templateDataUi) {
                                const templateDataValues = templateDataUi.templateDataValues;
                                const templateData = {};
                                if (templateDataValues !== undefined) {
                                    for (const templateDataValue of templateDataValues) {
                                        //@ts-ignore
                                        templateData[templateDataValue.key] = templateDataValue.value;
                                    }
                                    params.push(`TemplateData=${JSON.stringify(templateData)}`);
                                }
                            }
                            responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'POST', '/?Action=SendTemplatedEmail&' + params.join('&'));
                            responseData = responseData.SendTemplatedEmailResponse;
                        }
                    }
                    if (resource === 'template') {
                        if (operation === 'create') {
                            const templateName = this.getNodeParameter('templateName', i);
                            const subjectPart = this.getNodeParameter('subjectPart', i);
                            const htmlPart = this.getNodeParameter('htmlPart', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const params = [
                                `Template.TemplateName=${templateName}`,
                                `Template.SubjectPart=${subjectPart}`,
                                `Template.HtmlPart=<h1>${htmlPart}</h1>`,
                            ];
                            if (additionalFields.textPart) {
                                params.push(`Template.TextPart=${additionalFields.textPart}`);
                            }
                            responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'POST', '/?Action=CreateTemplate&' + params.join('&'));
                            responseData = responseData.CreateTemplateResponse;
                        }
                        if (operation === 'delete') {
                            const templateName = this.getNodeParameter('templateName', i);
                            const params = [
                                `TemplateName=${templateName}`,
                            ];
                            responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'POST', '/?Action=DeleteTemplate&' + params.join('&'));
                            responseData = responseData.DeleteTemplateResponse;
                        }
                        if (operation === 'get') {
                            const templateName = this.getNodeParameter('templateName', i);
                            const params = [
                                `TemplateName=${templateName}`,
                            ];
                            responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'POST', '/?Action=GetTemplate&' + params.join('&'));
                            responseData = responseData.GetTemplateResponse;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.awsApiRequestSOAPAllItems.call(this, 'ListTemplatesResponse.ListTemplatesResult.TemplatesMetadata.member', 'email', 'POST', '/?Action=ListTemplates');
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'GET', `/?Action=ListTemplates&MaxItems=${limit}`);
                                responseData = responseData.ListTemplatesResponse.ListTemplatesResult.TemplatesMetadata.member;
                            }
                        }
                        if (operation === 'update') {
                            const templateName = this.getNodeParameter('templateName', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const params = [
                                `Template.TemplateName=${templateName}`,
                            ];
                            if (updateFields.textPart) {
                                params.push(`Template.TextPart=${updateFields.textPart}`);
                            }
                            if (updateFields.subjectPart) {
                                params.push(`Template.SubjectPart=${updateFields.subjectPart}`);
                            }
                            if (updateFields.subjectPart) {
                                params.push(`Template.HtmlPart=${updateFields.htmlPart}`);
                            }
                            responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'email', 'POST', '/?Action=UpdateTemplate&' + params.join('&'));
                            responseData = responseData.UpdateTemplateResponse;
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
                        if (responseData !== undefined) {
                            returnData.push(responseData);
                        }
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
exports.AwsSes = AwsSes;

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
exports.Mailgun = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Mailgun {
    constructor() {
        this.description = {
            displayName: 'Mailgun',
            name: 'mailgun',
            icon: 'file:mailgun.svg',
            group: ['output'],
            version: 1,
            description: 'Sends an email via Mailgun',
            defaults: {
                name: 'Mailgun',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mailgunApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'From Email',
                    name: 'fromEmail',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'Admin <admin@example.com>',
                    description: 'Email address of the sender optional with name',
                },
                {
                    displayName: 'To Email',
                    name: 'toEmail',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'info@example.com',
                    description: 'Email address of the recipient. Multiple ones can be separated by comma.',
                },
                {
                    displayName: 'Cc Email',
                    name: 'ccEmail',
                    type: 'string',
                    default: '',
                    placeholder: '',
                    description: 'Cc Email address of the recipient. Multiple ones can be separated by comma.',
                },
                {
                    displayName: 'Bcc Email',
                    name: 'bccEmail',
                    type: 'string',
                    default: '',
                    placeholder: '',
                    description: 'Bcc Email address of the recipient. Multiple ones can be separated by comma.',
                },
                {
                    displayName: 'Subject',
                    name: 'subject',
                    type: 'string',
                    default: '',
                    placeholder: 'My subject line',
                    description: 'Subject line of the email',
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
                    description: 'Plain text message of email',
                },
                {
                    displayName: 'HTML',
                    name: 'html',
                    type: 'string',
                    typeOptions: {
                        rows: 5,
                    },
                    default: '',
                    description: 'HTML text message of email',
                },
                {
                    displayName: 'Attachments',
                    name: 'attachments',
                    type: 'string',
                    default: '',
                    description: 'Name of the binary properties which contain data which should be added to email as attachment. Multiple ones can be comma-separated.',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let item;
            for (let itemIndex = 0; itemIndex < length; itemIndex++) {
                try {
                    item = items[itemIndex];
                    const fromEmail = this.getNodeParameter('fromEmail', itemIndex);
                    const toEmail = this.getNodeParameter('toEmail', itemIndex);
                    const ccEmail = this.getNodeParameter('ccEmail', itemIndex);
                    const bccEmail = this.getNodeParameter('bccEmail', itemIndex);
                    const subject = this.getNodeParameter('subject', itemIndex);
                    const text = this.getNodeParameter('text', itemIndex);
                    const html = this.getNodeParameter('html', itemIndex);
                    const attachmentPropertyString = this.getNodeParameter('attachments', itemIndex);
                    const credentials = yield this.getCredentials('mailgunApi');
                    const formData = {
                        from: fromEmail,
                        to: toEmail,
                        subject,
                        text,
                        html,
                    };
                    if (ccEmail.length !== 0) {
                        formData.cc = ccEmail;
                    }
                    if (bccEmail.length !== 0) {
                        formData.bcc = bccEmail;
                    }
                    if (attachmentPropertyString && item.binary) {
                        const attachments = [];
                        const attachmentProperties = attachmentPropertyString.split(',').map((propertyName) => {
                            return propertyName.trim();
                        });
                        for (const propertyName of attachmentProperties) {
                            if (!item.binary.hasOwnProperty(propertyName)) {
                                continue;
                            }
                            const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(itemIndex, propertyName);
                            attachments.push({
                                value: binaryDataBuffer,
                                options: {
                                    filename: item.binary[propertyName].fileName || 'unknown',
                                },
                            });
                        }
                        if (attachments.length) {
                            // @ts-ignore
                            formData.attachment = attachments;
                        }
                    }
                    const options = {
                        method: 'POST',
                        formData,
                        uri: `https://${credentials.apiDomain}/v3/${credentials.emailDomain}/messages`,
                        auth: {
                            user: 'api',
                            pass: credentials.apiKey,
                        },
                        json: true,
                    };
                    let responseData;
                    try {
                        responseData = yield this.helpers.request(options);
                    }
                    catch (error) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                    }
                    returnData.push({
                        json: responseData,
                    });
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ json: { error: error.message } });
                        continue;
                    }
                    throw error;
                }
            }
            return this.prepareOutputData(returnData);
        });
    }
}
exports.Mailgun = Mailgun;

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
exports.Mailjet = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const EmailDescription_1 = require("./EmailDescription");
const SmsDescription_1 = require("./SmsDescription");
class Mailjet {
    constructor() {
        this.description = {
            displayName: 'Mailjet',
            name: 'mailjet',
            icon: 'file:mailjet.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Mailjet API',
            defaults: {
                name: 'Mailjet',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mailjetEmailApi',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                        },
                    },
                },
                {
                    name: 'mailjetSmsApi',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'sms',
                            ],
                        },
                    },
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
                            name: 'Email',
                            value: 'email',
                        },
                        {
                            name: 'SMS',
                            value: 'sms',
                        },
                    ],
                    default: 'email',
                },
                ...EmailDescription_1.emailOperations,
                ...EmailDescription_1.emailFields,
                ...SmsDescription_1.smsOperations,
                ...SmsDescription_1.smsFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available custom fields to display them to user so that he can
                // select them easily
                getTemplates() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { Data: templates } = yield GenericFunctions_1.mailjetApiRequest.call(this, 'GET', '/v3/REST/template');
                        for (const template of templates) {
                            returnData.push({
                                name: template.Name,
                                value: template.ID,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'email') {
                        //https://dev.mailjet.com/email/guides/send-api-v31/#send-a-basic-email
                        if (operation === 'send') {
                            const fromEmail = this.getNodeParameter('fromEmail', i);
                            const htmlBody = this.getNodeParameter('html', i);
                            const textBody = this.getNodeParameter('text', i);
                            const subject = this.getNodeParameter('subject', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const toEmail = this.getNodeParameter('toEmail', i).split(',');
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            const body = {
                                From: {
                                    Email: fromEmail,
                                },
                                Subject: subject,
                                To: [],
                                Cc: [],
                                Bcc: [],
                                Variables: {},
                            };
                            for (const email of toEmail) {
                                (_a = body.To) === null || _a === void 0 ? void 0 : _a.push({
                                    Email: email,
                                });
                            }
                            if (jsonParameters) {
                                const variablesJson = this.getNodeParameter('variablesJson', i);
                                const parsedJson = (0, GenericFunctions_1.validateJSON)(variablesJson);
                                if (parsedJson === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Parameter 'Variables (JSON)' has a invalid JSON`);
                                }
                                body.Variables = parsedJson;
                            }
                            else {
                                const variables = this.getNodeParameter('variablesUi', i).variablesValues || [];
                                for (const variable of variables) {
                                    body.Variables[variable.name] = variable.value;
                                }
                            }
                            if (htmlBody) {
                                body.HTMLPart = htmlBody;
                            }
                            if (textBody) {
                                body.TextPart = textBody;
                            }
                            if (additionalFields.bccEmail) {
                                const bccEmail = additionalFields.bccEmail.split(',');
                                for (const email of bccEmail) {
                                    body.Bcc.push({
                                        Email: email,
                                    });
                                }
                            }
                            if (additionalFields.ccAddresses) {
                                const ccEmail = additionalFields.ccAddresses.split(',');
                                for (const email of ccEmail) {
                                    body.Cc.push({
                                        Email: email,
                                    });
                                }
                            }
                            if (additionalFields.trackOpens) {
                                body.TrackOpens = additionalFields.trackOpens;
                            }
                            if (additionalFields.replyTo) {
                                const replyTo = additionalFields.replyTo;
                                body['ReplyTo'] = {
                                    Email: replyTo,
                                };
                            }
                            if (additionalFields.trackClicks) {
                                body.TrackClicks = additionalFields.trackClicks;
                            }
                            if (additionalFields.fromName) {
                                body.From.Name = additionalFields.fromName;
                            }
                            if (additionalFields.templateLanguage) {
                                body.TemplateLanguage = additionalFields.templateLanguage;
                            }
                            if (additionalFields.priority) {
                                body.Priority = additionalFields.priority;
                            }
                            responseData = yield GenericFunctions_1.mailjetApiRequest.call(this, 'POST', '/v3.1/send', { Messages: [body] });
                            responseData = responseData.Messages;
                        }
                        //https://dev.mailjet.com/email/guides/send-api-v31/#use-a-template
                        if (operation === 'sendTemplate') {
                            const fromEmail = this.getNodeParameter('fromEmail', i);
                            const templateId = parseInt(this.getNodeParameter('templateId', i), 10);
                            const subject = this.getNodeParameter('subject', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const toEmail = this.getNodeParameter('toEmail', i).split(',');
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            const body = {
                                From: {
                                    Email: fromEmail,
                                },
                                Subject: subject,
                                To: [],
                                Cc: [],
                                Bcc: [],
                                Variables: {},
                                TemplateID: templateId,
                            };
                            for (const email of toEmail) {
                                body.To.push({
                                    Email: email,
                                });
                            }
                            if (jsonParameters) {
                                const variablesJson = this.getNodeParameter('variablesJson', i);
                                const parsedJson = (0, GenericFunctions_1.validateJSON)(variablesJson);
                                if (parsedJson === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Parameter 'Variables (JSON)' has a invalid JSON`);
                                }
                                body.Variables = parsedJson;
                            }
                            else {
                                const variables = this.getNodeParameter('variablesUi', i).variablesValues || [];
                                for (const variable of variables) {
                                    body.Variables[variable.name] = variable.value;
                                }
                            }
                            if (additionalFields.bccEmail) {
                                const bccEmail = additionalFields.bccEmail.split(',');
                                for (const email of bccEmail) {
                                    body.Bcc.push({
                                        Email: email,
                                    });
                                }
                            }
                            if (additionalFields.ccEmail) {
                                const ccEmail = additionalFields.ccEmail.split(',');
                                for (const email of ccEmail) {
                                    body.Cc.push({
                                        Email: email,
                                    });
                                }
                            }
                            if (additionalFields.replyTo) {
                                const replyTo = additionalFields.replyTo;
                                body['ReplyTo'] = {
                                    Email: replyTo,
                                };
                            }
                            if (additionalFields.trackOpens) {
                                body.TrackOpens = additionalFields.trackOpens;
                            }
                            if (additionalFields.trackClicks) {
                                body.TrackClicks = additionalFields.trackClicks;
                            }
                            if (additionalFields.fromName) {
                                body.From.Name = additionalFields.fromName;
                            }
                            if (additionalFields.templateLanguage) {
                                body.TemplateLanguage = additionalFields.templateLanguage;
                            }
                            if (additionalFields.priority) {
                                body.Priority = additionalFields.priority;
                            }
                            responseData = yield GenericFunctions_1.mailjetApiRequest.call(this, 'POST', '/v3.1/send', { Messages: [body] });
                            responseData = responseData.Messages;
                        }
                    }
                    if (resource === 'sms') {
                        //https://dev.mailjet.com/sms/reference/send-message#v4_post_sms-send
                        if (operation === 'send') {
                            const from = this.getNodeParameter('from', i);
                            const to = this.getNodeParameter('to', i);
                            const text = this.getNodeParameter('text', i);
                            const body = {
                                From: from,
                                To: to,
                                Text: text,
                            };
                            responseData = yield GenericFunctions_1.mailjetApiRequest.call(this, 'POST', '/v4/sms-send', body);
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
exports.Mailjet = Mailjet;

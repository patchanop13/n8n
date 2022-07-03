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
exports.FormIoTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class FormIoTrigger {
    constructor() {
        this.description = {
            displayName: 'Form.io Trigger',
            name: 'formIoTrigger',
            icon: 'file:formio.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            description: 'Handle form.io events via webhooks',
            defaults: {
                name: 'Form.io Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'formIoApi',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Project Name or ID',
                    name: 'projectId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getProjects',
                    },
                    required: true,
                    default: '',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                },
                {
                    displayName: 'Form Name or ID',
                    name: 'formId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsDependsOn: [
                            'projectId',
                        ],
                        loadOptionsMethod: 'getForms',
                    },
                    required: true,
                    default: '',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                },
                {
                    displayName: 'Trigger Events',
                    name: 'events',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Submission Created',
                            value: 'create',
                        },
                        {
                            name: 'Submission Updated',
                            value: 'update',
                        },
                    ],
                    required: true,
                    default: [],
                },
                {
                    displayName: 'Simplify',
                    name: 'simple',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to return a simplified version of the response instead of the raw data',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getProjects() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const projects = yield GenericFunctions_1.formIoApiRequest.call(this, 'GET', '/project', {});
                        const returnData = [];
                        for (const project of projects) {
                            returnData.push({
                                name: project.title,
                                value: project._id,
                            });
                        }
                        return returnData;
                    });
                },
                getForms() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const projectId = this.getCurrentNodeParameter('projectId');
                        const forms = yield GenericFunctions_1.formIoApiRequest.call(this, 'GET', `/project/${projectId}/form`, {});
                        const returnData = [];
                        for (const form of forms) {
                            returnData.push({
                                name: form.title,
                                value: form._id,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const formId = this.getNodeParameter('formId');
                        const projectId = this.getNodeParameter('projectId');
                        const method = this.getNodeParameter('events');
                        const actions = yield GenericFunctions_1.formIoApiRequest.call(this, 'GET', `/project/${projectId}/form/${formId}/action`);
                        for (const action of actions) {
                            if (action.name === 'webhook') {
                                if (action.settings.url === webhookUrl &&
                                    // tslint:disable-next-line: no-any
                                    (action.method.length === method.length && action.method.every((value) => method.includes(value)))) {
                                    webhookData.webhookId = action._id;
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const formId = this.getNodeParameter('formId');
                        const projectId = this.getNodeParameter('projectId');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const method = this.getNodeParameter('events');
                        const payload = {
                            data: {
                                name: `webhook`,
                                title: `webhook-n8n:${webhookUrl}`,
                                method,
                                handler: [
                                    'after',
                                ],
                                priority: 0,
                                settings: {
                                    method: 'post',
                                    block: false,
                                    url: webhookUrl,
                                },
                                condition: {
                                    field: 'submit',
                                },
                            },
                        };
                        const webhook = yield GenericFunctions_1.formIoApiRequest.call(this, 'POST', `/project/${projectId}/form/${formId}/action`, payload);
                        webhookData.webhookId = webhook._id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const formId = this.getNodeParameter('formId');
                        const projectId = this.getNodeParameter('projectId');
                        yield GenericFunctions_1.formIoApiRequest.call(this, 'DELETE', `/project/${projectId}/form/${formId}/action/${webhookData.webhookId}`);
                        delete webhookData.webhookId;
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            const simple = this.getNodeParameter('simple');
            let response = req.body.request;
            if (simple === true) {
                response = response.data;
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(response),
                ],
            };
        });
    }
}
exports.FormIoTrigger = FormIoTrigger;

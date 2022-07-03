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
exports.CopperTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class CopperTrigger {
    constructor() {
        this.description = {
            displayName: 'Copper Trigger',
            name: 'copperTrigger',
            icon: 'file:copper.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle Copper events via webhooks',
            defaults: {
                name: 'Copper Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'copperApi',
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
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    required: true,
                    default: '',
                    options: [
                        {
                            name: 'Company',
                            value: 'company',
                        },
                        {
                            name: 'Lead',
                            value: 'lead',
                        },
                        {
                            name: 'Opportunity',
                            value: 'opportunity',
                        },
                        {
                            name: 'Person',
                            value: 'person',
                        },
                        {
                            name: 'Project',
                            value: 'project',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                    ],
                    description: 'The resource which will fire the event',
                },
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    required: true,
                    default: '',
                    options: [
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'An existing record is removed',
                        },
                        {
                            name: 'New',
                            value: 'new',
                            description: 'A new record is created',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Any field in the existing entity record is changed',
                        },
                    ],
                    description: 'The event to listen to',
                },
            ],
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId === undefined) {
                            return false;
                        }
                        const endpoint = `/webhooks/${webhookData.webhookId}`;
                        try {
                            yield GenericFunctions_1.copperApiRequest.call(this, 'GET', endpoint);
                        }
                        catch (error) {
                            return false;
                        }
                        return true;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const resource = this.getNodeParameter('resource');
                        const event = this.getNodeParameter('event');
                        const endpoint = '/webhooks';
                        const body = {
                            target: webhookUrl,
                            type: resource,
                            event,
                        };
                        const credentials = yield this.getCredentials('copperApi');
                        body.secret = {
                            secret: (0, GenericFunctions_1.getAutomaticSecret)(credentials),
                        };
                        const { id } = yield GenericFunctions_1.copperApiRequest.call(this, 'POST', endpoint, body);
                        webhookData.webhookId = id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const endpoint = `/webhooks/${webhookData.webhookId}`;
                        try {
                            yield GenericFunctions_1.copperApiRequest.call(this, 'DELETE', endpoint);
                        }
                        catch (error) {
                            return false;
                        }
                        delete webhookData.webhookId;
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getCredentials('copperApi');
            const req = this.getRequestObject();
            // Check if the supplied secret matches. If not ignore request.
            if (req.body.secret !== (0, GenericFunctions_1.getAutomaticSecret)(credentials)) {
                return {};
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(req.body),
                ],
            };
        });
    }
}
exports.CopperTrigger = CopperTrigger;

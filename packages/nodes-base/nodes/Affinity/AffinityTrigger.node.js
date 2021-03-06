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
exports.AffinityTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class AffinityTrigger {
    constructor() {
        this.description = {
            displayName: 'Affinity Trigger',
            name: 'affinityTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:affinity.png',
            group: ['trigger'],
            version: 1,
            description: 'Handle Affinity events via webhooks',
            defaults: {
                name: 'Affinity-Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'affinityApi',
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
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'field_value.created',
                            value: 'field_value.created',
                        },
                        {
                            name: 'field_value.deleted',
                            value: 'field_value.deleted',
                        },
                        {
                            name: 'field_value.updated',
                            value: 'field_value.updated',
                        },
                        {
                            name: 'field.created',
                            value: 'field.created',
                        },
                        {
                            name: 'field.deleted',
                            value: 'field.deleted',
                        },
                        {
                            name: 'field.updated',
                            value: 'field.updated',
                        },
                        {
                            name: 'file.created',
                            value: 'file.created',
                        },
                        {
                            name: 'file.deleted',
                            value: 'file.deleted',
                        },
                        {
                            name: 'list_entry.created',
                            value: 'list_entry.created',
                        },
                        {
                            name: 'list_entry.deleted',
                            value: 'list_entry.deleted',
                        },
                        {
                            name: 'list.created',
                            value: 'list.created',
                        },
                        {
                            name: 'list.deleted',
                            value: 'list.deleted',
                        },
                        {
                            name: 'list.updated',
                            value: 'list.updated',
                        },
                        {
                            name: 'note.created',
                            value: 'note.created',
                        },
                        {
                            name: 'note.deleted',
                            value: 'note.deleted',
                        },
                        {
                            name: 'note.updated',
                            value: 'note.updated',
                        },
                        {
                            name: 'opportunity.created',
                            value: 'opportunity.created',
                        },
                        {
                            name: 'opportunity.deleted',
                            value: 'opportunity.deleted',
                        },
                        {
                            name: 'opportunity.updated',
                            value: 'opportunity.updated',
                        },
                        {
                            name: 'organization.created',
                            value: 'organization.created',
                        },
                        {
                            name: 'organization.deleted',
                            value: 'organization.deleted',
                        },
                        {
                            name: 'organization.updated',
                            value: 'organization.updated',
                        },
                        {
                            name: 'person.created',
                            value: 'person.created',
                        },
                        {
                            name: 'person.deleted',
                            value: 'person.deleted',
                        },
                        {
                            name: 'person.updated',
                            value: 'person.updated',
                        },
                    ],
                    default: [],
                    required: true,
                    description: 'Webhook events that will be enabled for that endpoint',
                },
            ],
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        // Check all the webhooks which exist already if it is identical to the
                        // one that is supposed to get created.
                        const endpoint = '/webhook';
                        const responseData = yield GenericFunctions_1.affinityApiRequest.call(this, 'GET', endpoint, {});
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const events = this.getNodeParameter('events');
                        for (const webhook of responseData) {
                            if ((0, GenericFunctions_1.eventsExist)(webhook.subscriptions, events) && webhook.webhook_url === webhookUrl) {
                                // Set webhook-id to be sure that it can be deleted
                                const webhookData = this.getWorkflowStaticData('node');
                                webhookData.webhookId = webhook.id;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        if (webhookUrl.includes('%20')) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The name of the Affinity Trigger Node is not allowed to contain any spaces!');
                        }
                        const events = this.getNodeParameter('events');
                        const endpoint = '/webhook/subscribe';
                        const body = {
                            webhook_url: webhookUrl,
                            subscriptions: events,
                        };
                        const responseData = yield GenericFunctions_1.affinityApiRequest.call(this, 'POST', endpoint, body);
                        if (responseData.id === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        const webhookData = this.getWorkflowStaticData('node');
                        webhookData.webhookId = responseData.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/webhook/${webhookData.webhookId}`;
                            const responseData = yield GenericFunctions_1.affinityApiRequest.call(this, 'DELETE', endpoint);
                            if (!responseData.success) {
                                return false;
                            }
                            // Remove from the static workflow data so that it is clear
                            // that no webhooks are registred anymore
                            delete webhookData.webhookId;
                        }
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const bodyData = this.getBodyData();
            if (bodyData.type === 'sample.webhook') {
                return {};
            }
            let responseData = {};
            if (bodyData.type && bodyData.body) {
                const resource = bodyData.type.split('.')[0];
                //@ts-ignore
                const id = bodyData.body.id;
                responseData = yield GenericFunctions_1.affinityApiRequest.call(this, 'GET', `/${(0, GenericFunctions_1.mapResource)(resource)}/${id}`);
                responseData.type = bodyData.type;
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(responseData),
                ],
            };
        });
    }
}
exports.AffinityTrigger = AffinityTrigger;

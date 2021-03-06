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
exports.KeapTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const change_case_1 = require("change-case");
class KeapTrigger {
    constructor() {
        this.description = {
            displayName: 'Keap Trigger',
            name: 'keapTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:keap.png',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["eventId"]}}',
            description: 'Starts the workflow when Infusionsoft events occur',
            defaults: {
                name: 'Keap Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'keapOAuth2Api',
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
                    displayName: 'Event Name or ID',
                    name: 'eventId',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'getEvents',
                    },
                    default: '',
                    required: true,
                },
                {
                    displayName: 'RAW Data',
                    name: 'rawData',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to return the data exactly in the way it got received from the API',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the event types to display them to user so that he can
                // select them easily
                getEvents() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const hooks = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', '/hooks/event_keys');
                        for (const hook of hooks) {
                            const hookName = hook;
                            const hookId = hook;
                            returnData.push({
                                name: (0, change_case_1.capitalCase)(hookName.replace('.', ' ')),
                                value: hookId,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const eventId = this.getNodeParameter('eventId');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', '/hooks', {});
                        for (const existingData of responseData) {
                            if (existingData.hookUrl === webhookUrl
                                && existingData.eventKey === eventId
                                && existingData.status === 'Verified') {
                                // The webhook exists already
                                webhookData.webhookId = existingData.key;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const eventId = this.getNodeParameter('eventId');
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const body = {
                            eventKey: eventId,
                            hookUrl: webhookUrl,
                        };
                        const responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'POST', '/hooks', body);
                        if (responseData.key === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        webhookData.webhookId = responseData.key;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            try {
                                yield GenericFunctions_1.keapApiRequest.call(this, 'DELETE', `/hooks/${webhookData.webhookId}`);
                            }
                            catch (error) {
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
            const rawData = this.getNodeParameter('rawData');
            const headers = this.getHeaderData();
            const bodyData = this.getBodyData();
            if (headers['x-hook-secret']) {
                // Is a create webhook confirmation request
                const res = this.getResponseObject();
                res.set('x-hook-secret', headers['x-hook-secret']);
                res.status(200).end();
                return {
                    noWebhookResponse: true,
                };
            }
            if (rawData) {
                return {
                    workflowData: [
                        this.helpers.returnJsonArray(bodyData),
                    ],
                };
            }
            const responseData = [];
            for (const data of bodyData.object_keys) {
                responseData.push({
                    eventKey: bodyData.event_key,
                    objectType: bodyData.object_type,
                    id: data.id,
                    timestamp: data.timestamp,
                    apiUrl: data.apiUrl,
                });
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(responseData),
                ],
            };
        });
    }
}
exports.KeapTrigger = KeapTrigger;

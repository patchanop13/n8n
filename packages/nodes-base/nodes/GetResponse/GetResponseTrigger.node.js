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
exports.GetResponseTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class GetResponseTrigger {
    constructor() {
        this.description = {
            displayName: 'GetResponse Trigger',
            name: 'getResponseTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:getResponse.png',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when GetResponse events occur',
            defaults: {
                name: 'GetResponse Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'getResponseApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'apiKey',
                            ],
                        },
                    },
                },
                {
                    name: 'getResponseOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'GET',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'API Key',
                            value: 'apiKey',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'apiKey',
                },
                {
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Customer Subscribed',
                            value: 'subscribe',
                            description: 'Receive notifications when a customer is subscribed to a list',
                        },
                        {
                            name: 'Customer Unsubscribed',
                            value: 'unsubscribe',
                            description: 'Receive notifications when a customer is unsubscribed from a list',
                        },
                        {
                            name: 'Email Clicked',
                            value: 'click',
                            description: 'Receive notifications when a email is clicked',
                        },
                        {
                            name: 'Email Opened',
                            value: 'open',
                            description: 'Receive notifications when a email is opened',
                        },
                        {
                            name: 'Survey Submitted',
                            value: 'survey',
                            description: 'Receive notifications when a survey is submitted',
                        },
                    ],
                    default: [],
                    required: true,
                },
                {
                    displayName: 'List Names or IDs',
                    name: 'listIds',
                    type: 'multiOptions',
                    typeOptions: {
                        loadOptionsMethod: 'getLists',
                    },
                    default: [],
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    placeholder: 'Add Option',
                    type: 'collection',
                    default: {},
                    options: [
                        {
                            displayName: 'Delete Current Subscription',
                            name: 'delete',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to delete the current subscription',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available teams to display them to user so that he can
                // select them easily
                getLists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const lists = yield GenericFunctions_1.getResponseApiRequestAllItems.call(this, 'GET', '/campaigns');
                        returnData.push({ name: '*', value: '*' });
                        for (const list of lists) {
                            returnData.push({
                                name: list.name,
                                value: list.campaignId,
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
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const deleteCurrentSubscription = this.getNodeParameter('options.delete', false);
                        try {
                            const data = yield GenericFunctions_1.getresponseApiRequest.call(this, 'GET', '/accounts/callbacks', {});
                            if (data.url !== webhookUrl) {
                                if (deleteCurrentSubscription === false) {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), data, { message: `The webhook (${data.url}) is active in the account. Delete it manually or set the parameter "Delete Current Subscription" to true, and the node will delete it for you.` });
                                }
                            }
                        }
                        catch (error) {
                            if (error.httpCode === '404') {
                                return false;
                            }
                        }
                        yield GenericFunctions_1.getresponseApiRequest.call(this, 'DELETE', '/accounts/callbacks');
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const events = this.getNodeParameter('events');
                        const body = {
                            url: webhookUrl,
                            actions: events.reduce((accumulator, currentValue) => {
                                accumulator[currentValue] = true;
                                return accumulator;
                            }, {}),
                        };
                        yield GenericFunctions_1.getresponseApiRequest.call(this, 'POST', '/accounts/callbacks', body);
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield GenericFunctions_1.getresponseApiRequest.call(this, 'DELETE', '/accounts/callbacks');
                        }
                        catch (error) {
                            return false;
                        }
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.getQueryData();
            const listIds = this.getNodeParameter('listIds');
            if (!listIds.includes('*') && !listIds.includes(query['CAMPAIGN_ID'])) {
                return {};
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(query),
                ],
            };
        });
    }
}
exports.GetResponseTrigger = GetResponseTrigger;

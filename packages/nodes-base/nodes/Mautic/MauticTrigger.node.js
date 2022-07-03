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
exports.MauticTrigger = void 0;
const url_1 = require("url");
const GenericFunctions_1 = require("./GenericFunctions");
class MauticTrigger {
    constructor() {
        this.description = {
            displayName: 'Mautic Trigger',
            name: 'mauticTrigger',
            icon: 'file:mautic.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle Mautic events via webhooks',
            defaults: {
                name: 'Mautic Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mauticApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'credentials',
                            ],
                        },
                    },
                },
                {
                    name: 'mauticOAuth2Api',
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
                    httpMethod: 'POST',
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
                            name: 'Credentials',
                            value: 'credentials',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'credentials',
                },
                {
                    displayName: 'Event Names or IDs',
                    name: 'events',
                    type: 'multiOptions',
                    required: true,
                    typeOptions: {
                        loadOptionsMethod: 'getEvents',
                    },
                    default: [],
                },
                {
                    displayName: 'Events Order',
                    name: 'eventsOrder',
                    type: 'options',
                    default: 'ASC',
                    options: [
                        {
                            name: 'ASC',
                            value: 'ASC',
                        },
                        {
                            name: 'DESC',
                            value: 'DESC',
                        },
                    ],
                    description: 'Order direction for queued events in one webhook. Can be “DESC” or “ASC”.',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the events to display them to user so that he can
                // select them easily
                getEvents() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { triggers } = yield GenericFunctions_1.mauticApiRequest.call(this, 'GET', '/hooks/triggers');
                        for (const [key, value] of Object.entries(triggers)) {
                            const eventId = key;
                            const eventName = value.label;
                            const eventDecription = value.description;
                            returnData.push({
                                name: eventName,
                                value: eventId,
                                description: eventDecription,
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
                        if (webhookData.webhookId === undefined) {
                            return false;
                        }
                        const endpoint = `/hooks/${webhookData.webhookId}`;
                        try {
                            yield GenericFunctions_1.mauticApiRequest.call(this, 'GET', endpoint, {});
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
                        const events = this.getNodeParameter('events', 0);
                        const eventsOrder = this.getNodeParameter('eventsOrder', 0);
                        const urlParts = (0, url_1.parse)(webhookUrl);
                        const body = {
                            name: `n8n-webhook:${urlParts.path}`,
                            description: 'n8n webhook',
                            webhookUrl,
                            triggers: events,
                            eventsOrderbyDir: eventsOrder,
                            isPublished: true,
                        };
                        const { hook } = yield GenericFunctions_1.mauticApiRequest.call(this, 'POST', '/hooks/new', body);
                        webhookData.webhookId = hook.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        try {
                            yield GenericFunctions_1.mauticApiRequest.call(this, 'DELETE', `/hooks/${webhookData.webhookId}/delete`);
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
            const req = this.getRequestObject();
            return {
                workflowData: [
                    this.helpers.returnJsonArray(req.body),
                ],
            };
        });
    }
}
exports.MauticTrigger = MauticTrigger;

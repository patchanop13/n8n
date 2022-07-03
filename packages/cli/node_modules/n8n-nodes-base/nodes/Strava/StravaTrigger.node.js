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
exports.StravaTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const crypto_1 = require("crypto");
class StravaTrigger {
    constructor() {
        this.description = {
            displayName: 'Strava Trigger',
            name: 'stravaTrigger',
            icon: 'file:strava.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Strava events occur',
            defaults: {
                name: 'Strava Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'stravaOAuth2Api',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'setup',
                    httpMethod: 'GET',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Object',
                    name: 'object',
                    type: 'options',
                    options: [
                        {
                            name: '[All]',
                            value: '*',
                        },
                        {
                            name: 'Activity',
                            value: 'activity',
                        },
                        {
                            name: 'Athlete',
                            value: 'athlete',
                        },
                    ],
                    default: '*',
                },
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    options: [
                        {
                            name: '[All]',
                            value: '*',
                        },
                        {
                            name: 'Created',
                            value: 'create',
                        },
                        {
                            name: 'Deleted',
                            value: 'delete',
                        },
                        {
                            name: 'Updated',
                            value: 'update',
                        },
                    ],
                    default: '*',
                },
                {
                    displayName: 'Resolve Data',
                    name: 'resolveData',
                    type: 'boolean',
                    default: true,
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                    description: 'By default the webhook-data only contain the Object ID. If this option gets activated, it will resolve the data automatically.',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Delete If Exist',
                            name: 'deleteIfExist',
                            type: 'boolean',
                            default: false,
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                            description: 'Strava allows just one subscription at all times. If you want to delete the current subscription to make room for a new subcription with the current parameters, set this parameter to true. Keep in mind this is a destructive operation.',
                        },
                    ],
                },
            ],
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        // Check all the webhooks which exist already if it is identical to the
                        // one that is supposed to get created.
                        const endpoint = '/push_subscriptions';
                        const webhooks = yield GenericFunctions_1.stravaApiRequest.call(this, 'GET', endpoint, {});
                        for (const webhook of webhooks) {
                            if (webhook.callback_url === webhookUrl) {
                                webhookData.webhookId = webhook.id;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    var _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const endpoint = '/push_subscriptions';
                        const body = {
                            callback_url: webhookUrl,
                            verify_token: (0, crypto_1.randomBytes)(20).toString('hex'),
                        };
                        let responseData;
                        try {
                            responseData = yield GenericFunctions_1.stravaApiRequest.call(this, 'POST', endpoint, body);
                        }
                        catch (error) {
                            const apiErrorResponse = error.cause.response;
                            if ((_a = apiErrorResponse === null || apiErrorResponse === void 0 ? void 0 : apiErrorResponse.body) === null || _a === void 0 ? void 0 : _a.errors) {
                                const errors = apiErrorResponse.body.errors;
                                for (error of errors) {
                                    // if there is a subscription already created
                                    if (error.resource === 'PushSubscription' && error.code === 'already exists') {
                                        const options = this.getNodeParameter('options');
                                        //get the current subscription
                                        const webhooks = yield GenericFunctions_1.stravaApiRequest.call(this, 'GET', `/push_subscriptions`, {});
                                        if (options.deleteIfExist) {
                                            // delete the subscription
                                            yield GenericFunctions_1.stravaApiRequest.call(this, 'DELETE', `/push_subscriptions/${webhooks[0].id}`);
                                            // now there is room create a subscription with the n8n data
                                            const body = {
                                                callback_url: webhookUrl,
                                                verify_token: (0, crypto_1.randomBytes)(20).toString('hex'),
                                            };
                                            responseData = yield GenericFunctions_1.stravaApiRequest.call(this, 'POST', `/push_subscriptions`, body);
                                        }
                                        else {
                                            error.message = `A subscription already exists [${webhooks[0].callback_url}]. If you want to delete this subcription and create a new one with the current parameters please go to options and set delete if exist to true`;
                                            throw error;
                                        }
                                    }
                                }
                            }
                            if (!responseData) {
                                throw error;
                            }
                        }
                        if (responseData.id === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        webhookData.webhookId = responseData.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/push_subscriptions/${webhookData.webhookId}`;
                            try {
                                yield GenericFunctions_1.stravaApiRequest.call(this, 'DELETE', endpoint);
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
            const body = this.getBodyData();
            const query = this.getQueryData();
            const object = this.getNodeParameter('object');
            const event = this.getNodeParameter('event');
            const resolveData = this.getNodeParameter('resolveData');
            let objectType, eventType;
            if (object === '*') {
                objectType = ['activity', 'athlete'];
            }
            else {
                objectType = [object];
            }
            if (event === '*') {
                eventType = ['create', 'update', 'delete'];
            }
            else {
                eventType = [event];
            }
            if (this.getWebhookName() === 'setup') {
                if (query['hub.challenge']) {
                    // Is a create webhook confirmation request
                    const res = this.getResponseObject();
                    res.status(200).json({ 'hub.challenge': query['hub.challenge'] }).end();
                    return {
                        noWebhookResponse: true,
                    };
                }
            }
            if (object !== '*' && !objectType.includes(body.object_type)) {
                return {};
            }
            if (event !== '*' && !eventType.includes(body.aspect_type)) {
                return {};
            }
            if (resolveData) {
                let endpoint = `/athletes/${body.object_id}/stats`;
                if (body.object_type === 'activity') {
                    endpoint = `/activities/${body.object_id}`;
                }
                body.object_data = yield GenericFunctions_1.stravaApiRequest.call(this, 'GET', endpoint);
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(body),
                ],
            };
        });
    }
}
exports.StravaTrigger = StravaTrigger;

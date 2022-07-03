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
exports.PushcutTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class PushcutTrigger {
    constructor() {
        this.description = {
            displayName: 'Pushcut Trigger',
            name: 'pushcutTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:pushcut.png',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Pushcut events occur',
            defaults: {
                name: 'Pushcut Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'pushcutApi',
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
                    displayName: 'Action Name',
                    name: 'actionName',
                    type: 'string',
                    description: 'Choose any name you would like. It will show up as a server action in the app.',
                    default: '',
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
                        const actionName = this.getNodeParameter('actionName');
                        // Check all the webhooks which exist already if it is identical to the
                        // one that is supposed to get created.
                        const endpoint = '/subscriptions';
                        const webhooks = yield GenericFunctions_1.pushcutApiRequest.call(this, 'GET', endpoint, {});
                        for (const webhook of webhooks) {
                            if (webhook.url === webhookUrl &&
                                webhook.actionName === actionName) {
                                webhookData.webhookId = webhook.id;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const actionName = this.getNodeParameter('actionName');
                        const endpoint = '/subscriptions';
                        const body = {
                            actionName,
                            url: webhookUrl,
                        };
                        const responseData = yield GenericFunctions_1.pushcutApiRequest.call(this, 'POST', endpoint, body);
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
                            const endpoint = `/subscriptions/${webhookData.webhookId}`;
                            try {
                                yield GenericFunctions_1.pushcutApiRequest.call(this, 'DELETE', endpoint);
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
            return {
                workflowData: [
                    this.helpers.returnJsonArray(body),
                ],
            };
        });
    }
}
exports.PushcutTrigger = PushcutTrigger;

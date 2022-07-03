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
exports.TrelloTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
// import { createHmac } from 'crypto';
class TrelloTrigger {
    constructor() {
        this.description = {
            displayName: 'Trello Trigger',
            name: 'trelloTrigger',
            icon: 'file:trello.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Trello events occur',
            defaults: {
                name: 'Trello Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'trelloApi',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'setup',
                    httpMethod: 'HEAD',
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
                    displayName: 'Model ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    placeholder: '4d5ea62fd76aa1136000000c',
                    required: true,
                    description: 'ID of the model of which to subscribe to events',
                },
            ],
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('trelloApi');
                        // Check all the webhooks which exist already if it is identical to the
                        // one that is supposed to get created.
                        const endpoint = `tokens/${credentials.apiToken}/webhooks`;
                        const responseData = yield GenericFunctions_1.apiRequest.call(this, 'GET', endpoint, {});
                        const idModel = this.getNodeParameter('id');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        for (const webhook of responseData) {
                            if (webhook.idModel === idModel && webhook.callbackURL === webhookUrl) {
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
                        const credentials = yield this.getCredentials('trelloApi');
                        const idModel = this.getNodeParameter('id');
                        const endpoint = `tokens/${credentials.apiToken}/webhooks`;
                        const body = {
                            description: `n8n Webhook - ${idModel}`,
                            callbackURL: webhookUrl,
                            idModel,
                        };
                        const responseData = yield GenericFunctions_1.apiRequest.call(this, 'POST', endpoint, body);
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
                            const credentials = yield this.getCredentials('trelloApi');
                            const endpoint = `tokens/${credentials.apiToken}/webhooks/${webhookData.webhookId}`;
                            const body = {};
                            try {
                                yield GenericFunctions_1.apiRequest.call(this, 'DELETE', endpoint, body);
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
            const webhookName = this.getWebhookName();
            if (webhookName === 'setup') {
                // Is a create webhook confirmation request
                const res = this.getResponseObject();
                res.status(200).end();
                return {
                    noWebhookResponse: true,
                };
            }
            const bodyData = this.getBodyData();
            // TODO: Check why that does not work as expected even though it gets done as described
            //    https://developers.trello.com/page/webhooks
            //const credentials = await this.getCredentials('trelloApi');
            // // Check if the request is valid
            // const headerData = this.getHeaderData() as IDataObject;
            // const webhookUrl = this.getNodeWebhookUrl('default');
            // const checkContent = JSON.stringify(bodyData) + webhookUrl;
            // const computedSignature = createHmac('sha1', credentials.oauthSecret as string).update(checkContent).digest('base64');
            // if (headerData['x-trello-webhook'] !== computedSignature) {
            // 	// Signature is not valid so ignore call
            // 	return {};
            // }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(bodyData),
                ],
            };
        });
    }
}
exports.TrelloTrigger = TrelloTrigger;

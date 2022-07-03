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
exports.WiseTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const crypto_1 = require("crypto");
class WiseTrigger {
    constructor() {
        this.description = {
            displayName: 'Wise Trigger',
            name: 'wiseTrigger',
            icon: 'file:wise.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            description: 'Handle Wise events via webhooks',
            defaults: {
                name: 'Wise Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'wiseApi',
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
                    displayName: 'Profile Name or ID',
                    name: 'profileId',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    required: true,
                    typeOptions: {
                        loadOptionsMethod: 'getProfiles',
                    },
                    default: '',
                },
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    required: true,
                    default: '',
                    options: [
                        {
                            name: 'Balance Credit',
                            value: 'balanceCredit',
                            description: 'Triggered every time a balance account is credited',
                        },
                        {
                            name: 'Transfer Active Case',
                            value: 'transferActiveCases',
                            description: 'Triggered every time a transfer\'s list of active cases is updated',
                        },
                        {
                            name: 'Transfer State Changed',
                            value: 'tranferStateChange',
                            description: 'Triggered every time a transfer\'s status is updated',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getProfiles() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const profiles = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', 'v1/profiles');
                        return profiles.map(({ id, type }) => ({
                            name: type.charAt(0).toUpperCase() + type.slice(1),
                            value: id,
                        }));
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
                        const profileId = this.getNodeParameter('profileId');
                        const event = this.getNodeParameter('event');
                        const webhooks = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', `v3/profiles/${profileId}/subscriptions`);
                        const trigger = (0, GenericFunctions_1.getTriggerName)(event);
                        for (const webhook of webhooks) {
                            if (webhook.delivery.url === webhookUrl && webhook.scope.id === profileId && webhook.trigger_on === trigger) {
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
                        const webhookData = this.getWorkflowStaticData('node');
                        const profileId = this.getNodeParameter('profileId');
                        const event = this.getNodeParameter('event');
                        const trigger = (0, GenericFunctions_1.getTriggerName)(event);
                        const body = {
                            name: `n8n Webhook`,
                            trigger_on: trigger,
                            delivery: {
                                version: '2.0.0',
                                url: webhookUrl,
                            },
                        };
                        const webhook = yield GenericFunctions_1.wiseApiRequest.call(this, 'POST', `v3/profiles/${profileId}/subscriptions`, body);
                        webhookData.webhookId = webhook.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const profileId = this.getNodeParameter('profileId');
                        try {
                            yield GenericFunctions_1.wiseApiRequest.call(this, 'DELETE', `v3/profiles/${profileId}/subscriptions/${webhookData.webhookId}`);
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
            const headers = this.getHeaderData();
            const credentials = yield this.getCredentials('wiseApi');
            if (headers['x-test-notification'] === 'true') {
                const res = this.getResponseObject();
                res.status(200).end();
                return {
                    noWebhookResponse: true,
                };
            }
            const signature = headers['x-signature'];
            const publicKey = (credentials.environment === 'test') ? GenericFunctions_1.testPublicKey : GenericFunctions_1.livePublicKey;
            //@ts-ignore
            const sig = (0, crypto_1.createVerify)('RSA-SHA1').update(req.rawBody);
            const verified = sig.verify(publicKey, signature, 'base64');
            if (verified === false) {
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
exports.WiseTrigger = WiseTrigger;

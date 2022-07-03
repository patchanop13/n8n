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
exports.OnfleetTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const OnfleetWebhookDescription_1 = require("./descriptions/OnfleetWebhookDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const WebhookMapping_1 = require("./WebhookMapping");
class OnfleetTrigger {
    constructor() {
        this.description = {
            displayName: 'Onfleet Trigger',
            name: 'onfleetTrigger',
            icon: 'file:Onfleet.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["triggerOn"]}}',
            description: 'Starts the workflow when Onfleet events occur',
            defaults: {
                name: 'Onfleet Trigger',
                color: '#AA81F3',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'onfleetApi',
                    required: true,
                    testedBy: 'onfleetApiTest',
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
                OnfleetWebhookDescription_1.eventDisplay,
                OnfleetWebhookDescription_1.eventNameField,
            ],
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        // Webhook got created before so check if it still exists
                        const endpoint = '/webhooks';
                        const webhooks = yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', endpoint);
                        for (const webhook of webhooks) {
                            if (webhook.url === webhookUrl && webhook.trigger === event) {
                                webhookData.webhookId = webhook.id;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { name = '' } = this.getNodeParameter('additionalFields');
                        const triggerOn = this.getNodeParameter('triggerOn');
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        if (webhookUrl.includes('//localhost')) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The Webhook can not work on "localhost". Please, either setup n8n on a custom domain or start with "--tunnel"!');
                        }
                        // Webhook name according to the field
                        let newWebhookName = `n8n-webhook:${webhookUrl}`;
                        if (name) {
                            newWebhookName = `n8n-webhook:${name}`;
                        }
                        const path = `/webhooks`;
                        const body = {
                            name: newWebhookName,
                            url: webhookUrl,
                            trigger: WebhookMapping_1.webhookMapping[triggerOn].key,
                        };
                        try {
                            const webhook = yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', path, body);
                            if (webhook.id === undefined) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), webhook, { message: 'Onfleet webhook creation response did not contain the expected data' });
                            }
                            webhookData.id = webhook.id;
                        }
                        catch (error) {
                            const { httpCode = '' } = error;
                            if (httpCode === '422') {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'A webhook with the identical URL probably exists already. Please delete it manually in Onfleet!');
                            }
                            throw error;
                        }
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        // Get the data of the already registered webhook
                        const endpoint = `/webhooks/${webhookData.id}`;
                        yield GenericFunctions_1.onfleetApiRequest.call(this, 'DELETE', endpoint);
                        return true;
                    });
                },
            },
        };
    }
    /**
     * Triggered function when an Onfleet webhook is executed
     * @returns {Promise<IWebhookResponseData>} Response data
     */
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            if (this.getWebhookName() === 'setup') {
                /* -------------------------------------------------------------------------- */
                /*                             Validation request                             */
                /* -------------------------------------------------------------------------- */
                const res = this.getResponseObject();
                res.status(200).send(req.query.check);
                return { noWebhookResponse: true };
            }
            const returnData = this.getBodyData();
            return {
                workflowData: [
                    this.helpers.returnJsonArray(returnData),
                ],
            };
        });
    }
}
exports.OnfleetTrigger = OnfleetTrigger;

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
exports.InvoiceNinjaTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class InvoiceNinjaTrigger {
    constructor() {
        this.description = {
            displayName: 'Invoice Ninja Trigger',
            name: 'invoiceNinjaTrigger',
            icon: 'file:invoiceNinja.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Invoice Ninja events occur',
            defaults: {
                name: 'Invoice Ninja Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'invoiceNinjaApi',
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
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    options: [
                        {
                            name: 'Client Created',
                            value: 'create_client',
                        },
                        {
                            name: 'Invoice Created',
                            value: 'create_invoice',
                        },
                        {
                            name: 'Payment Created',
                            value: 'create_payment',
                        },
                        {
                            name: 'Quote Created',
                            value: 'create_quote',
                        },
                        {
                            name: 'Vendor Created',
                            value: 'create_vendor',
                        },
                    ],
                    default: '',
                    required: true,
                },
            ],
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const event = this.getNodeParameter('event');
                        const endpoint = '/hooks';
                        const body = {
                            target_url: webhookUrl,
                            event,
                        };
                        const responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'POST', endpoint, body);
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
                            const endpoint = `/hooks/${webhookData.webhookId}`;
                            try {
                                yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'DELETE', endpoint);
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
            const bodyData = this.getBodyData();
            return {
                workflowData: [
                    this.helpers.returnJsonArray(bodyData),
                ],
            };
        });
    }
}
exports.InvoiceNinjaTrigger = InvoiceNinjaTrigger;

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
exports.PayPal = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const PaymentDescription_1 = require("./PaymentDescription");
const GenericFunctions_1 = require("./GenericFunctions");
class PayPal {
    constructor() {
        this.description = {
            displayName: 'PayPal',
            name: 'payPal',
            icon: 'file:paypal.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume PayPal API',
            defaults: {
                name: 'PayPal',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'payPalApi',
                    required: true,
                    testedBy: 'payPalApiTest',
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Payout',
                            value: 'payout',
                        },
                        {
                            name: 'Payout Item',
                            value: 'payoutItem',
                        },
                    ],
                    default: 'payout',
                },
                // Payout
                ...PaymentDescription_1.payoutOperations,
                ...PaymentDescription_1.payoutItemOperations,
                ...PaymentDescription_1.payoutFields,
                ...PaymentDescription_1.payoutItemFields,
            ],
        };
        this.methods = {
            credentialTest: {
                payPalApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = credential.data;
                        const clientId = credentials.clientId;
                        const clientSecret = credentials.secret;
                        const environment = credentials.env;
                        if (!clientId || !clientSecret || !environment) {
                            return {
                                status: 'Error',
                                message: `Connection details not valid: missing credentials`,
                            };
                        }
                        let baseUrl = '';
                        if (environment !== 'live') {
                            baseUrl = 'https://api-m.sandbox.paypal.com';
                        }
                        else {
                            baseUrl = 'https://api-m.paypal.com';
                        }
                        const base64Key = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
                        const options = {
                            headers: {
                                'Authorization': `Basic ${base64Key}`,
                            },
                            method: 'POST',
                            uri: `${baseUrl}/v1/oauth2/token`,
                            form: {
                                grant_type: 'client_credentials',
                            },
                        };
                        try {
                            yield this.helpers.request(options);
                            return {
                                status: 'OK',
                                message: 'Authentication successful!',
                            };
                        }
                        catch (error) {
                            return {
                                status: 'Error',
                                message: `Connection details not valid: ${error.message}`,
                            };
                        }
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let responseData;
            const qs = {};
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'payout') {
                        if (operation === 'create') {
                            const body = {};
                            const header = {};
                            const jsonActive = this.getNodeParameter('jsonParameters', i);
                            const senderBatchId = this.getNodeParameter('senderBatchId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            header.sender_batch_id = senderBatchId;
                            if (additionalFields.emailSubject) {
                                header.email_subject = additionalFields.emailSubject;
                            }
                            if (additionalFields.emailMessage) {
                                header.email_message = additionalFields.emailMessage;
                            }
                            if (additionalFields.note) {
                                header.note = additionalFields.note;
                            }
                            body.sender_batch_header = header;
                            if (!jsonActive) {
                                const payoutItems = [];
                                const itemsValues = this.getNodeParameter('itemsUi', i).itemsValues;
                                if (itemsValues && itemsValues.length > 0) {
                                    itemsValues.forEach(o => {
                                        const payoutItem = {};
                                        const amount = {};
                                        amount.currency = o.currency;
                                        amount.value = parseFloat(o.amount);
                                        payoutItem.amount = amount;
                                        payoutItem.note = o.note || '';
                                        payoutItem.receiver = o.receiverValue;
                                        payoutItem.recipient_type = o.recipientType;
                                        payoutItem.recipient_wallet = o.recipientWallet;
                                        payoutItem.sender_item_id = o.senderItemId || '';
                                        payoutItems.push(payoutItem);
                                    });
                                    body.items = payoutItems;
                                }
                                else {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'You must have at least one item.');
                                }
                            }
                            else {
                                const itemsJson = (0, GenericFunctions_1.validateJSON)(this.getNodeParameter('itemsJson', i));
                                body.items = itemsJson;
                            }
                            responseData = yield GenericFunctions_1.payPalApiRequest.call(this, '/payments/payouts', 'POST', body);
                        }
                        if (operation === 'get') {
                            const payoutBatchId = this.getNodeParameter('payoutBatchId', i);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.payPalApiRequestAllItems.call(this, 'items', `/payments/payouts/${payoutBatchId}`, 'GET', {}, qs);
                            }
                            else {
                                qs.page_size = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.payPalApiRequest.call(this, `/payments/payouts/${payoutBatchId}`, 'GET', {}, qs);
                                responseData = responseData.items;
                            }
                        }
                    }
                    else if (resource === 'payoutItem') {
                        if (operation === 'get') {
                            const payoutItemId = this.getNodeParameter('payoutItemId', i);
                            responseData = yield GenericFunctions_1.payPalApiRequest.call(this, `/payments/payouts-item/${payoutItemId}`, 'GET', {}, qs);
                        }
                        if (operation === 'cancel') {
                            const payoutItemId = this.getNodeParameter('payoutItemId', i);
                            responseData = yield GenericFunctions_1.payPalApiRequest.call(this, `/payments/payouts-item/${payoutItemId}/cancel`, 'POST', {}, qs);
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
                        returnData.push(responseData);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.PayPal = PayPal;

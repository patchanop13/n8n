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
exports.MailerLite = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const SubscriberDescription_1 = require("./SubscriberDescription");
class MailerLite {
    constructor() {
        this.description = {
            displayName: 'MailerLite',
            name: 'mailerLite',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:mailerLite.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Mailer Lite API',
            defaults: {
                name: 'MailerLite',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mailerLiteApi',
                    required: true,
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
                            name: 'Subscriber',
                            value: 'subscriber',
                        },
                    ],
                    default: 'subscriber',
                },
                ...SubscriberDescription_1.subscriberOperations,
                ...SubscriberDescription_1.subscriberFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available custom fields to display them to user so that he can
                // select them easily
                getCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const fields = yield GenericFunctions_1.mailerliteApiRequest.call(this, 'GET', '/fields');
                        for (const field of fields) {
                            returnData.push({
                                name: field.key,
                                value: field.key,
                            });
                        }
                        return returnData;
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
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'subscriber') {
                        //https://developers.mailerlite.com/reference#create-a-subscriber
                        if (operation === 'create') {
                            const email = this.getNodeParameter('email', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                email,
                                fields: [],
                            };
                            Object.assign(body, additionalFields);
                            if (additionalFields.customFieldsUi) {
                                const customFieldsValues = additionalFields.customFieldsUi.customFieldsValues;
                                if (customFieldsValues) {
                                    const fields = {};
                                    for (const customFieldValue of customFieldsValues) {
                                        //@ts-ignore
                                        fields[customFieldValue.fieldId] = customFieldValue.value;
                                    }
                                    body.fields = fields;
                                    delete body.customFieldsUi;
                                }
                            }
                            responseData = yield GenericFunctions_1.mailerliteApiRequest.call(this, 'POST', '/subscribers', body);
                        }
                        //https://developers.mailerlite.com/reference#single-subscriber
                        if (operation === 'get') {
                            const subscriberId = this.getNodeParameter('subscriberId', i);
                            responseData = yield GenericFunctions_1.mailerliteApiRequest.call(this, 'GET', `/subscribers/${subscriberId}`);
                        }
                        //https://developers.mailerlite.com/reference#subscribers
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            Object.assign(qs, filters);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.mailerliteApiRequestAllItems.call(this, 'GET', `/subscribers`, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.mailerliteApiRequest.call(this, 'GET', `/subscribers`, {}, qs);
                            }
                        }
                        //https://developers.mailerlite.com/reference#update-subscriber
                        if (operation === 'update') {
                            const subscriberId = this.getNodeParameter('subscriberId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            Object.assign(body, updateFields);
                            if (updateFields.customFieldsUi) {
                                const customFieldsValues = updateFields.customFieldsUi.customFieldsValues;
                                if (customFieldsValues) {
                                    const fields = {};
                                    for (const customFieldValue of customFieldsValues) {
                                        //@ts-ignore
                                        fields[customFieldValue.fieldId] = customFieldValue.value;
                                    }
                                    body.fields = fields;
                                    delete body.customFieldsUi;
                                }
                            }
                            responseData = yield GenericFunctions_1.mailerliteApiRequest.call(this, 'PUT', `/subscribers/${subscriberId}`, body);
                        }
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
            if (Array.isArray(responseData)) {
                returnData.push.apply(returnData, responseData);
            }
            else if (responseData !== undefined) {
                returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.MailerLite = MailerLite;

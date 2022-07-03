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
exports.HubspotTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const crypto_1 = require("crypto");
class HubspotTrigger {
    constructor() {
        this.description = {
            displayName: 'HubSpot Trigger',
            name: 'hubspotTrigger',
            icon: 'file:hubspot.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when HubSpot events occur',
            defaults: {
                name: 'Hubspot Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'hubspotDeveloperApi',
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
                {
                    name: 'setup',
                    httpMethod: 'GET',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Events',
                    name: 'eventsUi',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    placeholder: 'Add Event',
                    default: {},
                    options: [
                        {
                            displayName: 'Event',
                            name: 'eventValues',
                            values: [
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'options',
                                    options: [
                                        {
                                            name: 'Company Created',
                                            value: 'company.creation',
                                            description: 'To get notified if any company is created in a customer\'s account',
                                        },
                                        {
                                            name: 'Company Deleted',
                                            value: 'company.deletion',
                                            description: 'To get notified if any company is deleted in a customer\'s account',
                                        },
                                        {
                                            name: 'Company Property Changed',
                                            value: 'company.propertyChange',
                                            description: 'To get notified if a specified property is changed for any company in a customer\'s account',
                                        },
                                        {
                                            name: 'Contact Created',
                                            value: 'contact.creation',
                                            description: 'To get notified if any contact is created in a customer\'s account',
                                        },
                                        {
                                            name: 'Contact Deleted',
                                            value: 'contact.deletion',
                                            description: 'To get notified if any contact is deleted in a customer\'s account',
                                        },
                                        {
                                            name: 'Contact Privacy Deleted',
                                            value: 'contact.privacyDeletion',
                                            description: 'To get notified if a contact is deleted for privacy compliance reasons',
                                        },
                                        {
                                            name: 'Contact Property Changed',
                                            value: 'contact.propertyChange',
                                            description: 'To get notified if a specified property is changed for any contact in a customer\'s account',
                                        },
                                        {
                                            name: 'Deal Created',
                                            value: 'deal.creation',
                                            description: 'To get notified if any deal is created in a customer\'s account',
                                        },
                                        {
                                            name: 'Deal Deleted',
                                            value: 'deal.deletion',
                                            description: 'To get notified if any deal is deleted in a customer\'s account',
                                        },
                                        {
                                            name: 'Deal Property Changed',
                                            value: 'deal.propertyChange',
                                            description: 'To get notified if a specified property is changed for any deal in a customer\'s account',
                                        },
                                    ],
                                    default: 'contact.creation',
                                    required: true,
                                },
                                {
                                    displayName: 'Property Name or ID',
                                    name: 'property',
                                    type: 'options',
                                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                                    typeOptions: {
                                        loadOptionsDependsOn: [
                                            'contact.propertyChange',
                                        ],
                                        loadOptionsMethod: 'getContactProperties',
                                    },
                                    displayOptions: {
                                        show: {
                                            name: [
                                                'contact.propertyChange',
                                            ],
                                        },
                                    },
                                    default: '',
                                    required: true,
                                },
                                {
                                    displayName: 'Property Name or ID',
                                    name: 'property',
                                    type: 'options',
                                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                                    typeOptions: {
                                        loadOptionsDependsOn: [
                                            'company.propertyChange',
                                        ],
                                        loadOptionsMethod: 'getCompanyProperties',
                                    },
                                    displayOptions: {
                                        show: {
                                            name: [
                                                'company.propertyChange',
                                            ],
                                        },
                                    },
                                    default: '',
                                    required: true,
                                },
                                {
                                    displayName: 'Property Name or ID',
                                    name: 'property',
                                    type: 'options',
                                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                                    typeOptions: {
                                        loadOptionsDependsOn: [
                                            'deal.propertyChange',
                                        ],
                                        loadOptionsMethod: 'getDealProperties',
                                    },
                                    displayOptions: {
                                        show: {
                                            name: [
                                                'deal.propertyChange',
                                            ],
                                        },
                                    },
                                    default: '',
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    options: [
                        {
                            displayName: 'Max Concurrent Requests',
                            name: 'maxConcurrentRequests',
                            type: 'number',
                            typeOptions: {
                                minValue: 5,
                            },
                            default: 5,
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available contacts to display them to user so that he can
                // select them easily
                getContactProperties() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const endpoint = '/properties/v2/contacts/properties';
                        const properties = yield GenericFunctions_1.hubspotApiRequest.call(this, 'GET', endpoint, {});
                        for (const property of properties) {
                            const propertyName = property.label;
                            const propertyId = property.name;
                            returnData.push({
                                name: propertyName,
                                value: propertyId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available companies to display them to user so that he can
                // select them easily
                getCompanyProperties() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const endpoint = '/properties/v2/companies/properties';
                        const properties = yield GenericFunctions_1.hubspotApiRequest.call(this, 'GET', endpoint, {});
                        for (const property of properties) {
                            const propertyName = property.label;
                            const propertyId = property.name;
                            returnData.push({
                                name: propertyName,
                                value: propertyId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available deals to display them to user so that he can
                // select them easily
                getDealProperties() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const endpoint = '/properties/v2/deals/properties';
                        const properties = yield GenericFunctions_1.hubspotApiRequest.call(this, 'GET', endpoint, {});
                        for (const property of properties) {
                            const propertyName = property.label;
                            const propertyId = property.name;
                            returnData.push({
                                name: propertyName,
                                value: propertyId,
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
                        // Check all the webhooks which exist already if it is identical to the
                        // one that is supposed to get created.
                        const currentWebhookUrl = this.getNodeWebhookUrl('default');
                        const { appId } = yield this.getCredentials('hubspotDeveloperApi');
                        try {
                            const { targetUrl } = yield GenericFunctions_1.hubspotApiRequest.call(this, 'GET', `/webhooks/v3/${appId}/settings`, {});
                            if (targetUrl !== currentWebhookUrl) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The APP ID ${appId} already has a target url ${targetUrl}. Delete it or use another APP ID before executing the trigger. Due to Hubspot API limitations, you can have just one trigger per APP.`);
                            }
                        }
                        catch (error) {
                            if (error.statusCode === 404) {
                                return false;
                            }
                        }
                        // if the app is using the current webhook url. Delete everything and create it again with the current events
                        const { results: subscriptions } = yield GenericFunctions_1.hubspotApiRequest.call(this, 'GET', `/webhooks/v3/${appId}/subscriptions`, {});
                        // delete all subscriptions
                        for (const subscription of subscriptions) {
                            yield GenericFunctions_1.hubspotApiRequest.call(this, 'DELETE', `/webhooks/v3/${appId}/subscriptions/${subscription.id}`, {});
                        }
                        yield GenericFunctions_1.hubspotApiRequest.call(this, 'DELETE', `/webhooks/v3/${appId}/settings`, {});
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const { appId } = yield this.getCredentials('hubspotDeveloperApi');
                        const events = (this.getNodeParameter('eventsUi') || {}).eventValues || [];
                        const additionalFields = this.getNodeParameter('additionalFields');
                        let endpoint = `/webhooks/v3/${appId}/settings`;
                        let body = {
                            targetUrl: webhookUrl,
                            maxConcurrentRequests: additionalFields.maxConcurrentRequests || 5,
                        };
                        yield GenericFunctions_1.hubspotApiRequest.call(this, 'PUT', endpoint, body);
                        endpoint = `/webhooks/v3/${appId}/subscriptions`;
                        if (Array.isArray(events) && events.length === 0) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `You must define at least one event`);
                        }
                        for (const event of events) {
                            body = {
                                eventType: event.name,
                                active: true,
                            };
                            if (GenericFunctions_1.propertyEvents.includes(event.name)) {
                                const property = event.property;
                                body.propertyName = property;
                            }
                            yield GenericFunctions_1.hubspotApiRequest.call(this, 'POST', endpoint, body);
                        }
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { appId } = yield this.getCredentials('hubspotDeveloperApi');
                        const { results: subscriptions } = yield GenericFunctions_1.hubspotApiRequest.call(this, 'GET', `/webhooks/v3/${appId}/subscriptions`, {});
                        for (const subscription of subscriptions) {
                            yield GenericFunctions_1.hubspotApiRequest.call(this, 'DELETE', `/webhooks/v3/${appId}/subscriptions/${subscription.id}`, {});
                        }
                        try {
                            yield GenericFunctions_1.hubspotApiRequest.call(this, 'DELETE', `/webhooks/v3/${appId}/settings`, {});
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
            const credentials = yield this.getCredentials('hubspotDeveloperApi');
            if (credentials === undefined) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials found!');
            }
            const req = this.getRequestObject();
            const bodyData = req.body;
            const headerData = this.getHeaderData();
            //@ts-ignore
            if (headerData['x-hubspot-signature'] === undefined) {
                return {};
            }
            const hash = `${credentials.clientSecret}${JSON.stringify(bodyData)}`;
            const signature = (0, crypto_1.createHash)('sha256').update(hash).digest('hex');
            //@ts-ignore
            if (signature !== headerData['x-hubspot-signature']) {
                return {};
            }
            for (let i = 0; i < bodyData.length; i++) {
                const subscriptionType = bodyData[i].subscriptionType;
                if (subscriptionType.includes('contact')) {
                    bodyData[i].contactId = bodyData[i].objectId;
                }
                if (subscriptionType.includes('company')) {
                    bodyData[i].companyId = bodyData[i].objectId;
                }
                if (subscriptionType.includes('deal')) {
                    bodyData[i].dealId = bodyData[i].objectId;
                }
                delete bodyData[i].objectId;
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(bodyData),
                ],
            };
        });
    }
}
exports.HubspotTrigger = HubspotTrigger;

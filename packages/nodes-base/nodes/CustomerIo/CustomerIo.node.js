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
exports.CustomerIo = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const CampaignDescription_1 = require("./CampaignDescription");
const CustomerDescription_1 = require("./CustomerDescription");
const EventDescription_1 = require("./EventDescription");
const SegmentDescription_1 = require("./SegmentDescription");
class CustomerIo {
    constructor() {
        this.description = {
            displayName: 'Customer.io',
            name: 'customerIo',
            icon: 'file:customerio.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Customer.io API',
            defaults: {
                name: 'CustomerIo',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'customerIoApi',
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
                            name: 'Customer',
                            value: 'customer',
                        },
                        {
                            name: 'Event',
                            value: 'event',
                        },
                        {
                            name: 'Campaign',
                            value: 'campaign',
                        },
                        {
                            name: 'Segment',
                            value: 'segment',
                        },
                    ],
                    default: 'customer',
                },
                // CAMPAIGN
                ...CampaignDescription_1.campaignOperations,
                ...CampaignDescription_1.campaignFields,
                // CUSTOMER
                ...CustomerDescription_1.customerOperations,
                ...CustomerDescription_1.customerFields,
                // EVENT
                ...EventDescription_1.eventOperations,
                ...EventDescription_1.eventFields,
                // SEGMENT
                ...SegmentDescription_1.segmentOperations,
                ...SegmentDescription_1.segmentFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const returnData = [];
            const items = this.getInputData();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const body = {};
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'campaign') {
                        if (operation === 'get') {
                            const campaignId = this.getNodeParameter('campaignId', i);
                            const endpoint = `/campaigns/${campaignId}`;
                            responseData = yield GenericFunctions_1.customerIoApiRequest.call(this, 'GET', endpoint, body, 'beta');
                            responseData = responseData.campaign;
                        }
                        if (operation === 'getAll') {
                            const endpoint = `/campaigns`;
                            responseData = yield GenericFunctions_1.customerIoApiRequest.call(this, 'GET', endpoint, body, 'beta');
                            responseData = responseData.campaigns;
                        }
                        if (operation === 'getMetrics') {
                            const campaignId = this.getNodeParameter('campaignId', i);
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            if (jsonParameters) {
                                const additionalFieldsJson = this.getNodeParameter('additionalFieldsJson', i);
                                if (additionalFieldsJson !== '') {
                                    if ((0, GenericFunctions_1.validateJSON)(additionalFieldsJson) !== undefined) {
                                        Object.assign(body, JSON.parse(additionalFieldsJson));
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Additional fields must be a valid JSON');
                                    }
                                }
                            }
                            else {
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                const period = this.getNodeParameter('period', i);
                                let endpoint = `/campaigns/${campaignId}/metrics`;
                                if (period !== 'days') {
                                    endpoint = `${endpoint}?period=${period}`;
                                }
                                if (additionalFields.steps) {
                                    body.steps = additionalFields.steps;
                                }
                                if (additionalFields.type) {
                                    if (additionalFields.type === 'urbanAirship') {
                                        additionalFields.type = 'urban_airship';
                                    }
                                    else {
                                        body.type = additionalFields.type;
                                    }
                                }
                                responseData = yield GenericFunctions_1.customerIoApiRequest.call(this, 'GET', endpoint, body, 'beta');
                                responseData = responseData.metric;
                            }
                        }
                    }
                    if (resource === 'customer') {
                        if (operation === 'upsert') {
                            const id = this.getNodeParameter('id', i);
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            if (jsonParameters) {
                                const additionalFieldsJson = this.getNodeParameter('additionalFieldsJson', i);
                                if (additionalFieldsJson !== '') {
                                    if ((0, GenericFunctions_1.validateJSON)(additionalFieldsJson) !== undefined) {
                                        Object.assign(body, JSON.parse(additionalFieldsJson));
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Additional fields must be a valid JSON');
                                    }
                                }
                            }
                            else {
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                if (additionalFields.customProperties) {
                                    const data = {}; // tslint:disable-line:no-any
                                    //@ts-ignore
                                    additionalFields.customProperties.customProperty.map(property => {
                                        data[property.key] = property.value;
                                    });
                                    body.data = data;
                                }
                                if (additionalFields.email) {
                                    body.email = additionalFields.email;
                                }
                                if (additionalFields.createdAt) {
                                    body.created_at = new Date(additionalFields.createdAt).getTime() / 1000;
                                }
                            }
                            const endpoint = `/customers/${id}`;
                            responseData = yield GenericFunctions_1.customerIoApiRequest.call(this, 'PUT', endpoint, body, 'tracking');
                            responseData = Object.assign({ id }, body);
                        }
                        if (operation === 'delete') {
                            const id = this.getNodeParameter('id', i);
                            body.id = id;
                            const endpoint = `/customers/${id}`;
                            yield GenericFunctions_1.customerIoApiRequest.call(this, 'DELETE', endpoint, body, 'tracking');
                            responseData = {
                                success: true,
                            };
                        }
                    }
                    if (resource === 'event') {
                        if (operation === 'track') {
                            const customerId = this.getNodeParameter('customerId', i);
                            const eventName = this.getNodeParameter('eventName', i);
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            body.name = eventName;
                            if (jsonParameters) {
                                const additionalFieldsJson = this.getNodeParameter('additionalFieldsJson', i);
                                if (additionalFieldsJson !== '') {
                                    if ((0, GenericFunctions_1.validateJSON)(additionalFieldsJson) !== undefined) {
                                        Object.assign(body, JSON.parse(additionalFieldsJson));
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Additional fields must be a valid JSON');
                                    }
                                }
                            }
                            else {
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                const data = {}; // tslint:disable-line:no-any
                                if (additionalFields.customAttributes) {
                                    //@ts-ignore
                                    additionalFields.customAttributes.customAttribute.map(property => {
                                        data[property.key] = property.value;
                                    });
                                }
                                if (additionalFields.type) {
                                    data.type = additionalFields.type;
                                }
                                body.data = data;
                            }
                            const endpoint = `/customers/${customerId}/events`;
                            yield GenericFunctions_1.customerIoApiRequest.call(this, 'POST', endpoint, body, 'tracking');
                            responseData = {
                                success: true,
                            };
                        }
                        if (operation === 'trackAnonymous') {
                            const eventName = this.getNodeParameter('eventName', i);
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            body.name = eventName;
                            if (jsonParameters) {
                                const additionalFieldsJson = this.getNodeParameter('additionalFieldsJson', i);
                                if (additionalFieldsJson !== '') {
                                    if ((0, GenericFunctions_1.validateJSON)(additionalFieldsJson) !== undefined) {
                                        Object.assign(body, JSON.parse(additionalFieldsJson));
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Additional fields must be a valid JSON');
                                    }
                                }
                            }
                            else {
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                const data = {}; // tslint:disable-line:no-any
                                if (additionalFields.customAttributes) {
                                    //@ts-ignore
                                    additionalFields.customAttributes.customAttribute.map(property => {
                                        data[property.key] = property.value;
                                    });
                                }
                                body.data = data;
                            }
                            const endpoint = `/events`;
                            yield GenericFunctions_1.customerIoApiRequest.call(this, 'POST', endpoint, body, 'tracking');
                            responseData = {
                                success: true,
                            };
                        }
                    }
                    if (resource === 'segment') {
                        const segmentId = this.getNodeParameter('segmentId', i);
                        const customerIds = this.getNodeParameter('customerIds', i);
                        body.id = segmentId;
                        body.ids = customerIds.split(',');
                        let endpoint = '';
                        if (operation === 'add') {
                            endpoint = `/segments/${segmentId}/add_customers`;
                        }
                        else {
                            endpoint = `/segments/${segmentId}/remove_customers`;
                        }
                        responseData = yield GenericFunctions_1.customerIoApiRequest.call(this, 'POST', endpoint, body, 'tracking');
                        responseData = {
                            success: true,
                        };
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
exports.CustomerIo = CustomerIo;

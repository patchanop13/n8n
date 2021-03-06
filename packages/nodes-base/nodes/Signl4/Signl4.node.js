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
exports.Signl4 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class Signl4 {
    constructor() {
        this.description = {
            displayName: 'SIGNL4',
            name: 'signl4',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:signl4.png',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume SIGNL4 API',
            defaults: {
                name: 'SIGNL4',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'signl4Api',
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
                            name: 'Alert',
                            value: 'alert',
                        },
                    ],
                    default: 'alert',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'alert',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Send',
                            value: 'send',
                            description: 'Send an alert',
                        },
                        {
                            name: 'Resolve',
                            value: 'resolve',
                            description: 'Resolve an alert',
                        },
                    ],
                    default: 'send',
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    default: '',
                    displayOptions: {
                        show: {
                            operation: [
                                'send',
                            ],
                            resource: [
                                'alert',
                            ],
                        },
                    },
                    description: 'A more detailed description for the alert',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    displayOptions: {
                        show: {
                            operation: [
                                'send',
                            ],
                            resource: [
                                'alert',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Alerting Scenario',
                            name: 'alertingScenario',
                            type: 'options',
                            options: [
                                {
                                    name: 'Single ACK',
                                    value: 'single_ack',
                                    description: 'In case only one person needs to confirm this Signl',
                                },
                                {
                                    name: 'Multi ACK',
                                    value: 'multi_ack',
                                    description: 'In case this alert must be confirmed by the number of people who are on duty at the time this Singl is raised',
                                },
                            ],
                            default: 'single_ack',
                        },
                        {
                            displayName: 'Attachments',
                            name: 'attachmentsUi',
                            placeholder: 'Add Attachments',
                            type: 'fixedCollection',
                            typeOptions: {
                                multipleValues: false,
                            },
                            options: [
                                {
                                    name: 'attachmentsBinary',
                                    displayName: 'Attachments Binary',
                                    values: [
                                        {
                                            displayName: 'Property Name',
                                            name: 'property',
                                            type: 'string',
                                            placeholder: 'data',
                                            default: '',
                                            description: 'Name of the binary properties which contain data which should be added as attachment',
                                        },
                                    ],
                                },
                            ],
                            default: {},
                        },
                        {
                            displayName: 'External ID',
                            name: 'externalId',
                            type: 'string',
                            default: '',
                            description: 'If the event originates from a record in a 3rd party system, use this parameter to pass the unique ID of that record. That ID will be communicated in outbound webhook notifications from SIGNL4, which is great for correlation/synchronization of that record with the alert. If you resolve / close an alert you must use the same External ID as in the original alert.',
                        },
                        {
                            displayName: 'Filtering',
                            name: 'filtering',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to apply event filtering for this event, or not. If set to true, the event will only trigger a notification to the team, if it contains at least one keyword from one of your services and system categories (i.e. it is whitelisted)',
                        },
                        {
                            displayName: 'Location',
                            name: 'locationFieldsUi',
                            type: 'fixedCollection',
                            placeholder: 'Add Location',
                            default: {},
                            description: 'Transmit location information (\'latitude, longitude\') with your event and display a map in the mobile app',
                            options: [
                                {
                                    name: 'locationFieldsValues',
                                    displayName: 'Location',
                                    values: [
                                        {
                                            displayName: 'Latitude',
                                            name: 'latitude',
                                            type: 'string',
                                            required: true,
                                            description: 'The location latitude',
                                            default: '',
                                        },
                                        {
                                            displayName: 'Longitude',
                                            name: 'longitude',
                                            type: 'string',
                                            required: true,
                                            description: 'The location longitude',
                                            default: '',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            displayName: 'Service',
                            name: 'service',
                            type: 'string',
                            default: '',
                            description: 'Assigns the alert to the service/system category with the specified name',
                        },
                        {
                            displayName: 'Title',
                            name: 'title',
                            type: 'string',
                            default: '',
                            description: 'The title or subject of this alert',
                        },
                    ],
                },
                {
                    displayName: 'External ID',
                    name: 'externalId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: [
                                'resolve',
                            ],
                            resource: [
                                'alert',
                            ],
                        },
                    },
                    description: 'If the event originates from a record in a 3rd party system, use this parameter to pass the unique ID of that record. That ID will be communicated in outbound webhook notifications from SIGNL4, which is great for correlation/synchronization of that record with the alert. If you resolve / close an alert you must use the same External ID as in the original alert.',
                },
            ],
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
                    if (resource === 'alert') {
                        //https://connect.signl4.com/webhook/docs/index.html
                        // Send alert
                        if (operation === 'send') {
                            const message = this.getNodeParameter('message', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const data = {
                                message,
                            };
                            if (additionalFields.title) {
                                data.title = additionalFields.title;
                            }
                            if (additionalFields.service) {
                                data.service = additionalFields.service;
                            }
                            if (additionalFields.locationFieldsUi) {
                                const locationUi = additionalFields.locationFieldsUi.locationFieldsValues;
                                if (locationUi) {
                                    data['X-S4-Location'] = `${locationUi.latitude},${locationUi.longitude}`;
                                }
                            }
                            if (additionalFields.alertingScenario) {
                                data['X-S4-AlertingScenario'] = additionalFields.alertingScenario;
                            }
                            if (additionalFields.filtering) {
                                data['X-S4-Filtering'] = additionalFields.filtering.toString();
                            }
                            if (additionalFields.externalId) {
                                data['X-S4-ExternalID'] = additionalFields.externalId;
                            }
                            data['X-S4-Status'] = 'new';
                            data['X-S4-SourceSystem'] = 'n8n';
                            // Attachments
                            const attachments = additionalFields.attachmentsUi;
                            if (attachments) {
                                if (attachments.attachmentsBinary && items[i].binary) {
                                    const propertyName = attachments.attachmentsBinary.property;
                                    const binaryProperty = items[i].binary[propertyName];
                                    if (binaryProperty) {
                                        const supportedFileExtension = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'mp3', 'wav'];
                                        if (!supportedFileExtension.includes(binaryProperty.fileExtension)) {
                                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Invalid extension, just ${supportedFileExtension.join(',')} are supported}`);
                                        }
                                        const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, propertyName);
                                        data.attachment = {
                                            value: binaryDataBuffer,
                                            options: {
                                                filename: binaryProperty.fileName,
                                                contentType: binaryProperty.mimeType,
                                            },
                                        };
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Binary property ${propertyName} does not exist on input`);
                                    }
                                }
                            }
                            responseData = yield GenericFunctions_1.SIGNL4ApiRequest.call(this, 'POST', '', {}, {
                                formData: data,
                            });
                        }
                        // Resolve alert
                        if (operation === 'resolve') {
                            const data = {};
                            data['X-S4-ExternalID'] = this.getNodeParameter('externalId', i);
                            data['X-S4-Status'] = 'resolved';
                            data['X-S4-SourceSystem'] = 'n8n';
                            responseData = yield GenericFunctions_1.SIGNL4ApiRequest.call(this, 'POST', '', {}, {
                                formData: data,
                            });
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else if (responseData !== undefined) {
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
exports.Signl4 = Signl4;

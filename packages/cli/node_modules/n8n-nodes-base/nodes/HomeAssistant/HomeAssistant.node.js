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
exports.HomeAssistant = void 0;
const ConfigDescription_1 = require("./ConfigDescription");
const ServiceDescription_1 = require("./ServiceDescription");
const StateDescription_1 = require("./StateDescription");
const EventDescription_1 = require("./EventDescription");
const LogDescription_1 = require("./LogDescription");
const TemplateDescription_1 = require("./TemplateDescription");
const HistoryDescription_1 = require("./HistoryDescription");
const CameraProxyDescription_1 = require("./CameraProxyDescription");
const GenericFunctions_1 = require("./GenericFunctions");
class HomeAssistant {
    constructor() {
        this.description = {
            displayName: 'Home Assistant',
            name: 'homeAssistant',
            icon: 'file:homeAssistant.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Home Assistant API',
            defaults: {
                name: 'Home Assistant',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'homeAssistantApi',
                    required: true,
                    testedBy: 'homeAssistantApiTest',
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
                            name: 'Camera Proxy',
                            value: 'cameraProxy',
                        },
                        {
                            name: 'Config',
                            value: 'config',
                        },
                        {
                            name: 'Event',
                            value: 'event',
                        },
                        // {
                        // 	name: 'History',
                        // 	value: 'history',
                        // },
                        {
                            name: 'Log',
                            value: 'log',
                        },
                        {
                            name: 'Service',
                            value: 'service',
                        },
                        {
                            name: 'State',
                            value: 'state',
                        },
                        {
                            name: 'Template',
                            value: 'template',
                        },
                    ],
                    default: 'config',
                },
                ...CameraProxyDescription_1.cameraProxyOperations,
                ...CameraProxyDescription_1.cameraProxyFields,
                ...ConfigDescription_1.configOperations,
                ...EventDescription_1.eventOperations,
                ...EventDescription_1.eventFields,
                ...HistoryDescription_1.historyOperations,
                ...HistoryDescription_1.historyFields,
                ...LogDescription_1.logOperations,
                ...LogDescription_1.logFields,
                ...ServiceDescription_1.serviceOperations,
                ...ServiceDescription_1.serviceFields,
                ...StateDescription_1.stateOperations,
                ...StateDescription_1.stateFields,
                ...TemplateDescription_1.templateOperations,
                ...TemplateDescription_1.templateFields,
            ],
        };
        this.methods = {
            credentialTest: {
                homeAssistantApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = credential.data;
                        const options = {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${credentials.accessToken}`,
                            },
                            uri: `${credentials.ssl === true ? 'https' : 'http'}://${credentials.host}:${credentials.port || '8123'}/api/`,
                            json: true,
                            timeout: 5000,
                        };
                        try {
                            const response = yield this.helpers.request(options);
                            if (!response.message) {
                                return {
                                    status: 'Error',
                                    message: `Token is not valid: ${response.error}`,
                                };
                            }
                        }
                        catch (error) {
                            return {
                                status: 'Error',
                                message: `${error.statusCode === 401 ? 'Token is' : 'Settings are'} not valid: ${error}`,
                            };
                        }
                        return {
                            status: 'OK',
                            message: 'Authentication successful!',
                        };
                    });
                },
            },
            loadOptions: {
                getAllEntities() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getHomeAssistantEntities.call(this);
                    });
                },
                getCameraEntities() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getHomeAssistantEntities.call(this, 'camera');
                    });
                },
                getDomains() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getHomeAssistantServices.call(this);
                    });
                },
                getDomainServices() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const currentDomain = this.getCurrentNodeParameter('domain');
                        if (currentDomain) {
                            return yield GenericFunctions_1.getHomeAssistantServices.call(this, currentDomain);
                        }
                        else {
                            return [];
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
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const qs = {};
            let responseData;
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'config') {
                        if (operation === 'get') {
                            responseData = yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'GET', '/config');
                        }
                        else if (operation === 'check') {
                            responseData = yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'POST', '/config/core/check_config');
                        }
                    }
                    else if (resource === 'service') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = (yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'GET', '/services'));
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                        else if (operation === 'call') {
                            const domain = this.getNodeParameter('domain', i);
                            const service = this.getNodeParameter('service', i);
                            const serviceAttributes = this.getNodeParameter('serviceAttributes', i);
                            const body = {};
                            if (Object.entries(serviceAttributes).length) {
                                if (serviceAttributes.attributes !== undefined) {
                                    serviceAttributes.attributes.map(attribute => {
                                        // @ts-ignore
                                        body[attribute.name] = attribute.value;
                                    });
                                }
                            }
                            responseData = yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'POST', `/services/${domain}/${service}`, body);
                            if (Array.isArray(responseData) && responseData.length === 0) {
                                responseData = {};
                            }
                        }
                    }
                    else if (resource === 'state') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = (yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'GET', '/states'));
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                        else if (operation === 'get') {
                            const entityId = this.getNodeParameter('entityId', i);
                            responseData = yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'GET', `/states/${entityId}`);
                        }
                        else if (operation === 'upsert') {
                            const entityId = this.getNodeParameter('entityId', i);
                            const state = this.getNodeParameter('state', i);
                            const stateAttributes = this.getNodeParameter('stateAttributes', i);
                            const body = {
                                state,
                                attributes: {},
                            };
                            if (Object.entries(stateAttributes).length) {
                                if (stateAttributes.attributes !== undefined) {
                                    stateAttributes.attributes.map(attribute => {
                                        // @ts-ignore
                                        body.attributes[attribute.name] = attribute.value;
                                    });
                                }
                            }
                            responseData = yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'POST', `/states/${entityId}`, body);
                        }
                    }
                    else if (resource === 'event') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = (yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'GET', '/events'));
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                        else if (operation === 'create') {
                            const eventType = this.getNodeParameter('eventType', i);
                            const eventAttributes = this.getNodeParameter('eventAttributes', i);
                            const body = {};
                            if (Object.entries(eventAttributes).length) {
                                if (eventAttributes.attributes !== undefined) {
                                    eventAttributes.attributes.map(attribute => {
                                        // @ts-ignore
                                        body[attribute.name] = attribute.value;
                                    });
                                }
                            }
                            responseData = yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'POST', `/events/${eventType}`, body);
                        }
                    }
                    else if (resource === 'log') {
                        if (operation === 'getErroLogs') {
                            responseData = yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'GET', '/error_log');
                            if (responseData) {
                                responseData = {
                                    errorLog: responseData,
                                };
                            }
                        }
                        else if (operation === 'getLogbookEntries') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            let endpoint = '/logbook';
                            if (Object.entries(additionalFields).length) {
                                if (additionalFields.startTime) {
                                    endpoint = `/logbook/${additionalFields.startTime}`;
                                }
                                if (additionalFields.endTime) {
                                    qs.end_time = additionalFields.endTime;
                                }
                                if (additionalFields.entityId) {
                                    qs.entity = additionalFields.entityId;
                                }
                            }
                            responseData = yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'GET', endpoint, {}, qs);
                        }
                    }
                    else if (resource === 'template') {
                        if (operation === 'create') {
                            const body = {
                                template: this.getNodeParameter('template', i),
                            };
                            responseData = yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'POST', '/template', body);
                            if (responseData) {
                                responseData = { renderedTemplate: responseData };
                            }
                        }
                    }
                    else if (resource === 'history') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            let endpoint = '/history/period';
                            if (Object.entries(additionalFields).length) {
                                if (additionalFields.startTime) {
                                    endpoint = `/history/period/${additionalFields.startTime}`;
                                }
                                if (additionalFields.endTime) {
                                    qs.end_time = additionalFields.endTime;
                                }
                                if (additionalFields.entityIds) {
                                    qs.filter_entity_id = additionalFields.entityIds;
                                }
                                if (additionalFields.minimalResponse === true) {
                                    qs.minimal_response = additionalFields.minimalResponse;
                                }
                                if (additionalFields.significantChangesOnly === true) {
                                    qs.significant_changes_only = additionalFields.significantChangesOnly;
                                }
                            }
                            responseData = (yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'GET', endpoint, {}, qs));
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                    }
                    else if (resource === 'cameraProxy') {
                        if (operation === 'getScreenshot') {
                            const cameraEntityId = this.getNodeParameter('cameraEntityId', i);
                            const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i);
                            const endpoint = `/camera_proxy/${cameraEntityId}`;
                            let mimeType;
                            responseData = yield GenericFunctions_1.homeAssistantApiRequest.call(this, 'GET', endpoint, {}, {}, undefined, {
                                encoding: null,
                                resolveWithFullResponse: true,
                            });
                            const newItem = {
                                json: items[i].json,
                                binary: {},
                            };
                            if (mimeType === undefined && responseData.headers['content-type']) {
                                mimeType = responseData.headers['content-type'];
                            }
                            if (items[i].binary !== undefined) {
                                // Create a shallow copy of the binary data so that the old
                                // data references which do not get changed still stay behind
                                // but the incoming data does not get changed.
                                Object.assign(newItem.binary, items[i].binary);
                            }
                            items[i] = newItem;
                            const data = Buffer.from(responseData.body);
                            items[i].binary[dataPropertyNameDownload] = yield this.helpers.prepareBinaryData(data, 'screenshot.jpg', mimeType);
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        if (resource === 'cameraProxy' && operation === 'get') {
                            items[i].json = { error: error.message };
                        }
                        else {
                            returnData.push({ error: error.message });
                        }
                        continue;
                    }
                    throw error;
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            if (resource === 'cameraProxy' && operation === 'getScreenshot') {
                return this.prepareOutputData(items);
            }
            else {
                return [this.helpers.returnJsonArray(returnData)];
            }
        });
    }
}
exports.HomeAssistant = HomeAssistant;

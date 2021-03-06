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
exports.Demio = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const EventDescription_1 = require("./EventDescription");
const ReportDescription_1 = require("./ReportDescription");
class Demio {
    constructor() {
        this.description = {
            displayName: 'Demio',
            name: 'demio',
            icon: 'file:demio.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Demio API',
            defaults: {
                name: 'Demio',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'demioApi',
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
                            name: 'Event',
                            value: 'event',
                        },
                        {
                            name: 'Report',
                            value: 'report',
                        },
                    ],
                    default: 'event',
                },
                // Event
                ...EventDescription_1.eventOperations,
                ...EventDescription_1.eventFields,
                // Report
                ...ReportDescription_1.reportOperations,
                ...ReportDescription_1.reportFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the events to display them to user so that he can
                // select them easily
                getEvents() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const events = yield GenericFunctions_1.demioApiRequest.call(this, 'GET', `/events`, {}, { type: 'upcoming' });
                        for (const event of events) {
                            returnData.push({
                                name: event.name,
                                value: event.id,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the sessions to display them to user so that he can
                // select them easily
                getEventSessions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const eventId = this.getCurrentNodeParameter('eventId');
                        const qs = {};
                        const resource = this.getCurrentNodeParameter('resource');
                        if (resource !== 'report') {
                            qs.active = true;
                        }
                        const returnData = [];
                        const { dates } = yield GenericFunctions_1.demioApiRequest.call(this, 'GET', `/event/${eventId}`, {});
                        for (const date of dates) {
                            returnData.push({
                                name: date.datetime,
                                value: date.date_id,
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
                    if (resource === 'event') {
                        if (operation === 'get') {
                            const id = this.getNodeParameter('eventId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.date_id !== undefined) {
                                responseData = yield GenericFunctions_1.demioApiRequest.call(this, 'GET', `/event/${id}/date/${additionalFields.date_id}`);
                            }
                            else {
                                Object.assign(qs, additionalFields);
                                responseData = yield GenericFunctions_1.demioApiRequest.call(this, 'GET', `/event/${id}`, {}, qs);
                            }
                        }
                        if (operation === 'getAll') {
                            const filters = this.getNodeParameter('filters', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            Object.assign(qs, filters);
                            responseData = yield GenericFunctions_1.demioApiRequest.call(this, 'GET', `/events`, {}, qs);
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        if (operation === 'register') {
                            const eventId = this.getNodeParameter('eventId', i);
                            const firstName = this.getNodeParameter('firstName', i);
                            const email = this.getNodeParameter('email', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                name: firstName,
                                email,
                                id: eventId,
                            };
                            Object.assign(body, additionalFields);
                            if (additionalFields.customFieldsUi) {
                                const customFields = (additionalFields.customFieldsUi || {}).customFieldsValues || [];
                                const data = customFields.reduce((obj, value) => Object.assign(obj, { [`${value.fieldId}`]: value.value }), {});
                                Object.assign(body, data);
                                delete additionalFields.customFields;
                            }
                            responseData = yield GenericFunctions_1.demioApiRequest.call(this, 'PUT', `/event/register`, body);
                        }
                    }
                    if (resource === 'report') {
                        if (operation === 'get') {
                            const sessionId = this.getNodeParameter('dateId', i);
                            const filters = this.getNodeParameter('filters', i);
                            Object.assign(qs, filters);
                            responseData = yield GenericFunctions_1.demioApiRequest.call(this, 'GET', `/report/${sessionId}/participants`, {}, qs);
                            responseData = responseData.participants;
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
exports.Demio = Demio;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagerDuty = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const IncidentDescription_1 = require("./IncidentDescription");
const IncidentNoteDescription_1 = require("./IncidentNoteDescription");
const LogEntryDescription_1 = require("./LogEntryDescription");
const UserDescription_1 = require("./UserDescription");
const change_case_1 = require("change-case");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class PagerDuty {
    constructor() {
        this.description = {
            displayName: 'PagerDuty',
            name: 'pagerDuty',
            icon: 'file:pagerDuty.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume PagerDuty API',
            defaults: {
                name: 'PagerDuty',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'pagerDutyApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'apiToken',
                            ],
                        },
                    },
                },
                {
                    name: 'pagerDutyOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'API Token',
                            value: 'apiToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'apiToken',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Incident',
                            value: 'incident',
                        },
                        {
                            name: 'Incident Note',
                            value: 'incidentNote',
                        },
                        {
                            name: 'Log Entry',
                            value: 'logEntry',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'incident',
                },
                // INCIDENT
                ...IncidentDescription_1.incidentOperations,
                ...IncidentDescription_1.incidentFields,
                // INCIDENT NOTE
                ...IncidentNoteDescription_1.incidentNoteOperations,
                ...IncidentNoteDescription_1.incidentNoteFields,
                // LOG ENTRY
                ...LogEntryDescription_1.logEntryOperations,
                ...LogEntryDescription_1.logEntryFields,
                // USER
                ...UserDescription_1.userOperations,
                ...UserDescription_1.userFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available escalation policies to display them to user so that he can
                // select them easily
                getEscalationPolicies() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const escalationPolicies = yield GenericFunctions_1.pagerDutyApiRequestAllItems.call(this, 'escalation_policies', 'GET', '/escalation_policies');
                        for (const escalationPolicy of escalationPolicies) {
                            const escalationPolicyName = escalationPolicy.name;
                            const escalationPolicyId = escalationPolicy.id;
                            returnData.push({
                                name: escalationPolicyName,
                                value: escalationPolicyId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available priorities to display them to user so that he can
                // select them easily
                getPriorities() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const priorities = yield GenericFunctions_1.pagerDutyApiRequestAllItems.call(this, 'priorities', 'GET', '/priorities');
                        for (const priority of priorities) {
                            const priorityName = priority.name;
                            const priorityId = priority.id;
                            const priorityDescription = priority.description;
                            returnData.push({
                                name: priorityName,
                                value: priorityId,
                                description: priorityDescription,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available services to display them to user so that he can
                // select them easily
                getServices() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const services = yield GenericFunctions_1.pagerDutyApiRequestAllItems.call(this, 'services', 'GET', '/services');
                        for (const service of services) {
                            const serviceName = service.name;
                            const serviceId = service.id;
                            returnData.push({
                                name: serviceName,
                                value: serviceId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the timezones to display them to user so that he can
                // select them easily
                getTimezones() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        for (const timezone of moment_timezone_1.default.tz.names()) {
                            const timezoneName = timezone;
                            const timezoneId = timezone;
                            returnData.push({
                                name: timezoneName,
                                value: timezoneId,
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
            let responseData;
            const qs = {};
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'incident') {
                        //https://api-reference.pagerduty.com/#!/Incidents/post_incidents
                        if (operation === 'create') {
                            const title = this.getNodeParameter('title', i);
                            const serviceId = this.getNodeParameter('serviceId', i);
                            const email = this.getNodeParameter('email', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const conferenceBridge = this.getNodeParameter('conferenceBridgeUi', i).conferenceBridgeValues;
                            const body = {
                                type: 'incident',
                                title,
                                service: {
                                    id: serviceId,
                                    type: 'service_reference',
                                },
                            };
                            if (additionalFields.details) {
                                body.body = {
                                    type: 'incident_body',
                                    details: additionalFields.details,
                                };
                            }
                            if (additionalFields.priorityId) {
                                body.priority = {
                                    id: additionalFields.priorityId,
                                    type: 'priority_reference',
                                };
                            }
                            if (additionalFields.escalationPolicyId) {
                                body.escalation_policy = {
                                    id: additionalFields.escalationPolicyId,
                                    type: 'escalation_policy_reference',
                                };
                            }
                            if (additionalFields.urgency) {
                                body.urgency = additionalFields.urgency;
                            }
                            if (additionalFields.incidentKey) {
                                body.incident_key = additionalFields.incidentKey;
                            }
                            if (conferenceBridge) {
                                body.conference_bridge = {
                                    conference_number: conferenceBridge.conferenceNumber,
                                    conference_url: conferenceBridge.conferenceUrl,
                                };
                            }
                            responseData = yield GenericFunctions_1.pagerDutyApiRequest.call(this, 'POST', '/incidents', { incident: body }, {}, undefined, { from: email });
                            responseData = responseData.incident;
                        }
                        //https://api-reference.pagerduty.com/#!/Incidents/get_incidents_id
                        if (operation === 'get') {
                            const incidentId = this.getNodeParameter('incidentId', i);
                            responseData = yield GenericFunctions_1.pagerDutyApiRequest.call(this, 'GET', `/incidents/${incidentId}`);
                            responseData = responseData.incident;
                        }
                        //https://api-reference.pagerduty.com/#!/Incidents/get_incidents
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const options = this.getNodeParameter('options', 0);
                            if (options.userIds) {
                                options.userIds = options.userIds.split(',');
                            }
                            if (options.teamIds) {
                                options.teamIds = options.teamIds.split(',');
                            }
                            if (options.include) {
                                options.include = options.include.map((e) => (0, change_case_1.snakeCase)(e));
                            }
                            if (options.sortBy) {
                                options.sortBy = options.sortBy;
                            }
                            Object.assign(qs, (0, GenericFunctions_1.keysToSnakeCase)(options)[0]);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.pagerDutyApiRequestAllItems.call(this, 'incidents', 'GET', '/incidents', {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.pagerDutyApiRequest.call(this, 'GET', '/incidents', {}, qs);
                                responseData = responseData.incidents;
                            }
                        }
                        //https://api-reference.pagerduty.com/#!/Incidents/put_incidents_id
                        if (operation === 'update') {
                            const incidentId = this.getNodeParameter('incidentId', i);
                            const email = this.getNodeParameter('email', i);
                            const conferenceBridge = this.getNodeParameter('conferenceBridgeUi', i).conferenceBridgeValues;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {
                                type: 'incident',
                            };
                            if (updateFields.title) {
                                body.title = updateFields.title;
                            }
                            if (updateFields.escalationLevel) {
                                body.escalation_level = updateFields.escalationLevel;
                            }
                            if (updateFields.details) {
                                body.body = {
                                    type: 'incident_body',
                                    details: updateFields.details,
                                };
                            }
                            if (updateFields.priorityId) {
                                body.priority = {
                                    id: updateFields.priorityId,
                                    type: 'priority_reference',
                                };
                            }
                            if (updateFields.escalationPolicyId) {
                                body.escalation_policy = {
                                    id: updateFields.escalationPolicyId,
                                    type: 'escalation_policy_reference',
                                };
                            }
                            if (updateFields.urgency) {
                                body.urgency = updateFields.urgency;
                            }
                            if (updateFields.resolution) {
                                body.resolution = updateFields.resolution;
                            }
                            if (updateFields.status) {
                                body.status = updateFields.status;
                            }
                            if (conferenceBridge) {
                                body.conference_bridge = {
                                    conference_number: conferenceBridge.conferenceNumber,
                                    conference_url: conferenceBridge.conferenceUrl,
                                };
                            }
                            responseData = yield GenericFunctions_1.pagerDutyApiRequest.call(this, 'PUT', `/incidents/${incidentId}`, { incident: body }, {}, undefined, { from: email });
                            responseData = responseData.incident;
                        }
                    }
                    if (resource === 'incidentNote') {
                        //https://api-reference.pagerduty.com/#!/Incidents/post_incidents_id_notes
                        if (operation === 'create') {
                            const incidentId = this.getNodeParameter('incidentId', i);
                            const content = this.getNodeParameter('content', i);
                            const email = this.getNodeParameter('email', i);
                            const body = {
                                content,
                            };
                            responseData = yield GenericFunctions_1.pagerDutyApiRequest.call(this, 'POST', `/incidents/${incidentId}/notes`, { note: body }, {}, undefined, { from: email });
                        }
                        //https://api-reference.pagerduty.com/#!/Incidents/get_incidents_id_notes
                        if (operation === 'getAll') {
                            const incidentId = this.getNodeParameter('incidentId', i);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.pagerDutyApiRequestAllItems.call(this, 'notes', 'GET', `/incidents/${incidentId}/notes`, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.pagerDutyApiRequest.call(this, 'GET', `/incidents/${incidentId}/notes`, {}, qs);
                                responseData = responseData.notes;
                            }
                        }
                    }
                    if (resource === 'logEntry') {
                        //https://api-reference.pagerduty.com/#!/Log_Entries/get_log_entries_id
                        if (operation === 'get') {
                            const logEntryId = this.getNodeParameter('logEntryId', i);
                            responseData = yield GenericFunctions_1.pagerDutyApiRequest.call(this, 'GET', `/log_entries/${logEntryId}`);
                            responseData = responseData.log_entry;
                        }
                        //https://api-reference.pagerduty.com/#!/Log_Entries/get_log_entries
                        if (operation === 'getAll') {
                            const options = this.getNodeParameter('options', i);
                            Object.assign(qs, options);
                            (0, GenericFunctions_1.keysToSnakeCase)(qs);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.pagerDutyApiRequestAllItems.call(this, 'log_entries', 'GET', '/log_entries', {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.pagerDutyApiRequest.call(this, 'GET', '/log_entries', {}, qs);
                                responseData = responseData.log_entries;
                            }
                        }
                    }
                    if (resource === 'user') {
                        //https://developer.pagerduty.com/api-reference/reference/REST/openapiv3.json/paths/~1users~1%7Bid%7D/get
                        if (operation === 'get') {
                            const userId = this.getNodeParameter('userId', i);
                            responseData = yield GenericFunctions_1.pagerDutyApiRequest.call(this, 'GET', `/users/${userId}`);
                            responseData = responseData.user;
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
exports.PagerDuty = PagerDuty;

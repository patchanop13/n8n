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
exports.Clockify = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const ClientDescription_1 = require("./ClientDescription");
const ProjectDescription_1 = require("./ProjectDescription");
const TagDescription_1 = require("./TagDescription");
const TaskDescription_1 = require("./TaskDescription");
const TimeEntryDescription_1 = require("./TimeEntryDescription");
const UserDescription_1 = require("./UserDescription");
const WorkspaceDescription_1 = require("./WorkspaceDescription");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class Clockify {
    constructor() {
        this.description = {
            displayName: 'Clockify',
            name: 'clockify',
            icon: 'file:clockify.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Clockify REST API',
            defaults: {
                name: 'Clockify',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'clockifyApi',
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
                            name: 'Client',
                            value: 'client',
                        },
                        {
                            name: 'Project',
                            value: 'project',
                        },
                        {
                            name: 'Tag',
                            value: 'tag',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                        {
                            name: 'Time Entry',
                            value: 'timeEntry',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                        {
                            name: 'Workspace',
                            value: 'workspace',
                        },
                    ],
                    default: 'project',
                },
                ...ClientDescription_1.clientOperations,
                ...ProjectDescription_1.projectOperations,
                ...TagDescription_1.tagOperations,
                ...TaskDescription_1.taskOperations,
                ...TimeEntryDescription_1.timeEntryOperations,
                ...UserDescription_1.userOperations,
                ...WorkspaceDescription_1.workspaceOperations,
                ...WorkspaceDescription_1.workspaceFields,
                {
                    displayName: 'Workspace Name or ID',
                    name: 'workspaceId',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'listWorkspaces',
                    },
                    required: true,
                    default: [],
                    displayOptions: {
                        hide: {
                            resource: [
                                'workspace',
                            ],
                        },
                    },
                },
                ...ClientDescription_1.clientFields,
                ...ProjectDescription_1.projectFields,
                ...TagDescription_1.tagFields,
                ...TaskDescription_1.taskFields,
                ...UserDescription_1.userFields,
                ...TimeEntryDescription_1.timeEntryFields,
            ],
        };
        this.methods = {
            loadOptions: {
                listWorkspaces() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rtv = [];
                        const workspaces = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', 'workspaces');
                        if (undefined !== workspaces) {
                            workspaces.forEach(value => {
                                rtv.push({
                                    name: value.name,
                                    value: value.id,
                                });
                            });
                        }
                        return rtv;
                    });
                },
                loadUsersForWorkspace() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rtv = [];
                        const workspaceId = this.getCurrentNodeParameter('workspaceId');
                        if (undefined !== workspaceId) {
                            const resource = `workspaces/${workspaceId}/users`;
                            const users = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', resource);
                            if (undefined !== users) {
                                users.forEach(value => {
                                    rtv.push({
                                        name: value.name,
                                        value: value.id,
                                    });
                                });
                            }
                        }
                        return rtv;
                    });
                },
                loadClientsForWorkspace() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rtv = [];
                        const workspaceId = this.getCurrentNodeParameter('workspaceId');
                        if (undefined !== workspaceId) {
                            const resource = `workspaces/${workspaceId}/clients`;
                            const clients = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', resource);
                            if (undefined !== clients) {
                                clients.forEach(value => {
                                    rtv.push({
                                        name: value.name,
                                        value: value.id,
                                    });
                                });
                            }
                        }
                        return rtv;
                    });
                },
                loadProjectsForWorkspace() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rtv = [];
                        const workspaceId = this.getCurrentNodeParameter('workspaceId');
                        if (undefined !== workspaceId) {
                            const resource = `workspaces/${workspaceId}/projects`;
                            const users = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', resource);
                            if (undefined !== users) {
                                users.forEach(value => {
                                    rtv.push({
                                        name: value.name,
                                        value: value.id,
                                    });
                                });
                            }
                        }
                        return rtv;
                    });
                },
                loadTagsForWorkspace() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rtv = [];
                        const workspaceId = this.getCurrentNodeParameter('workspaceId');
                        if (undefined !== workspaceId) {
                            const resource = `workspaces/${workspaceId}/tags`;
                            const users = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', resource);
                            if (undefined !== users) {
                                users.forEach(value => {
                                    rtv.push({
                                        name: value.name,
                                        value: value.id,
                                    });
                                });
                            }
                        }
                        return rtv;
                    });
                },
                loadCustomFieldsForWorkspace() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rtv = [];
                        const workspaceId = this.getCurrentNodeParameter('workspaceId');
                        if (undefined !== workspaceId) {
                            const resource = `workspaces/${workspaceId}/custom-fields`;
                            const customFields = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', resource);
                            for (const customField of customFields) {
                                rtv.push({
                                    name: customField.name,
                                    value: customField.id,
                                });
                            }
                        }
                        return rtv;
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
                    if (resource === 'client') {
                        if (operation === 'create') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const name = this.getNodeParameter('name', i);
                            const body = {
                                name,
                            };
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'POST', `/workspaces/${workspaceId}/clients`, body, qs);
                        }
                        if (operation === 'delete') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const clientId = this.getNodeParameter('clientId', i);
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'DELETE', `/workspaces/${workspaceId}/clients/${clientId}`, {}, qs);
                        }
                        if (operation === 'update') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const clientId = this.getNodeParameter('clientId', i);
                            const name = this.getNodeParameter('name', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {
                                name,
                            };
                            Object.assign(body, updateFields);
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'PUT', `/workspaces/${workspaceId}/clients/${clientId}`, body, qs);
                        }
                        if (operation === 'get') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const clientId = this.getNodeParameter('clientId', i);
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', `/workspaces/${workspaceId}/clients/${clientId}`, {}, qs);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.clockifyApiRequestAllItems.call(this, 'GET', `/workspaces/${workspaceId}/clients`, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.clockifyApiRequestAllItems.call(this, 'GET', `/workspaces/${workspaceId}/clients`, {}, qs);
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                    }
                    if (resource === 'project') {
                        if (operation === 'create') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                name,
                            };
                            Object.assign(body, additionalFields);
                            if (body.estimateUi) {
                                body.estimate = body.estimateUi.estimateValues;
                                delete body.estimateUi;
                            }
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'POST', `/workspaces/${workspaceId}/projects`, body, qs);
                        }
                        if (operation === 'delete') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const projectId = this.getNodeParameter('projectId', i);
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'DELETE', `/workspaces/${workspaceId}/projects/${projectId}`, {}, qs);
                        }
                        if (operation === 'get') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const projectId = this.getNodeParameter('projectId', i);
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', `/workspaces/${workspaceId}/projects/${projectId}`, {}, qs);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.clockifyApiRequestAllItems.call(this, 'GET', `/workspaces/${workspaceId}/projects`, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.clockifyApiRequestAllItems.call(this, 'GET', `/workspaces/${workspaceId}/projects`, {}, qs);
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                        if (operation === 'update') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const projectId = this.getNodeParameter('projectId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            Object.assign(body, updateFields);
                            if (body.estimateUi) {
                                body.estimate = body.estimateUi.estimateValues;
                                delete body.estimateUi;
                            }
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'PUT', `/workspaces/${workspaceId}/projects/${projectId}`, body, qs);
                        }
                    }
                    if (resource === 'tag') {
                        if (operation === 'create') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const name = this.getNodeParameter('name', i);
                            const body = {
                                name,
                            };
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'POST', `/workspaces/${workspaceId}/tags`, body, qs);
                        }
                        if (operation === 'delete') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const tagId = this.getNodeParameter('tagId', i);
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'DELETE', `/workspaces/${workspaceId}/tags/${tagId}`, {}, qs);
                            responseData = { success: true };
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.clockifyApiRequestAllItems.call(this, 'GET', `/workspaces/${workspaceId}/tags`, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.clockifyApiRequestAllItems.call(this, 'GET', `/workspaces/${workspaceId}/tags`, {}, qs);
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                        if (operation === 'update') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const tagId = this.getNodeParameter('tagId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            Object.assign(body, updateFields);
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'PUT', `/workspaces/${workspaceId}/tags/${tagId}`, body, qs);
                        }
                    }
                    if (resource === 'task') {
                        if (operation === 'create') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const projectId = this.getNodeParameter('projectId', i);
                            const name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                name,
                            };
                            Object.assign(body, additionalFields);
                            if (body.estimate) {
                                const [hour, minute] = body.estimate.split(':');
                                body.estimate = `PT${hour}H${minute}M`;
                            }
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'POST', `/workspaces/${workspaceId}/projects/${projectId}/tasks`, body, qs);
                        }
                        if (operation === 'delete') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const projectId = this.getNodeParameter('projectId', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'DELETE', `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, {}, qs);
                        }
                        if (operation === 'get') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const projectId = this.getNodeParameter('projectId', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, {}, qs);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const projectId = this.getNodeParameter('projectId', i);
                            const filters = this.getNodeParameter('filters', i);
                            Object.assign(qs, filters);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.clockifyApiRequestAllItems.call(this, 'GET', `/workspaces/${workspaceId}/projects/${projectId}/tasks`, {}, qs);
                            }
                            else {
                                qs['page-size'] = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', `/workspaces/${workspaceId}/projects/${projectId}/tasks`, {}, qs);
                            }
                        }
                        if (operation === 'update') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const projectId = this.getNodeParameter('projectId', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            Object.assign(body, updateFields);
                            if (body.estimate) {
                                const [hour, minute] = body.estimate.split(':');
                                body.estimate = `PT${hour}H${minute}M`;
                            }
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'PUT', `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, body, qs);
                        }
                    }
                    if (resource === 'timeEntry') {
                        if (operation === 'create') {
                            const timezone = this.getTimezone();
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const start = this.getNodeParameter('start', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                start: moment_timezone_1.default.tz(start, timezone).utc().format(),
                            };
                            Object.assign(body, additionalFields);
                            if (body.end) {
                                body.end = moment_timezone_1.default.tz(body.end, timezone).utc().format();
                            }
                            if (body.customFieldsUi) {
                                const customFields = body.customFieldsUi.customFieldsValues;
                                body.customFields = customFields;
                            }
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'POST', `/workspaces/${workspaceId}/time-entries`, body, qs);
                        }
                        if (operation === 'delete') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const timeEntryId = this.getNodeParameter('timeEntryId', i);
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'DELETE', `/workspaces/${workspaceId}/time-entries/${timeEntryId}`, {}, qs);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const timeEntryId = this.getNodeParameter('timeEntryId', i);
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', `/workspaces/${workspaceId}/time-entries/${timeEntryId}`, {}, qs);
                        }
                        if (operation === 'update') {
                            const timezone = this.getTimezone();
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const timeEntryId = this.getNodeParameter('timeEntryId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            Object.assign(body, updateFields);
                            if (body.end) {
                                body.end = moment_timezone_1.default.tz(body.end, timezone).utc().format();
                            }
                            if (body.start) {
                                body.start = moment_timezone_1.default.tz(body.start, timezone).utc().format();
                            }
                            else {
                                // even if you do not want to update the start time, it always has to be set
                                // to make it more simple to the user, if he did not set a start time look for the current start time
                                // and set it
                                const { timeInterval: { start } } = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', `/workspaces/${workspaceId}/time-entries/${timeEntryId}`, {}, qs);
                                body.start = start;
                            }
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'PUT', `/workspaces/${workspaceId}/time-entries/${timeEntryId}`, body, qs);
                        }
                    }
                    if (resource === 'user') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.clockifyApiRequestAllItems.call(this, 'GET', `/workspaces/${workspaceId}/users`, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.clockifyApiRequestAllItems.call(this, 'GET', `/workspaces/${workspaceId}/users`, {}, qs);
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                    }
                    if (resource === 'workspace') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', '/workspaces', {}, qs);
                            if (!returnAll) {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, qs.limit);
                            }
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
exports.Clockify = Clockify;

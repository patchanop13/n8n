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
exports.MicrosoftToDo = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const LinkedResourceDescription_1 = require("./LinkedResourceDescription");
const TaskDescription_1 = require("./TaskDescription");
const ListDescription_1 = require("./ListDescription");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class MicrosoftToDo {
    constructor() {
        this.description = {
            displayName: 'Microsoft To Do',
            name: 'microsoftToDo',
            icon: 'file:todo.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Microsoft To Do API.',
            defaults: {
                name: 'Microsoft To Do',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'microsoftToDoOAuth2Api',
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
                            name: 'Linked Resource',
                            value: 'linkedResource',
                        },
                        {
                            name: 'List',
                            value: 'list',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                    ],
                    default: 'task',
                },
                ...LinkedResourceDescription_1.linkedResourceOperations,
                ...LinkedResourceDescription_1.linkedResourceFields,
                ...TaskDescription_1.taskOperations,
                ...TaskDescription_1.taskFields,
                ...ListDescription_1.listOperations,
                ...ListDescription_1.listFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the team's channels to display them to user so that he can
                // select them easily
                getTaskLists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const lists = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', '/todo/lists');
                        for (const list of lists) {
                            returnData.push({
                                name: list.displayName,
                                value: list.id,
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
            const timezone = this.getTimezone();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'linkedResource') {
                        // https://docs.microsoft.com/en-us/graph/api/todotask-post-linkedresources?view=graph-rest-1.0&tabs=http
                        if (operation === 'create') {
                            const taskListId = this.getNodeParameter('taskListId', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            const body = Object.assign({ applicationName: this.getNodeParameter('applicationName', i), displayName: this.getNodeParameter('displayName', i) }, this.getNodeParameter('additionalFields', i));
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', `/todo/lists/${taskListId}/tasks/${taskId}/linkedResources`, body, qs);
                            // https://docs.microsoft.com/en-us/graph/api/linkedresource-delete?view=graph-rest-1.0&tabs=http
                        }
                        else if (operation === 'delete') {
                            const taskListId = this.getNodeParameter('taskListId', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            const linkedResourceId = this.getNodeParameter('linkedResourceId', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'DELETE', `/todo/lists/${taskListId}/tasks/${taskId}/linkedResources/${linkedResourceId}`, undefined, qs);
                            responseData = { success: true };
                            // https://docs.microsoft.com/en-us/graph/api/linkedresource-get?view=graph-rest-1.0&tabs=http
                        }
                        else if (operation === 'get') {
                            const taskListId = this.getNodeParameter('taskListId', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            const linkedResourceId = this.getNodeParameter('linkedResourceId', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/todo/lists/${taskListId}/tasks/${taskId}/linkedResources/${linkedResourceId}`, undefined, qs);
                            // https://docs.microsoft.com/en-us/graph/api/todotask-list-linkedresources?view=graph-rest-1.0&tabs=http
                        }
                        else if (operation === 'getAll') {
                            const taskListId = this.getNodeParameter('taskListId', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/todo/lists/${taskListId}/tasks/${taskId}/linkedResources`, undefined, qs);
                            }
                            else {
                                qs['$top'] = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/todo/lists/${taskListId}/tasks/${taskId}/linkedResources`, undefined, qs);
                                responseData = responseData.value;
                            }
                            // https://docs.microsoft.com/en-us/graph/api/linkedresource-update?view=graph-rest-1.0&tabs=http
                        }
                        else if (operation === 'update') {
                            const taskListId = this.getNodeParameter('taskListId', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            const linkedResourceId = this.getNodeParameter('linkedResourceId', i);
                            const body = Object.assign({}, this.getNodeParameter('updateFields', i));
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'PATCH', `/todo/lists/${taskListId}/tasks/${taskId}/linkedResources/${linkedResourceId}`, body, qs);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
                        }
                    }
                    else if (resource === 'task') {
                        // https://docs.microsoft.com/en-us/graph/api/todotasklist-post-tasks?view=graph-rest-1.0&tabs=http
                        if (operation === 'create') {
                            const taskListId = this.getNodeParameter('taskListId', i);
                            const body = Object.assign({ title: this.getNodeParameter('title', i) }, this.getNodeParameter('additionalFields', i));
                            if (body.content) {
                                body.body = {
                                    content: body.content,
                                    contentType: 'html',
                                };
                            }
                            if (body.dueDateTime) {
                                body.dueDateTime = {
                                    dateTime: moment_timezone_1.default.tz(body.dueDateTime, timezone).format(),
                                    timeZone: timezone,
                                };
                            }
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', `/todo/lists/${taskListId}/tasks`, body, qs);
                            // https://docs.microsoft.com/en-us/graph/api/todotask-delete?view=graph-rest-1.0&tabs=http
                        }
                        else if (operation === 'delete') {
                            const taskListId = this.getNodeParameter('taskListId', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'DELETE', `/todo/lists/${taskListId}/tasks/${taskId}`, undefined, qs);
                            responseData = { success: true };
                            // https://docs.microsoft.com/en-us/graph/api/todotask-get?view=graph-rest-1.0&tabs=http
                        }
                        else if (operation === 'get') {
                            const taskListId = this.getNodeParameter('taskListId', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/todo/lists/${taskListId}/tasks/${taskId}`, undefined, qs);
                            // https://docs.microsoft.com/en-us/graph/api/todotasklist-list-tasks?view=graph-rest-1.0&tabs=http
                        }
                        else if (operation === 'getAll') {
                            const taskListId = this.getNodeParameter('taskListId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/todo/lists/${taskListId}/tasks/`, undefined, qs);
                            }
                            else {
                                qs['$top'] = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/todo/lists/${taskListId}/tasks/`, undefined, qs);
                                responseData = responseData.value;
                            }
                            // https://docs.microsoft.com/en-us/graph/api/todotask-update?view=graph-rest-1.0&tabs=http
                        }
                        else if (operation === 'update') {
                            const taskListId = this.getNodeParameter('taskListId', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            const body = Object.assign({}, this.getNodeParameter('updateFields', i));
                            if (body.content) {
                                body.body = {
                                    content: body.content,
                                    contentType: 'html',
                                };
                            }
                            if (body.dueDateTime) {
                                body.dueDateTime = {
                                    dateTime: moment_timezone_1.default.tz(body.dueDateTime, timezone).format(),
                                    timeZone: timezone,
                                };
                            }
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'PATCH', `/todo/lists/${taskListId}/tasks/${taskId}`, body, qs);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
                        }
                    }
                    else if (resource === 'list') {
                        // https://docs.microsoft.com/en-us/graph/api/todo-post-lists?view=graph-rest-1.0&tabs=http
                        if (operation === 'create') {
                            const body = {
                                displayName: this.getNodeParameter('displayName', i),
                            };
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', '/todo/lists/', body, qs);
                            // https://docs.microsoft.com/en-us/graph/api/todotasklist-delete?view=graph-rest-1.0&tabs=http
                        }
                        else if (operation === 'delete') {
                            const listId = this.getNodeParameter('listId', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'DELETE', `/todo/lists/${listId}`, undefined, qs);
                            responseData = { success: true };
                            //https://docs.microsoft.com/en-us/graph/api/todotasklist-get?view=graph-rest-1.0&tabs=http
                        }
                        else if (operation === 'get') {
                            const listId = this.getNodeParameter('listId', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/todo/lists/${listId}`, undefined, qs);
                            // https://docs.microsoft.com/en-us/graph/api/todo-list-lists?view=graph-rest-1.0&tabs=http
                        }
                        else if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', '/todo/lists', undefined, qs);
                            }
                            else {
                                qs['$top'] = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', '/todo/lists', undefined, qs);
                                responseData = responseData.value;
                            }
                            // https://docs.microsoft.com/en-us/graph/api/todotasklist-update?view=graph-rest-1.0&tabs=http
                        }
                        else if (operation === 'update') {
                            const listId = this.getNodeParameter('listId', i);
                            const body = {
                                displayName: this.getNodeParameter('displayName', i),
                            };
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'PATCH', `/todo/lists/${listId}`, body, qs);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
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
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.MicrosoftToDo = MicrosoftToDo;

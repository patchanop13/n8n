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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleTasks = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const TaskDescription_1 = require("./TaskDescription");
class GoogleTasks {
    constructor() {
        this.description = {
            displayName: 'Google Tasks',
            name: 'googleTasks',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:googleTasks.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Google Tasks API',
            defaults: {
                name: 'Google Tasks',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'googleTasksOAuth2Api',
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
                            name: 'Task',
                            value: 'task',
                        },
                    ],
                    default: 'task',
                },
                ...TaskDescription_1.taskOperations,
                ...TaskDescription_1.taskFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the tasklists to display them to user so that he can select them easily
                getTasks() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const tasks = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', '/tasks/v1/users/@me/lists');
                        for (const task of tasks) {
                            const taskName = task.title;
                            const taskId = task.id;
                            returnData.push({
                                name: taskName,
                                value: taskId,
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
            let body = {};
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'task') {
                        if (operation === 'create') {
                            body = {};
                            //https://developers.google.com/tasks/v1/reference/tasks/insert
                            const taskId = this.getNodeParameter('task', i);
                            body.title = this.getNodeParameter('title', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.parent) {
                                qs.parent = additionalFields.parent;
                            }
                            if (additionalFields.previous) {
                                qs.previous = additionalFields.previous;
                            }
                            if (additionalFields.status) {
                                body.status = additionalFields.status;
                            }
                            if (additionalFields.notes) {
                                body.notes = additionalFields.notes;
                            }
                            if (additionalFields.dueDate) {
                                body.due = additionalFields.dueDate;
                            }
                            if (additionalFields.completed) {
                                body.completed = additionalFields.completed;
                            }
                            if (additionalFields.deleted) {
                                body.deleted = additionalFields.deleted;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/tasks/v1/lists/${taskId}/tasks`, body, qs);
                        }
                        if (operation === 'delete') {
                            //https://developers.google.com/tasks/v1/reference/tasks/delete
                            const taskListId = this.getNodeParameter('task', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'DELETE', `/tasks/v1/lists/${taskListId}/tasks/${taskId}`, {});
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            //https://developers.google.com/tasks/v1/reference/tasks/get
                            const taskListId = this.getNodeParameter('task', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/tasks/v1/lists/${taskListId}/tasks/${taskId}`, {}, qs);
                        }
                        if (operation === 'getAll') {
                            //https://developers.google.com/tasks/v1/reference/tasks/list
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const taskListId = this.getNodeParameter('task', i);
                            const _a = this.getNodeParameter('additionalFields', i), { showCompleted = true, showDeleted = false, showHidden = false } = _a, options = __rest(_a, ["showCompleted", "showDeleted", "showHidden"]);
                            if (options.completedMax) {
                                qs.completedMax = options.completedMax;
                            }
                            if (options.completedMin) {
                                qs.completedMin = options.completedMin;
                            }
                            if (options.dueMin) {
                                qs.dueMin = options.dueMin;
                            }
                            if (options.dueMax) {
                                qs.dueMax = options.dueMax;
                            }
                            qs.showCompleted = showCompleted;
                            qs.showDeleted = showDeleted;
                            qs.showHidden = showHidden;
                            if (options.updatedMin) {
                                qs.updatedMin = options.updatedMin;
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', `/tasks/v1/lists/${taskListId}/tasks`, {}, qs);
                            }
                            else {
                                qs.maxResults = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/tasks/v1/lists/${taskListId}/tasks`, {}, qs);
                                responseData = responseData.items;
                            }
                        }
                        if (operation === 'update') {
                            body = {};
                            //https://developers.google.com/tasks/v1/reference/tasks/patch
                            const taskListId = this.getNodeParameter('task', i);
                            const taskId = this.getNodeParameter('taskId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (updateFields.previous) {
                                qs.previous = updateFields.previous;
                            }
                            if (updateFields.status) {
                                body.status = updateFields.status;
                            }
                            if (updateFields.notes) {
                                body.notes = updateFields.notes;
                            }
                            if (updateFields.title) {
                                body.title = updateFields.title;
                            }
                            if (updateFields.dueDate) {
                                body.due = updateFields.dueDate;
                            }
                            if (updateFields.completed) {
                                body.completed = updateFields.completed;
                            }
                            if (updateFields.deleted) {
                                body.deleted = updateFields.deleted;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'PATCH', `/tasks/v1/lists/${taskListId}/tasks/${taskId}`, body, qs);
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
exports.GoogleTasks = GoogleTasks;

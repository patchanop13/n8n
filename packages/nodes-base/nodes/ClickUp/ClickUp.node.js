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
exports.ClickUp = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const ChecklistDescription_1 = require("./ChecklistDescription");
const ChecklistItemDescription_1 = require("./ChecklistItemDescription");
const CommentDescription_1 = require("./CommentDescription");
const FolderDescription_1 = require("./FolderDescription");
const GoalDescription_1 = require("./GoalDescription");
const GoalKeyResultDescription_1 = require("./GoalKeyResultDescription");
// import {
// 	guestFields,
// 	guestOperations,
// } from './guestDescription';
const TaskDescription_1 = require("./TaskDescription");
const TaskListDescription_1 = require("./TaskListDescription");
const TaskTagDescription_1 = require("./TaskTagDescription");
const SpaceTagDescription_1 = require("./SpaceTagDescription");
const TaskDependencyDescription_1 = require("./TaskDependencyDescription");
const TimeEntryDescription_1 = require("./TimeEntryDescription");
const TimeEntryTagDescription_1 = require("./TimeEntryTagDescription");
const ListDescription_1 = require("./ListDescription");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class ClickUp {
    constructor() {
        this.description = {
            displayName: 'ClickUp',
            name: 'clickUp',
            icon: 'file:clickup.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
            description: 'Consume ClickUp API (Beta)',
            defaults: {
                name: 'ClickUp',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'clickUpApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'accessToken',
                            ],
                        },
                    },
                },
                {
                    name: 'clickUpOAuth2Api',
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
                            name: 'Access Token',
                            value: 'accessToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'accessToken',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Checklist',
                            value: 'checklist',
                        },
                        {
                            name: 'Checklist Item',
                            value: 'checklistItem',
                        },
                        {
                            name: 'Comment',
                            value: 'comment',
                        },
                        {
                            name: 'Folder',
                            value: 'folder',
                        },
                        {
                            name: 'Goal',
                            value: 'goal',
                        },
                        {
                            name: 'Goal Key Result',
                            value: 'goalKeyResult',
                        },
                        // {
                        // 	name: 'Guest',
                        // 	value: 'guest',
                        // },
                        {
                            name: 'List',
                            value: 'list',
                        },
                        {
                            name: 'Space Tag',
                            value: 'spaceTag',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                        {
                            name: 'Task Dependency',
                            value: 'taskDependency',
                        },
                        {
                            name: 'Task List',
                            value: 'taskList',
                        },
                        {
                            name: 'Task Tag',
                            value: 'taskTag',
                        },
                        {
                            name: 'Time Entry',
                            value: 'timeEntry',
                        },
                        {
                            name: 'Time Entry Tag',
                            value: 'timeEntryTag',
                        },
                    ],
                    default: 'task',
                },
                // CHECKLIST
                ...ChecklistDescription_1.checklistOperations,
                ...ChecklistDescription_1.checklistFields,
                // CHECKLIST ITEM
                ...ChecklistItemDescription_1.checklistItemOperations,
                ...ChecklistItemDescription_1.checklistItemFields,
                // COMMENT
                ...CommentDescription_1.commentOperations,
                ...CommentDescription_1.commentFields,
                // FOLDER
                ...FolderDescription_1.folderOperations,
                ...FolderDescription_1.folderFields,
                // GOAL
                ...GoalDescription_1.goalOperations,
                ...GoalDescription_1.goalFields,
                // GOAL kEY RESULT
                ...GoalKeyResultDescription_1.goalKeyResultOperations,
                ...GoalKeyResultDescription_1.goalKeyResultFields,
                // GUEST
                // ...guestOperations,
                // ...guestFields,
                // TASK TAG
                ...TaskTagDescription_1.taskTagOperations,
                ...TaskTagDescription_1.taskTagFields,
                // TASK LIST
                ...TaskListDescription_1.taskListOperations,
                ...TaskListDescription_1.taskListFields,
                // SPACE TAG
                ...SpaceTagDescription_1.spaceTagOperations,
                ...SpaceTagDescription_1.spaceTagFields,
                // TASK
                ...TaskDescription_1.taskOperations,
                ...TaskDescription_1.taskFields,
                // TASK DEPENDENCY
                ...TaskDependencyDescription_1.taskDependencyOperations,
                ...TaskDependencyDescription_1.taskDependencyFields,
                // TIME ENTRY
                ...TimeEntryDescription_1.timeEntryOperations,
                ...TimeEntryDescription_1.timeEntryFields,
                ...TaskDependencyDescription_1.taskDependencyFields,
                // TIME ENTRY TAG
                ...TimeEntryTagDescription_1.timeEntryTagOperations,
                ...TimeEntryTagDescription_1.timeEntryTagFields,
                // LIST
                ...ListDescription_1.listOperations,
                ...ListDescription_1.listFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available teams to display them to user so that he can
                // select them easily
                getTeams() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { teams } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', '/team');
                        for (const team of teams) {
                            const teamName = team.name;
                            const teamId = team.id;
                            returnData.push({
                                name: teamName,
                                value: teamId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available spaces to display them to user so that he can
                // select them easily
                getSpaces() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const teamId = this.getCurrentNodeParameter('team');
                        const returnData = [];
                        const { spaces } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/team/${teamId}/space`);
                        for (const space of spaces) {
                            const spaceName = space.name;
                            const spaceId = space.id;
                            returnData.push({
                                name: spaceName,
                                value: spaceId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available folders to display them to user so that he can
                // select them easily
                getFolders() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const spaceId = this.getCurrentNodeParameter('space');
                        const returnData = [];
                        const { folders } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/space/${spaceId}/folder`);
                        for (const folder of folders) {
                            const folderName = folder.name;
                            const folderId = folder.id;
                            returnData.push({
                                name: folderName,
                                value: folderId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available lists to display them to user so that he can
                // select them easily
                getLists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const folderId = this.getCurrentNodeParameter('folder');
                        const returnData = [];
                        const { lists } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/folder/${folderId}/list`);
                        for (const list of lists) {
                            const listName = list.name;
                            const listId = list.id;
                            returnData.push({
                                name: listName,
                                value: listId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available lists without a folder to display them to user so that he can
                // select them easily
                getFolderlessLists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const spaceId = this.getCurrentNodeParameter('space');
                        const returnData = [];
                        const { lists } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/space/${spaceId}/list`);
                        for (const list of lists) {
                            const listName = list.name;
                            const listId = list.id;
                            returnData.push({
                                name: listName,
                                value: listId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available assignees to display them to user so that he can
                // select them easily
                getAssignees() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const listId = this.getCurrentNodeParameter('list');
                        const taskId = this.getCurrentNodeParameter('task');
                        const returnData = [];
                        let url;
                        if (listId) {
                            url = `/list/${listId}/member`;
                        }
                        else if (taskId) {
                            url = `/task/${taskId}/member`;
                        }
                        else {
                            return returnData;
                        }
                        const { members } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', url);
                        for (const member of members) {
                            const memberName = member.username;
                            const menberId = member.id;
                            returnData.push({
                                name: memberName,
                                value: menberId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available tags to display them to user so that he can
                // select them easily
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const spaceId = this.getCurrentNodeParameter('space');
                        const returnData = [];
                        const { tags } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/space/${spaceId}/tag`);
                        for (const tag of tags) {
                            const tagName = tag.name;
                            const tagId = tag.name;
                            returnData.push({
                                name: tagName,
                                value: tagId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available tags to display them to user so that he can
                // select them easily
                getTimeEntryTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const teamId = this.getCurrentNodeParameter('team');
                        const returnData = [];
                        const { data: tags } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/team/${teamId}/time_entries/tags`);
                        for (const tag of tags) {
                            const tagName = tag.name;
                            const tagId = JSON.stringify(tag);
                            returnData.push({
                                name: tagName,
                                value: tagId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available tags to display them to user so that he can
                // select them easily
                getStatuses() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const listId = this.getCurrentNodeParameter('list');
                        const returnData = [];
                        const { statuses } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/list/${listId}`);
                        for (const status of statuses) {
                            const statusName = status.status;
                            const statusId = status.status;
                            returnData.push({
                                name: statusName,
                                value: statusId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the custom fields to display them to user so that he can
                // select them easily
                getCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const listId = this.getCurrentNodeParameter('list');
                        const returnData = [];
                        const { fields } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/list/${listId}/field`);
                        for (const field of fields) {
                            const fieldName = field.name;
                            const fieldId = field.id;
                            returnData.push({
                                name: fieldName,
                                value: fieldId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available lists to display them to user so that he can
                // select them easily
                getTasks() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const listId = this.getCurrentNodeParameter('list');
                        const archived = this.getCurrentNodeParameter('archived');
                        const returnData = [];
                        const { tasks } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/list/${listId}/task?archived=${archived}`);
                        for (const task of tasks) {
                            const taskName = task.name;
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
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'checklist') {
                        if (operation === 'create') {
                            const taskId = this.getNodeParameter('task', i);
                            const name = this.getNodeParameter('name', i);
                            const body = {
                                name,
                            };
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/task/${taskId}/checklist`, body);
                            responseData = responseData.checklist;
                        }
                        if (operation === 'delete') {
                            const checklistId = this.getNodeParameter('checklist', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/checklist/${checklistId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'update') {
                            const checklistId = this.getNodeParameter('checklist', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            if (updateFields.name) {
                                body.name = updateFields.name;
                            }
                            if (updateFields.position) {
                                body.position = updateFields.position;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'PUT', `/checklist/${checklistId}`, body);
                            responseData = responseData.checklist;
                        }
                    }
                    if (resource === 'checklistItem') {
                        if (operation === 'create') {
                            const checklistId = this.getNodeParameter('checklist', i);
                            const name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                name,
                            };
                            if (additionalFields.assignee) {
                                body.assignee = parseInt(additionalFields.assignee, 10);
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/checklist/${checklistId}/checklist_item`, body);
                            responseData = responseData.checklist;
                        }
                        if (operation === 'delete') {
                            const checklistId = this.getNodeParameter('checklist', i);
                            const checklistItemId = this.getNodeParameter('checklistItem', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/checklist/${checklistId}/checklist_item/${checklistItemId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'update') {
                            const checklistId = this.getNodeParameter('checklist', i);
                            const checklistItemId = this.getNodeParameter('checklistItem', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            if (updateFields.name) {
                                body.name = updateFields.name;
                            }
                            if (updateFields.parent) {
                                body.parent = updateFields.parent;
                            }
                            if (updateFields.assignee) {
                                body.assignee = parseInt(updateFields.assignee, 10);
                            }
                            if (updateFields.resolved) {
                                body.resolved = updateFields.resolved;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'PUT', `/checklist/${checklistId}/checklist_item/${checklistItemId}`, body);
                            responseData = responseData.checklist;
                        }
                    }
                    if (resource === 'comment') {
                        if (operation === 'create') {
                            const resource = this.getNodeParameter('commentOn', i);
                            const id = this.getNodeParameter('id', i);
                            const commentText = this.getNodeParameter('commentText', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                comment_text: commentText,
                            };
                            if (additionalFields.assignee) {
                                body.assignee = parseInt(additionalFields.assignee, 10);
                            }
                            if (additionalFields.notifyAll) {
                                body.notify_all = additionalFields.notifyAll;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/${resource}/${id}/comment`, body);
                        }
                        if (operation === 'delete') {
                            const commentId = this.getNodeParameter('comment', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/comment/${commentId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'getAll') {
                            const resource = this.getNodeParameter('commentsOn', i);
                            const id = this.getNodeParameter('id', i);
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/${resource}/${id}/comment`, {}, qs);
                            responseData = responseData.comments;
                            responseData = responseData.splice(0, qs.limit);
                        }
                        if (operation === 'update') {
                            const commentId = this.getNodeParameter('comment', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            if (updateFields.commentText) {
                                body.comment_text = updateFields.commentText;
                            }
                            if (updateFields.assignee) {
                                body.assignee = parseInt(updateFields.assignee, 10);
                            }
                            if (updateFields.resolved) {
                                body.resolved = updateFields.resolved;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'PUT', `/comment/${commentId}`, body);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'folder') {
                        if (operation === 'create') {
                            const spaceId = this.getNodeParameter('space', i);
                            const name = this.getNodeParameter('name', i);
                            const body = {
                                name,
                            };
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/space/${spaceId}/folder`, body);
                        }
                        if (operation === 'delete') {
                            const folderId = this.getNodeParameter('folder', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/folder/${folderId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            const folderId = this.getNodeParameter('folder', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/folder/${folderId}`);
                        }
                        if (operation === 'getAll') {
                            const filters = this.getNodeParameter('filters', i);
                            const spaceId = this.getNodeParameter('space', i);
                            if (filters.archived) {
                                qs.archived = filters.archived;
                            }
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/space/${spaceId}/folder`, {}, qs);
                            responseData = responseData.folders;
                            responseData = responseData.splice(0, qs.limit);
                        }
                        if (operation === 'update') {
                            const folderId = this.getNodeParameter('folder', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            if (updateFields.name) {
                                body.name = updateFields.name;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'PUT', `/folder/${folderId}`, body);
                        }
                    }
                    if (resource === 'goal') {
                        if (operation === 'create') {
                            const teamId = this.getNodeParameter('team', i);
                            const name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                name,
                            };
                            if (additionalFields.dueDate) {
                                body.due_date = new Date(additionalFields.dueDate).getTime();
                            }
                            if (additionalFields.description) {
                                body.description = additionalFields.description;
                            }
                            if (additionalFields.multipleOwners) {
                                body.multiple_owners = additionalFields.multipleOwners;
                            }
                            if (additionalFields.color) {
                                body.color = additionalFields.color;
                            }
                            if (additionalFields.owners) {
                                body.owners = additionalFields.owners.split(',').map((e) => parseInt(e, 10));
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/team/${teamId}/goal`, body);
                            responseData = responseData.goal;
                        }
                        if (operation === 'delete') {
                            const goalId = this.getNodeParameter('goal', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/goal/${goalId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            const goalId = this.getNodeParameter('goal', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/goal/${goalId}`);
                            responseData = responseData.goal;
                        }
                        if (operation === 'getAll') {
                            const teamId = this.getNodeParameter('team', i);
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/team/${teamId}/goal`, {}, qs);
                            responseData = responseData.goals;
                            responseData = responseData.splice(0, qs.limit);
                        }
                        if (operation === 'update') {
                            const goalId = this.getNodeParameter('goal', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            if (updateFields.name) {
                                body.name = updateFields.name;
                            }
                            if (updateFields.dueDate) {
                                body.due_date = new Date(updateFields.dueDate).getTime();
                            }
                            if (updateFields.description) {
                                body.description = updateFields.description;
                            }
                            if (updateFields.color) {
                                body.color = updateFields.color;
                            }
                            if (updateFields.addOwners) {
                                body.add_owners = updateFields.addOwners.split(',').map((e) => parseInt(e, 10));
                            }
                            if (updateFields.removeOwners) {
                                body.rem_owners = updateFields.removeOwners.split(',').map((e) => parseInt(e, 10));
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'PUT', `/goal/${goalId}`, body);
                            responseData = responseData.goal;
                        }
                    }
                    if (resource === 'goalKeyResult') {
                        if (operation === 'create') {
                            const goalId = this.getNodeParameter('goal', i);
                            const name = this.getNodeParameter('name', i);
                            const type = this.getNodeParameter('type', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                name,
                                type,
                            };
                            if (type === 'number' || type === 'currency') {
                                if (!additionalFields.unit) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Unit field must be set');
                                }
                            }
                            if (type === 'number' || type === 'percentaje'
                                || type === 'automatic' || type === 'currency') {
                                if (additionalFields.stepsStart === undefined
                                    || !additionalFields.stepsEnd === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Steps start and steps end fields must be set');
                                }
                            }
                            if (additionalFields.unit) {
                                body.unit = additionalFields.unit;
                            }
                            if (additionalFields.stepsStart) {
                                body.steps_start = additionalFields.stepsStart;
                            }
                            if (additionalFields.stepsEnd) {
                                body.steps_end = additionalFields.stepsEnd;
                            }
                            if (additionalFields.taskIds) {
                                body.task_ids = additionalFields.taskIds.split(',');
                            }
                            if (additionalFields.listIds) {
                                body.list_ids = additionalFields.listIds.split(',');
                            }
                            if (additionalFields.owners) {
                                body.owners = additionalFields.owners.split(',').map((e) => parseInt(e, 10));
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/goal/${goalId}/key_result`, body);
                            responseData = responseData.key_result;
                        }
                        if (operation === 'delete') {
                            const keyResultId = this.getNodeParameter('keyResult', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/key_result/${keyResultId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'update') {
                            const keyResultId = this.getNodeParameter('keyResult', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            if (updateFields.name) {
                                body.name = updateFields.name;
                            }
                            if (updateFields.note) {
                                body.note = updateFields.note;
                            }
                            if (updateFields.stepsCurrent) {
                                body.steps_current = updateFields.stepsCurrent;
                            }
                            if (updateFields.stepsStart) {
                                body.steps_start = updateFields.stepsStart;
                            }
                            if (updateFields.stepsEnd) {
                                body.steps_end = updateFields.stepsEnd;
                            }
                            if (updateFields.unit) {
                                body.unit = updateFields.unit;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'PUT', `/key_result/${keyResultId}`, body);
                            responseData = responseData.key_result;
                        }
                    }
                    if (resource === 'guest') {
                        if (operation === 'create') {
                            const teamId = this.getNodeParameter('team', i);
                            const email = this.getNodeParameter('email', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                email,
                            };
                            if (additionalFields.canEditTags) {
                                body.can_edit_tags = additionalFields.canEditTags;
                            }
                            if (additionalFields.canSeeTimeSpend) {
                                body.can_see_time_spend = additionalFields.canSeeTimeSpend;
                            }
                            if (additionalFields.canSeeTimeEstimated) {
                                body.can_see_time_estimated = additionalFields.canSeeTimeEstimated;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/team/${teamId}/guest`, body);
                            responseData = responseData.team;
                        }
                        if (operation === 'delete') {
                            const teamId = this.getNodeParameter('team', i);
                            const guestId = this.getNodeParameter('guest', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/team/${teamId}/guest/${guestId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            const teamId = this.getNodeParameter('team', i);
                            const guestId = this.getNodeParameter('guest', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/team/${teamId}/guest/${guestId}`);
                            responseData = responseData.team;
                        }
                        if (operation === 'update') {
                            const teamId = this.getNodeParameter('team', i);
                            const guestId = this.getNodeParameter('guest', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            if (updateFields.username) {
                                body.username = updateFields.username;
                            }
                            if (updateFields.canEditTags) {
                                body.can_edit_tags = updateFields.canEditTags;
                            }
                            if (updateFields.canSeeTimeSpend) {
                                body.can_see_time_spend = updateFields.canSeeTimeSpend;
                            }
                            if (updateFields.canSeeTimeEstimated) {
                                body.can_see_time_estimated = updateFields.canSeeTimeEstimated;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'PUT', `/team/${teamId}/guest/${guestId}`, body);
                            responseData = responseData.team;
                        }
                    }
                    if (resource === 'task') {
                        if (operation === 'create') {
                            const listId = this.getNodeParameter('list', i);
                            const name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                name,
                            };
                            if (additionalFields.customFieldsJson) {
                                const customFields = (0, GenericFunctions_1.validateJSON)(additionalFields.customFieldsJson);
                                if (customFields === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Custom Fields: Invalid JSON');
                                }
                                body.custom_fields = customFields;
                            }
                            if (additionalFields.content) {
                                body.content = additionalFields.content;
                            }
                            if (additionalFields.assignees) {
                                body.assignees = additionalFields.assignees;
                            }
                            if (additionalFields.tags) {
                                body.tags = additionalFields.tags;
                            }
                            if (additionalFields.status) {
                                body.status = additionalFields.status;
                            }
                            if (additionalFields.priority) {
                                body.priority = additionalFields.priority;
                            }
                            if (additionalFields.dueDate) {
                                body.due_date = new Date(additionalFields.dueDate).getTime();
                            }
                            if (additionalFields.dueDateTime) {
                                body.due_date_time = additionalFields.dueDateTime;
                            }
                            if (additionalFields.timeEstimate) {
                                body.time_estimate = additionalFields.timeEstimate * 6000;
                            }
                            if (additionalFields.startDate) {
                                body.start_date = new Date(additionalFields.startDate).getTime();
                            }
                            if (additionalFields.startDateTime) {
                                body.start_date_time = additionalFields.startDateTime;
                            }
                            if (additionalFields.notifyAll) {
                                body.notify_all = additionalFields.notifyAll;
                            }
                            if (additionalFields.parentId) {
                                body.parent = additionalFields.parentId;
                            }
                            if (additionalFields.markdownContent) {
                                delete body.content;
                                body.markdown_content = additionalFields.content;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/list/${listId}/task`, body);
                        }
                        if (operation === 'update') {
                            const taskId = this.getNodeParameter('id', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {
                                assignees: {
                                    add: [],
                                    rem: [],
                                },
                            };
                            if (updateFields.content) {
                                body.content = updateFields.content;
                            }
                            if (updateFields.priority) {
                                body.priority = updateFields.priority;
                            }
                            if (updateFields.dueDate) {
                                body.due_date = new Date(updateFields.dueDate).getTime();
                            }
                            if (updateFields.dueDateTime) {
                                body.due_date_time = updateFields.dueDateTime;
                            }
                            if (updateFields.timeEstimate) {
                                body.time_estimate = updateFields.timeEstimate * 6000;
                            }
                            if (updateFields.startDate) {
                                body.start_date = new Date(updateFields.startDate).getTime();
                            }
                            if (updateFields.startDateTime) {
                                body.start_date_time = updateFields.startDateTime;
                            }
                            if (updateFields.notifyAll) {
                                body.notify_all = updateFields.notifyAll;
                            }
                            if (updateFields.name) {
                                body.name = updateFields.name;
                            }
                            if (updateFields.parentId) {
                                body.parent = updateFields.parentId;
                            }
                            if (updateFields.addAssignees) {
                                //@ts-ignore
                                body.assignees.add = updateFields.addAssignees.split(',').map((e) => parseInt(e, 10));
                            }
                            if (updateFields.removeAssignees) {
                                //@ts-ignore
                                body.assignees.rem = updateFields.removeAssignees.split(',').map((e) => parseInt(e, 10));
                            }
                            if (updateFields.status) {
                                body.status = updateFields.status;
                            }
                            if (updateFields.markdownContent) {
                                delete body.content;
                                body.markdown_content = updateFields.content;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'PUT', `/task/${taskId}`, body);
                        }
                        if (operation === 'get') {
                            const taskId = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/task/${taskId}`);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            if (filters.archived) {
                                qs.archived = filters.archived;
                            }
                            if (filters.subtasks) {
                                qs.subtasks = filters.subtasks;
                            }
                            if (filters.includeClosed) {
                                qs.include_closed = filters.includeClosed;
                            }
                            if (filters.orderBy) {
                                qs.order_by = filters.orderBy;
                            }
                            if (filters.statuses) {
                                qs.statuses = filters.statuses;
                            }
                            if (filters.assignees) {
                                qs.assignees = filters.assignees;
                            }
                            if (filters.tags) {
                                qs.tags = filters.tags;
                            }
                            if (filters.dueDateGt) {
                                qs.due_date_gt = new Date(filters.dueDateGt).getTime();
                            }
                            if (filters.dueDateLt) {
                                qs.due_date_lt = new Date(filters.dueDateLt).getTime();
                            }
                            if (filters.dateCreatedGt) {
                                qs.date_created_gt = new Date(filters.dateCreatedGt).getTime();
                            }
                            if (filters.dateCreatedLt) {
                                qs.date_created_lt = new Date(filters.dateCreatedLt).getTime();
                            }
                            if (filters.dateUpdatedGt) {
                                qs.date_updated_gt = new Date(filters.dateUpdatedGt).getTime();
                            }
                            if (filters.dateUpdatedLt) {
                                qs.date_updated_lt = new Date(filters.dateUpdatedLt).getTime();
                            }
                            if (filters.customFieldsUi) {
                                const customFieldsValues = filters.customFieldsUi.customFieldsValues;
                                if (customFieldsValues) {
                                    const customFields = [];
                                    for (const customFieldValue of customFieldsValues) {
                                        customFields.push({
                                            field_id: customFieldValue.fieldId,
                                            operator: (customFieldValue.operator === 'equal') ? '=' : customFieldValue.operator,
                                            value: customFieldValue.value,
                                        });
                                    }
                                    qs.custom_fields = JSON.stringify(customFields);
                                }
                            }
                            const listId = this.getNodeParameter('list', i);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.clickupApiRequestAllItems.call(this, 'tasks', 'GET', `/list/${listId}/task`, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.clickupApiRequestAllItems.call(this, 'tasks', 'GET', `/list/${listId}/task`, {}, qs);
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                        if (operation === 'member') {
                            const taskId = this.getNodeParameter('id', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/task/${taskId}/member`, {}, qs);
                                responseData = responseData.members;
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/task/${taskId}/member`, {}, qs);
                                responseData = responseData.members;
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                        if (operation === 'setCustomField') {
                            const taskId = this.getNodeParameter('task', i);
                            const fieldId = this.getNodeParameter('field', i);
                            const value = this.getNodeParameter('value', i);
                            const jsonParse = this.getNodeParameter('jsonParse', i);
                            const body = {};
                            body.value = value;
                            if (jsonParse === true) {
                                body.value = (0, GenericFunctions_1.validateJSON)(body.value);
                                if (body.value === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Value is invalid JSON!');
                                }
                            }
                            else {
                                //@ts-ignore
                                if (!isNaN(body.value)) {
                                    body.value = parseInt(body.value, 10);
                                }
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/task/${taskId}/field/${fieldId}`, body);
                        }
                        if (operation === 'delete') {
                            const taskId = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/task/${taskId}`, {});
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'taskTag') {
                        if (operation === 'add') {
                            const taskId = this.getNodeParameter('taskId', i);
                            const name = this.getNodeParameter('tagName', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const qs = {};
                            Object.assign(qs, additionalFields);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/task/${taskId}/tag/${name}`, {}, qs);
                            responseData = { success: true };
                        }
                        if (operation === 'remove') {
                            const taskId = this.getNodeParameter('taskId', i);
                            const name = this.getNodeParameter('tagName', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const qs = {};
                            Object.assign(qs, additionalFields);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/task/${taskId}/tag/${name}`, {}, qs);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'taskList') {
                        if (operation === 'add') {
                            const taskId = this.getNodeParameter('taskId', i);
                            const listId = this.getNodeParameter('listId', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/list/${listId}/task/${taskId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'remove') {
                            const taskId = this.getNodeParameter('taskId', i);
                            const listId = this.getNodeParameter('listId', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/list/${listId}/task/${taskId}`);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'taskDependency') {
                        if (operation === 'create') {
                            const taskId = this.getNodeParameter('task', i);
                            const dependsOnTaskId = this.getNodeParameter('dependsOnTask', i);
                            const body = {};
                            body.depends_on = dependsOnTaskId;
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/task/${taskId}/dependency`, body);
                            responseData = { success: true };
                        }
                        if (operation === 'delete') {
                            const taskId = this.getNodeParameter('task', i);
                            const dependsOnTaskId = this.getNodeParameter('dependsOnTask', i);
                            qs.depends_on = dependsOnTaskId;
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/task/${taskId}/dependency`, {}, qs);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'timeEntry') {
                        if (operation === 'update') {
                            const teamId = this.getNodeParameter('team', i);
                            const timeEntryId = this.getNodeParameter('timeEntry', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const timezone = this.getTimezone();
                            const body = {};
                            Object.assign(body, updateFields);
                            if (body.start) {
                                body.start = moment_timezone_1.default.tz(body.start, timezone).valueOf();
                            }
                            if (body.duration) {
                                body.duration = body.duration * 60000;
                            }
                            if (body.task) {
                                body.tid = body.task;
                                body.custom_task_ids = true;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'PUT', `/team/${teamId}/time_entries/${timeEntryId}`, body);
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            const teamId = this.getNodeParameter('team', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            const timezone = this.getTimezone();
                            Object.assign(qs, filters);
                            if (filters.start_date) {
                                qs.start_date = moment_timezone_1.default.tz(qs.start_date, timezone).valueOf();
                            }
                            if (filters.end_date) {
                                qs.end_date = moment_timezone_1.default.tz(qs.end_date, timezone).valueOf();
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/team/${teamId}/time_entries`, {}, qs);
                            responseData = responseData.data;
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        if (operation === 'get') {
                            const teamId = this.getNodeParameter('team', i);
                            const running = this.getNodeParameter('running', i);
                            let endpoint = `/team/${teamId}/time_entries/current`;
                            if (running === false) {
                                const timeEntryId = this.getNodeParameter('timeEntry', i);
                                endpoint = `/team/${teamId}/time_entries/${timeEntryId}`;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.data;
                        }
                        if (operation === 'create') {
                            const teamId = this.getNodeParameter('team', i);
                            const taskId = this.getNodeParameter('task', i);
                            const start = this.getNodeParameter('start', i);
                            const duration = this.getNodeParameter('duration', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const timezone = this.getTimezone();
                            const body = {
                                start: moment_timezone_1.default.tz(start, timezone).valueOf(),
                                duration: duration * 60000,
                                tid: taskId,
                            };
                            Object.assign(body, additionalFields);
                            if (body.tags) {
                                body.tags = body.tags.map((tag) => (JSON.parse(tag)));
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/team/${teamId}/time_entries`, body);
                            responseData = responseData.data;
                        }
                        if (operation === 'start') {
                            const teamId = this.getNodeParameter('team', i);
                            const taskId = this.getNodeParameter('task', i);
                            const body = {};
                            body.tid = taskId;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/team/${teamId}/time_entries/start`, body);
                            responseData = responseData.data;
                        }
                        if (operation === 'stop') {
                            const teamId = this.getNodeParameter('team', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/team/${teamId}/time_entries/stop`);
                            if (responseData.data) {
                                responseData = responseData.data;
                            }
                            else {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'There seems to be nothing to stop.');
                            }
                        }
                        if (operation === 'delete') {
                            const teamId = this.getNodeParameter('team', i);
                            const timeEntryId = this.getNodeParameter('timeEntry', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/team/${teamId}/time_entries/${timeEntryId}`);
                            responseData = responseData.data;
                        }
                    }
                    if (resource === 'timeEntryTag') {
                        if (operation === 'add') {
                            const teamId = this.getNodeParameter('team', i);
                            const timeEntryIds = this.getNodeParameter('timeEntryIds', i);
                            const tagsUi = this.getNodeParameter('tagsUi', i);
                            const body = {};
                            body.time_entry_ids = timeEntryIds.split(',');
                            if (tagsUi) {
                                const tags = tagsUi.tagsValues;
                                if (tags === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one tag must be set');
                                }
                                body.tags = tags;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/team/${teamId}/time_entries/tags`, body);
                            responseData = { success: true };
                        }
                        if (operation === 'getAll') {
                            const teamId = this.getNodeParameter('team', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/team/${teamId}/time_entries/tags`);
                            responseData = responseData.data;
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        if (operation === 'remove') {
                            const teamId = this.getNodeParameter('team', i);
                            const timeEntryIds = this.getNodeParameter('timeEntryIds', i);
                            const tagNames = this.getNodeParameter('tagNames', i);
                            const body = {};
                            body.time_entry_ids = timeEntryIds.split(',');
                            body.tags = tagNames.map((tag) => (JSON.parse(tag).name));
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/team/${teamId}/time_entries/tags`, body);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'spaceTag') {
                        if (operation === 'create') {
                            const spaceId = this.getNodeParameter('space', i);
                            const name = this.getNodeParameter('name', i);
                            const foregroundColor = this.getNodeParameter('foregroundColor', i);
                            const backgroundColor = this.getNodeParameter('backgroundColor', i);
                            const body = {
                                tag: {
                                    name,
                                    tag_bg: backgroundColor,
                                    tag_fg: foregroundColor,
                                },
                            };
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/space/${spaceId}/tag`, body);
                            responseData = { success: true };
                        }
                        if (operation === 'delete') {
                            const spaceId = this.getNodeParameter('space', i);
                            const name = this.getNodeParameter('name', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/space/${spaceId}/tag/${name}`);
                            responseData = { success: true };
                        }
                        if (operation === 'getAll') {
                            const spaceId = this.getNodeParameter('space', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/space/${spaceId}/tag`);
                            responseData = responseData.tags;
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        if (operation === 'update') {
                            const spaceId = this.getNodeParameter('space', i);
                            const tagName = this.getNodeParameter('name', i);
                            const newTagName = this.getNodeParameter('newName', i);
                            const foregroundColor = this.getNodeParameter('foregroundColor', i);
                            const backgroundColor = this.getNodeParameter('backgroundColor', i);
                            const body = {
                                tag: {
                                    name: newTagName,
                                    tag_bg: backgroundColor,
                                    tag_fg: foregroundColor,
                                },
                            };
                            yield GenericFunctions_1.clickupApiRequest.call(this, 'PUT', `/space/${spaceId}/tag/${tagName}`, body);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'list') {
                        if (operation === 'create') {
                            const spaceId = this.getNodeParameter('space', i);
                            const folderless = this.getNodeParameter('folderless', i);
                            const name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                name,
                            };
                            if (additionalFields.content) {
                                body.content = additionalFields.content;
                            }
                            if (additionalFields.dueDate) {
                                body.due_date = new Date(additionalFields.dueDate).getTime();
                            }
                            if (additionalFields.dueDateTime) {
                                body.due_date_time = additionalFields.dueDateTime;
                            }
                            if (additionalFields.priority) {
                                body.priority = additionalFields.priority;
                            }
                            if (additionalFields.assignee) {
                                body.assignee = parseInt(additionalFields.assignee, 10);
                            }
                            if (additionalFields.status) {
                                body.status = additionalFields.status;
                            }
                            if (folderless) {
                                responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/space/${spaceId}/list`, body);
                            }
                            else {
                                const folderId = this.getNodeParameter('folder', i);
                                responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', `/folder/${folderId}/list`, body);
                            }
                        }
                        if (operation === 'member') {
                            const listId = this.getNodeParameter('id', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/list/${listId}/member`, {}, qs);
                                responseData = responseData.members;
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/list/${listId}/member`, {}, qs);
                                responseData = responseData.members;
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                        if (operation === 'customFields') {
                            const listId = this.getNodeParameter('list', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/list/${listId}/field`);
                            responseData = responseData.fields;
                        }
                        if (operation === 'delete') {
                            const listId = this.getNodeParameter('list', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', `/list/${listId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            const listId = this.getNodeParameter('list', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', `/list/${listId}`);
                        }
                        if (operation === 'getAll') {
                            const filters = this.getNodeParameter('filters', i);
                            const spaceId = this.getNodeParameter('space', i);
                            const folderless = this.getNodeParameter('folderless', i);
                            if (filters.archived) {
                                qs.archived = filters.archived;
                            }
                            let endpoint = `/space/${spaceId}/list`;
                            if (!folderless) {
                                const folderId = this.getNodeParameter('folder', i);
                                endpoint = `/folder/${folderId}/list`;
                            }
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', endpoint, {}, qs);
                            responseData = responseData.lists;
                            responseData = responseData.splice(0, qs.limit);
                        }
                        if (operation === 'update') {
                            const listId = this.getNodeParameter('list', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            if (updateFields.name) {
                                body.name = updateFields.name;
                            }
                            if (updateFields.content) {
                                body.content = updateFields.content;
                            }
                            if (updateFields.dueDate) {
                                body.due_date = new Date(updateFields.dueDate).getTime();
                            }
                            if (updateFields.dueDateTime) {
                                body.due_date_time = updateFields.dueDateTime;
                            }
                            if (updateFields.priority) {
                                body.priority = updateFields.priority;
                            }
                            if (updateFields.assignee) {
                                body.assignee = parseInt(updateFields.assignee, 10);
                            }
                            if (updateFields.unsetStatus) {
                                body.unset_status = updateFields.unsetStatus;
                            }
                            responseData = yield GenericFunctions_1.clickupApiRequest.call(this, 'PUT', `/list/${listId}`, body);
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
exports.ClickUp = ClickUp;

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
exports.Taiga = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
class Taiga {
    constructor() {
        this.description = {
            displayName: 'Taiga',
            name: 'taiga',
            icon: 'file:taiga.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Taiga API',
            defaults: {
                name: 'Taiga',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'taigaApi',
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
                            name: 'Epic',
                            value: 'epic',
                        },
                        {
                            name: 'Issue',
                            value: 'issue',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                        {
                            name: 'User Story',
                            value: 'userStory',
                        },
                    ],
                    default: 'issue',
                },
                ...descriptions_1.epicOperations,
                ...descriptions_1.epicFields,
                ...descriptions_1.issueOperations,
                ...descriptions_1.issueFields,
                ...descriptions_1.taskOperations,
                ...descriptions_1.taskFields,
                ...descriptions_1.userStoryOperations,
                ...descriptions_1.userStoryFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getEpics() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const project = this.getCurrentNodeParameter('projectId');
                        const epics = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/epics', {}, { project });
                        return epics.map(({ subject, id }) => ({ name: subject, value: id }));
                    });
                },
                getMilestones() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const project = this.getCurrentNodeParameter('projectId');
                        const milestones = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/milestones', {}, { project });
                        return (0, GenericFunctions_1.toOptions)(milestones);
                    });
                },
                getPriorities() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const project = this.getCurrentNodeParameter('projectId');
                        const priorities = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/priorities', {}, { project });
                        return (0, GenericFunctions_1.toOptions)(priorities);
                    });
                },
                getProjects() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { id } = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/users/me');
                        const projects = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/projects', {}, { member: id });
                        return (0, GenericFunctions_1.toOptions)(projects);
                    });
                },
                getRoles() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const project = this.getCurrentNodeParameter('projectId');
                        const roles = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/roles', {}, { project });
                        return (0, GenericFunctions_1.toOptions)(roles);
                    });
                },
                getSeverities() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const project = this.getCurrentNodeParameter('projectId');
                        const severities = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/severities', {}, { project });
                        return (0, GenericFunctions_1.toOptions)(severities);
                    });
                },
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const project = this.getCurrentNodeParameter('projectId');
                        const tags = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', `/projects/${project}/tags_colors`);
                        return Object.keys(tags).map(tag => ({ name: tag, value: tag }));
                    });
                },
                getTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const project = this.getCurrentNodeParameter('projectId');
                        const types = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/issue-types', {}, { project });
                        return (0, GenericFunctions_1.toOptions)(types);
                    });
                },
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const project = this.getCurrentNodeParameter('projectId');
                        const users = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/users', {}, { project });
                        return users.map(({ full_name_display, id }) => ({ name: full_name_display, value: id }));
                    });
                },
                getUserStories() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const project = this.getCurrentNodeParameter('projectId');
                        const userStories = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/userstories', {}, { project });
                        return userStories.map(({ subject, id }) => ({ name: subject, value: id }));
                    });
                },
                // statuses
                getIssueStatuses() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const project = this.getCurrentNodeParameter('projectId');
                        const statuses = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/issue-statuses', {}, { project });
                        return (0, GenericFunctions_1.toOptions)(statuses);
                    });
                },
                getTaskStatuses() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const project = this.getCurrentNodeParameter('projectId');
                        const statuses = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/task-statuses', {}, { project });
                        return (0, GenericFunctions_1.toOptions)(statuses);
                    });
                },
                getUserStoryStatuses() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const project = this.getCurrentNodeParameter('projectId');
                        const statuses = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/userstory-statuses', {}, { project });
                        return (0, GenericFunctions_1.toOptions)(statuses);
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'epic') {
                        // **********************************************************************
                        //                                  epic
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //               epic: create
                            // ----------------------------------------
                            const body = {
                                project: this.getNodeParameter('projectId', i),
                                subject: this.getNodeParameter('subject', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'POST', '/epics', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //               epic: delete
                            // ----------------------------------------
                            const epicId = this.getNodeParameter('epicId', i);
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'DELETE', `/epics/${epicId}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                epic: get
                            // ----------------------------------------
                            const epicId = this.getNodeParameter('epicId', i);
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', `/epics/${epicId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //               epic: getAll
                            // ----------------------------------------
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            if (Object.keys(filters).length) {
                                Object.assign(qs, filters);
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/epics', {}, qs, i);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //               epic: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, updateFields);
                            }
                            else {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const epicId = this.getNodeParameter('epicId', i);
                            body.version = yield GenericFunctions_1.getVersionForUpdate.call(this, `/epics/${epicId}`);
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'PATCH', `/epics/${epicId}`, body);
                        }
                    }
                    else if (resource === 'issue') {
                        // **********************************************************************
                        //                                 issue
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //              issue: create
                            // ----------------------------------------
                            const body = {
                                project: this.getNodeParameter('projectId', i),
                                subject: this.getNodeParameter('subject', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'POST', '/issues', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //              issue: delete
                            // ----------------------------------------
                            const issueId = this.getNodeParameter('issueId', i);
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'DELETE', `/issues/${issueId}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                issue: get
                            // ----------------------------------------
                            const issueId = this.getNodeParameter('issueId', i);
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', `/issues/${issueId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //              issue: getAll
                            // ----------------------------------------
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            if (Object.keys(filters).length) {
                                Object.assign(qs, filters);
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/issues', {}, qs, i);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //              issue: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, updateFields);
                            }
                            else {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const issueId = this.getNodeParameter('issueId', i);
                            body.version = yield GenericFunctions_1.getVersionForUpdate.call(this, `/issues/${issueId}`);
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'PATCH', `/issues/${issueId}`, body);
                        }
                    }
                    else if (resource === 'task') {
                        // **********************************************************************
                        //                                  task
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //               task: create
                            // ----------------------------------------
                            const body = {
                                project: this.getNodeParameter('projectId', i),
                                subject: this.getNodeParameter('subject', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'POST', '/tasks', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //               task: delete
                            // ----------------------------------------
                            const taskId = this.getNodeParameter('taskId', i);
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'DELETE', `/tasks/${taskId}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                task: get
                            // ----------------------------------------
                            const taskId = this.getNodeParameter('taskId', i);
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', `/tasks/${taskId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //               task: getAll
                            // ----------------------------------------
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            if (Object.keys(filters).length) {
                                Object.assign(qs, filters);
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/tasks', {}, qs, i);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //               task: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, updateFields);
                            }
                            else {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const taskId = this.getNodeParameter('taskId', i);
                            body.version = yield GenericFunctions_1.getVersionForUpdate.call(this, `/tasks/${taskId}`);
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'PATCH', `/tasks/${taskId}`, body);
                        }
                    }
                    else if (resource === 'userStory') {
                        // **********************************************************************
                        //                               userStory
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //            userStory: create
                            // ----------------------------------------
                            const body = {
                                project: this.getNodeParameter('projectId', i),
                                subject: this.getNodeParameter('subject', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'POST', '/userstories', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //            userStory: delete
                            // ----------------------------------------
                            const userStoryId = this.getNodeParameter('userStoryId', i);
                            const endpoint = `/userstories/${userStoryId}`;
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'DELETE', endpoint);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //              userStory: get
                            // ----------------------------------------
                            const userStoryId = this.getNodeParameter('userStoryId', i);
                            const endpoint = `/userstories/${userStoryId}`;
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            userStory: getAll
                            // ----------------------------------------
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            if (Object.keys(filters).length) {
                                Object.assign(qs, filters);
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/userstories', {}, qs, i);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //            userStory: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, updateFields);
                            }
                            else {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const userStoryId = this.getNodeParameter('userStoryId', i);
                            body.version = yield GenericFunctions_1.getVersionForUpdate.call(this, `/userstories/${userStoryId}`);
                            responseData = yield GenericFunctions_1.taigaApiRequest.call(this, 'PATCH', `/userstories/${userStoryId}`, body);
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
exports.Taiga = Taiga;

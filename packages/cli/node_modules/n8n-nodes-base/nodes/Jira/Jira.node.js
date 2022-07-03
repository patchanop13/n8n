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
exports.Jira = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const IssueAttachmentDescription_1 = require("./IssueAttachmentDescription");
const IssueCommentDescription_1 = require("./IssueCommentDescription");
const IssueDescription_1 = require("./IssueDescription");
const UserDescription_1 = require("./UserDescription");
class Jira {
    constructor() {
        this.description = {
            displayName: 'Jira Software',
            name: 'jira',
            icon: 'file:jira.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Jira Software API',
            defaults: {
                name: 'Jira',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'jiraSoftwareCloudApi',
                    required: true,
                    displayOptions: {
                        show: {
                            jiraVersion: [
                                'cloud',
                            ],
                        },
                    },
                    testedBy: 'jiraSoftwareApiTest',
                },
                {
                    name: 'jiraSoftwareServerApi',
                    required: true,
                    displayOptions: {
                        show: {
                            jiraVersion: [
                                'server',
                            ],
                        },
                    },
                    testedBy: 'jiraSoftwareApiTest',
                },
            ],
            properties: [
                {
                    displayName: 'Jira Version',
                    name: 'jiraVersion',
                    type: 'options',
                    options: [
                        {
                            name: 'Cloud',
                            value: 'cloud',
                        },
                        {
                            name: 'Server (Self Hosted)',
                            value: 'server',
                        },
                    ],
                    default: 'cloud',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Issue',
                            value: 'issue',
                            description: 'Creates an issue or, where the option to create subtasks is enabled in Jira, a subtask',
                        },
                        {
                            name: 'Issue Attachment',
                            value: 'issueAttachment',
                            description: 'Add, remove, and get an attachment from an issue',
                        },
                        {
                            name: 'Issue Comment',
                            value: 'issueComment',
                            description: 'Get, create, update, and delete a comment from an issue',
                        },
                        {
                            name: 'User',
                            value: 'user',
                            description: 'Get, create and delete a user',
                        },
                    ],
                    default: 'issue',
                },
                ...IssueDescription_1.issueOperations,
                ...IssueDescription_1.issueFields,
                ...IssueAttachmentDescription_1.issueAttachmentOperations,
                ...IssueAttachmentDescription_1.issueAttachmentFields,
                ...IssueCommentDescription_1.issueCommentOperations,
                ...IssueCommentDescription_1.issueCommentFields,
                ...UserDescription_1.userOperations,
                ...UserDescription_1.userFields,
            ],
        };
        this.methods = {
            credentialTest: {
                jiraSoftwareApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = credential.data;
                        const data = Buffer.from(`${credentials.email}:${credentials.password || credentials.apiToken}`).toString('base64');
                        const options = {
                            headers: {
                                Authorization: `Basic ${data}`,
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                'X-Atlassian-Token': 'no-check',
                            },
                            method: 'GET',
                            uri: `${credentials.domain}/rest/api/2/project`,
                            qs: {
                                recent: 0,
                            },
                            json: true,
                            timeout: 5000,
                        };
                        try {
                            yield this.helpers.request(options);
                        }
                        catch (err) {
                            return {
                                status: 'Error',
                                message: `Connection details not valid: ${err.message}`,
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
                // Get all the projects to display them to user so that he can
                // select them easily
                getProjects() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const jiraVersion = this.getCurrentNodeParameter('jiraVersion');
                        let endpoint = '';
                        let projects;
                        if (jiraVersion === 'server') {
                            endpoint = '/api/2/project';
                            projects = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, endpoint, 'GET');
                        }
                        else {
                            endpoint = '/api/2/project/search';
                            projects = yield GenericFunctions_1.jiraSoftwareCloudApiRequestAllItems.call(this, 'values', endpoint, 'GET');
                        }
                        if (projects.values && Array.isArray(projects.values)) {
                            projects = projects.values;
                        }
                        for (const project of projects) {
                            const projectName = project.name;
                            const projectId = project.id;
                            returnData.push({
                                name: projectName,
                                value: projectId,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                // Get all the issue types to display them to user so that he can
                // select them easily
                getIssueTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const projectId = this.getCurrentNodeParameter('project');
                        const returnData = [];
                        const { issueTypes } = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/project/${projectId}`, 'GET');
                        for (const issueType of issueTypes) {
                            const issueTypeName = issueType.name;
                            const issueTypeId = issueType.id;
                            returnData.push({
                                name: issueTypeName,
                                value: issueTypeId,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                // Get all the labels to display them to user so that he can
                // select them easily
                getLabels() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const labels = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, '/api/2/label', 'GET');
                        for (const label of labels.values) {
                            const labelName = label;
                            const labelId = label;
                            returnData.push({
                                name: labelName,
                                value: labelId,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                // Get all the priorities to display them to user so that he can
                // select them easily
                getPriorities() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const priorities = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, '/api/2/priority', 'GET');
                        for (const priority of priorities) {
                            const priorityName = priority.name;
                            const priorityId = priority.id;
                            returnData.push({
                                name: priorityName,
                                value: priorityId,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                // Get all the users to display them to user so that he can
                // select them easily
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const jiraVersion = this.getCurrentNodeParameter('jiraVersion');
                        const query = {};
                        let endpoint = '/api/2/users/search';
                        if (jiraVersion === 'server') {
                            endpoint = '/api/2/user/search';
                            query.username = '\'';
                        }
                        const users = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, endpoint, 'GET', {}, query);
                        return users.reduce((activeUsers, user) => {
                            if (user.active) {
                                activeUsers.push({
                                    name: user.displayName,
                                    value: (user.accountId || user.name),
                                });
                            }
                            return activeUsers;
                        }, []).sort((a, b) => {
                            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
                        });
                    });
                },
                // Get all the groups to display them to user so that he can
                // select them easily
                getGroups() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const groups = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, '/api/2/groups/picker', 'GET');
                        for (const group of groups.groups) {
                            const groupName = group.name;
                            const groupId = group.name;
                            returnData.push({
                                name: groupName,
                                value: groupId,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                // Get all the groups to display them to user so that he can
                // select them easily
                getTransitions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const issueKey = this.getCurrentNodeParameter('issueKey');
                        const transitions = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/issue/${issueKey}/transitions`, 'GET');
                        for (const transition of transitions.transitions) {
                            returnData.push({
                                name: transition.name,
                                value: transition.id,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                // Get all the custom fields to display them to user so that he can
                // select them easily
                getCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const operation = this.getCurrentNodeParameter('operation');
                        let projectId;
                        let issueTypeId;
                        if (operation === 'create') {
                            projectId = this.getCurrentNodeParameter('project');
                            issueTypeId = this.getCurrentNodeParameter('issueType');
                        }
                        else {
                            const issueKey = this.getCurrentNodeParameter('issueKey');
                            const res = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/issue/${issueKey}`, 'GET', {}, {});
                            projectId = res.fields.project.id;
                            issueTypeId = res.fields.issuetype.id;
                        }
                        const res = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/issue/createmeta?projectIds=${projectId}&issueTypeIds=${issueTypeId}&expand=projects.issuetypes.fields`, 'GET');
                        // tslint:disable-next-line: no-any
                        const fields = res.projects.find((o) => o.id === projectId).issuetypes.find((o) => o.id === issueTypeId).fields;
                        for (const key of Object.keys(fields)) {
                            const field = fields[key];
                            if (field.schema && Object.keys(field.schema).includes('customId')) {
                                returnData.push({
                                    name: field.name,
                                    value: field.key || field.fieldId,
                                });
                            }
                        }
                        return returnData;
                    });
                },
                // Get all the components to display them to user so that he can
                // select them easily
                getProjectComponents() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const project = this.getCurrentNodeParameter('project');
                        const { values: components } = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/project/${project}/component`, 'GET');
                        for (const component of components) {
                            returnData.push({
                                name: component.name,
                                value: component.id,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
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
            const jiraVersion = this.getNodeParameter('jiraVersion', 0);
            if (resource === 'issue') {
                //https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-post
                if (operation === 'create') {
                    for (let i = 0; i < length; i++) {
                        const summary = this.getNodeParameter('summary', i);
                        const projectId = this.getNodeParameter('project', i);
                        const issueTypeId = this.getNodeParameter('issueType', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {};
                        const fields = {
                            summary,
                            project: {
                                id: projectId,
                            },
                            issuetype: {
                                id: issueTypeId,
                            },
                        };
                        if (additionalFields.labels) {
                            fields.labels = additionalFields.labels;
                        }
                        if (additionalFields.serverLabels) {
                            fields.labels = additionalFields.serverLabels;
                        }
                        if (additionalFields.priority) {
                            fields.priority = {
                                id: additionalFields.priority,
                            };
                        }
                        if (additionalFields.assignee) {
                            if (jiraVersion === 'server') {
                                fields.assignee = {
                                    name: additionalFields.assignee,
                                };
                            }
                            else {
                                fields.assignee = {
                                    id: additionalFields.assignee,
                                };
                            }
                        }
                        if (additionalFields.reporter) {
                            if (jiraVersion === 'server') {
                                fields.reporter = {
                                    name: additionalFields.reporter,
                                };
                            }
                            else {
                                fields.reporter = {
                                    id: additionalFields.reporter,
                                };
                            }
                        }
                        if (additionalFields.description) {
                            fields.description = additionalFields.description;
                        }
                        if (additionalFields.updateHistory) {
                            qs.updateHistory = additionalFields.updateHistory;
                        }
                        if (additionalFields.componentIds) {
                            fields.components = additionalFields.componentIds.map(id => ({ id }));
                        }
                        if (additionalFields.customFieldsUi) {
                            const customFields = additionalFields.customFieldsUi.customFieldsValues;
                            if (customFields) {
                                const data = customFields.reduce((obj, value) => Object.assign(obj, { [`${value.fieldId}`]: value.fieldValue }), {});
                                Object.assign(fields, data);
                            }
                        }
                        const issueTypes = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, '/api/2/issuetype', 'GET', body, qs);
                        const subtaskIssues = [];
                        for (const issueType of issueTypes) {
                            if (issueType.subtask) {
                                subtaskIssues.push(issueType.id);
                            }
                        }
                        if (!additionalFields.parentIssueKey
                            && subtaskIssues.includes(issueTypeId)) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'You must define a Parent Issue Key when Issue type is sub-task');
                        }
                        else if (additionalFields.parentIssueKey
                            && subtaskIssues.includes(issueTypeId)) {
                            fields.parent = {
                                key: additionalFields.parentIssueKey.toUpperCase(),
                            };
                        }
                        body.fields = fields;
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, '/api/2/issue', 'POST', body);
                        returnData.push(responseData);
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-issueIdOrKey-put
                if (operation === 'update') {
                    for (let i = 0; i < length; i++) {
                        const issueKey = this.getNodeParameter('issueKey', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const body = {};
                        const fields = {};
                        if (updateFields.summary) {
                            fields.summary = updateFields.summary;
                        }
                        if (updateFields.issueType) {
                            fields.issuetype = {
                                id: updateFields.issueType,
                            };
                        }
                        if (updateFields.labels) {
                            fields.labels = updateFields.labels;
                        }
                        if (updateFields.serverLabels) {
                            fields.labels = updateFields.serverLabels;
                        }
                        if (updateFields.priority) {
                            fields.priority = {
                                id: updateFields.priority,
                            };
                        }
                        if (updateFields.assignee) {
                            if (jiraVersion === 'server') {
                                fields.assignee = {
                                    name: updateFields.assignee,
                                };
                            }
                            else {
                                fields.assignee = {
                                    id: updateFields.assignee,
                                };
                            }
                        }
                        if (updateFields.reporter) {
                            if (jiraVersion === 'server') {
                                fields.reporter = {
                                    name: updateFields.reporter,
                                };
                            }
                            else {
                                fields.reporter = {
                                    id: updateFields.reporter,
                                };
                            }
                        }
                        if (updateFields.description) {
                            fields.description = updateFields.description;
                        }
                        if (updateFields.customFieldsUi) {
                            const customFields = updateFields.customFieldsUi.customFieldsValues;
                            if (customFields) {
                                const data = customFields.reduce((obj, value) => Object.assign(obj, { [`${value.fieldId}`]: value.fieldValue }), {});
                                Object.assign(fields, data);
                            }
                        }
                        const issueTypes = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, '/api/2/issuetype', 'GET', body);
                        const subtaskIssues = [];
                        for (const issueType of issueTypes) {
                            if (issueType.subtask) {
                                subtaskIssues.push(issueType.id);
                            }
                        }
                        if (!updateFields.parentIssueKey
                            && subtaskIssues.includes(updateFields.issueType)) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'You must define a Parent Issue Key when Issue type is sub-task');
                        }
                        else if (updateFields.parentIssueKey
                            && subtaskIssues.includes(updateFields.issueType)) {
                            fields.parent = {
                                key: updateFields.parentIssueKey.toUpperCase(),
                            };
                        }
                        body.fields = fields;
                        if (updateFields.statusId) {
                            responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/issue/${issueKey}/transitions`, 'POST', { transition: { id: updateFields.statusId } });
                        }
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/issue/${issueKey}`, 'PUT', body);
                        returnData.push({ success: true });
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-issueIdOrKey-get
                if (operation === 'get') {
                    for (let i = 0; i < length; i++) {
                        const issueKey = this.getNodeParameter('issueKey', i);
                        const simplifyOutput = this.getNodeParameter('simplifyOutput', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (additionalFields.fields) {
                            qs.fields = additionalFields.fields;
                        }
                        if (additionalFields.fieldsByKey) {
                            qs.fieldsByKey = additionalFields.fieldsByKey;
                        }
                        if (additionalFields.expand) {
                            qs.expand = additionalFields.expand;
                        }
                        if (simplifyOutput) {
                            qs.expand = `${qs.expand || ''},names`;
                        }
                        if (additionalFields.properties) {
                            qs.properties = additionalFields.properties;
                        }
                        if (additionalFields.updateHistory) {
                            qs.updateHistory = additionalFields.updateHistory;
                        }
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/issue/${issueKey}`, 'GET', {}, qs);
                        if (simplifyOutput) {
                            returnData.push((0, GenericFunctions_1.simplifyIssueOutput)(responseData));
                        }
                        else {
                            returnData.push(responseData);
                        }
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-search-post
                if (operation === 'getAll') {
                    for (let i = 0; i < length; i++) {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const options = this.getNodeParameter('options', i);
                        const body = {};
                        if (options.fields) {
                            body.fields = options.fields.split(',');
                        }
                        if (options.jql) {
                            body.jql = options.jql;
                        }
                        if (options.expand) {
                            if (typeof options.expand === 'string') {
                                body.expand = options.expand.split(',');
                            }
                            else {
                                body.expand = options.expand;
                            }
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequestAllItems.call(this, 'issues', `/api/2/search`, 'POST', body);
                        }
                        else {
                            const limit = this.getNodeParameter('limit', i);
                            body.maxResults = limit;
                            responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/search`, 'POST', body);
                            responseData = responseData.issues;
                        }
                        returnData.push(...responseData);
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-issueIdOrKey-changelog-get
                if (operation === 'changelog') {
                    for (let i = 0; i < length; i++) {
                        const issueKey = this.getNodeParameter('issueKey', i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequestAllItems.call(this, 'values', `/api/2/issue/${issueKey}/changelog`, 'GET');
                        }
                        else {
                            qs.maxResults = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/issue/${issueKey}/changelog`, 'GET', {}, qs);
                            responseData = responseData.values;
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-issueIdOrKey-notify-post
                if (operation === 'notify') {
                    for (let i = 0; i < length; i++) {
                        const issueKey = this.getNodeParameter('issueKey', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const jsonActive = this.getNodeParameter('jsonParameters', 0);
                        const body = {};
                        if (additionalFields.textBody) {
                            body.textBody = additionalFields.textBody;
                        }
                        if (additionalFields.htmlBody) {
                            body.htmlBody = additionalFields.htmlBody;
                        }
                        if (!jsonActive) {
                            const notificationRecipientsValues = this.getNodeParameter('notificationRecipientsUi', i).notificationRecipientsValues;
                            const notificationRecipients = {};
                            if (notificationRecipientsValues) {
                                // @ts-ignore
                                if (notificationRecipientsValues.reporter) {
                                    // @ts-ignore
                                    notificationRecipients.reporter = notificationRecipientsValues.reporter;
                                }
                                // @ts-ignore
                                if (notificationRecipientsValues.assignee) {
                                    // @ts-ignore
                                    notificationRecipients.assignee = notificationRecipientsValues.assignee;
                                }
                                // @ts-ignore
                                if (notificationRecipientsValues.assignee) {
                                    // @ts-ignore
                                    notificationRecipients.watchers = notificationRecipientsValues.watchers;
                                }
                                // @ts-ignore
                                if (notificationRecipientsValues.voters) {
                                    // @ts-ignore
                                    notificationRecipients.watchers = notificationRecipientsValues.voters;
                                }
                                // @ts-ignore
                                if (notificationRecipientsValues.users.length > 0) {
                                    // @ts-ignore
                                    notificationRecipients.users = notificationRecipientsValues.users.map(user => {
                                        return {
                                            accountId: user,
                                        };
                                    });
                                }
                                // @ts-ignore
                                if (notificationRecipientsValues.groups.length > 0) {
                                    // @ts-ignore
                                    notificationRecipients.groups = notificationRecipientsValues.groups.map(group => {
                                        return {
                                            name: group,
                                        };
                                    });
                                }
                            }
                            body.to = notificationRecipients;
                            const notificationRecipientsRestrictionsValues = this.getNodeParameter('notificationRecipientsRestrictionsUi', i).notificationRecipientsRestrictionsValues;
                            const notificationRecipientsRestrictions = {};
                            if (notificationRecipientsRestrictionsValues) {
                                // @ts-ignore
                                if (notificationRecipientsRestrictionsValues.groups.length > 0) {
                                    // @ts-ignore
                                    notificationRecipientsRestrictions.groups = notificationRecipientsRestrictionsValues.groups.map(group => {
                                        return {
                                            name: group,
                                        };
                                    });
                                }
                            }
                            body.restrict = notificationRecipientsRestrictions;
                        }
                        else {
                            const notificationRecipientsJson = (0, GenericFunctions_1.validateJSON)(this.getNodeParameter('notificationRecipientsJson', i));
                            if (notificationRecipientsJson) {
                                body.to = notificationRecipientsJson;
                            }
                            const notificationRecipientsRestrictionsJson = (0, GenericFunctions_1.validateJSON)(this.getNodeParameter('notificationRecipientsRestrictionsJson', i));
                            if (notificationRecipientsRestrictionsJson) {
                                body.restrict = notificationRecipientsRestrictionsJson;
                            }
                        }
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/issue/${issueKey}/notify`, 'POST', body, qs);
                        returnData.push(responseData);
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-issueIdOrKey-transitions-get
                if (operation === 'transitions') {
                    for (let i = 0; i < length; i++) {
                        const issueKey = this.getNodeParameter('issueKey', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (additionalFields.transitionId) {
                            qs.transitionId = additionalFields.transitionId;
                        }
                        if (additionalFields.expand) {
                            qs.expand = additionalFields.expand;
                        }
                        if (additionalFields.skipRemoteOnlyCondition) {
                            qs.skipRemoteOnlyCondition = additionalFields.skipRemoteOnlyCondition;
                        }
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/issue/${issueKey}/transitions`, 'GET', {}, qs);
                        responseData = responseData.transitions;
                        returnData.push.apply(returnData, responseData);
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-issueIdOrKey-delete
                if (operation === 'delete') {
                    for (let i = 0; i < length; i++) {
                        const issueKey = this.getNodeParameter('issueKey', i);
                        const deleteSubtasks = this.getNodeParameter('deleteSubtasks', i);
                        qs.deleteSubtasks = deleteSubtasks;
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/issue/${issueKey}`, 'DELETE', {}, qs);
                        returnData.push({ success: true });
                    }
                }
            }
            if (resource === 'issueAttachment') {
                const apiVersion = jiraVersion === 'server' ? '2' : '3';
                //https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-issue-issueidorkey-attachments-post
                if (operation === 'add') {
                    for (let i = 0; i < length; i++) {
                        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                        const issueKey = this.getNodeParameter('issueKey', i);
                        if (items[i].binary === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                        }
                        const item = items[i].binary;
                        const binaryData = item[binaryPropertyName];
                        const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                        if (binaryData === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                        }
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/${apiVersion}/issue/${issueKey}/attachments`, 'POST', {}, {}, undefined, {
                            formData: {
                                file: {
                                    value: binaryDataBuffer,
                                    options: {
                                        filename: binaryData.fileName,
                                    },
                                },
                            },
                        });
                        returnData.push.apply(returnData, responseData);
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-attachment-id-delete
                if (operation === 'remove') {
                    for (let i = 0; i < length; i++) {
                        const attachmentId = this.getNodeParameter('attachmentId', i);
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/${apiVersion}/attachment/${attachmentId}`, 'DELETE', {}, qs);
                        returnData.push({ success: true });
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-attachment-id-get
                if (operation === 'get') {
                    const download = this.getNodeParameter('download', 0);
                    for (let i = 0; i < length; i++) {
                        const attachmentId = this.getNodeParameter('attachmentId', i);
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/${apiVersion}/attachment/${attachmentId}`, 'GET', {}, qs);
                        returnData.push({ json: responseData });
                    }
                    if (download) {
                        const binaryPropertyName = this.getNodeParameter('binaryProperty', 0);
                        for (const [index, attachment] of returnData.entries()) {
                            returnData[index]['binary'] = {};
                            //@ts-ignore
                            const buffer = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, '', 'GET', {}, {}, attachment === null || attachment === void 0 ? void 0 : attachment.json.content, { json: false, encoding: null });
                            //@ts-ignore
                            returnData[index]['binary'][binaryPropertyName] = yield this.helpers.prepareBinaryData(buffer, attachment.json.filename, attachment.json.mimeType);
                        }
                    }
                }
                if (operation === 'getAll') {
                    const download = this.getNodeParameter('download', 0);
                    for (let i = 0; i < length; i++) {
                        const issueKey = this.getNodeParameter('issueKey', i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const { fields: { attachment } } = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/2/issue/${issueKey}`, 'GET', {}, qs);
                        responseData = attachment;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', i);
                            responseData = responseData.slice(0, limit);
                        }
                        responseData = responseData.map((data) => ({ json: data }));
                        returnData.push.apply(returnData, responseData);
                    }
                    if (download) {
                        const binaryPropertyName = this.getNodeParameter('binaryProperty', 0);
                        for (const [index, attachment] of returnData.entries()) {
                            returnData[index]['binary'] = {};
                            //@ts-ignore
                            const buffer = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, '', 'GET', {}, {}, attachment.json.content, { json: false, encoding: null });
                            //@ts-ignore
                            returnData[index]['binary'][binaryPropertyName] = yield this.helpers.prepareBinaryData(buffer, attachment.json.filename, attachment.json.mimeType);
                        }
                    }
                }
            }
            if (resource === 'issueComment') {
                const apiVersion = jiraVersion === 'server' ? '2' : '3';
                //https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-post
                if (operation === 'add') {
                    for (let i = 0; i < length; i++) {
                        const jsonParameters = this.getNodeParameter('jsonParameters', 0);
                        const issueKey = this.getNodeParameter('issueKey', i);
                        const options = this.getNodeParameter('options', i);
                        const body = {};
                        if (options.expand) {
                            qs.expand = options.expand;
                            delete options.expand;
                        }
                        Object.assign(body, options);
                        if (jsonParameters === false) {
                            const comment = this.getNodeParameter('comment', i);
                            if (jiraVersion === 'server') {
                                Object.assign(body, { body: comment });
                            }
                            else {
                                Object.assign(body, {
                                    body: {
                                        type: 'doc',
                                        version: 1,
                                        content: [
                                            {
                                                type: 'paragraph',
                                                content: [
                                                    {
                                                        type: 'text',
                                                        text: comment,
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                });
                            }
                        }
                        else {
                            const commentJson = this.getNodeParameter('commentJson', i);
                            const json = (0, GenericFunctions_1.validateJSON)(commentJson);
                            if (json === '') {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Document Format must be a valid JSON');
                            }
                            Object.assign(body, { body: json });
                        }
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/${apiVersion}/issue/${issueKey}/comment`, 'POST', body, qs);
                        returnData.push(responseData);
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-issueIdOrKey-get
                if (operation === 'get') {
                    for (let i = 0; i < length; i++) {
                        const issueKey = this.getNodeParameter('issueKey', i);
                        const commentId = this.getNodeParameter('commentId', i);
                        const options = this.getNodeParameter('options', i);
                        Object.assign(qs, options);
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/${apiVersion}/issue/${issueKey}/comment/${commentId}`, 'GET', {}, qs);
                        returnData.push(responseData);
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-get
                if (operation === 'getAll') {
                    for (let i = 0; i < length; i++) {
                        const issueKey = this.getNodeParameter('issueKey', i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const options = this.getNodeParameter('options', i);
                        const body = {};
                        Object.assign(qs, options);
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequestAllItems.call(this, 'comments', `/api/${apiVersion}/issue/${issueKey}/comment`, 'GET', body, qs);
                        }
                        else {
                            const limit = this.getNodeParameter('limit', i);
                            body.maxResults = limit;
                            responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/${apiVersion}/issue/${issueKey}/comment`, 'GET', body, qs);
                            responseData = responseData.comments;
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-id-delete
                if (operation === 'remove') {
                    for (let i = 0; i < length; i++) {
                        const issueKey = this.getNodeParameter('issueKey', i);
                        const commentId = this.getNodeParameter('commentId', i);
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/${apiVersion}/issue/${issueKey}/comment/${commentId}`, 'DELETE', {}, qs);
                        returnData.push({ success: true });
                    }
                }
                //https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-id-put
                if (operation === 'update') {
                    for (let i = 0; i < length; i++) {
                        const issueKey = this.getNodeParameter('issueKey', i);
                        const commentId = this.getNodeParameter('commentId', i);
                        const options = this.getNodeParameter('options', i);
                        const jsonParameters = this.getNodeParameter('jsonParameters', 0);
                        const body = {};
                        if (options.expand) {
                            qs.expand = options.expand;
                            delete options.expand;
                        }
                        Object.assign(qs, options);
                        if (jsonParameters === false) {
                            const comment = this.getNodeParameter('comment', i);
                            if (jiraVersion === 'server') {
                                Object.assign(body, { body: comment });
                            }
                            else {
                                Object.assign(body, {
                                    body: {
                                        type: 'doc',
                                        version: 1,
                                        content: [
                                            {
                                                type: 'paragraph',
                                                content: [
                                                    {
                                                        type: 'text',
                                                        text: comment,
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                });
                            }
                        }
                        else {
                            const commentJson = this.getNodeParameter('commentJson', i);
                            const json = (0, GenericFunctions_1.validateJSON)(commentJson);
                            if (json === '') {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Document Format must be a valid JSON');
                            }
                            Object.assign(body, { body: json });
                        }
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/${apiVersion}/issue/${issueKey}/comment/${commentId}`, 'PUT', body, qs);
                        returnData.push(responseData);
                    }
                }
            }
            if (resource === 'user') {
                const apiVersion = jiraVersion === 'server' ? '2' : '3';
                if (operation === 'create') {
                    // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-users/#api-rest-api-3-user-post
                    for (let i = 0; i < length; i++) {
                        const body = {
                            name: this.getNodeParameter('username', i),
                            emailAddress: this.getNodeParameter('emailAddress', i),
                            displayName: this.getNodeParameter('displayName', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        Object.assign(body, additionalFields);
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/${apiVersion}/user`, 'POST', body, {});
                        returnData.push(responseData);
                    }
                }
                else if (operation === 'delete') {
                    // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-users/#api-rest-api-3-user-delete
                    for (let i = 0; i < length; i++) {
                        qs.accountId = this.getNodeParameter('accountId', i);
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/${apiVersion}/user`, 'DELETE', {}, qs);
                        returnData.push({ success: true });
                    }
                }
                else if (operation === 'get') {
                    // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-users/#api-rest-api-3-user-get
                    for (let i = 0; i < length; i++) {
                        qs.accountId = this.getNodeParameter('accountId', i);
                        const { expand } = this.getNodeParameter('additionalFields', i);
                        if (expand) {
                            qs.expand = expand.join(',');
                        }
                        responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, `/api/${apiVersion}/user`, 'GET', {}, qs);
                        returnData.push(responseData);
                    }
                }
            }
            if (resource === 'issueAttachment' && (operation === 'getAll' || operation === 'get')) {
                return this.prepareOutputData(returnData);
            }
            else {
                return [this.helpers.returnJsonArray(returnData)];
            }
        });
    }
}
exports.Jira = Jira;

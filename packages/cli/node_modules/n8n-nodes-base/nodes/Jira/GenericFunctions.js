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
exports.allEvents = exports.simplifyIssueOutput = exports.getId = exports.eventExists = exports.validateJSON = exports.jiraSoftwareCloudApiRequestAllItems = exports.jiraSoftwareCloudApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function jiraSoftwareCloudApiRequest(endpoint, method, body = {}, query, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let data;
        let domain;
        const jiraVersion = this.getNodeParameter('jiraVersion', 0);
        let jiraCredentials;
        if (jiraVersion === 'server') {
            jiraCredentials = yield this.getCredentials('jiraSoftwareServerApi');
        }
        else {
            jiraCredentials = yield this.getCredentials('jiraSoftwareCloudApi');
        }
        if (jiraVersion === 'server') {
            domain = jiraCredentials.domain;
            data = Buffer.from(`${jiraCredentials.email}:${jiraCredentials.password}`).toString('base64');
        }
        else {
            domain = jiraCredentials.domain;
            data = Buffer.from(`${jiraCredentials.email}:${jiraCredentials.apiToken}`).toString('base64');
        }
        const options = {
            headers: {
                Authorization: `Basic ${data}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Atlassian-Token': 'no-check',
            },
            method,
            qs: query,
            uri: uri || `${domain}/rest${endpoint}`,
            body,
            json: true,
        };
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(query || {}).length === 0) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.jiraSoftwareCloudApiRequest = jiraSoftwareCloudApiRequest;
function jiraSoftwareCloudApiRequestAllItems(propertyName, endpoint, method, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.startAt = 0;
        body.startAt = 0;
        query.maxResults = 100;
        body.maxResults = 100;
        do {
            responseData = yield jiraSoftwareCloudApiRequest.call(this, endpoint, method, body, query);
            returnData.push.apply(returnData, responseData[propertyName]);
            query.startAt = responseData.startAt + responseData.maxResults;
            body.startAt = responseData.startAt + responseData.maxResults;
        } while ((responseData.startAt + responseData.maxResults < responseData.total));
        return returnData;
    });
}
exports.jiraSoftwareCloudApiRequestAllItems = jiraSoftwareCloudApiRequestAllItems;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = '';
    }
    return result;
}
exports.validateJSON = validateJSON;
function eventExists(currentEvents, webhookEvents) {
    for (const currentEvent of currentEvents) {
        if (!webhookEvents.includes(currentEvent)) {
            return false;
        }
    }
    return true;
}
exports.eventExists = eventExists;
function getId(url) {
    return url.split('/').pop();
}
exports.getId = getId;
function simplifyIssueOutput(responseData) {
    const mappedFields = {
        id: responseData.id,
        key: responseData.key,
        self: responseData.self,
    };
    // Sort custom fields last so we map them last
    const customField = /^customfield_\d+$/;
    const sortedFields = Object.keys(responseData.fields).sort((a, b) => {
        if (customField.test(a) && customField.test(b)) {
            return a > b ? 1 : -1;
        }
        if (customField.test(a)) {
            return 1;
        }
        if (customField.test(b)) {
            return -1;
        }
        return a > b ? 1 : -1;
    });
    for (const field of sortedFields) {
        if (responseData.names[field] in mappedFields) {
            let newField = responseData.names[field];
            let counter = 0;
            while (newField in mappedFields) {
                counter++;
                newField = `${responseData.names[field]}_${counter}`;
            }
            mappedFields[newField] = responseData.fields[field];
        }
        else {
            mappedFields[responseData.names[field] || field] = responseData.fields[field];
        }
    }
    return mappedFields;
}
exports.simplifyIssueOutput = simplifyIssueOutput;
exports.allEvents = [
    'board_created',
    'board_updated',
    'board_deleted',
    'board_configuration_changed',
    'comment_created',
    'comment_updated',
    'comment_deleted',
    'jira:issue_created',
    'jira:issue_updated',
    'jira:issue_deleted',
    'option_voting_changed',
    'option_watching_changed',
    'option_unassigned_issues_changed',
    'option_subtasks_changed',
    'option_attachments_changed',
    'option_issuelinks_changed',
    'option_timetracking_changed',
    'project_created',
    'project_updated',
    'project_deleted',
    'sprint_created',
    'sprint_deleted',
    'sprint_updated',
    'sprint_started',
    'sprint_closed',
    'user_created',
    'user_updated',
    'user_deleted',
    'jira:version_released',
    'jira:version_unreleased',
    'jira:version_created',
    'jira:version_moved',
    'jira:version_updated',
    'jira:version_deleted',
    'issuelink_created',
    'issuelink_deleted',
    'worklog_created',
    'worklog_updated',
    'worklog_deleted',
];

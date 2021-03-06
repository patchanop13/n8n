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
exports.SentryIo = void 0;
const EventDescription_1 = require("./EventDescription");
const IssueDescription_1 = require("./IssueDescription");
const OrganizationDescription_1 = require("./OrganizationDescription");
const ProjectDescription_1 = require("./ProjectDescription");
const ReleaseDescription_1 = require("./ReleaseDescription");
const TeamDescription_1 = require("./TeamDescription");
const GenericFunctions_1 = require("./GenericFunctions");
class SentryIo {
    constructor() {
        this.description = {
            displayName: 'Sentry.io',
            name: 'sentryIo',
            icon: 'file:sentryio.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Sentry.io API',
            defaults: {
                name: 'Sentry.io',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'sentryIoOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                            sentryVersion: [
                                'cloud',
                            ],
                        },
                    },
                },
                {
                    name: 'sentryIoApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'accessToken',
                            ],
                            sentryVersion: [
                                'cloud',
                            ],
                        },
                    },
                },
                {
                    name: 'sentryIoServerApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'accessToken',
                            ],
                            sentryVersion: [
                                'server',
                            ],
                        },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Sentry Version',
                    name: 'sentryVersion',
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
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    displayOptions: {
                        show: {
                            sentryVersion: [
                                'cloud',
                            ],
                        },
                    },
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
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    displayOptions: {
                        show: {
                            sentryVersion: [
                                'server',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Access Token',
                            value: 'accessToken',
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
                            name: 'Event',
                            value: 'event',
                        },
                        {
                            name: 'Issue',
                            value: 'issue',
                        },
                        {
                            name: 'Organization',
                            value: 'organization',
                        },
                        {
                            name: 'Project',
                            value: 'project',
                        },
                        {
                            name: 'Release',
                            value: 'release',
                        },
                        {
                            name: 'Team',
                            value: 'team',
                        },
                    ],
                    default: 'event',
                },
                // EVENT
                ...EventDescription_1.eventOperations,
                ...EventDescription_1.eventFields,
                // ISSUE
                ...IssueDescription_1.issueOperations,
                ...IssueDescription_1.issueFields,
                // ORGANIZATION
                ...OrganizationDescription_1.organizationOperations,
                ...OrganizationDescription_1.organizationFields,
                // PROJECT
                ...ProjectDescription_1.projectOperations,
                ...ProjectDescription_1.projectFields,
                // RELEASE
                ...ReleaseDescription_1.releaseOperations,
                ...ReleaseDescription_1.releaseFields,
                // TEAM
                ...TeamDescription_1.teamOperations,
                ...TeamDescription_1.teamFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all organizations so they can be displayed easily
                getOrganizations() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const organizations = yield GenericFunctions_1.sentryApiRequestAllItems.call(this, 'GET', `/api/0/organizations/`, {});
                        for (const organization of organizations) {
                            returnData.push({
                                name: organization.slug,
                                value: organization.slug,
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
                // Get all projects so can be displayed easily
                getProjects() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const projects = yield GenericFunctions_1.sentryApiRequestAllItems.call(this, 'GET', `/api/0/projects/`, {});
                        const organizationSlug = this.getNodeParameter('organizationSlug');
                        for (const project of projects) {
                            if (organizationSlug !== project.organization.slug) {
                                continue;
                            }
                            returnData.push({
                                name: project.slug,
                                value: project.slug,
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
                // Get an organization teams
                getTeams() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const organizationSlug = this.getNodeParameter('organizationSlug');
                        const teams = yield GenericFunctions_1.sentryApiRequestAllItems.call(this, 'GET', `/api/0/organizations/${organizationSlug}/teams/`, {});
                        for (const team of teams) {
                            returnData.push({
                                name: team.slug,
                                value: team.slug,
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
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'event') {
                        if (operation === 'getAll') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const projectSlug = this.getNodeParameter('projectSlug', i);
                            const full = this.getNodeParameter('full', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const endpoint = `/api/0/projects/${organizationSlug}/${projectSlug}/events/`;
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.limit = limit;
                            }
                            qs.full = full;
                            responseData = yield GenericFunctions_1.sentryApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        if (operation === 'get') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const projectSlug = this.getNodeParameter('projectSlug', i);
                            const eventId = this.getNodeParameter('eventId', i);
                            const endpoint = `/api/0/projects/${organizationSlug}/${projectSlug}/events/${eventId}/`;
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'GET', endpoint, qs);
                        }
                    }
                    if (resource === 'issue') {
                        if (operation === 'getAll') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const projectSlug = this.getNodeParameter('projectSlug', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const endpoint = `/api/0/projects/${organizationSlug}/${projectSlug}/issues/`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.statsPeriod) {
                                qs.statsPeriod = additionalFields.statsPeriod;
                            }
                            if (additionalFields.shortIdLookup) {
                                qs.shortIdLookup = additionalFields.shortIdLookup;
                            }
                            if (additionalFields.query) {
                                qs.query = additionalFields.query;
                            }
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.limit = limit;
                            }
                            responseData = yield GenericFunctions_1.sentryApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        if (operation === 'get') {
                            const issueId = this.getNodeParameter('issueId', i);
                            const endpoint = `/api/0/issues/${issueId}/`;
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'GET', endpoint, qs);
                        }
                        if (operation === 'delete') {
                            const issueId = this.getNodeParameter('issueId', i);
                            const endpoint = `/api/0/issues/${issueId}/`;
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'DELETE', endpoint, qs);
                            responseData = { success: true };
                        }
                        if (operation === 'update') {
                            const issueId = this.getNodeParameter('issueId', i);
                            const endpoint = `/api/0/issues/${issueId}/`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.status) {
                                qs.status = additionalFields.status;
                            }
                            if (additionalFields.assignedTo) {
                                qs.assignedTo = additionalFields.assignedTo;
                            }
                            if (additionalFields.hasSeen) {
                                qs.hasSeen = additionalFields.hasSeen;
                            }
                            if (additionalFields.isBookmarked) {
                                qs.isBookmarked = additionalFields.isBookmarked;
                            }
                            if (additionalFields.isSubscribed) {
                                qs.isSubscribed = additionalFields.isSubscribed;
                            }
                            if (additionalFields.isPublic) {
                                qs.isPublic = additionalFields.isPublic;
                            }
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'PUT', endpoint, qs);
                        }
                    }
                    if (resource === 'organization') {
                        if (operation === 'get') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const endpoint = `/api/0/organizations/${organizationSlug}/`;
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'GET', endpoint, qs);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const endpoint = `/api/0/organizations/`;
                            if (additionalFields.member) {
                                qs.member = additionalFields.member;
                            }
                            if (additionalFields.owner) {
                                qs.owner = additionalFields.owner;
                            }
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.limit = limit;
                            }
                            responseData = yield GenericFunctions_1.sentryApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
                            if (responseData === undefined) {
                                responseData = [];
                            }
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        if (operation === 'create') {
                            const name = this.getNodeParameter('name', i);
                            const agreeTerms = this.getNodeParameter('agreeTerms', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const endpoint = `/api/0/organizations/`;
                            qs.name = name;
                            qs.agreeTerms = agreeTerms;
                            if (additionalFields.slug) {
                                qs.slug = additionalFields.slug;
                            }
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'POST', endpoint, qs);
                        }
                        if (operation === 'update') {
                            const organizationSlug = this.getNodeParameter('organization_slug', i);
                            const endpoint = `/api/0/organizations/${organizationSlug}/`;
                            const body = this.getNodeParameter('updateFields', i);
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'PUT', endpoint, body, qs);
                        }
                    }
                    if (resource === 'project') {
                        if (operation === 'create') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const teamSlug = this.getNodeParameter('teamSlug', i);
                            const name = this.getNodeParameter('name', i);
                            const endpoint = `/api/0/teams/${organizationSlug}/${teamSlug}/projects/`;
                            const body = Object.assign({ name }, this.getNodeParameter('additionalFields', i));
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'POST', endpoint, body, qs);
                        }
                        if (operation === 'get') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const projectSlug = this.getNodeParameter('projectSlug', i);
                            const endpoint = `/api/0/projects/${organizationSlug}/${projectSlug}/`;
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'GET', endpoint, qs);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const endpoint = `/api/0/projects/`;
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.limit = limit;
                            }
                            responseData = yield GenericFunctions_1.sentryApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        if (operation === 'update') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const projectSlug = this.getNodeParameter('projectSlug', i);
                            const endpoint = `/api/0/projects/${organizationSlug}/${projectSlug}/`;
                            const body = this.getNodeParameter('updateFields', i);
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'PUT', endpoint, body, qs);
                        }
                        if (operation === 'delete') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const projectSlug = this.getNodeParameter('projectSlug', i);
                            const endpoint = `/api/0/projects/${organizationSlug}/${projectSlug}/`;
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'DELETE', endpoint, qs);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'release') {
                        if (operation === 'get') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const version = this.getNodeParameter('version', i);
                            const endpoint = `/api/0/organizations/${organizationSlug}/releases/${version}/`;
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'GET', endpoint, qs);
                        }
                        if (operation === 'getAll') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const endpoint = `/api/0/organizations/${organizationSlug}/releases/`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (additionalFields.query) {
                                qs.query = additionalFields.query;
                            }
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.limit = limit;
                            }
                            responseData = yield GenericFunctions_1.sentryApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        if (operation === 'delete') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const version = this.getNodeParameter('version', i);
                            const endpoint = `/api/0/organizations/${organizationSlug}/releases/${version}/`;
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'DELETE', endpoint, qs);
                            responseData = { success: true };
                        }
                        if (operation === 'create') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const endpoint = `/api/0/organizations/${organizationSlug}/releases/`;
                            const version = this.getNodeParameter('version', i);
                            const url = this.getNodeParameter('url', i);
                            const projects = this.getNodeParameter('projects', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.dateReleased) {
                                qs.dateReleased = additionalFields.dateReleased;
                            }
                            qs.version = version;
                            qs.url = url;
                            qs.projects = projects;
                            if (additionalFields.commits) {
                                const commits = [];
                                //@ts-ignore
                                // tslint:disable-next-line: no-any
                                additionalFields.commits.commitProperties.map((commit) => {
                                    const commitObject = { id: commit.id };
                                    if (commit.repository) {
                                        commitObject.repository = commit.repository;
                                    }
                                    if (commit.message) {
                                        commitObject.message = commit.message;
                                    }
                                    if (commit.patchSet && Array.isArray(commit.patchSet)) {
                                        commit.patchSet.patchSetProperties.map((patchSet) => {
                                            var _a;
                                            (_a = commitObject.patch_set) === null || _a === void 0 ? void 0 : _a.push(patchSet);
                                        });
                                    }
                                    if (commit.authorName) {
                                        commitObject.author_name = commit.authorName;
                                    }
                                    if (commit.authorEmail) {
                                        commitObject.author_email = commit.authorEmail;
                                    }
                                    if (commit.timestamp) {
                                        commitObject.timestamp = commit.timestamp;
                                    }
                                    commits.push(commitObject);
                                });
                                qs.commits = commits;
                            }
                            if (additionalFields.refs) {
                                const refs = [];
                                //@ts-ignore
                                additionalFields.refs.refProperties.map((ref) => {
                                    refs.push(ref);
                                });
                                qs.refs = refs;
                            }
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'POST', endpoint, qs);
                        }
                        if (operation === 'update') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const version = this.getNodeParameter('version', i);
                            const endpoint = `/api/0/organizations/${organizationSlug}/releases/${version}/`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = Object.assign({}, updateFields);
                            if (updateFields.commits) {
                                const commits = [];
                                //@ts-ignore
                                // tslint:disable-next-line: no-any
                                updateFields.commits.commitProperties.map((commit) => {
                                    const commitObject = { id: commit.id };
                                    if (commit.repository) {
                                        commitObject.repository = commit.repository;
                                    }
                                    if (commit.message) {
                                        commitObject.message = commit.message;
                                    }
                                    if (commit.patchSet && Array.isArray(commit.patchSet)) {
                                        commit.patchSet.patchSetProperties.map((patchSet) => {
                                            var _a;
                                            (_a = commitObject.patch_set) === null || _a === void 0 ? void 0 : _a.push(patchSet);
                                        });
                                    }
                                    if (commit.authorName) {
                                        commitObject.author_name = commit.authorName;
                                    }
                                    if (commit.authorEmail) {
                                        commitObject.author_email = commit.authorEmail;
                                    }
                                    if (commit.timestamp) {
                                        commitObject.timestamp = commit.timestamp;
                                    }
                                    commits.push(commitObject);
                                });
                                body.commits = commits;
                            }
                            if (updateFields.refs) {
                                const refs = [];
                                //@ts-ignore
                                updateFields.refs.refProperties.map((ref) => {
                                    refs.push(ref);
                                });
                                body.refs = refs;
                            }
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'PUT', endpoint, body, qs);
                        }
                    }
                    if (resource === 'team') {
                        if (operation === 'get') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const teamSlug = this.getNodeParameter('teamSlug', i);
                            const endpoint = `/api/0/teams/${organizationSlug}/${teamSlug}/`;
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'GET', endpoint, qs);
                        }
                        if (operation === 'getAll') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const endpoint = `/api/0/organizations/${organizationSlug}/teams/`;
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.limit = limit;
                            }
                            responseData = yield GenericFunctions_1.sentryApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        if (operation === 'create') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const name = this.getNodeParameter('name', i);
                            const endpoint = `/api/0/organizations/${organizationSlug}/teams/`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            qs.name = name;
                            if (additionalFields.slug) {
                                qs.slug = additionalFields.slug;
                            }
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'POST', endpoint, qs);
                        }
                        if (operation === 'update') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const teamSlug = this.getNodeParameter('teamSlug', i);
                            const endpoint = `/api/0/teams/${organizationSlug}/${teamSlug}/`;
                            const body = this.getNodeParameter('updateFields', i);
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'PUT', endpoint, body, qs);
                        }
                        if (operation === 'delete') {
                            const organizationSlug = this.getNodeParameter('organizationSlug', i);
                            const teamSlug = this.getNodeParameter('teamSlug', i);
                            const endpoint = `/api/0/teams/${organizationSlug}/${teamSlug}/`;
                            responseData = yield GenericFunctions_1.sentryIoApiRequest.call(this, 'DELETE', endpoint, qs);
                            responseData = { success: true };
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
exports.SentryIo = SentryIo;

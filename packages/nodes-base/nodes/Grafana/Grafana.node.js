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
exports.Grafana = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
class Grafana {
    constructor() {
        this.description = {
            displayName: 'Grafana',
            name: 'grafana',
            icon: 'file:grafana.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Grafana API',
            defaults: {
                name: 'Grafana',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'grafanaApi',
                    required: true,
                    testedBy: 'grafanaApiTest',
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    noDataExpression: true,
                    type: 'options',
                    options: [
                        {
                            name: 'Dashboard',
                            value: 'dashboard',
                        },
                        {
                            name: 'Team',
                            value: 'team',
                        },
                        {
                            name: 'Team Member',
                            value: 'teamMember',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'dashboard',
                },
                ...descriptions_1.dashboardOperations,
                ...descriptions_1.dashboardFields,
                ...descriptions_1.teamOperations,
                ...descriptions_1.teamFields,
                ...descriptions_1.teamMemberOperations,
                ...descriptions_1.teamMemberFields,
                ...descriptions_1.userOperations,
                ...descriptions_1.userFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getDashboards() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const dashboards = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', '/search', {}, { qs: 'dash-db' });
                        return dashboards.map(({ id, title }) => ({ value: id, name: title }));
                    });
                },
                getFolders() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const folders = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', '/folders');
                        return folders.map(({ id, title }) => ({ value: id, name: title }));
                    });
                },
                getTeams() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const res = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', '/teams/search');
                        return res.teams.map(({ id, name }) => ({ value: id, name }));
                    });
                },
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const users = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', '/org/users');
                        return users.map(({ userId, email }) => ({ value: userId, name: email }));
                    });
                },
            },
            credentialTest: {
                grafanaApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { apiKey, baseUrl: rawBaseUrl } = credential.data;
                        const baseUrl = (0, GenericFunctions_1.tolerateTrailingSlash)(rawBaseUrl);
                        const options = {
                            headers: {
                                Authorization: `Bearer ${apiKey}`,
                            },
                            method: 'GET',
                            uri: `${baseUrl}/api/folders`,
                            json: true,
                        };
                        try {
                            yield this.helpers.request(options);
                            return {
                                status: 'OK',
                                message: 'Authentication successful',
                            };
                        }
                        catch (error) {
                            return {
                                status: 'Error',
                                message: error.message,
                            };
                        }
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
                    if (resource === 'dashboard') {
                        // **********************************************************************
                        //                               dashboard
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //            dashboard: create
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/dashboard/#create--update-dashboard
                            const body = {
                                dashboard: {
                                    id: null,
                                    title: this.getNodeParameter('title', i),
                                },
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                if (additionalFields.folderId === '')
                                    delete additionalFields.folderId;
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'POST', '/dashboards/db', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //            dashboard: delete
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/dashboard/#delete-dashboard-by-uid
                            const uidOrUrl = this.getNodeParameter('dashboardUidOrUrl', i);
                            const uid = GenericFunctions_1.deriveUid.call(this, uidOrUrl);
                            const endpoint = `/dashboards/uid/${uid}`;
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //              dashboard: get
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/dashboard/#get-dashboard-by-uid
                            const uidOrUrl = this.getNodeParameter('dashboardUidOrUrl', i);
                            const uid = GenericFunctions_1.deriveUid.call(this, uidOrUrl);
                            const endpoint = `/dashboards/uid/${uid}`;
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            dashboard: getAll
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/folder_dashboard_search/#search-folders-and-dashboards
                            const qs = {
                                type: 'dash-db',
                            };
                            const filters = this.getNodeParameter('filters', i);
                            if (Object.keys(filters).length) {
                                Object.assign(qs, filters);
                            }
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                Object.assign(qs, { limit });
                            }
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', '/search', {}, qs);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //            dashboard: update
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/dashboard/#create--update-dashboard
                            const uidOrUrl = this.getNodeParameter('dashboardUidOrUrl', i);
                            const uid = GenericFunctions_1.deriveUid.call(this, uidOrUrl);
                            // ensure dashboard to update exists
                            yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', `/dashboards/uid/${uid}`);
                            const body = {
                                overwrite: true,
                                dashboard: { uid },
                            };
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource, updateFields);
                            const { title } = updateFields, rest = __rest(updateFields, ["title"]);
                            if (!title) {
                                const { dashboard } = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', `/dashboards/uid/${uid}`);
                                body.dashboard.title = dashboard.title;
                            }
                            else {
                                const dashboards = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', '/search');
                                const titles = dashboards.map(({ title }) => title);
                                if (titles.includes(title)) {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'A dashboard with the same name already exists in the selected folder' });
                                }
                                body.dashboard.title = title;
                            }
                            if (title) {
                                body.dashboard.title = title;
                            }
                            if (Object.keys(rest).length) {
                                if (rest.folderId === '')
                                    delete rest.folderId;
                                Object.assign(body, rest);
                            }
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'POST', '/dashboards/db', body);
                        }
                    }
                    else if (resource === 'team') {
                        // **********************************************************************
                        //                                  team
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //               team: create
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/team/#add-team
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'POST', '/teams', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //               team: delete
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/team/#delete-team-by-id
                            const teamId = this.getNodeParameter('teamId', i);
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'DELETE', `/teams/${teamId}`);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                team: get
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/team/#get-team-by-id
                            const teamId = this.getNodeParameter('teamId', i);
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', `/teams/${teamId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //               team: getAll
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/team/#team-search-with-paging
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            if (Object.keys(filters).length) {
                                Object.assign(qs, filters);
                            }
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', '/teams/search', {}, qs);
                            responseData = responseData.teams;
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //               team: update
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/team/#update-team
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource, updateFields);
                            const body = {};
                            const teamId = this.getNodeParameter('teamId', i);
                            // check if team exists, since API does not specify update failure reason
                            yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', `/teams/${teamId}`);
                            // prevent email from being overridden to empty
                            if (!updateFields.email) {
                                const { email } = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', `/teams/${teamId}`);
                                body.email = email;
                            }
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, updateFields);
                            }
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'PUT', `/teams/${teamId}`, body);
                        }
                    }
                    else if (resource === 'teamMember') {
                        // **********************************************************************
                        //                               teamMember
                        // **********************************************************************
                        if (operation === 'add') {
                            // ----------------------------------------
                            //            teamMember: add
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/team/#add-team-member
                            const userId = this.getNodeParameter('userId', i);
                            const body = {
                                userId: parseInt(userId, 10),
                            };
                            const teamId = this.getNodeParameter('teamId', i);
                            const endpoint = `/teams/${teamId}/members`;
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'POST', endpoint, body);
                        }
                        else if (operation === 'remove') {
                            // ----------------------------------------
                            //            teamMember: remove
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/team/#remove-member-from-team
                            const teamId = this.getNodeParameter('teamId', i);
                            const memberId = this.getNodeParameter('memberId', i);
                            const endpoint = `/teams/${teamId}/members/${memberId}`;
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            teamMember: getAll
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/team/#get-team-members
                            const teamId = this.getNodeParameter('teamId', i);
                            // check if team exists, since API returns all members if team does not exist
                            yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', `/teams/${teamId}`);
                            const endpoint = `/teams/${teamId}/members`;
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', endpoint);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                    }
                    else if (resource === 'user') {
                        // **********************************************************************
                        //                                  user
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //                user: create
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/org/#add-a-new-user-to-the-current-organization
                            const body = {
                                role: this.getNodeParameter('role', i),
                                loginOrEmail: this.getNodeParameter('loginOrEmail', i),
                            };
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'POST', '/org/users', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //                user: delete
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/org/#delete-user-in-current-organization
                            const userId = this.getNodeParameter('userId', i);
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'DELETE', `/org/users/${userId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //               user: getAll
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/org/#get-all-users-within-the-current-organization
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'GET', '/org/users');
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //               user: update
                            // ----------------------------------------
                            // https://grafana.com/docs/grafana/latest/http_api/org/#updates-the-given-user
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource, updateFields);
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, updateFields);
                            }
                            const userId = this.getNodeParameter('userId', i);
                            responseData = yield GenericFunctions_1.grafanaApiRequest.call(this, 'PATCH', `/org/users/${userId}`, body);
                        }
                    }
                    Array.isArray(responseData)
                        ? returnData.push(...responseData)
                        : returnData.push(responseData);
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
exports.Grafana = Grafana;

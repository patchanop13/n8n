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
exports.ElasticSecurity = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
class ElasticSecurity {
    constructor() {
        this.description = {
            displayName: 'Elastic Security',
            name: 'elasticSecurity',
            icon: 'file:elasticSecurity.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Elastic Security API',
            defaults: {
                name: 'Elastic Security',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'elasticSecurityApi',
                    required: true,
                    testedBy: 'elasticSecurityApiTest',
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
                            name: 'Case',
                            value: 'case',
                        },
                        {
                            name: 'Case Comment',
                            value: 'caseComment',
                        },
                        {
                            name: 'Case Tag',
                            value: 'caseTag',
                        },
                        {
                            name: 'Connector',
                            value: 'connector',
                        },
                    ],
                    default: 'case',
                },
                ...descriptions_1.caseOperations,
                ...descriptions_1.caseFields,
                ...descriptions_1.caseCommentOperations,
                ...descriptions_1.caseCommentFields,
                ...descriptions_1.caseTagOperations,
                ...descriptions_1.caseTagFields,
                ...descriptions_1.connectorOperations,
                ...descriptions_1.connectorFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const tags = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'GET', '/cases/tags');
                        return tags.map(tag => ({ name: tag, value: tag }));
                    });
                },
                getConnectors() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const endpoint = '/cases/configure/connectors/_find';
                        const connectors = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'GET', endpoint);
                        return connectors.map(({ name, id }) => ({ name, value: id }));
                    });
                },
            },
            credentialTest: {
                elasticSecurityApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { username, password, baseUrl: rawBaseUrl, } = credential.data;
                        const baseUrl = (0, GenericFunctions_1.tolerateTrailingSlash)(rawBaseUrl);
                        const token = Buffer.from(`${username}:${password}`).toString('base64');
                        const endpoint = '/cases/status';
                        const options = {
                            headers: {
                                Authorization: `Basic ${token}`,
                                'kbn-xsrf': true,
                            },
                            method: 'GET',
                            body: {},
                            qs: {},
                            uri: `${baseUrl}/api${endpoint}`,
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'case') {
                        // **********************************************************************
                        //                                  case
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //               case: create
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/cases-api-create.html
                            const body = {
                                title: this.getNodeParameter('title', i),
                                connector: {},
                                owner: 'securitySolution',
                                description: '',
                                tags: [],
                                settings: {
                                    syncAlerts: this.getNodeParameter('additionalFields.syncAlerts', i, false),
                                },
                            };
                            const connectorId = this.getNodeParameter('connectorId', i);
                            const { id: fetchedId, name: fetchedName, type: fetchedType, } = yield GenericFunctions_1.getConnector.call(this, connectorId);
                            const selectedConnectorType = this.getNodeParameter('connectorType', i);
                            if (fetchedType !== selectedConnectorType) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Connector Type does not match the type of the connector in Connector Name');
                            }
                            const connector = {
                                id: fetchedId,
                                name: fetchedName,
                                type: fetchedType,
                                fields: {},
                            };
                            if (selectedConnectorType === '.jira') {
                                connector.fields = {
                                    issueType: this.getNodeParameter('issueType', i),
                                    priority: this.getNodeParameter('priority', i),
                                    parent: null, // required but unimplemented
                                };
                            }
                            else if (selectedConnectorType === '.servicenow') {
                                connector.fields = {
                                    urgency: this.getNodeParameter('urgency', i),
                                    severity: this.getNodeParameter('severity', i),
                                    impact: this.getNodeParameter('impact', i),
                                    category: this.getNodeParameter('category', i),
                                    subcategory: null, // required but unimplemented
                                };
                            }
                            else if (selectedConnectorType === '.resilient') {
                                const rawIssueTypes = this.getNodeParameter('issueTypes', i);
                                connector.fields = {
                                    issueTypes: rawIssueTypes.split(',').map(Number),
                                    severityCode: this.getNodeParameter('severityCode', i),
                                    incidentTypes: null, // required but undocumented
                                };
                            }
                            body.connector = connector;
                            const _c = this.getNodeParameter('additionalFields', i), { syncAlerts } = _c, // ignored because already set
                            rest = __rest(_c, ["syncAlerts"]);
                            if (Object.keys(rest).length) {
                                Object.assign(body, rest);
                            }
                            responseData = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'POST', '/cases', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //               case: delete
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/cases-api-delete-case.html
                            const caseId = this.getNodeParameter('caseId', i);
                            yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'DELETE', `/cases?ids=["${caseId}"]`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                case: get
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/cases-api-get-case.html
                            const caseId = this.getNodeParameter('caseId', i);
                            responseData = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'GET', `/cases/${caseId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //               case: getAll
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/cases-api-find-cases.html
                            const qs = {};
                            const { tags, status, } = this.getNodeParameter('filters', i);
                            const sortOptions = this.getNodeParameter('sortOptions', i);
                            qs.sortField = (_a = sortOptions.sortField) !== null && _a !== void 0 ? _a : 'createdAt';
                            qs.sortOrder = (_b = sortOptions.sortOrder) !== null && _b !== void 0 ? _b : 'asc';
                            if (status) {
                                qs.status = status;
                            }
                            if (tags === null || tags === void 0 ? void 0 : tags.length) {
                                qs.tags = tags.join(',');
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/cases/_find', {}, qs);
                        }
                        else if (operation === 'getStatus') {
                            // ----------------------------------------
                            //             case: getStatus
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/cases-api-get-status.html
                            responseData = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'GET', '/cases/status');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //               case: update
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/cases-api-update.html
                            const caseId = this.getNodeParameter('caseId', i);
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (!Object.keys(updateFields).length) {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const { syncAlerts } = updateFields, rest = __rest(updateFields, ["syncAlerts"]);
                            Object.assign(body, {
                                cases: [
                                    Object.assign(Object.assign({ id: caseId, version: yield GenericFunctions_1.getVersion.call(this, `/cases/${caseId}`) }, (syncAlerts && { settings: { syncAlerts } })), rest),
                                ],
                            });
                            responseData = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'PATCH', '/cases', body);
                        }
                    }
                    else if (resource === 'caseTag') {
                        // **********************************************************************
                        //                               caseTag
                        // **********************************************************************
                        if (operation === 'add') {
                            // ----------------------------------------
                            //              caseTag: add
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/cases-api-create.html
                            const caseId = this.getNodeParameter('caseId', i);
                            const { title, connector, owner, description, settings, tags, } = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'GET', `/cases/${caseId}`);
                            const tagToAdd = this.getNodeParameter('tag', i);
                            if (tags.includes(tagToAdd)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Cannot add tag "${tagToAdd}" to case ID ${caseId} because this case already has this tag.`);
                            }
                            const body = {};
                            Object.assign(body, {
                                cases: [
                                    {
                                        id: caseId,
                                        title,
                                        connector,
                                        owner,
                                        description,
                                        settings,
                                        version: yield GenericFunctions_1.getVersion.call(this, `/cases/${caseId}`),
                                        tags: [...tags, tagToAdd],
                                    },
                                ],
                            });
                            responseData = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'PATCH', '/cases', body);
                        }
                        else if (operation === 'remove') {
                            // https://www.elastic.co/guide/en/security/current/cases-api-update.html
                            const caseId = this.getNodeParameter('caseId', i);
                            const tagToRemove = this.getNodeParameter('tag', i);
                            const { title, connector, owner, description, settings, tags, } = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'GET', `/cases/${caseId}`);
                            if (!tags.includes(tagToRemove)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Cannot remove tag "${tagToRemove}" from case ID ${caseId} because this case does not have this tag.`);
                            }
                            const body = {};
                            Object.assign(body, {
                                cases: [
                                    {
                                        id: caseId,
                                        title,
                                        connector,
                                        owner,
                                        description,
                                        settings,
                                        version: yield GenericFunctions_1.getVersion.call(this, `/cases/${caseId}`),
                                        tags: tags.filter((tag) => tag !== tagToRemove),
                                    },
                                ],
                            });
                            responseData = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'PATCH', '/cases', body);
                        }
                    }
                    else if (resource === 'caseComment') {
                        // **********************************************************************
                        //                              caseComment
                        // **********************************************************************
                        if (operation === 'add') {
                            // ----------------------------------------
                            //             caseComment: add
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/cases-api-add-comment.html
                            const simple = this.getNodeParameter('simple', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                comment: this.getNodeParameter('comment', i),
                                type: 'user',
                                owner: additionalFields.owner || 'securitySolution',
                            };
                            const caseId = this.getNodeParameter('caseId', i);
                            const endpoint = `/cases/${caseId}/comments`;
                            responseData = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'POST', endpoint, body);
                            if (simple === true) {
                                const { comments } = responseData;
                                responseData = comments[comments.length - 1];
                            }
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //             caseComment: get
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/cases-api-get-comment.html
                            const caseId = this.getNodeParameter('caseId', i);
                            const commentId = this.getNodeParameter('commentId', i);
                            const endpoint = `/cases/${caseId}/comments/${commentId}`;
                            responseData = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //           caseComment: getAll
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/cases-api-get-all-case-comments.html
                            const caseId = this.getNodeParameter('caseId', i);
                            const endpoint = `/cases/${caseId}/comments`;
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'remove') {
                            // ----------------------------------------
                            //           caseComment: remove
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/cases-api-delete-comment.html
                            const caseId = this.getNodeParameter('caseId', i);
                            const commentId = this.getNodeParameter('commentId', i);
                            const endpoint = `/cases/${caseId}/comments/${commentId}`;
                            yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'DELETE', endpoint);
                            responseData = { success: true };
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //           caseComment: update
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/cases-api-update-comment.html
                            const simple = this.getNodeParameter('simple', i);
                            const caseId = this.getNodeParameter('caseId', i);
                            const commentId = this.getNodeParameter('commentId', i);
                            const body = {
                                comment: this.getNodeParameter('comment', i),
                                id: commentId,
                                type: 'user',
                                owner: 'securitySolution',
                                version: yield GenericFunctions_1.getVersion.call(this, `/cases/${caseId}/comments/${commentId}`),
                            };
                            const patchEndpoint = `/cases/${caseId}/comments`;
                            responseData = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'PATCH', patchEndpoint, body);
                            if (simple === true) {
                                const { comments } = responseData;
                                responseData = comments[comments.length - 1];
                            }
                        }
                    }
                    else if (resource === 'connector') {
                        if (operation === 'create') {
                            // ----------------------------------------
                            //           connector: create
                            // ----------------------------------------
                            // https://www.elastic.co/guide/en/security/current/register-connector.html
                            const connectorType = this.getNodeParameter('connectorType', i);
                            const body = {
                                connector_type_id: connectorType,
                                name: this.getNodeParameter('name', i),
                            };
                            if (connectorType === '.jira') {
                                body.config = {
                                    apiUrl: this.getNodeParameter('apiUrl', i),
                                    projectKey: this.getNodeParameter('projectKey', i),
                                };
                                body.secrets = {
                                    email: this.getNodeParameter('email', i),
                                    apiToken: this.getNodeParameter('apiToken', i),
                                };
                            }
                            else if (connectorType === '.resilient') {
                                body.config = {
                                    apiUrl: this.getNodeParameter('apiUrl', i),
                                    orgId: this.getNodeParameter('orgId', i),
                                };
                                body.secrets = {
                                    apiKeyId: this.getNodeParameter('apiKeyId', i),
                                    apiKeySecret: this.getNodeParameter('apiKeySecret', i),
                                };
                            }
                            else if (connectorType === '.servicenow') {
                                body.config = {
                                    apiUrl: this.getNodeParameter('apiUrl', i),
                                };
                                body.secrets = {
                                    username: this.getNodeParameter('username', i),
                                    password: this.getNodeParameter('password', i),
                                };
                            }
                            responseData = yield GenericFunctions_1.elasticSecurityApiRequest.call(this, 'POST', '/actions/connector', body);
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
exports.ElasticSecurity = ElasticSecurity;

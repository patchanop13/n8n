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
exports.Linear = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const IssueDescription_1 = require("./IssueDescription");
const Queries_1 = require("./Queries");
class Linear {
    constructor() {
        this.description = {
            displayName: 'Linear',
            name: 'linear',
            icon: 'file:linear.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Linear API',
            defaults: {
                name: 'Linear',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'linearApi',
                    required: true,
                    testedBy: 'linearApiTest',
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
                            name: 'Issue',
                            value: 'issue',
                        },
                    ],
                    default: 'issue',
                },
                ...IssueDescription_1.issueOperations,
                ...IssueDescription_1.issueFields,
            ],
        };
        this.methods = {
            credentialTest: {
                linearApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield GenericFunctions_1.validateCredentials.call(this, credential.data);
                        }
                        catch (error) {
                            const { error: err } = error;
                            const errors = err.errors;
                            const authenticationError = Boolean(errors.filter(e => e.extensions.code === 'AUTHENTICATION_ERROR').length);
                            if (authenticationError) {
                                return {
                                    status: 'Error',
                                    message: 'The security token included in the request is invalid',
                                };
                            }
                        }
                        return {
                            status: 'OK',
                            message: 'Connection successful!',
                        };
                    });
                },
            },
            loadOptions: {
                getTeams() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const body = {
                            query: Queries_1.query.getTeams(),
                            variables: {
                                $first: 10,
                            },
                        };
                        const teams = yield GenericFunctions_1.linearApiRequestAllItems.call(this, 'data.teams', body);
                        for (const team of teams) {
                            returnData.push({
                                name: team.name,
                                value: team.id,
                            });
                        }
                        return returnData;
                    });
                },
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const body = {
                            query: Queries_1.query.getUsers(),
                            variables: {
                                $first: 10,
                            },
                        };
                        const users = yield GenericFunctions_1.linearApiRequestAllItems.call(this, 'data.users', body);
                        for (const user of users) {
                            returnData.push({
                                name: user.name,
                                value: user.id,
                            });
                        }
                        return returnData;
                    });
                },
                getStates() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const body = {
                            query: Queries_1.query.getStates(),
                            variables: {
                                $first: 10,
                            },
                        };
                        const states = yield GenericFunctions_1.linearApiRequestAllItems.call(this, 'data.workflowStates', body);
                        for (const state of states) {
                            returnData.push({
                                name: state.name,
                                value: state.id,
                            });
                        }
                        return returnData.sort(GenericFunctions_1.sort);
                    });
                },
            },
        };
    }
    execute() {
        var _a, _b, _c, _d, _e, _f;
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
                    if (resource === 'issue') {
                        if (operation === 'create') {
                            const teamId = this.getNodeParameter('teamId', i);
                            const title = this.getNodeParameter('title', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                query: Queries_1.query.createIssue(),
                                variables: Object.assign({ teamId,
                                    title }, additionalFields),
                            };
                            responseData = yield GenericFunctions_1.linearApiRequest.call(this, body);
                            responseData = (_a = responseData.data.issueCreate) === null || _a === void 0 ? void 0 : _a.issue;
                        }
                        if (operation === 'delete') {
                            const issueId = this.getNodeParameter('issueId', i);
                            const body = {
                                query: Queries_1.query.deleteIssue(),
                                variables: {
                                    issueId,
                                },
                            };
                            responseData = yield GenericFunctions_1.linearApiRequest.call(this, body);
                            responseData = (_b = responseData === null || responseData === void 0 ? void 0 : responseData.data) === null || _b === void 0 ? void 0 : _b.issueDelete;
                        }
                        if (operation === 'get') {
                            const issueId = this.getNodeParameter('issueId', i);
                            const body = {
                                query: Queries_1.query.getIssue(),
                                variables: {
                                    issueId,
                                },
                            };
                            responseData = yield GenericFunctions_1.linearApiRequest.call(this, body);
                            responseData = (_d = (_c = responseData.data) === null || _c === void 0 ? void 0 : _c.issues) === null || _d === void 0 ? void 0 : _d.nodes[0];
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const body = {
                                query: Queries_1.query.getIssues(),
                                variables: {
                                    first: 50,
                                },
                            };
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.linearApiRequestAllItems.call(this, 'data.issues', body);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', 0);
                                body.variables.first = limit;
                                responseData = yield GenericFunctions_1.linearApiRequest.call(this, body);
                                responseData = responseData.data.issues.nodes;
                            }
                        }
                        if (operation === 'update') {
                            const issueId = this.getNodeParameter('issueId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {
                                query: Queries_1.query.updateIssue(),
                                variables: Object.assign({ issueId }, updateFields),
                            };
                            responseData = yield GenericFunctions_1.linearApiRequest.call(this, body);
                            responseData = (_f = (_e = responseData === null || responseData === void 0 ? void 0 : responseData.data) === null || _e === void 0 ? void 0 : _e.issueUpdate) === null || _f === void 0 ? void 0 : _f.issue;
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
                        returnData.push({
                            error: error.message,
                        });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Linear = Linear;

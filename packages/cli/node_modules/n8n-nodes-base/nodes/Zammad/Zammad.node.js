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
exports.Zammad = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class Zammad {
    constructor() {
        this.description = {
            displayName: 'Zammad',
            name: 'zammad',
            icon: 'file:zammad.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Zammad API',
            defaults: {
                name: 'Zammad',
            },
            inputs: [
                'main',
            ],
            outputs: [
                'main',
            ],
            credentials: [
                {
                    name: 'zammadBasicAuthApi',
                    required: true,
                    testedBy: 'zammadBasicAuthApiTest',
                    displayOptions: {
                        show: {
                            authentication: [
                                'basicAuth',
                            ],
                        },
                    },
                },
                {
                    name: 'zammadTokenAuthApi',
                    required: true,
                    testedBy: 'zammadTokenAuthApiTest',
                    displayOptions: {
                        show: {
                            authentication: [
                                'tokenAuth',
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
                            name: 'Basic Auth',
                            value: 'basicAuth',
                        },
                        {
                            name: 'Token Auth',
                            value: 'tokenAuth',
                        },
                    ],
                    default: 'tokenAuth',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    noDataExpression: true,
                    type: 'options',
                    options: [
                        {
                            name: 'Group',
                            value: 'group',
                        },
                        {
                            name: 'Organization',
                            value: 'organization',
                        },
                        {
                            name: 'Ticket',
                            value: 'ticket',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'user',
                },
                ...descriptions_1.groupDescription,
                ...descriptions_1.organizationDescription,
                ...descriptions_1.ticketDescription,
                ...descriptions_1.userDescription,
            ],
        };
        this.methods = {
            loadOptions: {
                // ----------------------------------
                //          custom fields
                // ----------------------------------
                loadGroupCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const allFields = yield GenericFunctions_1.getAllFields.call(this);
                        return (0, GenericFunctions_1.getGroupCustomFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
                    });
                },
                loadOrganizationCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const allFields = yield GenericFunctions_1.getAllFields.call(this);
                        return (0, GenericFunctions_1.getOrganizationCustomFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
                    });
                },
                loadUserCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const allFields = yield GenericFunctions_1.getAllFields.call(this);
                        return (0, GenericFunctions_1.getUserCustomFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
                    });
                },
                loadTicketCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const allFields = yield GenericFunctions_1.getAllFields.call(this);
                        return (0, GenericFunctions_1.getTicketCustomFields)(allFields).map((i) => ({ name: i.name, value: i.id }));
                    });
                },
                // ----------------------------------
                //          built-in fields
                // ----------------------------------
                loadGroupFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const allFields = yield GenericFunctions_1.getAllFields.call(this);
                        return (0, GenericFunctions_1.getGroupFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
                    });
                },
                loadOrganizationFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const allFields = yield GenericFunctions_1.getAllFields.call(this);
                        return (0, GenericFunctions_1.getOrganizationFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
                    });
                },
                loadTicketFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const allFields = yield GenericFunctions_1.getAllFields.call(this);
                        return (0, GenericFunctions_1.getTicketFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
                    });
                },
                loadUserFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const allFields = yield GenericFunctions_1.getAllFields.call(this);
                        return (0, GenericFunctions_1.getUserFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
                    });
                },
                // ----------------------------------
                //             resources
                // ----------------------------------
                // by non-ID attribute
                /**
                 * POST /tickets requires group name instead of group ID.
                 */
                loadGroupNames() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const groups = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/groups');
                        return groups.map(i => ({ name: i.name, value: i.name }));
                    });
                },
                /**
                 * PUT /users requires organization name instead of organization ID.
                 */
                loadOrganizationNames() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const orgs = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/organizations');
                        return orgs.filter(GenericFunctions_1.isNotZammadFoundation).map(i => ({ name: i.name, value: i.name }));
                    });
                },
                /**
                 * POST & PUT /tickets requires customer email instead of customer ID.
                 */
                loadCustomerEmails() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const users = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/users');
                        return users.filter(GenericFunctions_1.isCustomer).map(i => ({ name: i.email, value: i.email }));
                    });
                },
                // by ID
                loadGroups() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const groups = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/groups');
                        return groups.map(i => ({ name: i.name, value: i.id }));
                    });
                },
                loadOrganizations() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const orgs = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/organizations');
                        return orgs.filter(GenericFunctions_1.isNotZammadFoundation).map(i => ({ name: i.name, value: i.id }));
                    });
                },
                loadUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const users = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/users');
                        return users.filter(GenericFunctions_1.doesNotBelongToZammad).map(i => ({ name: i.login, value: i.id }));
                    });
                },
            },
            credentialTest: {
                zammadBasicAuthApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = credential.data;
                        const baseUrl = (0, GenericFunctions_1.tolerateTrailingSlash)(credentials.baseUrl);
                        const options = {
                            method: 'GET',
                            uri: `${baseUrl}/api/v1/users/me`,
                            json: true,
                            rejectUnauthorized: !credentials.allowUnauthorizedCerts,
                            auth: {
                                user: credentials.username,
                                pass: credentials.password,
                            },
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
                zammadTokenAuthApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = credential.data;
                        const baseUrl = (0, GenericFunctions_1.tolerateTrailingSlash)(credentials.baseUrl);
                        const options = {
                            method: 'GET',
                            uri: `${baseUrl}/api/v1/users/me`,
                            json: true,
                            rejectUnauthorized: !credentials.allowUnauthorizedCerts,
                            headers: {
                                Authorization: `Token token=${credentials.accessToken}`,
                            },
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
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            const returnData = [];
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'user') {
                        // **********************************************************************
                        //                                  user
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------
                            //           user:create
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/user.html#create
                            const body = {
                                firstname: this.getNodeParameter('firstname', i),
                                lastname: this.getNodeParameter('lastname', i),
                            };
                            const _a = this.getNodeParameter('additionalFields', i), { addressUi, customFieldsUi } = _a, rest = __rest(_a, ["addressUi", "customFieldsUi"]);
                            Object.assign(body, addressUi === null || addressUi === void 0 ? void 0 : addressUi.addressDetails);
                            customFieldsUi === null || customFieldsUi === void 0 ? void 0 : customFieldsUi.customFieldPairs.forEach((pair) => {
                                body[pair['name']] = pair['value'];
                            });
                            Object.assign(body, rest);
                            responseData = yield GenericFunctions_1.zammadApiRequest.call(this, 'POST', '/users', body);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //            user:update
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/user.html#update
                            const id = this.getNodeParameter('id', i);
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (!Object.keys(updateFields).length) {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const { addressUi, customFieldsUi } = updateFields, rest = __rest(updateFields, ["addressUi", "customFieldsUi"]);
                            Object.assign(body, addressUi === null || addressUi === void 0 ? void 0 : addressUi.addressDetails);
                            customFieldsUi === null || customFieldsUi === void 0 ? void 0 : customFieldsUi.customFieldPairs.forEach((pair) => {
                                body[pair['name']] = pair['value'];
                            });
                            Object.assign(body, rest);
                            responseData = yield GenericFunctions_1.zammadApiRequest.call(this, 'PUT', `/users/${id}`, body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //            user:delete
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/user.html#delete
                            const id = this.getNodeParameter('id', i);
                            yield GenericFunctions_1.zammadApiRequest.call(this, 'DELETE', `/users/${id}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //            user:get
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/user.html#show
                            const id = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', `/users/${id}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //           user:getAll
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/user.html#list
                            // https://docs.zammad.org/en/latest/api/user.html#search
                            const qs = {};
                            const _b = this.getNodeParameter('filters', i), { sortUi } = _b, rest = __rest(_b, ["sortUi"]);
                            Object.assign(qs, sortUi === null || sortUi === void 0 ? void 0 : sortUi.sortDetails);
                            Object.assign(qs, rest);
                            qs.query || (qs.query = ''); // otherwise triggers 500
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const limit = returnAll ? 0 : this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.zammadApiRequestAllItems.call(this, 'GET', '/users/search', {}, qs, limit).then(responseData => {
                                return responseData.map(user => {
                                    const { preferences } = user, rest = __rest(user, ["preferences"]);
                                    return rest;
                                });
                            });
                        }
                        else if (operation === 'getSelf') {
                            // ----------------------------------
                            //             user:me
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/user.html#me-current-user
                            responseData = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/users/me');
                        }
                    }
                    else if (resource === 'organization') {
                        // **********************************************************************
                        //                             organization
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------
                            //        organization:create
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/organization.html#create
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            const _c = this.getNodeParameter('additionalFields', i), { customFieldsUi } = _c, rest = __rest(_c, ["customFieldsUi"]);
                            customFieldsUi === null || customFieldsUi === void 0 ? void 0 : customFieldsUi.customFieldPairs.forEach((pair) => {
                                body[pair['name']] = pair['value'];
                            });
                            Object.assign(body, rest);
                            responseData = yield GenericFunctions_1.zammadApiRequest.call(this, 'POST', '/organizations', body);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //       organization:update
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/organization.html#update
                            const id = this.getNodeParameter('id', i);
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (!Object.keys(updateFields).length) {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const { customFieldsUi } = updateFields, rest = __rest(updateFields, ["customFieldsUi"]);
                            customFieldsUi === null || customFieldsUi === void 0 ? void 0 : customFieldsUi.customFieldPairs.forEach((pair) => {
                                body[pair['name']] = pair['value'];
                            });
                            Object.assign(body, rest);
                            responseData = yield GenericFunctions_1.zammadApiRequest.call(this, 'PUT', `/organizations/${id}`, body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         organization:delete
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/organization.html#delete
                            const id = this.getNodeParameter('id', i);
                            yield GenericFunctions_1.zammadApiRequest.call(this, 'DELETE', `/organizations/${id}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         organization:get
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/organization.html#show
                            const id = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', `/organizations/${id}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         organization:getAll
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/organization.html#list
                            // https://docs.zammad.org/en/latest/api/organization.html#search - returning empty always
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const limit = returnAll ? 0 : this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.zammadApiRequestAllItems.call(this, 'GET', '/organizations', {}, {}, limit);
                        }
                    }
                    else if (resource === 'group') {
                        // **********************************************************************
                        //                                  group
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------
                            //           group:create
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/group.html#create
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            const _d = this.getNodeParameter('additionalFields', i), { customFieldsUi } = _d, rest = __rest(_d, ["customFieldsUi"]);
                            customFieldsUi === null || customFieldsUi === void 0 ? void 0 : customFieldsUi.customFieldPairs.forEach((pair) => {
                                body[pair['name']] = pair['value'];
                            });
                            Object.assign(body, rest);
                            responseData = yield GenericFunctions_1.zammadApiRequest.call(this, 'POST', '/groups', body);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //            group:update
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/group.html#update
                            const id = this.getNodeParameter('id', i);
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (!Object.keys(updateFields).length) {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const { customFieldsUi } = updateFields, rest = __rest(updateFields, ["customFieldsUi"]);
                            customFieldsUi === null || customFieldsUi === void 0 ? void 0 : customFieldsUi.customFieldPairs.forEach((pair) => {
                                body[pair['name']] = pair['value'];
                            });
                            Object.assign(body, rest);
                            responseData = yield GenericFunctions_1.zammadApiRequest.call(this, 'PUT', `/groups/${id}`, body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //            group:delete
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/group.html#delete
                            const id = this.getNodeParameter('id', i);
                            yield GenericFunctions_1.zammadApiRequest.call(this, 'DELETE', `/groups/${id}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //             group:get
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/group.html#show
                            const id = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', `/groups/${id}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //           group:getAll
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/group.html#list
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const limit = returnAll ? 0 : this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.zammadApiRequestAllItems.call(this, 'GET', '/groups', {}, {}, limit);
                        }
                    }
                    else if (resource === 'ticket') {
                        // **********************************************************************
                        //                                  ticket
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------
                            //           ticket:create
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/ticket/index.html#create
                            const body = {
                                article: {},
                                title: this.getNodeParameter('title', i),
                                group: this.getNodeParameter('group', i),
                                customer: this.getNodeParameter('customer', i),
                            };
                            const article = this.getNodeParameter('article', i);
                            if (!Object.keys(article).length) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Article is required');
                            }
                            const _e = article.articleDetails, { visibility } = _e, rest = __rest(_e, ["visibility"]);
                            body.article = Object.assign(Object.assign({}, rest), { internal: visibility === 'internal' });
                            responseData = yield GenericFunctions_1.zammadApiRequest.call(this, 'POST', '/tickets', body);
                            const { id } = responseData;
                            responseData.articles = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', `/ticket_articles/by_ticket/${id}`);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //          ticket:delete
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/ticket/index.html#delete
                            const id = this.getNodeParameter('id', i);
                            yield GenericFunctions_1.zammadApiRequest.call(this, 'DELETE', `/tickets/${id}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //            ticket:get
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/ticket/index.html#show
                            const id = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', `/tickets/${id}`);
                            responseData.articles = yield GenericFunctions_1.zammadApiRequest.call(this, 'GET', `/ticket_articles/by_ticket/${id}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //           ticket:getAll
                            // ----------------------------------
                            // https://docs.zammad.org/en/latest/api/ticket/index.html#list
                            // https://docs.zammad.org/en/latest/api/ticket/index.html#search - returning empty always
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const limit = returnAll ? 0 : this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.zammadApiRequestAllItems.call(this, 'GET', '/tickets', {}, {}, limit);
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
exports.Zammad = Zammad;

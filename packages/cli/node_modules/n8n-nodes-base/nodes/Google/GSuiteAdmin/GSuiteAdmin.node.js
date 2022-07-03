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
exports.GSuiteAdmin = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const UserDescription_1 = require("./UserDescription");
const GroupDescripion_1 = require("./GroupDescripion");
class GSuiteAdmin {
    constructor() {
        this.description = {
            displayName: 'G Suite Admin',
            name: 'gSuiteAdmin',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:gSuiteAdmin.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume G Suite Admin API',
            defaults: {
                name: 'G Suite Admin',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'gSuiteAdminOAuth2Api',
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
                            name: 'Group',
                            value: 'group',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'user',
                },
                ...GroupDescripion_1.groupOperations,
                ...GroupDescripion_1.groupFields,
                ...UserDescription_1.userOperations,
                ...UserDescription_1.userFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the domains to display them to user so that he can
                // select them easily
                getDomains() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const domains = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'domains', 'GET', '/directory/v1/customer/my_customer/domains');
                        for (const domain of domains) {
                            const domainName = domain.domainName;
                            const domainId = domain.domainName;
                            returnData.push({
                                name: domainName,
                                value: domainId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the schemas to display them to user so that he can
                // select them easily
                getSchemas() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const schemas = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'schemas', 'GET', '/directory/v1/customer/my_customer/schemas');
                        for (const schema of schemas) {
                            const schemaName = schema.displayName;
                            const schemaId = schema.schemaName;
                            returnData.push({
                                name: schemaName,
                                value: schemaId,
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
                if (resource === 'group') {
                    //https://developers.google.com/admin-sdk/directory/v1/reference/groups/insert
                    if (operation === 'create') {
                        const email = this.getNodeParameter('email', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            email,
                        };
                        Object.assign(body, additionalFields);
                        responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/directory/v1/groups`, body);
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/groups/delete
                    if (operation === 'delete') {
                        const groupId = this.getNodeParameter('groupId', i);
                        responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'DELETE', `/directory/v1/groups/${groupId}`, {});
                        responseData = { success: true };
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/groups/get
                    if (operation === 'get') {
                        const groupId = this.getNodeParameter('groupId', i);
                        responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/directory/v1/groups/${groupId}`, {});
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/groups/list
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const options = this.getNodeParameter('options', i);
                        Object.assign(qs, options);
                        if (qs.customer === undefined) {
                            qs.customer = 'my_customer';
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'groups', 'GET', `/directory/v1/groups`, {}, qs);
                        }
                        else {
                            qs.maxResults = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/directory/v1/groups`, {}, qs);
                            responseData = responseData.groups;
                        }
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/groups/update
                    if (operation === 'update') {
                        const groupId = this.getNodeParameter('groupId', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const body = {};
                        Object.assign(body, updateFields);
                        responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'PUT', `/directory/v1/groups/${groupId}`, body);
                    }
                }
                if (resource === 'user') {
                    //https://developers.google.com/admin-sdk/directory/v1/reference/users/insert
                    if (operation === 'create') {
                        const domain = this.getNodeParameter('domain', i);
                        const firstName = this.getNodeParameter('firstName', i);
                        const lastName = this.getNodeParameter('lastName', i);
                        const password = this.getNodeParameter('password', i);
                        const username = this.getNodeParameter('username', i);
                        const makeAdmin = this.getNodeParameter('makeAdmin', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            name: {
                                familyName: lastName,
                                givenName: firstName,
                            },
                            password,
                            primaryEmail: `${username}@${domain}`,
                        };
                        Object.assign(body, additionalFields);
                        if (additionalFields.phoneUi) {
                            const phones = additionalFields.phoneUi.phoneValues;
                            body.phones = phones;
                            delete body.phoneUi;
                        }
                        if (additionalFields.emailUi) {
                            const emails = additionalFields.emailUi.emailValues;
                            body.emails = emails;
                            delete body.emailUi;
                        }
                        responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/directory/v1/users`, body, qs);
                        if (makeAdmin) {
                            yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/directory/v1/users/${responseData.id}/makeAdmin`, { status: true });
                            responseData.isAdmin = true;
                        }
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/users/delete
                    if (operation === 'delete') {
                        const userId = this.getNodeParameter('userId', i);
                        responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'DELETE', `/directory/v1/users/${userId}`, {});
                        responseData = { success: true };
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/users/get
                    if (operation === 'get') {
                        const userId = this.getNodeParameter('userId', i);
                        const projection = this.getNodeParameter('projection', i);
                        const options = this.getNodeParameter('options', i);
                        qs.projection = projection;
                        Object.assign(qs, options);
                        if (qs.customFieldMask) {
                            qs.customFieldMask = qs.customFieldMask.join(' ');
                        }
                        if (qs.projection === 'custom' && qs.customFieldMask === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'When projection is set to custom, the custom schemas field must be defined');
                        }
                        responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/directory/v1/users/${userId}`, {}, qs);
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/users/list
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const projection = this.getNodeParameter('projection', i);
                        const options = this.getNodeParameter('options', i);
                        qs.projection = projection;
                        Object.assign(qs, options);
                        if (qs.customer === undefined) {
                            qs.customer = 'my_customer';
                        }
                        if (qs.customFieldMask) {
                            qs.customFieldMask = qs.customFieldMask.join(' ');
                        }
                        if (qs.projection === 'custom' && qs.customFieldMask === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'When projection is set to custom, the custom schemas field must be defined');
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'users', 'GET', `/directory/v1/users`, {}, qs);
                        }
                        else {
                            qs.maxResults = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/directory/v1/users`, {}, qs);
                            responseData = responseData.users;
                        }
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/users/update
                    if (operation === 'update') {
                        const userId = this.getNodeParameter('userId', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const body = { name: {} };
                        Object.assign(body, updateFields);
                        if (updateFields.firstName) {
                            body.name.givenName = updateFields.firstName;
                            //@ts-ignore
                            delete body.firstName;
                        }
                        if (updateFields.lastName) {
                            body.name.familyName = updateFields.lastName;
                            //@ts-ignore
                            delete body.lastName;
                        }
                        if (Object.keys(body.name).length === 0) {
                            //@ts-ignore
                            delete body.name;
                        }
                        if (updateFields.phoneUi) {
                            const phones = updateFields.phoneUi.phoneValues;
                            body.phones = phones;
                            //@ts-ignore
                            delete body.phoneUi;
                        }
                        if (updateFields.emailUi) {
                            const emails = updateFields.emailUi.emailValues;
                            body.emails = emails;
                            //@ts-ignore
                            delete body.emailUi;
                        }
                        //@ts-ignore
                        body['customSchemas'] = { testing: { hasdog: true } };
                        responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'PUT', `/directory/v1/users/${userId}`, body, qs);
                    }
                }
            }
            if (Array.isArray(responseData)) {
                returnData.push.apply(returnData, responseData);
            }
            else if (responseData !== undefined) {
                returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.GSuiteAdmin = GSuiteAdmin;

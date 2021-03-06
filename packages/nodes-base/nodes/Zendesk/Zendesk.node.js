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
exports.Zendesk = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const TicketDescription_1 = require("./TicketDescription");
const TicketFieldDescription_1 = require("./TicketFieldDescription");
const UserDescription_1 = require("./UserDescription");
const OrganizationDescription_1 = require("./OrganizationDescription");
class Zendesk {
    constructor() {
        this.description = {
            displayName: 'Zendesk',
            name: 'zendesk',
            icon: 'file:zendesk.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Zendesk API',
            defaults: {
                name: 'Zendesk',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'zendeskApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'apiToken',
                            ],
                        },
                    },
                },
                {
                    name: 'zendeskOAuth2Api',
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
                            name: 'API Token',
                            value: 'apiToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'apiToken',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Ticket',
                            value: 'ticket',
                            description: 'Tickets are the means through which your end users (customers) communicate with agents in Zendesk Support',
                        },
                        {
                            name: 'Ticket Field',
                            value: 'ticketField',
                            description: 'Manage system and custom ticket fields',
                        },
                        {
                            name: 'User',
                            value: 'user',
                            description: 'Manage users',
                        },
                        {
                            name: 'Organization',
                            value: 'organization',
                            description: 'Manage organizations',
                        },
                    ],
                    default: 'ticket',
                },
                // TICKET
                ...TicketDescription_1.ticketOperations,
                ...TicketDescription_1.ticketFields,
                // TICKET FIELD
                ...TicketFieldDescription_1.ticketFieldOperations,
                ...TicketFieldDescription_1.ticketFieldFields,
                // USER
                ...UserDescription_1.userOperations,
                ...UserDescription_1.userFields,
                // ORGANIZATION
                ...OrganizationDescription_1.organizationOperations,
                ...OrganizationDescription_1.organizationFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the custom fields to display them to user so that he can
                // select them easily
                getCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const customFields = [
                            'text',
                            'textarea',
                            'date',
                            'integer',
                            'decimal',
                            'regexp',
                            'multiselect',
                            'tagger',
                        ];
                        const fields = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'ticket_fields', 'GET', '/ticket_fields');
                        for (const field of fields) {
                            if (customFields.includes(field.type)) {
                                const fieldName = field.title;
                                const fieldId = field.id;
                                returnData.push({
                                    name: fieldName,
                                    value: fieldId,
                                });
                            }
                        }
                        return returnData;
                    });
                },
                // Get all the groups to display them to user so that he can
                // select them easily
                getGroups() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const groups = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'groups', 'GET', '/groups');
                        for (const group of groups) {
                            const groupName = group.name;
                            const groupId = group.id;
                            returnData.push({
                                name: groupName,
                                value: groupId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the tags to display them to user so that he can
                // select them easily
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const tags = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'tags', 'GET', '/tags');
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
                // Get all the locales to display them to user so that he can
                // select them easily
                getLocales() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const locales = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'locales', 'GET', '/locales');
                        for (const locale of locales) {
                            const localeName = `${locale.locale} - ${locale.name}`;
                            const localeId = locale.locale;
                            returnData.push({
                                name: localeName,
                                value: localeId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the user fields to display them to user so that he can
                // select them easily
                getUserFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const fields = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'user_fields', 'GET', '/user_fields');
                        for (const field of fields) {
                            const fieldName = field.title;
                            const fieldId = field.key;
                            returnData.push({
                                name: fieldName,
                                value: fieldId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the organization fields to display them to the user for easy selection
                getOrganizationFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const fields = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'organization_fields', 'GET', '/organization_fields');
                        for (const field of fields) {
                            const fieldName = field.title;
                            const fieldId = field.key;
                            returnData.push({
                                name: fieldName,
                                value: fieldId,
                            });
                        }
                        return returnData;
                    });
                },
                getOrganizations() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const fields = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'organizations', 'GET', `/organizations`, {}, {});
                        for (const field of fields) {
                            returnData.push({
                                name: field.name,
                                value: field.id,
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
            for (let i = 0; i < length; i++) {
                try {
                    const resource = this.getNodeParameter('resource', 0);
                    const operation = this.getNodeParameter('operation', 0);
                    //https://developer.zendesk.com/api-reference/ticketing/introduction/
                    if (resource === 'ticket') {
                        //https://developer.zendesk.com/rest_api/docs/support/tickets
                        if (operation === 'create') {
                            const description = this.getNodeParameter('description', i);
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            const comment = {
                                body: description,
                            };
                            const body = {
                                comment,
                            };
                            if (jsonParameters) {
                                const additionalFieldsJson = this.getNodeParameter('additionalFieldsJson', i);
                                if (additionalFieldsJson !== '') {
                                    if ((0, GenericFunctions_1.validateJSON)(additionalFieldsJson) !== undefined) {
                                        Object.assign(body, JSON.parse(additionalFieldsJson));
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Additional fields must be a valid JSON');
                                    }
                                }
                            }
                            else {
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                if (additionalFields.type) {
                                    body.type = additionalFields.type;
                                }
                                if (additionalFields.externalId) {
                                    body.external_id = additionalFields.externalId;
                                }
                                if (additionalFields.subject) {
                                    body.subject = additionalFields.subject;
                                }
                                if (additionalFields.status) {
                                    body.status = additionalFields.status;
                                }
                                if (additionalFields.recipient) {
                                    body.recipient = additionalFields.recipient;
                                }
                                if (additionalFields.group) {
                                    body.group = additionalFields.group;
                                }
                                if (additionalFields.tags) {
                                    body.tags = additionalFields.tags;
                                }
                                if (additionalFields.customFieldsUi) {
                                    body.custom_fields = additionalFields.customFieldsUi.customFieldsValues;
                                }
                            }
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'POST', '/tickets', { ticket: body });
                            responseData = responseData.ticket;
                        }
                        //https://developer.zendesk.com/rest_api/docs/support/tickets#update-ticket
                        if (operation === 'update') {
                            const ticketId = this.getNodeParameter('id', i);
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            const body = {};
                            if (jsonParameters) {
                                const updateFieldsJson = this.getNodeParameter('updateFieldsJson', i);
                                if (updateFieldsJson !== '') {
                                    if ((0, GenericFunctions_1.validateJSON)(updateFieldsJson) !== undefined) {
                                        Object.assign(body, JSON.parse(updateFieldsJson));
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Additional fields must be a valid JSON');
                                    }
                                }
                            }
                            else {
                                const updateFields = this.getNodeParameter('updateFields', i);
                                if (updateFields.type) {
                                    body.type = updateFields.type;
                                }
                                if (updateFields.externalId) {
                                    body.external_id = updateFields.externalId;
                                }
                                if (updateFields.subject) {
                                    body.subject = updateFields.subject;
                                }
                                if (updateFields.status) {
                                    body.status = updateFields.status;
                                }
                                if (updateFields.recipient) {
                                    body.recipient = updateFields.recipient;
                                }
                                if (updateFields.group) {
                                    body.group = updateFields.group;
                                }
                                if (updateFields.tags) {
                                    body.tags = updateFields.tags;
                                }
                                if (updateFields.customFieldsUi) {
                                    body.custom_fields = updateFields.customFieldsUi.customFieldsValues;
                                }
                                if (updateFields.assigneeEmail) {
                                    body.assignee_email = updateFields.assigneeEmail;
                                }
                                if (updateFields.internalNote) {
                                    const comment = {
                                        html_body: updateFields.internalNote,
                                        public: false,
                                    };
                                    body.comment = comment;
                                }
                                if (updateFields.publicReply) {
                                    const comment = {
                                        body: updateFields.publicReply,
                                        public: true,
                                    };
                                    body.comment = comment;
                                }
                            }
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'PUT', `/tickets/${ticketId}`, { ticket: body });
                            responseData = responseData.ticket;
                        }
                        //https://developer.zendesk.com/rest_api/docs/support/tickets#show-ticket
                        //https://developer.zendesk.com/api-reference/ticketing/tickets/suspended_tickets/#show-suspended-ticket
                        if (operation === 'get') {
                            const ticketType = this.getNodeParameter('ticketType', i);
                            const ticketId = this.getNodeParameter('id', i);
                            const endpoint = (ticketType === 'regular') ? `/tickets/${ticketId}` : `/suspended_tickets/${ticketId}`;
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', endpoint, {});
                            responseData = responseData.ticket || responseData.suspended_ticket;
                        }
                        //https://developer.zendesk.com/rest_api/docs/support/search#list-search-results
                        //https://developer.zendesk.com/api-reference/ticketing/tickets/suspended_tickets/#list-suspended-tickets
                        if (operation === 'getAll') {
                            const ticketType = this.getNodeParameter('ticketType', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            qs.query = 'type:ticket';
                            if (options.query) {
                                qs.query += ` ${options.query}`;
                            }
                            if (options.status) {
                                qs.query += ` status:${options.status}`;
                            }
                            if (options.group) {
                                qs.query += ` group:${options.group}`;
                            }
                            if (options.sortBy) {
                                qs.sort_by = options.sortBy;
                            }
                            if (options.sortOrder) {
                                qs.sort_order = options.sortOrder;
                            }
                            const endpoint = (ticketType === 'regular') ? `/search` : `/suspended_tickets`;
                            const property = (ticketType === 'regular') ? 'results' : 'suspended_tickets';
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, property, 'GET', endpoint, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.per_page = limit;
                                responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', endpoint, {}, qs);
                                responseData = responseData.results || responseData.suspended_tickets;
                            }
                        }
                        //https://developer.zendesk.com/rest_api/docs/support/tickets#delete-ticket
                        //https://developer.zendesk.com/api-reference/ticketing/tickets/suspended_tickets/#delete-suspended-ticket
                        if (operation === 'delete') {
                            const ticketType = this.getNodeParameter('ticketType', i);
                            const ticketId = this.getNodeParameter('id', i);
                            const endpoint = (ticketType === 'regular') ? `/tickets/${ticketId}` : `/suspended_tickets/${ticketId}`;
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'DELETE', endpoint, {});
                            responseData = { success: true };
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/tickets/suspended_tickets/#recover-suspended-ticket
                        if (operation === 'recover') {
                            const ticketId = this.getNodeParameter('id', i);
                            try {
                                responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'PUT', `/suspended_tickets/${ticketId}/recover`, {});
                                responseData = responseData.ticket;
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                    }
                    //https://developer.zendesk.com/api-reference/ticketing/tickets/ticket_fields/
                    if (resource === 'ticketField') {
                        //https://developer.zendesk.com/rest_api/docs/support/tickets#show-ticket
                        if (operation === 'get') {
                            const ticketFieldId = this.getNodeParameter('ticketFieldId', i);
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', `/ticket_fields/${ticketFieldId}`, {});
                            responseData = responseData.ticket_field;
                        }
                        //https://developer.zendesk.com/rest_api/docs/support/ticket_fields#list-ticket-fields
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'ticket_fields', 'GET', '/ticket_fields', {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.limit = limit;
                                responseData = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'ticket_fields', 'GET', '/ticket_fields', {}, qs);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                    }
                    //https://developer.zendesk.com/api-reference/ticketing/users/users/
                    if (resource === 'user') {
                        //https://developer.zendesk.com/api-reference/ticketing/users/users/#create-user
                        if (operation === 'create') {
                            const name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                name,
                            };
                            Object.assign(body, additionalFields);
                            if (body.userFieldsUi) {
                                const userFields = body.userFieldsUi.userFieldValues;
                                if (userFields) {
                                    body.user_fields = {};
                                    for (const userField of userFields) {
                                        //@ts-ignore
                                        body.user_fields[userField.field] = userField.value;
                                    }
                                    delete body.userFieldsUi;
                                }
                            }
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'POST', '/users', { user: body });
                            responseData = responseData.user;
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/users/users/#update-user
                        if (operation === 'update') {
                            const userId = this.getNodeParameter('id', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            Object.assign(body, updateFields);
                            if (body.userFieldsUi) {
                                const userFields = body.userFieldsUi.userFieldValues;
                                if (userFields) {
                                    body.user_fields = {};
                                    for (const userField of userFields) {
                                        //@ts-ignore
                                        body.user_fields[userField.field] = userField.value;
                                    }
                                    delete body.userFieldsUi;
                                }
                            }
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'PUT', `/users/${userId}`, { user: body });
                            responseData = responseData.user;
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/users/users/#show-user
                        if (operation === 'get') {
                            const userId = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', `/users/${userId}`, {});
                            responseData = responseData.user;
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/users/users/#list-users
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('filters', i);
                            Object.assign(qs, options);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'users', 'GET', `/users`, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.per_page = limit;
                                responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', `/users`, {}, qs);
                                responseData = responseData.users;
                            }
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/organizations/organizations/#list-organizations
                        if (operation === 'getOrganizations') {
                            const userId = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', `/users/${userId}/organizations`, {});
                            responseData = responseData.organizations;
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/users/users/#search-users
                        if (operation === 'search') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('filters', i);
                            Object.assign(qs, options);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'users', 'GET', `/users/search`, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.per_page = limit;
                                responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', `/users/search`, {}, qs);
                                responseData = responseData.users;
                            }
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/users/users/#delete-user
                        if (operation === 'delete') {
                            const userId = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'DELETE', `/users/${userId}`, {});
                            responseData = responseData.user;
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/users/users/#show-user-related-information
                        if (operation === 'getRelatedData') {
                            const userId = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', `/users/${userId}/related`, {});
                            responseData = responseData.user_related;
                        }
                    }
                    //https://developer.zendesk.com/api-reference/ticketing/organizations/organizations/
                    if (resource === 'organization') {
                        //https://developer.zendesk.com/api-reference/ticketing/organizations/organizations/#create-organization
                        if (operation === 'create') {
                            const name = this.getNodeParameter('name', i);
                            const body = {
                                name,
                            };
                            const _a = this.getNodeParameter('additionalFields', i), { organizationFieldsUi } = _a, rest = __rest(_a, ["organizationFieldsUi"]);
                            Object.assign(body, rest);
                            if (organizationFieldsUi === null || organizationFieldsUi === void 0 ? void 0 : organizationFieldsUi.organizationFieldValues.length) {
                                const organizationFields = organizationFieldsUi.organizationFieldValues;
                                if (organizationFields.length) {
                                    body.organization_fields = {};
                                    for (const organizationField of organizationFields) {
                                        body.organization_fields[organizationField.field] = organizationField.value;
                                    }
                                }
                            }
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'POST', '/organizations', { organization: body });
                            responseData = responseData.organization;
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/organizations/organizations/#delete-organization
                        if (operation === 'delete') {
                            const organizationId = this.getNodeParameter('id', i);
                            yield GenericFunctions_1.zendeskApiRequest.call(this, 'DELETE', `/organizations/${organizationId}`, {});
                            responseData = { success: true };
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/organizations/organizations/#count-organizations
                        if (operation === 'count') {
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', `/organizations/count`, {});
                            responseData = responseData.count;
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/organizations/organizations/#show-organization
                        if (operation === 'get') {
                            const organizationId = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', `/organizations/${organizationId}`, {});
                            responseData = responseData.organization;
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/organizations/organizations/#list-organizations
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'organizations', 'GET', `/organizations`, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.per_page = limit;
                                responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', `/organizations`, {}, qs);
                                responseData = responseData.organizations;
                            }
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/organizations/organizations/#show-organizations-related-information
                        if (operation === 'getRelatedData') {
                            const organizationId = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', `/organizations/${organizationId}/related`, {});
                            responseData = responseData.organization_related;
                        }
                        //https://developer.zendesk.com/api-reference/ticketing/organizations/organizations/#update-organization
                        if (operation === 'update') {
                            const organizationId = this.getNodeParameter('id', i);
                            const body = {};
                            const _b = this.getNodeParameter('updateFields', i), { organizationFieldsUi } = _b, rest = __rest(_b, ["organizationFieldsUi"]);
                            Object.assign(body, rest);
                            if (organizationFieldsUi === null || organizationFieldsUi === void 0 ? void 0 : organizationFieldsUi.organizationFieldValues.length) {
                                const organizationFields = organizationFieldsUi.organizationFieldValues;
                                if (organizationFields.length) {
                                    body.organization_fields = {};
                                    for (const organizationField of organizationFields) {
                                        body.organization_fields[organizationField.field] = organizationField.value;
                                    }
                                }
                            }
                            responseData = yield GenericFunctions_1.zendeskApiRequest.call(this, 'PUT', `/organizations/${organizationId}`, { organization: body });
                            responseData = responseData.organization;
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
exports.Zendesk = Zendesk;

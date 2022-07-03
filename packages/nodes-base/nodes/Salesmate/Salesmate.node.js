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
exports.Salesmate = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const CompanyDescription_1 = require("./CompanyDescription");
const ActivityDescription_1 = require("./ActivityDescription");
const DealDescription_1 = require("./DealDescription");
class Salesmate {
    constructor() {
        this.description = {
            displayName: 'Salesmate',
            name: 'salesmate',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:salesmate.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
            description: 'Consume Salesmate API',
            defaults: {
                name: 'Salesmate',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'salesmateApi',
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
                            name: 'Activity',
                            value: 'activity',
                        },
                        {
                            name: 'Company',
                            value: 'company',
                        },
                        {
                            name: 'Deal',
                            value: 'deal',
                        },
                    ],
                    default: 'activity',
                },
                ...CompanyDescription_1.companyOperations,
                ...ActivityDescription_1.activityOperations,
                ...DealDescription_1.dealOperations,
                ...CompanyDescription_1.companyFields,
                ...ActivityDescription_1.activityFields,
                ...DealDescription_1.dealFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available users to display them to user so that he can
                // select them easily
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const users = yield GenericFunctions_1.salesmateApiRequest.call(this, 'GET', '/v1/users/active');
                        for (const user of users.Data) {
                            const userName = user.nickname;
                            const userId = user.id;
                            returnData.push({
                                name: userName,
                                value: userId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available contacs to display them to user so that he can
                // select them easily
                getContacts() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            fields: ['name', 'id'],
                            query: {},
                        };
                        const contacts = yield GenericFunctions_1.salesmateApiRequest.call(this, 'POST', '/v2/contacts/search', qs);
                        for (const contact of contacts.Data.data) {
                            const contactName = contact.name;
                            const contactId = contact.id;
                            returnData.push({
                                name: contactName,
                                value: contactId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available companies to display them to user so that he can
                // select them easily
                getCompanies() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            fields: ['name', 'id'],
                            query: {},
                        };
                        const companies = yield GenericFunctions_1.salesmateApiRequest.call(this, 'POST', '/v2/companies/search', qs);
                        for (const company of companies.Data.data) {
                            const companyName = company.name;
                            const companyId = company.id;
                            returnData.push({
                                name: companyName,
                                value: companyId,
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
                if (resource === 'company') {
                    if (operation === 'create') {
                        const owner = this.getNodeParameter('owner', i);
                        const name = this.getNodeParameter('name', i);
                        const rawData = this.getNodeParameter('rawData', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            name,
                            owner,
                        };
                        if (additionalFields.website) {
                            body.website = additionalFields.website;
                        }
                        if (additionalFields.phone) {
                            body.phone = additionalFields.phone;
                        }
                        if (additionalFields.otherPhone) {
                            body.otherPhone = additionalFields.otherPhone;
                        }
                        if (additionalFields.facebookHandle) {
                            body.facebookHandle = additionalFields.facebookHandle;
                        }
                        if (additionalFields.googlePlusHandle) {
                            body.googlePlusHandle = additionalFields.googlePlusHandle;
                        }
                        if (additionalFields.linkedInHandle) {
                            body.linkedInHandle = additionalFields.linkedInHandle;
                        }
                        if (additionalFields.skypeId) {
                            body.skypeId = additionalFields.skypeId;
                        }
                        if (additionalFields.twitterHandle) {
                            body.twitterHandle = additionalFields.twitterHandle;
                        }
                        if (additionalFields.currency) {
                            body.currency = additionalFields.currency;
                        }
                        if (additionalFields.billingAddressLine1) {
                            body.billingAddressLine1 = additionalFields.billingAddressLine1;
                        }
                        if (additionalFields.billingAddressLine2) {
                            body.billingAddressLine2 = additionalFields.billingAddressLine2;
                        }
                        if (additionalFields.billingCity) {
                            body.billingCity = additionalFields.billingCity;
                        }
                        if (additionalFields.billingZipCode) {
                            body.billingZipCode = additionalFields.billingZipCode;
                        }
                        if (additionalFields.billingState) {
                            body.billingState = additionalFields.billingState;
                        }
                        if (additionalFields.description) {
                            body.description = additionalFields.description;
                        }
                        if (additionalFields.tags) {
                            body.tags = additionalFields.tags;
                        }
                        responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'POST', '/v1/companies', body);
                        responseData = responseData.Data;
                        if (!rawData) {
                            delete responseData.detail;
                        }
                    }
                    if (operation === 'update') {
                        const companyId = this.getNodeParameter('id', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const rawData = this.getNodeParameter('rawData', i);
                        const body = {};
                        if (updateFields.owner) {
                            body.owner = updateFields.owner;
                        }
                        if (updateFields.name) {
                            body.name = updateFields.name;
                        }
                        if (updateFields.website) {
                            body.website = updateFields.website;
                        }
                        if (updateFields.phone) {
                            body.phone = updateFields.phone;
                        }
                        if (updateFields.otherPhone) {
                            body.otherPhone = updateFields.otherPhone;
                        }
                        if (updateFields.facebookHandle) {
                            body.facebookHandle = updateFields.facebookHandle;
                        }
                        if (updateFields.googlePlusHandle) {
                            body.googlePlusHandle = updateFields.googlePlusHandle;
                        }
                        if (updateFields.linkedInHandle) {
                            body.linkedInHandle = updateFields.linkedInHandle;
                        }
                        if (updateFields.skypeId) {
                            body.skypeId = updateFields.skypeId;
                        }
                        if (updateFields.twitterHandle) {
                            body.twitterHandle = updateFields.twitterHandle;
                        }
                        if (updateFields.currency) {
                            body.currency = updateFields.currency;
                        }
                        if (updateFields.billingAddressLine1) {
                            body.billingAddressLine1 = updateFields.billingAddressLine1;
                        }
                        if (updateFields.billingAddressLine2) {
                            body.billingAddressLine2 = updateFields.billingAddressLine2;
                        }
                        if (updateFields.billingCity) {
                            body.billingCity = updateFields.billingCity;
                        }
                        if (updateFields.billingZipCode) {
                            body.billingZipCode = updateFields.billingZipCode;
                        }
                        if (updateFields.billingState) {
                            body.billingState = updateFields.billingState;
                        }
                        if (updateFields.description) {
                            body.description = updateFields.description;
                        }
                        if (updateFields.tags) {
                            body.tags = updateFields.tags;
                        }
                        responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'PUT', `/v1/companies/${companyId}`, body);
                        responseData = responseData.Data;
                        if (!rawData) {
                            delete responseData.detail;
                        }
                    }
                    if (operation === 'get') {
                        const companyId = this.getNodeParameter('id', i);
                        const rawData = this.getNodeParameter('rawData', i);
                        responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'GET', `/v1/companies/${companyId}`);
                        responseData = responseData.Data;
                        if (!rawData) {
                            responseData = (0, GenericFunctions_1.simplifySalesmateData)(responseData);
                        }
                    }
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const options = this.getNodeParameter('options', i);
                        const jsonActive = this.getNodeParameter('jsonParameters', i);
                        let body = {
                            query: {
                                group: {},
                            },
                        };
                        if (options.sortBy) {
                            qs.sortBy = options.sortBy;
                        }
                        if (options.sortOrder) {
                            qs.sortOrder = options.sortOrder;
                        }
                        if (options.fields) {
                            if (options.fields.trim() === '') {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'You have to add at least one field');
                            }
                            body.fields = options.fields.split(',');
                        }
                        else {
                            body.fields = [
                                'name',
                                'description',
                                'billingAddressLine1',
                                'billingAddressLine2',
                                'billingCity',
                                'billingZipCode',
                                'billingState',
                                'billingCountry',
                                'website',
                                'owner',
                                'tags',
                                'photo',
                                'createdAt',
                            ];
                        }
                        if (!jsonActive) {
                            const filters = [];
                            const filtersUi = this.getNodeParameter('filters', i).filtersUi;
                            if (filtersUi && filtersUi.conditions) {
                                const conditions = filtersUi.conditions;
                                if (conditions.conditionsUi) {
                                    for (const condition of conditions.conditionsUi) {
                                        const filter = {};
                                        filter.moduleName = 'Company';
                                        filter.field = {
                                            fieldName: condition.field,
                                        };
                                        filter.condition = condition.condition;
                                        filter.data = condition.value;
                                        filters.push(filter);
                                    }
                                }
                            }
                            if (filtersUi && filtersUi.operator) {
                                //@ts-ignore
                                body.query.group = {
                                    operator: filtersUi.operator,
                                    rules: filters,
                                };
                            }
                        }
                        else {
                            const json = (0, GenericFunctions_1.validateJSON)(this.getNodeParameter('filtersJson', i));
                            body = json;
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.salesmateApiRequestAllItems.call(this, 'Data', 'POST', '/v2/companies/search', body, qs);
                        }
                        else {
                            const limit = this.getNodeParameter('limit', i);
                            qs.rows = limit;
                            responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'POST', '/v2/companies/search', body, qs);
                            responseData = responseData.Data.data;
                        }
                    }
                    if (operation === 'delete') {
                        const companyId = parseInt(this.getNodeParameter('id', i), 10);
                        responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'DELETE', `/v1/companies/${companyId}`);
                    }
                }
                if (resource === 'activity') {
                    if (operation === 'create') {
                        const owner = this.getNodeParameter('owner', i);
                        const title = this.getNodeParameter('title', i);
                        const type = this.getNodeParameter('type', i);
                        const rawData = this.getNodeParameter('rawData', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            title,
                            owner,
                            type,
                        };
                        if (additionalFields.dueDate) {
                            body.dueDate = new Date(additionalFields.dueDate).getTime();
                        }
                        if (additionalFields.duration) {
                            body.duration = additionalFields.duration;
                        }
                        if (additionalFields.isCalendarInvite) {
                            body.isCalendarInvite = additionalFields.isCalendarInvite;
                        }
                        if (additionalFields.isCompleted) {
                            body.isCompleted = additionalFields.isCompleted;
                        }
                        if (additionalFields.description) {
                            body.description = additionalFields.description;
                        }
                        if (additionalFields.tags) {
                            body.tags = additionalFields.tags;
                        }
                        responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'POST', '/v1/activities', body);
                        responseData = responseData.Data;
                        if (!rawData) {
                            delete responseData.detail;
                        }
                    }
                    if (operation === 'update') {
                        const activityId = this.getNodeParameter('id', i);
                        const rawData = this.getNodeParameter('rawData', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const body = {};
                        if (updateFields.title) {
                            body.title = updateFields.title;
                        }
                        if (updateFields.type) {
                            body.type = updateFields.type;
                        }
                        if (updateFields.owner) {
                            body.owner = updateFields.owner;
                        }
                        if (updateFields.dueDate) {
                            body.dueDate = new Date(updateFields.dueDate).getTime();
                        }
                        if (updateFields.duration) {
                            body.duration = updateFields.duration;
                        }
                        if (updateFields.isCalendarInvite) {
                            body.isCalendarInvite = updateFields.isCalendarInvite;
                        }
                        if (updateFields.isCompleted) {
                            body.isCompleted = updateFields.isCompleted;
                        }
                        if (updateFields.description) {
                            body.description = updateFields.description;
                        }
                        if (updateFields.tags) {
                            body.tags = updateFields.tags;
                        }
                        responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'PUT', `/v1/activities/${activityId}`, body);
                        responseData = responseData.Data;
                        if (!rawData) {
                            delete responseData.detail;
                        }
                    }
                    if (operation === 'get') {
                        const activityId = this.getNodeParameter('id', i);
                        const rawData = this.getNodeParameter('rawData', i);
                        responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'GET', `/v1/activities/${activityId}`);
                        responseData = responseData.Data;
                        if (!rawData) {
                            responseData = (0, GenericFunctions_1.simplifySalesmateData)(responseData);
                        }
                    }
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const options = this.getNodeParameter('options', i);
                        const jsonActive = this.getNodeParameter('jsonParameters', i);
                        let body = {
                            query: {
                                group: {},
                            },
                        };
                        if (options.sortBy) {
                            qs.sortBy = options.sortBy;
                        }
                        if (options.sortOrder) {
                            qs.sortOrder = options.sortOrder;
                        }
                        if (options.fields) {
                            if (options.fields.trim() === '') {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'You have to add at least one field');
                            }
                            body.fields = options.fields.split(',');
                        }
                        else {
                            body.fields = [
                                'title',
                                'dueDate',
                                'description',
                                'duration',
                                'owner',
                                'Deal.title',
                                'PrimaryContact.name',
                                'PrimaryContact.email',
                                'PrimaryCompany.name',
                                'PrimaryCompany.email',
                                'tags',
                                'type',
                                'createdAt',
                                'isCompleted',
                            ];
                        }
                        if (!jsonActive) {
                            const filters = [];
                            const filtersUi = this.getNodeParameter('filters', i).filtersUi;
                            if (filtersUi && filtersUi.conditions) {
                                const conditions = filtersUi.conditions;
                                if (conditions.conditionsUi) {
                                    for (const condition of conditions.conditionsUi) {
                                        const filter = {};
                                        filter.moduleName = 'Task';
                                        filter.field = {
                                            fieldName: condition.field,
                                        };
                                        filter.condition = condition.condition;
                                        filter.data = condition.value;
                                        filters.push(filter);
                                    }
                                }
                            }
                            if (filtersUi && filtersUi.operator) {
                                //@ts-ignore
                                body.query.group = {
                                    operator: filtersUi.operator,
                                    rules: filters,
                                };
                            }
                        }
                        else {
                            const json = (0, GenericFunctions_1.validateJSON)(this.getNodeParameter('filtersJson', i));
                            body = json;
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.salesmateApiRequestAllItems.call(this, 'Data', 'POST', '/v2/activities/search', body, qs);
                        }
                        else {
                            const limit = this.getNodeParameter('limit', i);
                            qs.rows = limit;
                            responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'POST', '/v2/activities/search', body, qs);
                            responseData = responseData.Data.data;
                        }
                    }
                    if (operation === 'delete') {
                        const activityId = this.getNodeParameter('id', i);
                        responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'DELETE', `/v1/activities/${activityId}`);
                    }
                }
                if (resource === 'deal') {
                    if (operation === 'create') {
                        const title = this.getNodeParameter('title', i);
                        const owner = this.getNodeParameter('owner', i);
                        const primaryContact = this.getNodeParameter('primaryContact', i);
                        const pipeline = this.getNodeParameter('pipeline', i);
                        const status = this.getNodeParameter('status', i);
                        const stage = this.getNodeParameter('stage', i);
                        const currency = this.getNodeParameter('currency', i);
                        const rawData = this.getNodeParameter('rawData', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            title,
                            owner,
                            primaryContact,
                            pipeline,
                            status,
                            stage,
                            currency,
                        };
                        if (additionalFields.description) {
                            body.description = additionalFields.description;
                        }
                        if (additionalFields.tags) {
                            body.tags = additionalFields.tags;
                        }
                        if (additionalFields.primaryCompany) {
                            body.primaryCompany = additionalFields.primaryCompany;
                        }
                        if (additionalFields.source) {
                            body.source = additionalFields.source;
                        }
                        if (additionalFields.estimatedCloseDate) {
                            body.estimatedCloseDate = additionalFields.estimatedCloseDate;
                        }
                        if (additionalFields.dealValue) {
                            body.dealValue = additionalFields.dealValue;
                        }
                        if (additionalFields.priority) {
                            body.priority = additionalFields.priority;
                        }
                        responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'POST', '/v1/deals', body);
                        responseData = responseData.Data;
                        if (!rawData) {
                            delete responseData.detail;
                        }
                    }
                    if (operation === 'update') {
                        const dealId = this.getNodeParameter('id', i);
                        const rawData = this.getNodeParameter('rawData', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const body = {};
                        if (updateFields.title) {
                            body.title = updateFields.title;
                        }
                        if (updateFields.owner) {
                            body.owner = updateFields.owner;
                        }
                        if (updateFields.primaryContact) {
                            body.primaryContact = updateFields.primaryContact;
                        }
                        if (updateFields.status) {
                            body.status = updateFields.status;
                        }
                        if (updateFields.currency) {
                            body.currency = updateFields.currency;
                        }
                        if (updateFields.stage) {
                            body.stage = updateFields.stage;
                        }
                        if (updateFields.pipeline) {
                            body.pipeline = updateFields.pipeline;
                        }
                        if (updateFields.description) {
                            body.description = updateFields.description;
                        }
                        if (updateFields.tags) {
                            body.tags = updateFields.tags;
                        }
                        if (updateFields.primaryCompany) {
                            body.primaryCompany = updateFields.primaryCompany;
                        }
                        if (updateFields.source) {
                            body.source = updateFields.source;
                        }
                        if (updateFields.estimatedCloseDate) {
                            body.estimatedCloseDate = updateFields.estimatedCloseDate;
                        }
                        if (updateFields.dealValue) {
                            body.dealValue = updateFields.dealValue;
                        }
                        if (updateFields.priority) {
                            body.priority = updateFields.priority;
                        }
                        responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'PUT', `/v1/deals/${dealId}`, body);
                        responseData = responseData.Data;
                        if (!rawData) {
                            delete responseData.detail;
                        }
                    }
                    if (operation === 'get') {
                        const dealId = this.getNodeParameter('id', i);
                        const rawData = this.getNodeParameter('rawData', i);
                        responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'GET', `/v1/deals/${dealId}`);
                        responseData = responseData.Data;
                        if (!rawData) {
                            responseData = (0, GenericFunctions_1.simplifySalesmateData)(responseData);
                        }
                    }
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const options = this.getNodeParameter('options', i);
                        const jsonActive = this.getNodeParameter('jsonParameters', i);
                        let body = {
                            query: {
                                group: {},
                            },
                        };
                        if (options.sortBy) {
                            qs.sortBy = options.sortBy;
                        }
                        if (options.sortOrder) {
                            qs.sortOrder = options.sortOrder;
                        }
                        if (options.fields !== undefined) {
                            if (options.fields.trim() === '') {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'You have to add at least one field');
                            }
                            body.fields = options.fields.split(',');
                        }
                        else {
                            body.fields = [
                                'title',
                                'PrimaryContact.name',
                                'PrimaryContact.email',
                                'PrimaryCompany.name',
                                'PrimaryCompany.email',
                                'dealValue',
                                'priority',
                                'stage',
                                'status',
                                'owner',
                                'tags',
                                'createdAt',
                            ];
                        }
                        if (!jsonActive) {
                            const filters = [];
                            const filtersUi = this.getNodeParameter('filters', i).filtersUi;
                            if (filtersUi && filtersUi.conditions) {
                                const conditions = filtersUi.conditions;
                                if (conditions.conditionsUi) {
                                    for (const condition of conditions.conditionsUi) {
                                        const filter = {};
                                        filter.moduleName = 'Task';
                                        filter.field = {
                                            fieldName: condition.field,
                                        };
                                        filter.condition = condition.condition;
                                        filter.data = condition.value;
                                        filters.push(filter);
                                    }
                                }
                            }
                            if (filtersUi && filtersUi.operator) {
                                //@ts-ignore
                                body.query.group = {
                                    operator: filtersUi.operator,
                                    rules: filters,
                                };
                            }
                        }
                        else {
                            const json = (0, GenericFunctions_1.validateJSON)(this.getNodeParameter('filtersJson', i));
                            body = json;
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.salesmateApiRequestAllItems.call(this, 'Data', 'POST', '/v2/deals/search', body, qs);
                        }
                        else {
                            const limit = this.getNodeParameter('limit', i);
                            qs.rows = limit;
                            responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'POST', '/v2/deals/search', body, qs);
                            responseData = responseData.Data.data;
                        }
                    }
                    if (operation === 'delete') {
                        const dealId = this.getNodeParameter('id', i);
                        responseData = yield GenericFunctions_1.salesmateApiRequest.call(this, 'DELETE', `/v1/deals/${dealId}`);
                    }
                }
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else {
                    returnData.push(responseData);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Salesmate = Salesmate;

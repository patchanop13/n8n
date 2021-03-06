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
exports.Harvest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const ClientDescription_1 = require("./ClientDescription");
const ContactDescription_1 = require("./ContactDescription");
const CompanyDescription_1 = require("./CompanyDescription");
const EstimateDescription_1 = require("./EstimateDescription");
const ExpenseDescription_1 = require("./ExpenseDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const InvoiceDescription_1 = require("./InvoiceDescription");
const ProjectDescription_1 = require("./ProjectDescription");
const TaskDescription_1 = require("./TaskDescription");
const TimeEntryDescription_1 = require("./TimeEntryDescription");
const UserDescription_1 = require("./UserDescription");
class Harvest {
    constructor() {
        this.description = {
            displayName: 'Harvest',
            name: 'harvest',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:harvest.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Access data on Harvest',
            defaults: {
                name: 'Harvest',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'harvestApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'accessToken',
                            ],
                        },
                    },
                },
                {
                    name: 'harvestOAuth2Api',
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
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Client',
                            value: 'client',
                        },
                        {
                            name: 'Company',
                            value: 'company',
                        },
                        {
                            name: 'Contact',
                            value: 'contact',
                        },
                        {
                            name: 'Estimate',
                            value: 'estimate',
                        },
                        {
                            name: 'Expense',
                            value: 'expense',
                        },
                        {
                            name: 'Invoice',
                            value: 'invoice',
                        },
                        {
                            name: 'Project',
                            value: 'project',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                        {
                            name: 'Time Entry',
                            value: 'timeEntry',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'task',
                },
                // operations
                ...ClientDescription_1.clientOperations,
                ...CompanyDescription_1.companyOperations,
                ...ContactDescription_1.contactOperations,
                ...EstimateDescription_1.estimateOperations,
                ...ExpenseDescription_1.expenseOperations,
                ...InvoiceDescription_1.invoiceOperations,
                ...ProjectDescription_1.projectOperations,
                ...TaskDescription_1.taskOperations,
                ...TimeEntryDescription_1.timeEntryOperations,
                ...UserDescription_1.userOperations,
                {
                    displayName: 'Account Name or ID',
                    name: 'accountId',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    required: true,
                    typeOptions: {
                        loadOptionsMethod: 'getAccounts',
                    },
                    default: '',
                },
                // fields
                ...ClientDescription_1.clientFields,
                ...ContactDescription_1.contactFields,
                ...EstimateDescription_1.estimateFields,
                ...ExpenseDescription_1.expenseFields,
                ...InvoiceDescription_1.invoiceFields,
                ...ProjectDescription_1.projectFields,
                ...TaskDescription_1.taskFields,
                ...TimeEntryDescription_1.timeEntryFields,
                ...UserDescription_1.userFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available accounts to display them to user so that he can
                // select them easily
                getAccounts() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { accounts } = yield GenericFunctions_1.harvestApiRequest.call(this, 'GET', {}, '', {}, {}, 'https://id.getharvest.com/api/v2/accounts');
                        for (const account of accounts) {
                            const accountName = account.name;
                            const accountId = account.id;
                            returnData.push({
                                name: accountName,
                                value: accountId,
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
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let endpoint = '';
            let requestMethod = '';
            let body;
            let qs;
            for (let i = 0; i < items.length; i++) {
                try {
                    body = {};
                    qs = {};
                    if (resource === 'timeEntry') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `time_entries/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.getAllResource.call(this, 'time_entries', i);
                            returnData.push.apply(returnData, responseData);
                        }
                        else if (operation === 'createByStartEnd') {
                            // ----------------------------------
                            //         createByStartEnd
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'time_entries';
                            body.project_id = this.getNodeParameter('projectId', i);
                            body.task_id = this.getNodeParameter('taskId', i);
                            body.spent_date = this.getNodeParameter('spentDate', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'createByDuration') {
                            // ----------------------------------
                            //         createByDuration
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'time_entries';
                            body.project_id = this.getNodeParameter('projectId', i);
                            body.task_id = this.getNodeParameter('taskId', i);
                            body.spent_date = this.getNodeParameter('spentDate', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `time_entries/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'deleteExternal') {
                            // ----------------------------------
                            //         deleteExternal
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `time_entries/${id}/external_reference`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'restartTime') {
                            // ----------------------------------
                            //         restartTime
                            // ----------------------------------
                            requestMethod = 'PATCH';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `time_entries/${id}/restart`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'stopTime') {
                            // ----------------------------------
                            //         stopTime
                            // ----------------------------------
                            requestMethod = 'PATCH';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `time_entries/${id}/stop`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PATCH';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `time_entries/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(body, updateFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'client') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `clients/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.getAllResource.call(this, 'clients', i);
                            returnData.push.apply(returnData, responseData);
                        }
                        else if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'clients';
                            body.name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PATCH';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `clients/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(qs, updateFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `clients/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                        }
                    }
                    else if (resource === 'project') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `projects/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.getAllResource.call(this, 'projects', i);
                            returnData.push.apply(returnData, responseData);
                        }
                        else if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'projects';
                            body.client_id = this.getNodeParameter('clientId', i);
                            body.name = this.getNodeParameter('name', i);
                            body.is_billable = this.getNodeParameter('isBillable', i);
                            body.bill_by = this.getNodeParameter('billBy', i);
                            body.budget_by = this.getNodeParameter('budgetBy', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PATCH';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `projects/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(body, updateFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `projects/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                        }
                    }
                    else if (resource === 'user') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `users/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.getAllResource.call(this, 'users', i);
                            returnData.push.apply(returnData, responseData);
                        }
                        else if (operation === 'me') {
                            // ----------------------------------
                            //         me
                            // ----------------------------------
                            requestMethod = 'GET';
                            endpoint = `users/me`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'users';
                            body.first_name = this.getNodeParameter('firstName', i);
                            body.last_name = this.getNodeParameter('lastName', i);
                            body.email = this.getNodeParameter('email', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PATCH';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `users/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(qs, updateFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `users/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                        }
                    }
                    else if (resource === 'contact') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `contacts/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.getAllResource.call(this, 'contacts', i);
                            returnData.push.apply(returnData, responseData);
                        }
                        else if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'contacts';
                            body.client_id = this.getNodeParameter('clientId', i);
                            body.first_name = this.getNodeParameter('firstName', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PATCH';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `contacts/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(qs, updateFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `contacts/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                        }
                    }
                    else if (resource === 'company') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            endpoint = `company`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                        }
                    }
                    else if (resource === 'task') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `tasks/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.getAllResource.call(this, 'tasks', i);
                            returnData.push.apply(returnData, responseData);
                        }
                        else if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'tasks';
                            body.name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PATCH';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `tasks/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(qs, updateFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `tasks/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                        }
                    }
                    else if (resource === 'invoice') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `invoices/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.getAllResource.call(this, 'invoices', i);
                            returnData.push.apply(returnData, responseData);
                        }
                        else if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'invoices';
                            body.client_id = this.getNodeParameter('clientId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PATCH';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `invoices/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(qs, updateFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `invoices/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                        }
                    }
                    else if (resource === 'expense') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `expenses/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.getAllResource.call(this, 'expenses', i);
                            returnData.push.apply(returnData, responseData);
                        }
                        else if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'expenses';
                            body.project_id = this.getNodeParameter('projectId', i);
                            body.expense_category_id = this.getNodeParameter('expenseCategoryId', i);
                            body.spent_date = this.getNodeParameter('spentDate', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PATCH';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `expenses/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(qs, updateFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `expenses/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                        }
                    }
                    else if (resource === 'estimate') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `estimates/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.getAllResource.call(this, 'estimates', i);
                            returnData.push.apply(returnData, responseData);
                        }
                        else if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'estimates';
                            body.client_id = this.getNodeParameter('clientId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PATCH';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `estimates/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(qs, updateFields);
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint, body);
                            returnData.push(responseData);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `estimates/${id}`;
                            const responseData = yield GenericFunctions_1.harvestApiRequest.call(this, requestMethod, qs, endpoint);
                            returnData.push(responseData);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                        }
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
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
exports.Harvest = Harvest;

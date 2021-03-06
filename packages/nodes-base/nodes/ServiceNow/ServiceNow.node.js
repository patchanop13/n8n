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
exports.ServiceNow = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const AttachmentDescription_1 = require("./AttachmentDescription");
const BusinessServiceDescription_1 = require("./BusinessServiceDescription");
const ConfigurationItemsDescription_1 = require("./ConfigurationItemsDescription");
const DepartmentDescription_1 = require("./DepartmentDescription");
const DictionaryDescription_1 = require("./DictionaryDescription");
const IncidentDescription_1 = require("./IncidentDescription");
const TableRecordDescription_1 = require("./TableRecordDescription");
const UserDescription_1 = require("./UserDescription");
const UserGroupDescription_1 = require("./UserGroupDescription");
const UserRoleDescription_1 = require("./UserRoleDescription");
class ServiceNow {
    constructor() {
        this.description = {
            displayName: 'ServiceNow',
            name: 'serviceNow',
            icon: 'file:servicenow.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume ServiceNow API',
            defaults: {
                name: 'ServiceNow',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'serviceNowOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
                },
                {
                    name: 'serviceNowBasicApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'basicAuth',
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
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'oAuth2',
                    description: 'Authentication method to use',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Attachment',
                            value: 'attachment',
                        },
                        {
                            name: 'Business Service',
                            value: 'businessService',
                        },
                        {
                            name: 'Configuration Item',
                            value: 'configurationItems',
                        },
                        {
                            name: 'Department',
                            value: 'department',
                        },
                        {
                            name: 'Dictionary',
                            value: 'dictionary',
                        },
                        {
                            name: 'Incident',
                            value: 'incident',
                        },
                        {
                            name: 'Table Record',
                            value: 'tableRecord',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                        {
                            name: 'User Group',
                            value: 'userGroup',
                        },
                        {
                            name: 'User Role',
                            value: 'userRole',
                        },
                    ],
                    default: 'user',
                },
                // ATTACHMENT SERVICE
                ...AttachmentDescription_1.attachmentOperations,
                ...AttachmentDescription_1.attachmentFields,
                // BUSINESS SERVICE
                ...BusinessServiceDescription_1.businessServiceOperations,
                ...BusinessServiceDescription_1.businessServiceFields,
                // CONFIGURATION ITEMS
                ...ConfigurationItemsDescription_1.configurationItemsOperations,
                ...ConfigurationItemsDescription_1.configurationItemsFields,
                // DEPARTMENT
                ...DepartmentDescription_1.departmentOperations,
                ...DepartmentDescription_1.departmentFields,
                // DICTIONARY
                ...DictionaryDescription_1.dictionaryOperations,
                ...DictionaryDescription_1.dictionaryFields,
                // INCIDENT
                ...IncidentDescription_1.incidentOperations,
                ...IncidentDescription_1.incidentFields,
                // TABLE RECORD
                ...TableRecordDescription_1.tableRecordOperations,
                ...TableRecordDescription_1.tableRecordFields,
                // USER
                ...UserDescription_1.userOperations,
                ...UserDescription_1.userFields,
                // USER GROUP
                ...UserGroupDescription_1.userGroupOperations,
                ...UserGroupDescription_1.userGroupFields,
                // USER ROLE
                ...UserRoleDescription_1.userRoleOperations,
                ...UserRoleDescription_1.userRoleFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getTables() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', `/now/doc/table/schema`, {}, {});
                        for (const table of response.result) {
                            returnData.push({
                                name: table.label,
                                value: table.value,
                                description: table.value,
                            });
                        }
                        return (0, GenericFunctions_1.sortData)(returnData);
                    });
                },
                // Get all the table column to display them to user
                getColumns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const resource = this.getNodeParameter('resource', 0);
                        const operation = this.getNodeParameter('operation', 0);
                        const returnData = [];
                        let tableName;
                        if (resource === 'tableRecord') {
                            tableName = this.getNodeParameter('tableName');
                        }
                        else {
                            tableName = (0, GenericFunctions_1.mapEndpoint)(resource, operation);
                        }
                        const qs = {
                            sysparm_query: `name=${tableName}`,
                            sysparm_fields: 'column_label,element',
                        };
                        const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', `/now/table/sys_dictionary`, {}, qs);
                        for (const column of response.result) {
                            if (column.element) {
                                returnData.push({
                                    name: column.column_label,
                                    value: column.element,
                                });
                            }
                        }
                        return (0, GenericFunctions_1.sortData)(returnData);
                    });
                },
                getBusinessServices() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            sysparm_fields: 'name,sys_id',
                        };
                        const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', `/now/table/cmdb_ci_service`, {}, qs);
                        for (const column of response.result) {
                            returnData.push({
                                name: column.name,
                                value: column.sys_id,
                            });
                        }
                        return (0, GenericFunctions_1.sortData)(returnData);
                    });
                },
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const resource = this.getNodeParameter('resource', 0);
                        const operation = this.getNodeParameter('operation', 0);
                        const qs = {
                            sysparm_fields: 'sys_id,user_name',
                        };
                        if (resource === 'incident' && operation === 'create') {
                            const additionalFields = this.getNodeParameter('additionalFields');
                            const group = additionalFields.assignment_group;
                            const response = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_user_grmember', {}, {
                                sysparm_query: `group=${group}^`,
                            });
                            for (const column of response) {
                                if (column.user) {
                                    const responseData = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', `/now/table/sys_user/${column.user.value}`, {}, {});
                                    const user = responseData.result;
                                    returnData.push({
                                        name: user.user_name,
                                        value: user.sys_id,
                                    });
                                }
                            }
                        }
                        else {
                            const response = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_user', {}, qs);
                            for (const column of response) {
                                if (column.user_name) {
                                    returnData.push({
                                        name: column.user_name,
                                        value: column.sys_id,
                                    });
                                }
                            }
                        }
                        return (0, GenericFunctions_1.sortData)(returnData);
                    });
                },
                getAssignmentGroups() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            sysparm_fields: 'sys_id,name',
                        };
                        const response = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_user_group', {}, qs);
                        for (const column of response) {
                            if (column.name) {
                                returnData.push({
                                    name: column.name,
                                    value: column.sys_id,
                                });
                            }
                        }
                        return (0, GenericFunctions_1.sortData)(returnData);
                    });
                },
                getUserRoles() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            sysparm_fields: 'sys_id,name',
                        };
                        const response = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_user_role', {}, qs);
                        for (const column of response) {
                            if (column.name) {
                                returnData.push({
                                    name: column.name,
                                    value: column.sys_id,
                                });
                            }
                        }
                        return (0, GenericFunctions_1.sortData)(returnData);
                    });
                },
                getConfigurationItems() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            sysparm_fields: 'sys_id,name,sys_class_name',
                        };
                        const response = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/cmdb_ci', {}, qs);
                        for (const column of response) {
                            if (column.name) {
                                returnData.push({
                                    name: column.name,
                                    value: column.sys_id,
                                    description: column.sys_class_name,
                                });
                            }
                        }
                        return (0, GenericFunctions_1.sortData)(returnData);
                    });
                },
                getIncidentCategories() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            sysparm_fields: 'label,value',
                            sysparm_query: 'element=category^name=incident',
                        };
                        const response = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_choice', {}, qs);
                        for (const column of response) {
                            returnData.push({
                                name: column.label,
                                value: column.value,
                            });
                        }
                        return (0, GenericFunctions_1.sortData)(returnData);
                    });
                },
                getIncidentSubcategories() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const operation = this.getNodeParameter('operation');
                        let category;
                        if (operation === 'update') {
                            const updateFields = this.getNodeParameter('updateFields');
                            category = updateFields.category;
                        }
                        else {
                            const additionalFields = this.getNodeParameter('additionalFields');
                            category = additionalFields.category;
                        }
                        const qs = {
                            sysparm_fields: 'label,value',
                            sysparm_query: `name=incident^element=subcategory^dependent_value=${category}`,
                        };
                        const response = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_choice', {}, qs);
                        for (const column of response) {
                            returnData.push({
                                name: column.label,
                                value: column.value,
                            });
                        }
                        return (0, GenericFunctions_1.sortData)(returnData);
                    });
                },
                getIncidentStates() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            sysparm_fields: 'label,value',
                            sysparm_query: 'element=state^name=incident',
                        };
                        const response = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_choice', {}, qs);
                        for (const column of response) {
                            returnData.push({
                                name: column.label,
                                value: column.value,
                            });
                        }
                        return (0, GenericFunctions_1.sortData)(returnData);
                    });
                },
                getIncidentResolutionCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            sysparm_fields: 'label,value',
                            sysparm_query: 'element=close_code^name=incident',
                        };
                        const response = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_choice', {}, qs);
                        for (const column of response) {
                            returnData.push({
                                name: column.label,
                                value: column.value,
                            });
                        }
                        return (0, GenericFunctions_1.sortData)(returnData);
                    });
                },
                getIncidentHoldReasons() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            sysparm_fields: 'label,value',
                            sysparm_query: 'element=hold_reason^name=incident',
                        };
                        const response = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_choice', {}, qs);
                        for (const column of response) {
                            returnData.push({
                                name: column.label,
                                value: column.value,
                            });
                        }
                        return (0, GenericFunctions_1.sortData)(returnData);
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
            let responseData = {};
            let qs;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    // https://developer.servicenow.com/dev.do#!/reference/api/rome/rest/c_AttachmentAPI
                    if (resource === 'attachment') {
                        if (operation === 'get') {
                            const attachmentsSysId = this.getNodeParameter('attachmentId', i);
                            const download = this.getNodeParameter('download', i);
                            const endpoint = `/now/attachment/${attachmentsSysId}`;
                            const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', endpoint, {});
                            const fileMetadata = response.result;
                            responseData = {
                                json: fileMetadata,
                            };
                            if (download) {
                                const outputField = this.getNodeParameter('outputField', i);
                                responseData = Object.assign(Object.assign({}, responseData), { binary: {
                                        [outputField]: yield GenericFunctions_1.serviceNowDownloadAttachment.call(this, endpoint, fileMetadata.file_name, fileMetadata.content_type),
                                    } });
                            }
                        }
                        else if (operation === 'getAll') {
                            const download = this.getNodeParameter('download', i);
                            const tableName = this.getNodeParameter('tableName', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            qs = {};
                            qs.sysparm_query = `table_name=${tableName}`;
                            if (options.queryFilter) {
                                qs.sysparm_query = `${qs.sysparm_query}^${options.queryFilter}`;
                            }
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.sysparm_limit = limit;
                                const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', '/now/attachment', {}, qs);
                                responseData = response.result;
                            }
                            else {
                                responseData = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/attachment', {}, qs);
                            }
                            if (download) {
                                const outputField = this.getNodeParameter('outputField', i);
                                const responseDataWithAttachments = [];
                                for (const data of responseData) {
                                    responseDataWithAttachments.push({
                                        json: data,
                                        binary: {
                                            [outputField]: yield GenericFunctions_1.serviceNowDownloadAttachment.call(this, `/now/attachment/${data.sys_id}`, data.file_name, data.content_type),
                                        },
                                    });
                                }
                                responseData = responseDataWithAttachments;
                            }
                            else {
                                responseData = responseData.map(data => ({ json: data }));
                            }
                        }
                        else if (operation === 'upload') {
                            const tableName = this.getNodeParameter('tableName', i);
                            const recordId = this.getNodeParameter('id', i);
                            const inputDataFieldName = this.getNodeParameter('inputDataFieldName', i);
                            const options = this.getNodeParameter('options', i);
                            let binaryData;
                            if (items[i].binary && items[i].binary[inputDataFieldName]) {
                                binaryData = items[i].binary[inputDataFieldName];
                            }
                            else {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${inputDataFieldName}" does not exists on item!`);
                            }
                            const headers = {
                                'Content-Type': binaryData.mimeType,
                            };
                            const qs = Object.assign({ table_name: tableName, table_sys_id: recordId, file_name: binaryData.fileName ? binaryData.fileName : `${inputDataFieldName}.${binaryData.fileExtension}` }, options);
                            const body = yield this.helpers.getBinaryDataBuffer(i, inputDataFieldName);
                            const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'POST', '/now/attachment/file', body, qs, '', { headers });
                            responseData = response.result;
                        }
                        else if (operation === 'delete') {
                            const attachmentsSysId = this.getNodeParameter('attachmentId', i);
                            yield GenericFunctions_1.serviceNowApiRequest.call(this, 'DELETE', `/now/attachment/${attachmentsSysId}`);
                            responseData = { 'success': true };
                        }
                    }
                    else if (resource === 'businessService') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            qs = this.getNodeParameter('options', i);
                            if (qs.sysparm_fields && typeof qs.sysparm_fields !== 'string') {
                                qs.sysparm_fields = qs.sysparm_fields.join(',');
                            }
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.sysparm_limit = limit;
                                const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', '/now/table/cmdb_ci_service', {}, qs);
                                responseData = response.result;
                            }
                            else {
                                responseData = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/cmdb_ci_service', {}, qs);
                            }
                        }
                    }
                    else if (resource === 'configurationItems') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            qs = this.getNodeParameter('options', i);
                            if (qs.sysparm_fields && typeof qs.sysparm_fields !== 'string') {
                                qs.sysparm_fields = qs.sysparm_fields.join(',');
                            }
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.sysparm_limit = limit;
                                const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', '/now/table/cmdb_ci', {}, qs);
                                responseData = response.result;
                            }
                            else {
                                responseData = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/cmdb_ci', {}, qs);
                            }
                        }
                    }
                    else if (resource === 'department') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            qs = this.getNodeParameter('options', i);
                            if (qs.sysparm_fields && typeof qs.sysparm_fields !== 'string') {
                                qs.sysparm_fields = qs.sysparm_fields.join(',');
                            }
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.sysparm_limit = limit;
                                const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', '/now/table/cmn_department', {}, qs);
                                responseData = response.result;
                            }
                            else {
                                responseData = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/cmn_department', {}, qs);
                            }
                        }
                    }
                    else if (resource === 'dictionary') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            qs = this.getNodeParameter('options', i);
                            if (qs.sysparm_fields && typeof qs.sysparm_fields !== 'string') {
                                qs.sysparm_fields = qs.sysparm_fields.join(',');
                            }
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.sysparm_limit = limit;
                                const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', '/now/table/sys_dictionary', {}, qs);
                                responseData = response.result;
                            }
                            else {
                                responseData = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_dictionary', {}, qs);
                            }
                        }
                    }
                    else if (resource === 'incident') {
                        if (operation === 'create') {
                            const shortDescription = this.getNodeParameter('short_description', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = Object.assign({ short_description: shortDescription }, additionalFields);
                            const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'POST', `/now/table/incident`, body);
                            responseData = response.result;
                        }
                        else if (operation === 'delete') {
                            const id = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'DELETE', `/now/table/incident/${id}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            const id = this.getNodeParameter('id', i);
                            qs = this.getNodeParameter('options', i);
                            if (qs.sysparm_fields && typeof qs.sysparm_fields !== 'string') {
                                qs.sysparm_fields = qs.sysparm_fields.join(',');
                            }
                            const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', `/now/table/incident/${id}`, {}, qs);
                            responseData = response.result;
                        }
                        else if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            qs = this.getNodeParameter('options', i);
                            if (qs.sysparm_fields && typeof qs.sysparm_fields !== 'string') {
                                qs.sysparm_fields = qs.sysparm_fields.join(',');
                            }
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.sysparm_limit = limit;
                                const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', `/now/table/incident`, {}, qs);
                                responseData = response.result;
                            }
                            else {
                                responseData = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', `/now/table/incident`, {}, qs);
                            }
                        }
                        else if (operation === 'update') {
                            const id = this.getNodeParameter('id', i);
                            const body = this.getNodeParameter('updateFields', i);
                            const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'PATCH', `/now/table/incident/${id}`, body);
                            responseData = response.result;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'tableRecord') {
                        if (operation === 'create') {
                            const tableName = this.getNodeParameter('tableName', i);
                            const dataToSend = this.getNodeParameter('dataToSend', i);
                            let body = {};
                            if (dataToSend === 'mapInput') {
                                const inputsToIgnore = this.getNodeParameter('inputsToIgnore', i).split(',').map(field => field.trim());
                                body = Object.entries(items[i].json)
                                    .filter(([key]) => !inputsToIgnore.includes(key))
                                    .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {});
                            }
                            else if (dataToSend === 'columns') {
                                const fieldsToSend = this.getNodeParameter('fieldsToSend', i);
                                body = fieldsToSend.field.reduce((obj, field) => {
                                    obj[field.column] = field.value;
                                    return obj;
                                }, {});
                            }
                            const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'POST', `/now/table/${tableName}`, body);
                            responseData = response.result;
                        }
                        else if (operation === 'delete') {
                            const tableName = this.getNodeParameter('tableName', i);
                            const id = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'DELETE', `/now/table/${tableName}/${id}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            const tableName = this.getNodeParameter('tableName', i);
                            const id = this.getNodeParameter('id', i);
                            qs = this.getNodeParameter('options', i);
                            if (qs.sysparm_fields && typeof qs.sysparm_fields !== 'string') {
                                qs.sysparm_fields = qs.sysparm_fields.join(',');
                            }
                            const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', `/now/table/${tableName}/${id}`, {}, qs);
                            responseData = response.result;
                        }
                        else if (operation === 'getAll') {
                            const tableName = this.getNodeParameter('tableName', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            qs = this.getNodeParameter('options', i);
                            if (qs.sysparm_fields && typeof qs.sysparm_fields !== 'string') {
                                qs.sysparm_fields = qs.sysparm_fields.join(',');
                            }
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.sysparm_limit = limit;
                                const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', `/now/table/${tableName}`, {}, qs);
                                responseData = response.result;
                            }
                            else {
                                responseData = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', `/now/table/${tableName}`, {}, qs);
                            }
                        }
                        else if (operation === 'update') {
                            const tableName = this.getNodeParameter('tableName', i);
                            const id = this.getNodeParameter('id', i);
                            const dataToSend = this.getNodeParameter('dataToSend', i);
                            let body = {};
                            if (dataToSend === 'mapInput') {
                                const inputsToIgnore = this.getNodeParameter('inputsToIgnore', i).split(',').map(field => field.trim());
                                body = Object.entries(items[i].json)
                                    .filter(([key]) => !inputsToIgnore.includes(key))
                                    .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {});
                            }
                            else if (dataToSend === 'columns') {
                                const fieldsToSend = this.getNodeParameter('fieldsToSend', i);
                                body = fieldsToSend.field.reduce((obj, field) => {
                                    obj[field.column] = field.value;
                                    return obj;
                                }, {});
                            }
                            const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'PATCH', `/now/table/${tableName}/${id}`, body);
                            responseData = response.result;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'user') {
                        if (operation === 'create') {
                            const body = this.getNodeParameter('additionalFields', i);
                            const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'POST', '/now/table/sys_user', body);
                            responseData = response.result;
                        }
                        else if (operation === 'delete') {
                            const id = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'DELETE', `/now/table/sys_user/${id}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            const getOption = this.getNodeParameter('getOption', i);
                            qs = this.getNodeParameter('options', i);
                            if (qs.sysparm_fields && typeof qs.sysparm_fields !== 'string') {
                                qs.sysparm_fields = qs.sysparm_fields.join(',');
                            }
                            if (getOption === 'id') {
                                const id = this.getNodeParameter('id', i);
                                const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', `/now/table/sys_user/${id}`, {}, qs);
                                responseData = response.result;
                            }
                            else {
                                const userName = this.getNodeParameter('user_name', i);
                                qs.sysparm_query = `user_name=${userName}`;
                                qs.sysparm_limit = 1;
                                const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', '/now/table/sys_user', {}, qs);
                                responseData = response.result;
                            }
                        }
                        else if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            qs = this.getNodeParameter('options', i);
                            if (qs.sysparm_fields && typeof qs.sysparm_fields !== 'string') {
                                qs.sysparm_fields = qs.sysparm_fields.join(',');
                            }
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.sysparm_limit = limit;
                                const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', '/now/table/sys_user', {}, qs);
                                responseData = response.result;
                            }
                            else {
                                responseData = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_user', {}, qs);
                            }
                        }
                        else if (operation === 'update') {
                            const id = this.getNodeParameter('id', i);
                            const body = this.getNodeParameter('updateFields', i);
                            const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'PATCH', `/now/table/sys_user/${id}`, body);
                            responseData = response.result;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'userGroup') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            qs = this.getNodeParameter('options', i);
                            if (qs.sysparm_fields && typeof qs.sysparm_fields !== 'string') {
                                qs.sysparm_fields = qs.sysparm_fields.join(',');
                            }
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.sysparm_limit = limit;
                                const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', '/now/table/sys_user_group', {}, qs);
                                responseData = response.result;
                            }
                            else {
                                responseData = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_user_group', {}, qs);
                            }
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'userRole') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            qs = this.getNodeParameter('options', i);
                            if (qs.sysparm_fields && typeof qs.sysparm_fields !== 'string') {
                                qs.sysparm_fields = qs.sysparm_fields.join(',');
                            }
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                qs.sysparm_limit = limit;
                                const response = yield GenericFunctions_1.serviceNowApiRequest.call(this, 'GET', '/now/table/sys_user_role', {}, qs);
                                responseData = response.result;
                            }
                            else {
                                responseData = yield GenericFunctions_1.serviceNowRequestAllItems.call(this, 'GET', '/now/table/sys_user_role', {}, qs);
                            }
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
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
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            if (resource === 'attachment') {
                if (operation === 'get' || operation === 'getAll') {
                    return this.prepareOutputData(returnData);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.ServiceNow = ServiceNow;

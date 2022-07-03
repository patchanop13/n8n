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
exports.Baserow = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const OperationDescription_1 = require("./OperationDescription");
class Baserow {
    constructor() {
        this.description = {
            displayName: 'Baserow',
            name: 'baserow',
            icon: 'file:baserow.svg',
            group: ['output'],
            version: 1,
            description: 'Consume the Baserow API',
            subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
            defaults: {
                name: 'Baserow',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'baserowApi',
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
                            name: 'Row',
                            value: 'row',
                        },
                    ],
                    default: 'row',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'row',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a row',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete a row',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve a row',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Retrieve all rows',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update a row',
                        },
                    ],
                    default: 'getAll',
                },
                ...OperationDescription_1.operationFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getDatabaseIds() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('baserowApi');
                        const jwtToken = yield GenericFunctions_1.getJwtToken.call(this, credentials);
                        const endpoint = '/api/applications/';
                        const databases = yield GenericFunctions_1.baserowApiRequest.call(this, 'GET', endpoint, {}, {}, jwtToken);
                        return (0, GenericFunctions_1.toOptions)(databases);
                    });
                },
                getTableIds() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('baserowApi');
                        const jwtToken = yield GenericFunctions_1.getJwtToken.call(this, credentials);
                        const databaseId = this.getNodeParameter('databaseId', 0);
                        const endpoint = `/api/database/tables/database/${databaseId}`;
                        const tables = yield GenericFunctions_1.baserowApiRequest.call(this, 'GET', endpoint, {}, {}, jwtToken);
                        return (0, GenericFunctions_1.toOptions)(tables);
                    });
                },
                getTableFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('baserowApi');
                        const jwtToken = yield GenericFunctions_1.getJwtToken.call(this, credentials);
                        const tableId = this.getNodeParameter('tableId', 0);
                        const endpoint = `/api/database/fields/table/${tableId}/`;
                        const fields = yield GenericFunctions_1.baserowApiRequest.call(this, 'GET', endpoint, {}, {}, jwtToken);
                        return (0, GenericFunctions_1.toOptions)(fields);
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const mapper = new GenericFunctions_1.TableFieldMapper();
            const returnData = [];
            const operation = this.getNodeParameter('operation', 0);
            const tableId = this.getNodeParameter('tableId', 0);
            const credentials = yield this.getCredentials('baserowApi');
            const jwtToken = yield GenericFunctions_1.getJwtToken.call(this, credentials);
            const fields = yield mapper.getTableFields.call(this, tableId, jwtToken);
            mapper.createMappings(fields);
            for (let i = 0; i < items.length; i++) {
                try {
                    if (operation === 'getAll') {
                        // ----------------------------------
                        //             getAll
                        // ----------------------------------
                        // https://api.baserow.io/api/redoc/#operation/list_database_table_rows
                        const { order, filters, filterType, search } = this.getNodeParameter('additionalOptions', 0);
                        const qs = {};
                        if (order === null || order === void 0 ? void 0 : order.fields) {
                            qs['order_by'] = order.fields
                                .map(({ field, direction }) => `${direction}${mapper.setField(field)}`)
                                .join(',');
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.fields) {
                            filters.fields.forEach(({ field, operator, value }) => {
                                qs[`filter__field_${mapper.setField(field)}__${operator}`] = value;
                            });
                        }
                        if (filterType) {
                            qs.filter_type = filterType;
                        }
                        if (search) {
                            qs.search = search;
                        }
                        const endpoint = `/api/database/rows/table/${tableId}/`;
                        const rows = yield GenericFunctions_1.baserowApiRequestAllItems.call(this, 'GET', endpoint, {}, qs, jwtToken);
                        rows.forEach(row => mapper.idsToNames(row));
                        returnData.push(...rows);
                    }
                    else if (operation === 'get') {
                        // ----------------------------------
                        //             get
                        // ----------------------------------
                        // https://api.baserow.io/api/redoc/#operation/get_database_table_row
                        const rowId = this.getNodeParameter('rowId', i);
                        const endpoint = `/api/database/rows/table/${tableId}/${rowId}/`;
                        const row = yield GenericFunctions_1.baserowApiRequest.call(this, 'GET', endpoint, {}, {}, jwtToken);
                        mapper.idsToNames(row);
                        returnData.push(row);
                    }
                    else if (operation === 'create') {
                        // ----------------------------------
                        //             create
                        // ----------------------------------
                        // https://api.baserow.io/api/redoc/#operation/create_database_table_row
                        const body = {};
                        const dataToSend = this.getNodeParameter('dataToSend', 0);
                        if (dataToSend === 'autoMapInputData') {
                            const incomingKeys = Object.keys(items[i].json);
                            const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                            const inputDataToIgnore = rawInputsToIgnore.split(',').map(c => c.trim());
                            for (const key of incomingKeys) {
                                if (inputDataToIgnore.includes(key))
                                    continue;
                                body[key] = items[i].json[key];
                                mapper.namesToIds(body);
                            }
                        }
                        else {
                            const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                            for (const field of fields) {
                                body[`field_${field.fieldId}`] = field.fieldValue;
                            }
                        }
                        const endpoint = `/api/database/rows/table/${tableId}/`;
                        const createdRow = yield GenericFunctions_1.baserowApiRequest.call(this, 'POST', endpoint, body, {}, jwtToken);
                        mapper.idsToNames(createdRow);
                        returnData.push(createdRow);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------
                        //             update
                        // ----------------------------------
                        // https://api.baserow.io/api/redoc/#operation/update_database_table_row
                        const rowId = this.getNodeParameter('rowId', i);
                        const body = {};
                        const dataToSend = this.getNodeParameter('dataToSend', 0);
                        if (dataToSend === 'autoMapInputData') {
                            const incomingKeys = Object.keys(items[i].json);
                            const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                            const inputsToIgnore = rawInputsToIgnore.split(',').map(c => c.trim());
                            for (const key of incomingKeys) {
                                if (inputsToIgnore.includes(key))
                                    continue;
                                body[key] = items[i].json[key];
                                mapper.namesToIds(body);
                            }
                        }
                        else {
                            const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                            for (const field of fields) {
                                body[`field_${field.fieldId}`] = field.fieldValue;
                            }
                        }
                        const endpoint = `/api/database/rows/table/${tableId}/${rowId}/`;
                        const updatedRow = yield GenericFunctions_1.baserowApiRequest.call(this, 'PATCH', endpoint, body, {}, jwtToken);
                        mapper.idsToNames(updatedRow);
                        returnData.push(updatedRow);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------
                        //             delete
                        // ----------------------------------
                        // https://api.baserow.io/api/redoc/#operation/delete_database_table_row
                        const rowId = this.getNodeParameter('rowId', i);
                        const endpoint = `/api/database/rows/table/${tableId}/${rowId}/`;
                        yield GenericFunctions_1.baserowApiRequest.call(this, 'DELETE', endpoint, {}, {}, jwtToken);
                        returnData.push({ success: true });
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
exports.Baserow = Baserow;

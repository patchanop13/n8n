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
exports.SeaTable = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const RowDescription_1 = require("./RowDescription");
class SeaTable {
    constructor() {
        this.description = {
            displayName: 'SeaTable',
            name: 'seaTable',
            icon: 'file:seaTable.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Consume the SeaTable API',
            defaults: {
                name: 'SeaTable',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'seaTableApi',
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
                ...RowDescription_1.rowOperations,
                ...RowDescription_1.rowFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getTableNames() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { metadata: { tables } } = yield GenericFunctions_1.seaTableApiRequest.call(this, {}, 'GET', `/dtable-server/api/v1/dtables/{{dtable_uuid}}/metadata`);
                        for (const table of tables) {
                            returnData.push({
                                name: table.name,
                                value: table.name,
                            });
                        }
                        return returnData;
                    });
                },
                getTableIds() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { metadata: { tables } } = yield GenericFunctions_1.seaTableApiRequest.call(this, {}, 'GET', `/dtable-server/api/v1/dtables/{{dtable_uuid}}/metadata`);
                        for (const table of tables) {
                            returnData.push({
                                name: table.name,
                                value: table._id,
                            });
                        }
                        return returnData;
                    });
                },
                getTableUpdateAbleColumns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const tableName = this.getNodeParameter('tableName');
                        const columns = yield GenericFunctions_1.getTableColumns.call(this, tableName);
                        return columns.filter(column => column.editable).map(column => ({ name: column.name, value: column.name }));
                    });
                },
                getAllSortableColumns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const tableName = this.getNodeParameter('tableName');
                        const columns = yield GenericFunctions_1.getTableColumns.call(this, tableName);
                        return columns.filter(column => !['file', 'image', 'url', 'collaborator', 'long-text'].includes(column.type)).map(column => ({ name: column.name, value: column.name }));
                    });
                },
                getViews() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const tableName = this.getNodeParameter('tableName');
                        const views = yield GenericFunctions_1.getTableViews.call(this, tableName);
                        return views.map(view => ({ name: view.name, value: view.name }));
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const body = {};
            const qs = {};
            const ctx = {};
            if (resource === 'row') {
                if (operation === 'create') {
                    // ----------------------------------
                    //         row:create
                    // ----------------------------------
                    const tableName = this.getNodeParameter('tableName', 0);
                    const tableColumns = yield GenericFunctions_1.getTableColumns.call(this, tableName);
                    body.table_name = tableName;
                    const fieldsToSend = this.getNodeParameter('fieldsToSend', 0);
                    let rowInput = {};
                    for (let i = 0; i < items.length; i++) {
                        rowInput = {};
                        try {
                            if (fieldsToSend === 'autoMapInputData') {
                                const incomingKeys = Object.keys(items[i].json);
                                const inputDataToIgnore = (0, GenericFunctions_1.split)(this.getNodeParameter('inputsToIgnore', i, ''));
                                for (const key of incomingKeys) {
                                    if (inputDataToIgnore.includes(key))
                                        continue;
                                    rowInput[key] = items[i].json[key];
                                }
                            }
                            else {
                                const columns = this.getNodeParameter('columnsUi.columnValues', i, []);
                                for (const column of columns) {
                                    rowInput[column.columnName] = column.columnValue;
                                }
                            }
                            body.row = (0, GenericFunctions_1.rowExport)(rowInput, (0, GenericFunctions_1.updateAble)(tableColumns));
                            responseData = yield GenericFunctions_1.seaTableApiRequest.call(this, ctx, 'POST', `/dtable-server/api/v1/dtables/{{dtable_uuid}}/rows/`, body);
                            const { _id: insertId } = responseData;
                            if (insertId === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'SeaTable: No identity after appending row.');
                            }
                            const newRowInsertData = (0, GenericFunctions_1.rowMapKeyToName)(responseData, tableColumns);
                            qs.table_name = tableName;
                            qs.convert = true;
                            const newRow = yield GenericFunctions_1.seaTableApiRequest.call(this, ctx, 'GET', `/dtable-server/api/v1/dtables/{{dtable_uuid}}/rows/${encodeURIComponent(insertId)}/`, body, qs);
                            if (newRow._id === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'SeaTable: No identity for appended row.');
                            }
                            const row = (0, GenericFunctions_1.rowFormatColumns)(Object.assign(Object.assign({}, newRowInsertData), newRow), tableColumns.map(({ name }) => name).concat(['_id', '_ctime', '_mtime']));
                            returnData.push(row);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
                else if (operation === 'get') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const tableId = this.getNodeParameter('tableId', 0);
                            const rowId = this.getNodeParameter('rowId', i);
                            const response = yield GenericFunctions_1.seaTableApiRequest.call(this, ctx, 'GET', `/dtable-server/api/v1/dtables/{{dtable_uuid}}/rows/${rowId}`, {}, { table_id: tableId, convert: true });
                            returnData.push(response);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
                else if (operation === 'getAll') {
                    // ----------------------------------
                    //         row:getAll
                    // ----------------------------------
                    const tableName = this.getNodeParameter('tableName', 0);
                    const tableColumns = yield GenericFunctions_1.getTableColumns.call(this, tableName);
                    try {
                        for (let i = 0; i < items.length; i++) {
                            const endpoint = `/dtable-server/api/v1/dtables/{{dtable_uuid}}/rows/`;
                            qs.table_name = tableName;
                            const filters = this.getNodeParameter('filters', i);
                            const options = this.getNodeParameter('options', i);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            Object.assign(qs, filters, options);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.setableApiRequestAllItems.call(this, ctx, 'rows', 'GET', endpoint, body, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.seaTableApiRequest.call(this, ctx, 'GET', endpoint, body, qs);
                                responseData = responseData.rows;
                            }
                            const rows = responseData.map((row) => (0, GenericFunctions_1.rowFormatColumns)(Object.assign({}, row), tableColumns.map(({ name }) => name).concat(['_id', '_ctime', '_mtime'])));
                            returnData.push(...rows);
                        }
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.message });
                        }
                        throw error;
                    }
                }
                else if (operation === 'delete') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const tableName = this.getNodeParameter('tableName', 0);
                            const rowId = this.getNodeParameter('rowId', i);
                            const body = {
                                table_name: tableName,
                                row_id: rowId,
                            };
                            const response = yield GenericFunctions_1.seaTableApiRequest.call(this, ctx, 'DELETE', `/dtable-server/api/v1/dtables/{{dtable_uuid}}/rows/`, body, qs);
                            returnData.push(response);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
                else if (operation === 'update') {
                    // ----------------------------------
                    //         row:update
                    // ----------------------------------
                    const tableName = this.getNodeParameter('tableName', 0);
                    const tableColumns = yield GenericFunctions_1.getTableColumns.call(this, tableName);
                    body.table_name = tableName;
                    const fieldsToSend = this.getNodeParameter('fieldsToSend', 0);
                    let rowInput = {};
                    for (let i = 0; i < items.length; i++) {
                        const rowId = this.getNodeParameter('rowId', i);
                        rowInput = {};
                        try {
                            if (fieldsToSend === 'autoMapInputData') {
                                const incomingKeys = Object.keys(items[i].json);
                                const inputDataToIgnore = (0, GenericFunctions_1.split)(this.getNodeParameter('inputsToIgnore', i, ''));
                                for (const key of incomingKeys) {
                                    if (inputDataToIgnore.includes(key))
                                        continue;
                                    rowInput[key] = items[i].json[key];
                                }
                            }
                            else {
                                const columns = this.getNodeParameter('columnsUi.columnValues', i, []);
                                for (const column of columns) {
                                    rowInput[column.columnName] = column.columnValue;
                                }
                            }
                            body.row = (0, GenericFunctions_1.rowExport)(rowInput, (0, GenericFunctions_1.updateAble)(tableColumns));
                            body.table_name = tableName;
                            body.row_id = rowId;
                            responseData = yield GenericFunctions_1.seaTableApiRequest.call(this, ctx, 'PUT', `/dtable-server/api/v1/dtables/{{dtable_uuid}}/rows/`, body);
                            returnData.push(Object.assign({ _id: rowId }, responseData));
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.SeaTable = SeaTable;

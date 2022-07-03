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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftSql = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../utils/utilities");
const mssql_1 = __importDefault(require("mssql"));
const GenericFunctions_1 = require("./GenericFunctions");
class MicrosoftSql {
    constructor() {
        this.description = {
            displayName: 'Microsoft SQL',
            name: 'microsoftSql',
            icon: 'file:mssql.svg',
            group: ['input'],
            version: 1,
            description: 'Get, add and update data in Microsoft SQL',
            defaults: {
                name: 'Microsoft SQL',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'microsoftSql',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Execute Query',
                            value: 'executeQuery',
                            description: 'Execute an SQL query',
                        },
                        {
                            name: 'Insert',
                            value: 'insert',
                            description: 'Insert rows in database',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update rows in database',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete rows in database',
                        },
                    ],
                    default: 'insert',
                },
                // ----------------------------------
                //         executeQuery
                // ----------------------------------
                {
                    displayName: 'Query',
                    name: 'query',
                    type: 'string',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    displayOptions: {
                        show: {
                            operation: ['executeQuery'],
                        },
                    },
                    default: '',
                    // eslint-disable-next-line n8n-nodes-base/node-param-placeholder-miscased-id
                    placeholder: 'SELECT id, name FROM product WHERE id < 40',
                    required: true,
                    description: 'The SQL query to execute',
                },
                // ----------------------------------
                //         insert
                // ----------------------------------
                {
                    displayName: 'Table',
                    name: 'table',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['insert'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Name of the table in which to insert data to',
                },
                {
                    displayName: 'Columns',
                    name: 'columns',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['insert'],
                        },
                    },
                    default: '',
                    // eslint-disable-next-line n8n-nodes-base/node-param-placeholder-miscased-id
                    placeholder: 'id,name,description',
                    description: 'Comma-separated list of the properties which should used as columns for the new rows',
                },
                // ----------------------------------
                //         update
                // ----------------------------------
                {
                    displayName: 'Table',
                    name: 'table',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['update'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Name of the table in which to update data in',
                },
                {
                    displayName: 'Update Key',
                    name: 'updateKey',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['update'],
                        },
                    },
                    default: 'id',
                    required: true,
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-id
                    description: 'Name of the property which decides which rows in the database should be updated. Normally that would be "id".',
                },
                {
                    displayName: 'Columns',
                    name: 'columns',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['update'],
                        },
                    },
                    default: '',
                    placeholder: 'name,description',
                    description: 'Comma-separated list of the properties which should used as columns for rows to update',
                },
                // ----------------------------------
                //         delete
                // ----------------------------------
                {
                    displayName: 'Table',
                    name: 'table',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['delete'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Name of the table in which to delete data',
                },
                {
                    displayName: 'Delete Key',
                    name: 'deleteKey',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['delete'],
                        },
                    },
                    default: 'id',
                    required: true,
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-id
                    description: 'Name of the property which decides which rows in the database should be deleted. Normally that would be "id".',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getCredentials('microsoftSql');
            const config = {
                server: credentials.server,
                port: credentials.port,
                database: credentials.database,
                user: credentials.user,
                password: credentials.password,
                domain: credentials.domain ? credentials.domain : undefined,
                connectionTimeout: credentials.connectTimeout,
                requestTimeout: credentials.requestTimeout,
                options: {
                    encrypt: credentials.tls,
                    enableArithAbort: false,
                },
            };
            const pool = new mssql_1.default.ConnectionPool(config);
            yield pool.connect();
            let returnItems = [];
            const items = this.getInputData();
            const operation = this.getNodeParameter('operation', 0);
            try {
                if (operation === 'executeQuery') {
                    // ----------------------------------
                    //         executeQuery
                    // ----------------------------------
                    const rawQuery = this.getNodeParameter('query', 0);
                    const queryResult = yield pool.request().query(rawQuery);
                    const result = queryResult.recordsets.length > 1
                        ? (0, utilities_1.flatten)(queryResult.recordsets)
                        : queryResult.recordsets[0];
                    returnItems = this.helpers.returnJsonArray(result);
                }
                else if (operation === 'insert') {
                    // ----------------------------------
                    //         insert
                    // ----------------------------------
                    const tables = (0, GenericFunctions_1.createTableStruct)(this.getNodeParameter, items);
                    yield (0, GenericFunctions_1.executeQueryQueue)(tables, ({ table, columnString, items, }) => {
                        return (0, utilities_1.chunk)(items, 1000).map(insertValues => {
                            const values = insertValues
                                .map((item) => (0, GenericFunctions_1.extractValues)(item))
                                .join(',');
                            return pool
                                .request()
                                .query(`INSERT INTO ${table}(${(0, GenericFunctions_1.formatColumns)(columnString)}) VALUES ${values};`);
                        });
                    });
                    returnItems = items;
                }
                else if (operation === 'update') {
                    // ----------------------------------
                    //         update
                    // ----------------------------------
                    const updateKeys = items.map((item, index) => this.getNodeParameter('updateKey', index));
                    const tables = (0, GenericFunctions_1.createTableStruct)(this.getNodeParameter, items, ['updateKey'].concat(updateKeys), 'updateKey');
                    yield (0, GenericFunctions_1.executeQueryQueue)(tables, ({ table, columnString, items, }) => {
                        return items.map(item => {
                            const columns = columnString
                                .split(',')
                                .map(column => column.trim());
                            const setValues = (0, GenericFunctions_1.extractUpdateSet)(item, columns);
                            const condition = (0, GenericFunctions_1.extractUpdateCondition)(item, item.updateKey);
                            return pool
                                .request()
                                .query(`UPDATE ${table} SET ${setValues} WHERE ${condition};`);
                        });
                    });
                    returnItems = items;
                }
                else if (operation === 'delete') {
                    // ----------------------------------
                    //         delete
                    // ----------------------------------
                    const tables = items.reduce((tables, item, index) => {
                        const table = this.getNodeParameter('table', index);
                        const deleteKey = this.getNodeParameter('deleteKey', index);
                        if (tables[table] === undefined) {
                            tables[table] = {};
                        }
                        if (tables[table][deleteKey] === undefined) {
                            tables[table][deleteKey] = [];
                        }
                        tables[table][deleteKey].push(item);
                        return tables;
                    }, {});
                    const queriesResults = yield Promise.all(Object.keys(tables).map(table => {
                        const deleteKeyResults = Object.keys(tables[table]).map(deleteKey => {
                            const deleteItemsList = (0, utilities_1.chunk)(tables[table][deleteKey].map(item => (0, GenericFunctions_1.copyInputItem)(item, [deleteKey])), 1000);
                            const queryQueue = deleteItemsList.map(deleteValues => {
                                return pool
                                    .request()
                                    .query(`DELETE FROM ${table} WHERE "${deleteKey}" IN ${(0, GenericFunctions_1.extractDeleteValues)(deleteValues, deleteKey)};`);
                            });
                            return Promise.all(queryQueue);
                        });
                        return Promise.all(deleteKeyResults);
                    }));
                    const rowsDeleted = (0, utilities_1.flatten)(queriesResults).reduce((acc, resp) => (acc += resp.rowsAffected.reduce((sum, val) => (sum += val))), 0);
                    returnItems = this.helpers.returnJsonArray({
                        rowsDeleted,
                    });
                }
                else {
                    yield pool.close();
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
                }
            }
            catch (error) {
                if (this.continueOnFail() === true) {
                    returnItems = items;
                }
                else {
                    yield pool.close();
                    throw error;
                }
            }
            // Close the connection
            yield pool.close();
            return this.prepareOutputData(returnItems);
        });
    }
}
exports.MicrosoftSql = MicrosoftSql;

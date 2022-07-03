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
exports.Snowflake = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const snowflake_sdk_1 = __importDefault(require("snowflake-sdk"));
class Snowflake {
    constructor() {
        this.description = {
            displayName: 'Snowflake',
            name: 'snowflake',
            icon: 'file:snowflake.svg',
            group: ['input'],
            version: 1,
            description: 'Get, add and update data in Snowflake',
            defaults: {
                name: 'Snowflake',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'snowflake',
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
                            operation: [
                                'executeQuery',
                            ],
                        },
                    },
                    default: '',
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
                            operation: [
                                'insert',
                            ],
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
                            operation: [
                                'insert',
                            ],
                        },
                    },
                    default: '',
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
                            operation: [
                                'update',
                            ],
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
                            operation: [
                                'update',
                            ],
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
                            operation: [
                                'update',
                            ],
                        },
                    },
                    default: '',
                    placeholder: 'name,description',
                    description: 'Comma-separated list of the properties which should used as columns for rows to update',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getCredentials('snowflake');
            const returnData = [];
            let responseData;
            const connection = snowflake_sdk_1.default.createConnection(credentials);
            yield (0, GenericFunctions_1.connect)(connection);
            const items = this.getInputData();
            const operation = this.getNodeParameter('operation', 0);
            if (operation === 'executeQuery') {
                // ----------------------------------
                //         executeQuery
                // ----------------------------------
                for (let i = 0; i < items.length; i++) {
                    const query = this.getNodeParameter('query', i);
                    responseData = yield (0, GenericFunctions_1.execute)(connection, query, []);
                    returnData.push.apply(returnData, responseData);
                }
            }
            if (operation === 'insert') {
                // ----------------------------------
                //         insert
                // ----------------------------------
                const table = this.getNodeParameter('table', 0);
                const columnString = this.getNodeParameter('columns', 0);
                const columns = columnString.split(',').map(column => column.trim());
                const query = `INSERT INTO ${table}(${columns.join(',')}) VALUES (${columns.map(column => '?').join(',')})`;
                const data = (0, GenericFunctions_1.copyInputItems)(items, columns);
                const binds = data.map((element => Object.values(element)));
                yield (0, GenericFunctions_1.execute)(connection, query, binds);
                returnData.push.apply(returnData, data);
            }
            if (operation === 'update') {
                // ----------------------------------
                //         update
                // ----------------------------------
                const table = this.getNodeParameter('table', 0);
                const updateKey = this.getNodeParameter('updateKey', 0);
                const columnString = this.getNodeParameter('columns', 0);
                const columns = columnString.split(',').map(column => column.trim());
                if (!columns.includes(updateKey)) {
                    columns.unshift(updateKey);
                }
                const query = `UPDATE ${table} SET ${columns.map(column => `${column} = ?`).join(',')} WHERE ${updateKey} = ?;`;
                const data = (0, GenericFunctions_1.copyInputItems)(items, columns);
                const binds = data.map((element => Object.values(element).concat(element[updateKey])));
                for (let i = 0; i < binds.length; i++) {
                    yield (0, GenericFunctions_1.execute)(connection, query, binds[i]);
                }
                returnData.push.apply(returnData, data);
            }
            yield (0, GenericFunctions_1.destroy)(connection);
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Snowflake = Snowflake;

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
exports.CrateDb = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const Postgres_node_functions_1 = require("../Postgres/Postgres.node.functions");
const pg_promise_1 = __importDefault(require("pg-promise"));
class CrateDb {
    constructor() {
        this.description = {
            displayName: 'CrateDB',
            name: 'crateDb',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:cratedb.png',
            group: ['input'],
            version: 1,
            description: 'Add and update data in CrateDB',
            defaults: {
                name: 'CrateDB',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'crateDb',
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
                            operation: ['executeQuery'],
                        },
                    },
                    default: '',
                    placeholder: 'SELECT id, name FROM product WHERE quantity > $1 AND price <= $2',
                    required: true,
                    description: 'The SQL query to execute. You can use n8n expressions or $1 and $2 in conjunction with query parameters.',
                },
                // ----------------------------------
                //         insert
                // ----------------------------------
                {
                    displayName: 'Schema',
                    name: 'schema',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['insert'],
                        },
                    },
                    default: 'doc',
                    required: true,
                    description: 'Name of the schema the table belongs to',
                },
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
                    placeholder: 'id,name,description',
                    description: 'Comma-separated list of the properties which should used as columns for the new rows',
                },
                // ----------------------------------
                //         update
                // ----------------------------------
                {
                    displayName: 'Schema',
                    name: 'schema',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['update'],
                        },
                    },
                    default: 'doc',
                    required: true,
                    description: 'Name of the schema the table belongs to',
                },
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
                    description: 'Comma-separated list of the properties which decides which rows in the database should be updated. Normally that would be "id".',
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
                //         insert,update
                // ----------------------------------
                {
                    displayName: 'Return Fields',
                    name: 'returnFields',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['insert', 'update'],
                        },
                    },
                    default: '*',
                    description: 'Comma-separated list of the fields that the operation will return',
                },
                // ----------------------------------
                //         additional fields
                // ----------------------------------
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    options: [
                        {
                            displayName: 'Mode',
                            name: 'mode',
                            type: 'options',
                            options: [
                                {
                                    name: 'Independently',
                                    value: 'independently',
                                    description: 'Execute each query independently',
                                },
                                {
                                    name: 'Multiple Queries',
                                    value: 'multiple',
                                    description: '<b>Default</b>. Sends multiple queries at once to database.',
                                },
                            ],
                            default: 'multiple',
                            description: 'The way queries should be sent to database. Can be used in conjunction with <b>Continue on Fail</b>. See <a href="https://docs.n8n.io/nodes/n8n-nodes-base.crateDb/">the docs</a> for more examples.',
                        },
                        {
                            displayName: 'Query Parameters',
                            name: 'queryParams',
                            type: 'string',
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'executeQuery',
                                    ],
                                },
                            },
                            default: '',
                            placeholder: 'quantity,price',
                            description: 'Comma-separated list of properties which should be used as query parameters',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getCredentials('crateDb');
            const pgp = (0, pg_promise_1.default)();
            const config = {
                host: credentials.host,
                port: credentials.port,
                database: credentials.database,
                user: credentials.user,
                password: credentials.password,
                ssl: !['disable', undefined].includes(credentials.ssl),
                sslmode: credentials.ssl || 'disable',
            };
            const db = pgp(config);
            let returnItems = [];
            const items = this.getInputData();
            const operation = this.getNodeParameter('operation', 0);
            if (operation === 'executeQuery') {
                // ----------------------------------
                //         executeQuery
                // ----------------------------------
                const queryResult = yield (0, Postgres_node_functions_1.pgQuery)(this.getNodeParameter, pgp, db, items, this.continueOnFail());
                returnItems = this.helpers.returnJsonArray(queryResult);
            }
            else if (operation === 'insert') {
                // ----------------------------------
                //         insert
                // ----------------------------------
                const insertData = yield (0, Postgres_node_functions_1.pgInsert)(this.getNodeParameter, pgp, db, items, this.continueOnFail());
                for (let i = 0; i < insertData.length; i++) {
                    returnItems.push({
                        json: insertData[i],
                    });
                }
            }
            else if (operation === 'update') {
                // ----------------------------------
                //         update
                // ----------------------------------
                const additionalFields = this.getNodeParameter('additionalFields', 0);
                const mode = (_a = additionalFields.mode) !== null && _a !== void 0 ? _a : 'multiple';
                if (mode === 'independently') {
                    const updateItems = yield (0, Postgres_node_functions_1.pgUpdate)(this.getNodeParameter, pgp, db, items, this.continueOnFail());
                    returnItems = this.helpers.returnJsonArray(updateItems);
                }
                else if (mode === 'multiple') {
                    // Crate db does not support multiple-update queries
                    // Therefore we cannot invoke `pgUpdate` using multiple mode
                    // so we have to call multiple updates manually here
                    const table = this.getNodeParameter('table', 0);
                    const schema = this.getNodeParameter('schema', 0);
                    const updateKeys = this.getNodeParameter('updateKey', 0).split(',').map(column => column.trim());
                    const columns = this.getNodeParameter('columns', 0).split(',').map(column => column.trim());
                    const queryColumns = columns.slice();
                    updateKeys.forEach(updateKey => {
                        if (!queryColumns.includes(updateKey)) {
                            columns.unshift(updateKey);
                            queryColumns.unshift('?' + updateKey);
                        }
                    });
                    const cs = new pgp.helpers.ColumnSet(queryColumns, { table: { table, schema } });
                    const where = ' WHERE ' + updateKeys.map(updateKey => pgp.as.name(updateKey) + ' = ${' + updateKey + '}').join(' AND ');
                    // updateKeyValue = item.json[updateKey] as string | number;
                    // if (updateKeyValue === undefined) {
                    // 	throw new NodeOperationError(this.getNode(), 'No value found for update key!');
                    // }
                    const returning = (0, Postgres_node_functions_1.generateReturning)(pgp, this.getNodeParameter('returnFields', 0));
                    const queries = [];
                    for (let i = 0; i < items.length; i++) {
                        const itemCopy = (0, Postgres_node_functions_1.getItemCopy)(items[i], columns);
                        queries.push(pgp.helpers.update(itemCopy, cs) + pgp.as.format(where, itemCopy) + returning);
                    }
                    const updateItems = yield db.multi(pgp.helpers.concat(queries));
                    returnItems = this.helpers.returnJsonArray((0, Postgres_node_functions_1.getItemsCopy)(items, columns));
                }
            }
            else {
                yield pgp.end();
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
            }
            // Close the connection
            yield pgp.end();
            return this.prepareOutputData(returnItems);
        });
    }
}
exports.CrateDb = CrateDb;

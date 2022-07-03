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
exports.Postgres = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const pg_promise_1 = __importDefault(require("pg-promise"));
const Postgres_node_functions_1 = require("./Postgres.node.functions");
class Postgres {
    constructor() {
        this.description = {
            displayName: 'Postgres',
            name: 'postgres',
            icon: 'file:postgres.svg',
            group: ['input'],
            version: 1,
            description: 'Get, add and update data in Postgres',
            defaults: {
                name: 'Postgres',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'postgres',
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
                    default: 'public',
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
                    // eslint-disable-next-line n8n-nodes-base/node-param-placeholder-miscased-id
                    placeholder: 'id:int,name:text,description',
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-id
                    description: 'Comma-separated list of the properties which should used as columns for the new rows. You can use type casting with colons (:) like id:int.',
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
                    default: 'public',
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
                    placeholder: 'name:text,description',
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-id
                    description: 'Comma-separated list of the properties which should used as columns for rows to update. You can use type casting with colons (:) like id:int.',
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
                //         Additional fields
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
                                {
                                    name: 'Transaction',
                                    value: 'transaction',
                                    description: 'Executes all queries in a single transaction',
                                },
                            ],
                            default: 'multiple',
                            description: 'The way queries should be sent to database. Can be used in conjunction with <b>Continue on Fail</b>. See <a href="https://docs.n8n.io/nodes/n8n-nodes-base.postgres/">the docs</a> for more examples',
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
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getCredentials('postgres');
            const pgp = (0, pg_promise_1.default)();
            const config = {
                host: credentials.host,
                port: credentials.port,
                database: credentials.database,
                user: credentials.user,
                password: credentials.password,
            };
            if (credentials.allowUnauthorizedCerts === true) {
                config.ssl = {
                    rejectUnauthorized: false,
                };
            }
            else {
                config.ssl = !['disable', undefined].includes(credentials.ssl);
                config.sslmode = credentials.ssl || 'disable';
            }
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
                const updateItems = yield (0, Postgres_node_functions_1.pgUpdate)(this.getNodeParameter, pgp, db, items, this.continueOnFail());
                returnItems = this.helpers.returnJsonArray(updateItems);
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
exports.Postgres = Postgres;

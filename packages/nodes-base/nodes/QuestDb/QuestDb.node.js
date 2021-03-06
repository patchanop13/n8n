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
exports.QuestDb = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const pg_promise_1 = __importDefault(require("pg-promise"));
const Postgres_node_functions_1 = require("../Postgres/Postgres.node.functions");
class QuestDb {
    constructor() {
        this.description = {
            displayName: 'QuestDB',
            name: 'questDb',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:questdb.png',
            group: ['input'],
            version: 1,
            description: 'Get, add and update data in QuestDB',
            defaults: {
                name: 'QuestDB',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'questDb',
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
                            description: 'Executes a SQL query',
                        },
                        {
                            name: 'Insert',
                            value: 'insert',
                            description: 'Insert rows in database',
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
                    type: 'hidden',
                    displayOptions: {
                        show: {
                            operation: [
                                'insert',
                            ],
                        },
                    },
                    default: '',
                    description: 'Name of the schema the table belongs to',
                },
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
                            operation: ['insert'],
                        },
                    },
                    default: '',
                    placeholder: 'id,name,description',
                    description: 'Comma-separated list of the properties which should used as columns for the new rows',
                },
                {
                    displayName: 'Return Fields',
                    name: 'returnFields',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['insert'],
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
                    displayOptions: {
                        show: {
                            operation: [
                                'executeQuery',
                            ],
                        },
                    },
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
                                    name: 'Transaction',
                                    value: 'transaction',
                                    description: 'Executes all queries in a single transaction',
                                },
                            ],
                            default: 'independently',
                            description: 'The way queries should be sent to database. Can be used in conjunction with <b>Continue on Fail</b>. See <a href="https://docs.n8n.io/nodes/n8n-nodes-base.questDb/">the docs</a> for more examples.',
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
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'hidden',
                    default: {},
                    displayOptions: {
                        show: {
                            operation: [
                                'insert',
                            ],
                        },
                    },
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getCredentials('questDb');
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
                const additionalFields = this.getNodeParameter('additionalFields', 0);
                const mode = (additionalFields.mode || 'independently');
                const queryResult = yield (0, Postgres_node_functions_1.pgQuery)(this.getNodeParameter, pgp, db, items, this.continueOnFail(), mode);
                returnItems = this.helpers.returnJsonArray(queryResult);
            }
            else if (operation === 'insert') {
                // ----------------------------------
                //         insert
                // ----------------------------------
                // Transaction and multiple won't work properly with QuestDB.
                // So we send queries independently.
                yield (0, Postgres_node_functions_1.pgInsert)(this.getNodeParameter, pgp, db, items, this.continueOnFail(), 'independently');
                const returnFields = this.getNodeParameter('returnFields', 0);
                const table = this.getNodeParameter('table', 0);
                const insertData = yield db.any('SELECT ${columns:name} from ${table:name}', {
                    columns: returnFields.split(',').map(value => value.trim()).filter(value => !!value),
                    table,
                });
                returnItems = this.helpers.returnJsonArray(insertData);
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
exports.QuestDb = QuestDb;

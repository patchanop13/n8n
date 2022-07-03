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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMySqlOptions = exports.getBootstrapMySqlOptions = exports.getPostgresOptions = exports.getBootstrapPostgresOptions = exports.getSqliteOptions = exports.createWorkflowWithTrigger = exports.createWorkflow = exports.createManyWorkflows = exports.createTag = exports.createWaitingExecution = exports.createErrorExecution = exports.createSuccessfulExecution = exports.createExecution = exports.createManyExecutions = exports.getAllRoles = exports.getCredentialOwnerRole = exports.getWorkflowOwnerRole = exports.getGlobalMemberRole = exports.getGlobalOwnerRole = exports.addApiKey = exports.createUserShell = exports.createUser = exports.saveCredential = exports.truncate = exports.terminate = exports.init = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const typeorm_1 = require("typeorm");
const n8n_core_1 = require("n8n-core");
const config_1 = __importDefault(require("../../../config"));
const constants_1 = require("./constants");
const src_1 = require("../../../src");
const random_1 = require("./random");
const CredentialsEntity_1 = require("../../../src/databases/entities/CredentialsEntity");
const UserManagementHelper_1 = require("../../../src/UserManagement/UserManagementHelper");
const entities_1 = require("../../../src/databases/entities");
const mysqldb_1 = require("../../../src/databases/migrations/mysqldb");
const postgresdb_1 = require("../../../src/databases/migrations/postgresdb");
const sqlite_1 = require("../../../src/databases/migrations/sqlite");
const utils_1 = require("./utils");
const CredentialsHelper_1 = require("../../../src/CredentialsHelper");
const exec = (0, util_1.promisify)(child_process_1.exec);
/**
 * Initialize one test DB per suite run, with bootstrap connection if needed.
 */
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbType = config_1.default.getEnv('database.type');
        if (dbType === 'sqlite') {
            jest.setTimeout(constants_1.DB_INITIALIZATION_TIMEOUT);
            // no bootstrap connection required
            const testDbName = `n8n_test_sqlite_${(0, random_1.randomString)(6, 10)}_${Date.now()}`;
            yield src_1.Db.init((0, exports.getSqliteOptions)({ name: testDbName }));
            yield (0, typeorm_1.getConnection)(testDbName).runMigrations({ transaction: 'none' });
            return { testDbName };
        }
        if (dbType === 'postgresdb') {
            jest.setTimeout(constants_1.DB_INITIALIZATION_TIMEOUT);
            let bootstrapPostgres;
            const pgOptions = (0, exports.getBootstrapPostgresOptions)();
            try {
                bootstrapPostgres = yield (0, typeorm_1.createConnection)(pgOptions);
            }
            catch (error) {
                const pgConfig = (0, utils_1.getPostgresSchemaSection)();
                if (!pgConfig)
                    throw new Error("Failed to find config schema section for 'postgresdb'");
                const message = [
                    "ERROR: Failed to connect to Postgres default DB 'postgres'",
                    'Please review your Postgres connection options:',
                    `host: ${pgOptions.host} | port: ${pgOptions.port} | schema: ${pgOptions.schema} | username: ${pgOptions.username} | password: ${pgOptions.password}`,
                    'Fix by setting correct values via environment variables:',
                    `${pgConfig.host.env} | ${pgConfig.port.env} | ${pgConfig.schema.env} | ${pgConfig.user.env} | ${pgConfig.password.env}`,
                    'Otherwise, make sure your Postgres server is running.',
                ].join('\n');
                console.error(message);
                process.exit(1);
            }
            const testDbName = `pg_${(0, random_1.randomString)(6, 10)}_${Date.now()}_n8n_test`;
            yield bootstrapPostgres.query(`CREATE DATABASE ${testDbName};`);
            try {
                const schema = config_1.default.getEnv('database.postgresdb.schema');
                yield exec(`psql -d ${testDbName} -c "CREATE SCHEMA IF NOT EXISTS ${schema}";`);
            }
            catch (error) {
                if (error instanceof Error && error.message.includes('command not found')) {
                    console.error('psql command not found. Make sure psql is installed and added to your PATH.');
                }
                process.exit(1);
            }
            yield src_1.Db.init((0, exports.getPostgresOptions)({ name: testDbName }));
            return { testDbName };
        }
        if (dbType === 'mysqldb') {
            // initialization timeout in test/setup.ts
            const bootstrapMysql = yield (0, typeorm_1.createConnection)((0, exports.getBootstrapMySqlOptions)());
            const testDbName = `mysql_${(0, random_1.randomString)(6, 10)}_${Date.now()}_n8n_test`;
            yield bootstrapMysql.query(`CREATE DATABASE ${testDbName};`);
            yield src_1.Db.init((0, exports.getMySqlOptions)({ name: testDbName }));
            return { testDbName };
        }
        throw new Error(`Unrecognized DB type: ${dbType}`);
    });
}
exports.init = init;
/**
 * Drop test DB, closing bootstrap connection if existing.
 */
function terminate(testDbName) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbType = config_1.default.getEnv('database.type');
        if (dbType === 'sqlite') {
            yield (0, typeorm_1.getConnection)(testDbName).close();
        }
        if (dbType === 'postgresdb') {
            yield (0, typeorm_1.getConnection)(testDbName).close();
            const bootstrapPostgres = (0, typeorm_1.getConnection)(constants_1.BOOTSTRAP_POSTGRES_CONNECTION_NAME);
            yield bootstrapPostgres.query(`DROP DATABASE ${testDbName}`);
            yield bootstrapPostgres.close();
        }
        if (dbType === 'mysqldb') {
            yield (0, typeorm_1.getConnection)(testDbName).close();
            const bootstrapMySql = (0, typeorm_1.getConnection)(constants_1.BOOTSTRAP_MYSQL_CONNECTION_NAME);
            yield bootstrapMySql.query(`DROP DATABASE ${testDbName}`);
            yield bootstrapMySql.close();
        }
    });
}
exports.terminate = terminate;
function truncateMappingTables(dbType, collections, testDb) {
    return __awaiter(this, void 0, void 0, function* () {
        const mappingTables = collections.reduce((acc, collection) => {
            const found = constants_1.MAPPING_TABLES_TO_CLEAR[collection];
            if (found)
                acc.push(...found);
            return acc;
        }, []);
        if (dbType === 'sqlite') {
            const promises = mappingTables.map((tableName) => testDb.query(`DELETE FROM ${tableName}; DELETE FROM sqlite_sequence WHERE name=${tableName};`));
            return Promise.all(promises);
        }
        if (dbType === 'postgresdb') {
            const schema = config_1.default.getEnv('database.postgresdb.schema');
            // `TRUNCATE` in postgres cannot be parallelized
            for (const tableName of mappingTables) {
                const fullTableName = `${schema}.${tableName}`;
                yield testDb.query(`TRUNCATE TABLE ${fullTableName} RESTART IDENTITY CASCADE;`);
            }
            return Promise.resolve([]);
        }
        // mysqldb, mariadb
        const promises = mappingTables.flatMap((tableName) => [
            testDb.query(`DELETE FROM ${tableName};`),
            testDb.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1;`),
        ]);
        return Promise.all(promises);
    });
}
/**
 * Truncate specific DB tables in a test DB.
 *
 * @param collections Array of entity names whose tables to truncate.
 * @param testDbName Name of the test DB to truncate tables in.
 */
function truncate(collections, testDbName) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbType = config_1.default.getEnv('database.type');
        const testDb = (0, typeorm_1.getConnection)(testDbName);
        if (dbType === 'sqlite') {
            yield testDb.query('PRAGMA foreign_keys=OFF');
            const truncationPromises = collections.map((collection) => {
                const tableName = toTableName(collection);
                return testDb.query(`DELETE FROM ${tableName}; DELETE FROM sqlite_sequence WHERE name=${tableName};`);
            });
            truncationPromises.push(truncateMappingTables(dbType, collections, testDb));
            yield Promise.all(truncationPromises);
            return testDb.query('PRAGMA foreign_keys=ON');
        }
        if (dbType === 'postgresdb') {
            const schema = config_1.default.getEnv('database.postgresdb.schema');
            // `TRUNCATE` in postgres cannot be parallelized
            for (const collection of collections) {
                const fullTableName = `${schema}.${toTableName(collection)}`;
                yield testDb.query(`TRUNCATE TABLE ${fullTableName} RESTART IDENTITY CASCADE;`);
            }
            return yield truncateMappingTables(dbType, collections, testDb);
            // return Promise.resolve([])
        }
        /**
         * MySQL `TRUNCATE` requires enabling and disabling the global variable `foreign_key_checks`,
         * which cannot be safely manipulated by parallel tests, so use `DELETE` and `AUTO_INCREMENT`.
         * Clear shared tables first to avoid deadlock: https://stackoverflow.com/a/41174997
         */
        if (dbType === 'mysqldb') {
            const { pass: isShared, fail: isNotShared } = (0, utils_1.categorize)(collections, (collectionName) => collectionName.toLowerCase().startsWith('shared'));
            yield truncateMySql(testDb, isShared);
            yield truncateMappingTables(dbType, collections, testDb);
            yield truncateMySql(testDb, isNotShared);
        }
    });
}
exports.truncate = truncate;
const isMapping = (collection) => Object.keys(constants_1.MAPPING_TABLES).includes(collection);
function toTableName(sourceName) {
    if (isMapping(sourceName))
        return constants_1.MAPPING_TABLES[sourceName];
    return {
        Credentials: 'credentials_entity',
        Workflow: 'workflow_entity',
        Execution: 'execution_entity',
        Tag: 'tag_entity',
        Webhook: 'webhook_entity',
        Role: 'role',
        User: 'user',
        SharedCredentials: 'shared_credentials',
        SharedWorkflow: 'shared_workflow',
        Settings: 'settings',
    }[sourceName];
}
function truncateMySql(connection, collections) {
    return Promise.all(collections.map((collection) => __awaiter(this, void 0, void 0, function* () {
        const tableName = toTableName(collection);
        yield connection.query(`DELETE FROM ${tableName};`);
        yield connection.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1;`);
    })));
}
// ----------------------------------
//        credential creation
// ----------------------------------
/**
 * Save a credential to the test DB, sharing it with a user.
 */
function saveCredential(credentialPayload, { user, role }) {
    return __awaiter(this, void 0, void 0, function* () {
        const newCredential = new CredentialsEntity_1.CredentialsEntity();
        Object.assign(newCredential, credentialPayload);
        const encryptedData = yield encryptCredentialData(newCredential);
        Object.assign(newCredential, encryptedData);
        const savedCredential = yield src_1.Db.collections.Credentials.save(newCredential);
        savedCredential.data = newCredential.data;
        yield src_1.Db.collections.SharedCredentials.save({
            user,
            credentials: savedCredential,
            role,
        });
        return savedCredential;
    });
}
exports.saveCredential = saveCredential;
// ----------------------------------
//           user creation
// ----------------------------------
/**
 * Store a user in the DB, defaulting to a `member`.
 */
function createUser(attributes = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, firstName, lastName, globalRole } = attributes, rest = __rest(attributes, ["email", "password", "firstName", "lastName", "globalRole"]);
        const user = Object.assign({ email: email !== null && email !== void 0 ? email : (0, random_1.randomEmail)(), password: yield (0, UserManagementHelper_1.hashPassword)(password !== null && password !== void 0 ? password : (0, random_1.randomValidPassword)()), firstName: firstName !== null && firstName !== void 0 ? firstName : (0, random_1.randomName)(), lastName: lastName !== null && lastName !== void 0 ? lastName : (0, random_1.randomName)(), globalRole: globalRole !== null && globalRole !== void 0 ? globalRole : (yield getGlobalMemberRole()) }, rest);
        return src_1.Db.collections.User.save(user);
    });
}
exports.createUser = createUser;
function createUserShell(globalRole) {
    if (globalRole.scope !== 'global') {
        throw new Error(`Invalid role received: ${JSON.stringify(globalRole)}`);
    }
    const shell = { globalRole };
    if (globalRole.name !== 'owner') {
        shell.email = (0, random_1.randomEmail)();
    }
    return src_1.Db.collections.User.save(shell);
}
exports.createUserShell = createUserShell;
function addApiKey(user) {
    user.apiKey = (0, random_1.randomApiKey)();
    return src_1.Db.collections.User.save(user);
}
exports.addApiKey = addApiKey;
// ----------------------------------
//          role fetchers
// ----------------------------------
function getGlobalOwnerRole() {
    return src_1.Db.collections.Role.findOneOrFail({
        name: 'owner',
        scope: 'global',
    });
}
exports.getGlobalOwnerRole = getGlobalOwnerRole;
function getGlobalMemberRole() {
    return src_1.Db.collections.Role.findOneOrFail({
        name: 'member',
        scope: 'global',
    });
}
exports.getGlobalMemberRole = getGlobalMemberRole;
function getWorkflowOwnerRole() {
    return src_1.Db.collections.Role.findOneOrFail({
        name: 'owner',
        scope: 'workflow',
    });
}
exports.getWorkflowOwnerRole = getWorkflowOwnerRole;
function getCredentialOwnerRole() {
    return src_1.Db.collections.Role.findOneOrFail({
        name: 'owner',
        scope: 'credential',
    });
}
exports.getCredentialOwnerRole = getCredentialOwnerRole;
function getAllRoles() {
    return Promise.all([
        getGlobalOwnerRole(),
        getGlobalMemberRole(),
        getWorkflowOwnerRole(),
        getCredentialOwnerRole(),
    ]);
}
exports.getAllRoles = getAllRoles;
// ----------------------------------
//          Execution helpers
// ----------------------------------
function createManyExecutions(amount, workflow, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const executionsRequests = [...Array(amount)].map((_) => callback(workflow));
        return Promise.all(executionsRequests);
    });
}
exports.createManyExecutions = createManyExecutions;
/**
 * Store a execution in the DB and assign it to a workflow.
 */
function createExecution(attributes = {}, workflow) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, finished, mode, startedAt, stoppedAt, waitTill } = attributes;
        const execution = yield src_1.Db.collections.Execution.save(Object.assign(Object.assign({ data: data !== null && data !== void 0 ? data : '[]', finished: finished !== null && finished !== void 0 ? finished : true, mode: mode !== null && mode !== void 0 ? mode : 'manual', startedAt: startedAt !== null && startedAt !== void 0 ? startedAt : new Date() }, (workflow !== undefined && { workflowData: workflow, workflowId: workflow.id.toString() })), { stoppedAt: stoppedAt !== null && stoppedAt !== void 0 ? stoppedAt : new Date(), waitTill: waitTill !== null && waitTill !== void 0 ? waitTill : null }));
        return execution;
    });
}
exports.createExecution = createExecution;
/**
 * Store a successful execution in the DB and assign it to a workflow.
 */
function createSuccessfulExecution(workflow) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield createExecution({
            finished: true,
        }, workflow);
    });
}
exports.createSuccessfulExecution = createSuccessfulExecution;
/**
 * Store an error execution in the DB and assign it to a workflow.
 */
function createErrorExecution(workflow) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield createExecution({
            finished: false,
            stoppedAt: new Date(),
        }, workflow);
    });
}
exports.createErrorExecution = createErrorExecution;
/**
 * Store a waiting execution in the DB and assign it to a workflow.
 */
function createWaitingExecution(workflow) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield createExecution({
            finished: false,
            waitTill: new Date(),
        }, workflow);
    });
}
exports.createWaitingExecution = createWaitingExecution;
// ----------------------------------
//          Tags
// ----------------------------------
function createTag(attributes = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = attributes;
        return yield src_1.Db.collections.Tag.save(Object.assign({ name: name !== null && name !== void 0 ? name : (0, random_1.randomName)() }, attributes));
    });
}
exports.createTag = createTag;
// ----------------------------------
//          Workflow helpers
// ----------------------------------
function createManyWorkflows(amount, attributes = {}, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const workflowRequests = [...Array(amount)].map((_) => createWorkflow(attributes, user));
        return Promise.all(workflowRequests);
    });
}
exports.createManyWorkflows = createManyWorkflows;
/**
 * Store a workflow in the DB (without a trigger) and optionally assign it to a user.
 * @param user user to assign the workflow to
 */
function createWorkflow(attributes = {}, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { active, name, nodes, connections } = attributes;
        const workflow = yield src_1.Db.collections.Workflow.save(Object.assign({ active: active !== null && active !== void 0 ? active : false, name: name !== null && name !== void 0 ? name : 'test workflow', nodes: nodes !== null && nodes !== void 0 ? nodes : [
                {
                    name: 'Start',
                    parameters: {},
                    position: [-20, 260],
                    type: 'n8n-nodes-base.start',
                    typeVersion: 1,
                },
            ], connections: connections !== null && connections !== void 0 ? connections : {} }, attributes));
        if (user) {
            yield src_1.Db.collections.SharedWorkflow.save({
                user,
                workflow,
                role: yield getWorkflowOwnerRole(),
            });
        }
        return workflow;
    });
}
exports.createWorkflow = createWorkflow;
/**
 * Store a workflow in the DB (with a trigger) and optionally assign it to a user.
 * @param user user to assign the workflow to
 */
function createWorkflowWithTrigger(attributes = {}, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const workflow = yield createWorkflow(Object.assign({ nodes: [
                {
                    parameters: {},
                    name: 'Start',
                    type: 'n8n-nodes-base.start',
                    typeVersion: 1,
                    position: [240, 300],
                },
                {
                    parameters: { triggerTimes: { item: [{ mode: 'everyMinute' }] } },
                    name: 'Cron',
                    type: 'n8n-nodes-base.cron',
                    typeVersion: 1,
                    position: [500, 300],
                },
                {
                    parameters: { options: {} },
                    name: 'Set',
                    type: 'n8n-nodes-base.set',
                    typeVersion: 1,
                    position: [780, 300],
                },
            ], connections: { Cron: { main: [[{ node: 'Set', type: 'main', index: 0 }]] } } }, attributes), user);
        return workflow;
    });
}
exports.createWorkflowWithTrigger = createWorkflowWithTrigger;
// ----------------------------------
//        connection options
// ----------------------------------
/**
 * Generate options for an in-memory sqlite database connection,
 * one per test suite run.
 */
const getSqliteOptions = ({ name }) => {
    return {
        name,
        type: 'sqlite',
        database: ':memory:',
        entityPrefix: '',
        dropSchema: true,
        migrations: sqlite_1.sqliteMigrations,
        migrationsTableName: 'migrations',
        migrationsRun: false,
    };
};
exports.getSqliteOptions = getSqliteOptions;
/**
 * Generate options for a bootstrap Postgres connection,
 * to create and drop test Postgres databases.
 */
const getBootstrapPostgresOptions = () => {
    const username = config_1.default.getEnv('database.postgresdb.user');
    const password = config_1.default.getEnv('database.postgresdb.password');
    const host = config_1.default.getEnv('database.postgresdb.host');
    const port = config_1.default.getEnv('database.postgresdb.port');
    const schema = config_1.default.getEnv('database.postgresdb.schema');
    return {
        name: constants_1.BOOTSTRAP_POSTGRES_CONNECTION_NAME,
        type: 'postgres',
        database: 'postgres',
        host,
        port,
        username,
        password,
        schema,
    };
};
exports.getBootstrapPostgresOptions = getBootstrapPostgresOptions;
const getPostgresOptions = ({ name }) => {
    const username = config_1.default.getEnv('database.postgresdb.user');
    const password = config_1.default.getEnv('database.postgresdb.password');
    const host = config_1.default.getEnv('database.postgresdb.host');
    const port = config_1.default.getEnv('database.postgresdb.port');
    const schema = config_1.default.getEnv('database.postgresdb.schema');
    return {
        name,
        type: 'postgres',
        database: name,
        host,
        port,
        username,
        password,
        entityPrefix: '',
        schema,
        dropSchema: true,
        migrations: postgresdb_1.postgresMigrations,
        migrationsRun: true,
        migrationsTableName: 'migrations',
        entities: Object.values(entities_1.entities),
        synchronize: false,
        logging: false,
    };
};
exports.getPostgresOptions = getPostgresOptions;
/**
 * Generate options for a bootstrap MySQL connection,
 * to create and drop test MySQL databases.
 */
const getBootstrapMySqlOptions = () => {
    const username = config_1.default.getEnv('database.mysqldb.user');
    const password = config_1.default.getEnv('database.mysqldb.password');
    const host = config_1.default.getEnv('database.mysqldb.host');
    const port = config_1.default.getEnv('database.mysqldb.port');
    return {
        name: constants_1.BOOTSTRAP_MYSQL_CONNECTION_NAME,
        database: constants_1.BOOTSTRAP_MYSQL_CONNECTION_NAME,
        type: 'mysql',
        host,
        port,
        username,
        password,
    };
};
exports.getBootstrapMySqlOptions = getBootstrapMySqlOptions;
/**
 * Generate options for a MySQL database connection,
 * one per test suite run.
 */
const getMySqlOptions = ({ name }) => {
    const username = config_1.default.getEnv('database.mysqldb.user');
    const password = config_1.default.getEnv('database.mysqldb.password');
    const host = config_1.default.getEnv('database.mysqldb.host');
    const port = config_1.default.getEnv('database.mysqldb.port');
    return {
        name,
        database: name,
        type: 'mysql',
        host,
        port,
        username,
        password,
        migrations: mysqldb_1.mysqlMigrations,
        migrationsTableName: 'migrations',
        migrationsRun: true,
    };
};
exports.getMySqlOptions = getMySqlOptions;
// ----------------------------------
//            encryption
// ----------------------------------
function encryptCredentialData(credential) {
    return __awaiter(this, void 0, void 0, function* () {
        const encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
        const coreCredential = (0, CredentialsHelper_1.createCredentiasFromCredentialsEntity)(credential, true);
        // @ts-ignore
        coreCredential.setData(credential.data, encryptionKey);
        return coreCredential.getDataToSave();
    });
}

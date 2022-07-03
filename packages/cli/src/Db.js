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
exports.init = exports.linkRepository = exports.transaction = exports.collections = exports.isInitialized = void 0;
/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
const n8n_core_1 = require("n8n-core");
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
const config_1 = __importDefault(require("../config"));
// eslint-disable-next-line import/no-cycle
const entities_1 = require("./databases/entities");
const postgresdb_1 = require("./databases/migrations/postgresdb");
const mysqldb_1 = require("./databases/migrations/mysqldb");
const sqlite_1 = require("./databases/migrations/sqlite");
exports.isInitialized = false;
exports.collections = {};
let connection;
function transaction(fn) {
    return __awaiter(this, void 0, void 0, function* () {
        return connection.transaction(fn);
    });
}
exports.transaction = transaction;
function linkRepository(entityClass) {
    return (0, typeorm_1.getRepository)(entityClass, connection.name);
}
exports.linkRepository = linkRepository;
function init(testConnectionOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        if (exports.isInitialized)
            return exports.collections;
        const dbType = (yield _1.GenericHelpers.getConfigValue('database.type'));
        const n8nFolder = n8n_core_1.UserSettings.getUserN8nFolderPath();
        let connectionOptions;
        const entityPrefix = config_1.default.getEnv('database.tablePrefix');
        if (testConnectionOptions) {
            connectionOptions = testConnectionOptions;
        }
        else {
            switch (dbType) {
                case 'postgresdb':
                    const sslCa = (yield _1.GenericHelpers.getConfigValue('database.postgresdb.ssl.ca'));
                    const sslCert = (yield _1.GenericHelpers.getConfigValue('database.postgresdb.ssl.cert'));
                    const sslKey = (yield _1.GenericHelpers.getConfigValue('database.postgresdb.ssl.key'));
                    const sslRejectUnauthorized = (yield _1.GenericHelpers.getConfigValue('database.postgresdb.ssl.rejectUnauthorized'));
                    let ssl;
                    if (sslCa !== '' || sslCert !== '' || sslKey !== '' || !sslRejectUnauthorized) {
                        ssl = {
                            ca: sslCa || undefined,
                            cert: sslCert || undefined,
                            key: sslKey || undefined,
                            rejectUnauthorized: sslRejectUnauthorized,
                        };
                    }
                    connectionOptions = {
                        type: 'postgres',
                        entityPrefix,
                        database: (yield _1.GenericHelpers.getConfigValue('database.postgresdb.database')),
                        host: (yield _1.GenericHelpers.getConfigValue('database.postgresdb.host')),
                        password: (yield _1.GenericHelpers.getConfigValue('database.postgresdb.password')),
                        port: (yield _1.GenericHelpers.getConfigValue('database.postgresdb.port')),
                        username: (yield _1.GenericHelpers.getConfigValue('database.postgresdb.user')),
                        schema: config_1.default.getEnv('database.postgresdb.schema'),
                        migrations: postgresdb_1.postgresMigrations,
                        migrationsRun: true,
                        migrationsTableName: `${entityPrefix}migrations`,
                        ssl,
                    };
                    break;
                case 'mariadb':
                case 'mysqldb':
                    connectionOptions = {
                        type: dbType === 'mysqldb' ? 'mysql' : 'mariadb',
                        database: (yield _1.GenericHelpers.getConfigValue('database.mysqldb.database')),
                        entityPrefix,
                        host: (yield _1.GenericHelpers.getConfigValue('database.mysqldb.host')),
                        password: (yield _1.GenericHelpers.getConfigValue('database.mysqldb.password')),
                        port: (yield _1.GenericHelpers.getConfigValue('database.mysqldb.port')),
                        username: (yield _1.GenericHelpers.getConfigValue('database.mysqldb.user')),
                        migrations: mysqldb_1.mysqlMigrations,
                        migrationsRun: true,
                        migrationsTableName: `${entityPrefix}migrations`,
                        timezone: 'Z', // set UTC as default
                    };
                    break;
                case 'sqlite':
                    connectionOptions = {
                        type: 'sqlite',
                        database: path_1.default.join(n8nFolder, 'database.sqlite'),
                        entityPrefix,
                        migrations: sqlite_1.sqliteMigrations,
                        migrationsRun: false,
                        migrationsTableName: `${entityPrefix}migrations`,
                    };
                    break;
                default:
                    throw new Error(`The database "${dbType}" is currently not supported!`);
            }
        }
        let loggingOption = (yield _1.GenericHelpers.getConfigValue('database.logging.enabled'));
        if (loggingOption) {
            const optionsString = (yield _1.GenericHelpers.getConfigValue('database.logging.options')).replace(/\s+/g, '');
            if (optionsString === 'all') {
                loggingOption = optionsString;
            }
            else {
                loggingOption = optionsString.split(',');
            }
        }
        Object.assign(connectionOptions, {
            entities: Object.values(entities_1.entities),
            synchronize: false,
            logging: loggingOption,
            maxQueryExecutionTime: (yield _1.GenericHelpers.getConfigValue('database.logging.maxQueryExecutionTime')),
        });
        connection = yield (0, typeorm_1.createConnection)(connectionOptions);
        if (!testConnectionOptions && dbType === 'sqlite') {
            // This specific migration changes database metadata.
            // A field is now nullable. We need to reconnect so that
            // n8n knows it has changed. Happens only on sqlite.
            let migrations = [];
            try {
                migrations = yield connection.query(`SELECT id FROM ${entityPrefix}migrations where name = "MakeStoppedAtNullable1607431743769"`);
            }
            catch (error) {
                // Migration table does not exist yet - it will be created after migrations run for the first time.
            }
            // If you remove this call, remember to turn back on the
            // setting to run migrations automatically above.
            yield connection.runMigrations({
                transaction: 'none',
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (migrations.length === 0) {
                yield connection.close();
                connection = yield (0, typeorm_1.createConnection)(connectionOptions);
            }
        }
        exports.collections.Credentials = linkRepository(entities_1.entities.CredentialsEntity);
        exports.collections.Execution = linkRepository(entities_1.entities.ExecutionEntity);
        exports.collections.Workflow = linkRepository(entities_1.entities.WorkflowEntity);
        exports.collections.Webhook = linkRepository(entities_1.entities.WebhookEntity);
        exports.collections.Tag = linkRepository(entities_1.entities.TagEntity);
        exports.collections.Role = linkRepository(entities_1.entities.Role);
        exports.collections.User = linkRepository(entities_1.entities.User);
        exports.collections.SharedCredentials = linkRepository(entities_1.entities.SharedCredentials);
        exports.collections.SharedWorkflow = linkRepository(entities_1.entities.SharedWorkflow);
        exports.collections.Settings = linkRepository(entities_1.entities.Settings);
        exports.isInitialized = true;
        return exports.collections;
    });
}
exports.init = init;

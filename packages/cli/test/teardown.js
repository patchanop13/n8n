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
const typeorm_1 = require("typeorm");
const config_1 = __importDefault(require("../config"));
const child_process_1 = require("child_process");
const testDb_1 = require("./integration/shared/testDb");
const constants_1 = require("./integration/shared/constants");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const dbType = config_1.default.getEnv('database.type');
    if (dbType === 'postgresdb') {
        const bootstrapPostgres = yield (0, typeorm_1.createConnection)((0, testDb_1.getBootstrapPostgresOptions)());
        const results = yield bootstrapPostgres.query('SELECT datname as db_name FROM pg_database;');
        const promises = results
            .filter(({ db_name: dbName }) => dbName.startsWith('pg_') && dbName.endsWith('_n8n_test'))
            .map(({ db_name: dbName }) => bootstrapPostgres.query(`DROP DATABASE ${dbName};`));
        yield Promise.all(promises);
        bootstrapPostgres.close();
    }
    if (dbType === 'mysqldb') {
        const user = config_1.default.getEnv('database.mysqldb.user');
        const password = config_1.default.getEnv('database.mysqldb.password');
        const host = config_1.default.getEnv('database.mysqldb.host');
        const bootstrapMySql = yield (0, typeorm_1.createConnection)((0, testDb_1.getBootstrapMySqlOptions)());
        const results = yield bootstrapMySql.query('SHOW DATABASES;');
        const promises = results
            .filter(({ Database: dbName }) => dbName.startsWith('mysql_') && dbName.endsWith('_n8n_test'))
            .map(({ Database: dbName }) => bootstrapMySql.query(`DROP DATABASE ${dbName};`));
        yield Promise.all(promises);
        yield bootstrapMySql.close();
        (0, child_process_1.exec)(`echo "DROP DATABASE ${constants_1.BOOTSTRAP_MYSQL_CONNECTION_NAME}" | mysql -h ${host} -u ${user} -p${password}`);
    }
});

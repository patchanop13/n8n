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
const child_process_1 = require("child_process");
const util_1 = require("util");
const config_1 = __importDefault(require("../config"));
const constants_1 = require("./integration/shared/constants");
const exec = (0, util_1.promisify)(child_process_1.exec);
const dbType = config_1.default.getEnv('database.type');
if (dbType === 'mysqldb') {
    const username = config_1.default.getEnv('database.mysqldb.user');
    const password = config_1.default.getEnv('database.mysqldb.password');
    const host = config_1.default.getEnv('database.mysqldb.host');
    const passwordSegment = password ? `-p${password}` : '';
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            jest.setTimeout(constants_1.DB_INITIALIZATION_TIMEOUT);
            yield exec(`echo "CREATE DATABASE IF NOT EXISTS ${constants_1.BOOTSTRAP_MYSQL_CONNECTION_NAME}" | mysql -h ${host} -u ${username} ${passwordSegment}; USE ${constants_1.BOOTSTRAP_MYSQL_CONNECTION_NAME};`);
        }
        catch (error) {
            if (error.stderr.includes('Access denied')) {
                console.error(`ERROR: Failed to log into MySQL to create bootstrap DB.\nPlease review your MySQL connection options:\n\thost: "${host}"\n\tusername: "${username}"\n\tpassword: "${password}"\nFix by setting correct values via environment variables.\n\texport DB_MYSQLDB_HOST=value\n\texport DB_MYSQLDB_USERNAME=value\n\texport DB_MYSQLDB_PASSWORD=value`);
                process.exit(1);
            }
        }
    }))();
}

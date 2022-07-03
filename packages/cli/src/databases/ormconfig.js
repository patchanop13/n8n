"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const n8n_core_1 = require("n8n-core");
const entities_1 = require("./entities");
exports.default = [
    {
        name: 'sqlite',
        type: 'sqlite',
        logging: true,
        entities: Object.values(entities_1.entities),
        database: path_1.default.resolve(n8n_core_1.UserSettings.getUserN8nFolderPath(), 'database.sqlite'),
        migrations: [path_1.default.resolve('migrations', 'sqlite', 'index.ts')],
        cli: {
            entitiesDir: path_1.default.resolve('entities'),
            migrationsDir: path_1.default.resolve('migrations', 'sqlite'),
        },
    },
    {
        name: 'postgres',
        type: 'postgres',
        database: 'n8n',
        schema: 'public',
        username: 'postgres',
        password: '',
        host: 'localhost',
        port: 5432,
        logging: false,
        entities: Object.values(entities_1.entities),
        migrations: [path_1.default.resolve('migrations', 'postgresdb', 'index.ts')],
        cli: {
            entitiesDir: path_1.default.resolve('entities'),
            migrationsDir: path_1.default.resolve('migrations', 'postgresdb'),
        },
    },
    {
        name: 'mysql',
        type: 'mysql',
        database: 'n8n',
        username: 'root',
        password: 'password',
        host: 'localhost',
        port: 3306,
        logging: false,
        entities: Object.values(entities_1.entities),
        migrations: [path_1.default.resolve('migrations', 'mysqldb', 'index.ts')],
        cli: {
            entitiesDir: path_1.default.resolve('entities'),
            migrationsDir: path_1.default.resolve('migrations', 'mysqldb'),
        },
    },
    {
        name: 'mariadb',
        type: 'mariadb',
        database: 'n8n',
        username: 'root',
        password: 'password',
        host: 'localhost',
        port: 3306,
        logging: false,
        entities: Object.values(entities_1.entities),
        migrations: [path_1.default.resolve('migrations', 'mysqldb', 'index.ts')],
        cli: {
            entitiesDir: path_1.default.resolve('entities'),
            migrationsDir: path_1.default.resolve('migrations', 'mysqldb'),
        },
    },
];

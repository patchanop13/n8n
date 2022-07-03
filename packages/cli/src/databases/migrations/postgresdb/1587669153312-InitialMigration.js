"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1587669153312 = void 0;
const config = __importStar(require("../../../../config"));
class InitialMigration1587669153312 {
    constructor() {
        this.name = 'InitialMigration1587669153312';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let tablePrefix = config.getEnv('database.tablePrefix');
            const tablePrefixIndex = tablePrefix;
            const schema = config.getEnv('database.postgresdb.schema');
            if (schema) {
                tablePrefix = schema + '.' + tablePrefix;
            }
            yield queryRunner.query(`SET search_path TO ${schema};`);
            yield queryRunner.query(`CREATE TABLE IF NOT EXISTS ${tablePrefix}credentials_entity ("id" SERIAL NOT NULL, "name" character varying(128) NOT NULL, "data" text NOT NULL, "type" character varying(32) NOT NULL, "nodesAccess" json NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT PK_${tablePrefixIndex}814c3d3c36e8a27fa8edb761b0e PRIMARY KEY ("id"))`, undefined);
            yield queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_${tablePrefixIndex}07fde106c0b471d8cc80a64fc8 ON ${tablePrefix}credentials_entity (type) `, undefined);
            yield queryRunner.query(`CREATE TABLE IF NOT EXISTS ${tablePrefix}execution_entity ("id" SERIAL NOT NULL, "data" text NOT NULL, "finished" boolean NOT NULL, "mode" character varying NOT NULL, "retryOf" character varying, "retrySuccessId" character varying, "startedAt" TIMESTAMP NOT NULL, "stoppedAt" TIMESTAMP NOT NULL, "workflowData" json NOT NULL, "workflowId" character varying, CONSTRAINT PK_${tablePrefixIndex}e3e63bbf986767844bbe1166d4e PRIMARY KEY ("id"))`, undefined);
            yield queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_${tablePrefixIndex}c4d999a5e90784e8caccf5589d ON ${tablePrefix}execution_entity ("workflowId") `, undefined);
            yield queryRunner.query(`CREATE TABLE IF NOT EXISTS ${tablePrefix}workflow_entity ("id" SERIAL NOT NULL, "name" character varying(128) NOT NULL, "active" boolean NOT NULL, "nodes" json NOT NULL, "connections" json NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "settings" json, "staticData" json, CONSTRAINT PK_${tablePrefixIndex}eded7d72664448da7745d551207 PRIMARY KEY ("id"))`, undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let tablePrefix = config.getEnv('database.tablePrefix');
            const tablePrefixIndex = tablePrefix;
            const schema = config.getEnv('database.postgresdb.schema');
            if (schema) {
                tablePrefix = schema + '.' + tablePrefix;
            }
            yield queryRunner.query(`SET search_path TO ${schema};`);
            yield queryRunner.query(`DROP TABLE ${tablePrefix}workflow_entity`, undefined);
            yield queryRunner.query(`DROP INDEX IDX_${tablePrefixIndex}c4d999a5e90784e8caccf5589d`, undefined);
            yield queryRunner.query(`DROP TABLE ${tablePrefix}execution_entity`, undefined);
            yield queryRunner.query(`DROP INDEX IDX_${tablePrefixIndex}07fde106c0b471d8cc80a64fc8`, undefined);
            yield queryRunner.query(`DROP TABLE ${tablePrefix}credentials_entity`, undefined);
        });
    }
}
exports.InitialMigration1587669153312 = InitialMigration1587669153312;

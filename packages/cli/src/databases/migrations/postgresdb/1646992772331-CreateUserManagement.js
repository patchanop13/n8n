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
exports.CreateUserManagement1646992772331 = void 0;
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../../../config"));
const migrationHelpers_1 = require("../../utils/migrationHelpers");
class CreateUserManagement1646992772331 {
    constructor() {
        this.name = 'CreateUserManagement1646992772331';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let tablePrefix = config_1.default.getEnv('database.tablePrefix');
            const tablePrefixPure = tablePrefix;
            const schema = config_1.default.getEnv('database.postgresdb.schema');
            if (schema) {
                tablePrefix = schema + '.' + tablePrefix;
            }
            yield queryRunner.query(`SET search_path TO ${schema};`);
            yield queryRunner.query(`CREATE TABLE ${tablePrefix}role (
				"id" serial NOT NULL,
				"name" VARCHAR(32) NOT NULL,
				"scope" VARCHAR(255) NOT NULL,
				"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				CONSTRAINT "PK_${tablePrefixPure}e853ce24e8200abe5721d2c6ac552b73" PRIMARY KEY ("id"),
				CONSTRAINT "UQ_${tablePrefixPure}5b49d0f504f7ef31045a1fb2eb8" UNIQUE ("scope", "name")
			);`);
            yield queryRunner.query(`CREATE TABLE ${tablePrefix}user (
				"id" UUID NOT NULL DEFAULT uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring),
				"email" VARCHAR(255),
				"firstName" VARCHAR(32),
				"lastName" VARCHAR(32),
				"password" VARCHAR(255),
				"resetPasswordToken" VARCHAR(255),
				"resetPasswordTokenExpiration" int,
				"personalizationAnswers" text,
				"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"globalRoleId" int NOT NULL,
				CONSTRAINT "PK_${tablePrefixPure}ea8f538c94b6e352418254ed6474a81f" PRIMARY KEY ("id"),
				CONSTRAINT "UQ_${tablePrefixPure}e12875dfb3b1d92d7d7c5377e2" UNIQUE (email),
				CONSTRAINT "FK_${tablePrefixPure}f0609be844f9200ff4365b1bb3d" FOREIGN KEY ("globalRoleId") REFERENCES ${tablePrefix}role (id)
			);`);
            yield queryRunner.query(`CREATE TABLE ${tablePrefix}shared_workflow (
				"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"roleId" INT NOT NULL,
				"userId" UUID NOT NULL,
				"workflowId" INT NOT NULL,
				CONSTRAINT "PK_${tablePrefixPure}cc5d5a71c7b2591f5154ffb0c785e85e" PRIMARY KEY ("userId", "workflowId"),
				CONSTRAINT "FK_${tablePrefixPure}3540da03964527aa24ae014b780" FOREIGN KEY ("roleId") REFERENCES ${tablePrefix}role ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
				CONSTRAINT "FK_${tablePrefixPure}82b2fd9ec4e3e24209af8160282" FOREIGN KEY ("userId") REFERENCES ${tablePrefix}user ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
				CONSTRAINT "FK_${tablePrefixPure}b83f8d2530884b66a9c848c8b88" FOREIGN KEY ("workflowId") REFERENCES
				${tablePrefix}workflow_entity ("id") ON DELETE CASCADE ON UPDATE NO ACTION
			);`);
            yield queryRunner.query(`CREATE INDEX "IDX_${tablePrefixPure}65a0933c0f19d278881653bf81d35064" ON ${tablePrefix}shared_workflow ("workflowId");`);
            yield queryRunner.query(`CREATE TABLE ${tablePrefix}shared_credentials (
				"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"roleId" INT NOT NULL,
				"userId" UUID NOT NULL,
				"credentialsId" INT NOT NULL,
				CONSTRAINT "PK_${tablePrefixPure}10dd1527ffb639609be7aadd98f628c6" PRIMARY KEY ("userId", "credentialsId"),
				CONSTRAINT "FK_${tablePrefixPure}c68e056637562000b68f480815a" FOREIGN KEY ("roleId") REFERENCES ${tablePrefix}role ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
				CONSTRAINT "FK_${tablePrefixPure}484f0327e778648dd04f1d70493" FOREIGN KEY ("userId") REFERENCES ${tablePrefix}user ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
				CONSTRAINT "FK_${tablePrefixPure}68661def1d4bcf2451ac8dbd949" FOREIGN KEY ("credentialsId") REFERENCES ${tablePrefix}credentials_entity ("id") ON DELETE CASCADE ON UPDATE NO ACTION
			);`);
            yield queryRunner.query(`CREATE INDEX "IDX_${tablePrefixPure}829d16efa0e265cb076d50eca8d21733" ON ${tablePrefix}shared_credentials ("credentialsId");`);
            yield queryRunner.query(`CREATE TABLE ${tablePrefix}settings (
				"key" VARCHAR(255) NOT NULL,
				"value" TEXT NOT NULL,
				"loadOnStartup" boolean NOT NULL DEFAULT false,
				CONSTRAINT "PK_${tablePrefixPure}dc0fe14e6d9943f268e7b119f69ab8bd" PRIMARY KEY ("key")
			);`);
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefixPure}a252c527c4c89237221fe2c0ab"`);
            // Insert initial roles
            yield queryRunner.query(`INSERT INTO ${tablePrefix}role (name, scope) VALUES ('owner', 'global');`);
            const instanceOwnerRole = yield queryRunner.query('SELECT lastval() as "insertId"');
            yield queryRunner.query(`INSERT INTO ${tablePrefix}role (name, scope) VALUES ('member', 'global');`);
            yield queryRunner.query(`INSERT INTO ${tablePrefix}role (name, scope) VALUES ('owner', 'workflow');`);
            const workflowOwnerRole = yield queryRunner.query('SELECT lastval() as "insertId"');
            yield queryRunner.query(`INSERT INTO ${tablePrefix}role (name, scope) VALUES ('owner', 'credential');`);
            const credentialOwnerRole = yield queryRunner.query('SELECT lastval() as "insertId"');
            const survey = (0, migrationHelpers_1.loadSurveyFromDisk)();
            const ownerUserId = (0, uuid_1.v4)();
            yield queryRunner.query(`INSERT INTO ${tablePrefix}user ("id", "globalRoleId", "personalizationAnswers") values ($1, $2, $3)`, [ownerUserId, instanceOwnerRole[0].insertId, survey]);
            yield queryRunner.query(`INSERT INTO ${tablePrefix}shared_workflow ("createdAt", "updatedAt", "roleId", "userId", "workflowId") select
				NOW(), NOW(), '${workflowOwnerRole[0].insertId}', '${ownerUserId}', "id" FROM ${tablePrefix}workflow_entity`);
            yield queryRunner.query(`INSERT INTO ${tablePrefix}shared_credentials ("createdAt", "updatedAt", "roleId", "userId", "credentialsId")   SELECT NOW(), NOW(), '${credentialOwnerRole[0].insertId}', '${ownerUserId}', "id" FROM ${tablePrefix}credentials_entity`);
            yield queryRunner.query(`INSERT INTO ${tablePrefix}settings ("key", "value", "loadOnStartup") VALUES ('userManagement.isInstanceOwnerSetUp', 'false', true), ('userManagement.skipInstanceOwnerSetup', 'false', true)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let tablePrefix = config_1.default.getEnv('database.tablePrefix');
            const tablePrefixPure = tablePrefix;
            const schema = config_1.default.getEnv('database.postgresdb.schema');
            if (schema) {
                tablePrefix = schema + '.' + tablePrefix;
            }
            yield queryRunner.query(`SET search_path TO ${schema};`);
            yield queryRunner.query(`CREATE UNIQUE INDEX "IDX_${tablePrefixPure}a252c527c4c89237221fe2c0ab" ON ${tablePrefix}workflow_entity ("name")`);
            yield queryRunner.query(`DROP TABLE ${tablePrefix}shared_credentials`);
            yield queryRunner.query(`DROP TABLE ${tablePrefix}shared_workflow`);
            yield queryRunner.query(`DROP TABLE ${tablePrefix}user`);
            yield queryRunner.query(`DROP TABLE ${tablePrefix}role`);
            yield queryRunner.query(`DROP TABLE ${tablePrefix}settings`);
        });
    }
}
exports.CreateUserManagement1646992772331 = CreateUserManagement1646992772331;

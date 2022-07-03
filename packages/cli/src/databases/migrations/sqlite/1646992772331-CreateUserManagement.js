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
exports.CreateUserManagement1646992772331 = void 0;
const uuid_1 = require("uuid");
const config = __importStar(require("../../../../config"));
const migrationHelpers_1 = require("../../utils/migrationHelpers");
class CreateUserManagement1646992772331 {
    constructor() {
        this.name = 'CreateUserManagement1646992772331';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, migrationHelpers_1.logMigrationStart)(this.name);
            const tablePrefix = config.getEnv('database.tablePrefix');
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(32) NOT NULL, "scope" varchar NOT NULL, "createdAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "updatedAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), CONSTRAINT "UQ_${tablePrefix}5b49d0f504f7ef31045a1fb2eb8" UNIQUE ("scope", "name"))`);
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}user" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar(255), "firstName" varchar(32), "lastName" varchar(32), "password" varchar, "resetPasswordToken" varchar, "resetPasswordTokenExpiration" integer DEFAULT NULL, "personalizationAnswers" text, "createdAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "updatedAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "globalRoleId" integer NOT NULL, CONSTRAINT "FK_${tablePrefix}f0609be844f9200ff4365b1bb3d" FOREIGN KEY ("globalRoleId") REFERENCES "${tablePrefix}role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`CREATE UNIQUE INDEX "UQ_${tablePrefix}e12875dfb3b1d92d7d7c5377e2" ON "${tablePrefix}user" ("email")`);
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}shared_workflow" ("createdAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "updatedAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "roleId" integer NOT NULL, "userId" varchar NOT NULL, "workflowId" integer NOT NULL, CONSTRAINT "FK_${tablePrefix}3540da03964527aa24ae014b780" FOREIGN KEY ("roleId") REFERENCES "${tablePrefix}role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_${tablePrefix}82b2fd9ec4e3e24209af8160282" FOREIGN KEY ("userId") REFERENCES "${tablePrefix}user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_${tablePrefix}b83f8d2530884b66a9c848c8b88" FOREIGN KEY ("workflowId") REFERENCES "${tablePrefix}workflow_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("userId", "workflowId"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_${tablePrefix}65a0933c0f19d278881653bf81d35064" ON "${tablePrefix}shared_workflow" ("workflowId")`);
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}shared_credentials" ("createdAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "updatedAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "roleId" integer NOT NULL, "userId" varchar NOT NULL, "credentialsId" integer NOT NULL, CONSTRAINT "FK_${tablePrefix}c68e056637562000b68f480815a" FOREIGN KEY ("roleId") REFERENCES "${tablePrefix}role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_${tablePrefix}484f0327e778648dd04f1d70493" FOREIGN KEY ("userId") REFERENCES "${tablePrefix}user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_${tablePrefix}68661def1d4bcf2451ac8dbd949" FOREIGN KEY ("credentialsId") REFERENCES "${tablePrefix}credentials_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("userId", "credentialsId"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_${tablePrefix}829d16efa0e265cb076d50eca8d21733" ON "${tablePrefix}shared_credentials" ("credentialsId")`);
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}settings" ("key"	TEXT NOT NULL,"value"	TEXT NOT NULL DEFAULT \'\',"loadOnStartup"	boolean NOT NULL default false,PRIMARY KEY("key"))`);
            yield queryRunner.query(`DROP INDEX IF EXISTS "IDX_${tablePrefix}943d8f922be094eb507cb9a7f9"`);
            // Insert initial roles
            yield queryRunner.query(`
			INSERT INTO "${tablePrefix}role" (name, scope)
			VALUES ("owner", "global");
		`);
            const instanceOwnerRole = yield queryRunner.query('SELECT last_insert_rowid() as insertId');
            yield queryRunner.query(`
			INSERT INTO "${tablePrefix}role" (name, scope)
			VALUES ("member", "global");
		`);
            yield queryRunner.query(`
			INSERT INTO "${tablePrefix}role" (name, scope)
			VALUES ("owner", "workflow");
		`);
            const workflowOwnerRole = yield queryRunner.query('SELECT last_insert_rowid() as insertId');
            yield queryRunner.query(`
			INSERT INTO "${tablePrefix}role" (name, scope)
			VALUES ("owner", "credential");
		`);
            const credentialOwnerRole = yield queryRunner.query('SELECT last_insert_rowid() as insertId');
            const survey = (0, migrationHelpers_1.loadSurveyFromDisk)();
            const ownerUserId = (0, uuid_1.v4)();
            yield queryRunner.query(`
			INSERT INTO "${tablePrefix}user" (id, globalRoleId, personalizationAnswers) values
			(?, ?, ?)
		`, [ownerUserId, instanceOwnerRole[0].insertId, survey]);
            yield queryRunner.query(`
			INSERT INTO "${tablePrefix}shared_workflow" (createdAt, updatedAt, roleId, userId, workflowId)
			select DATETIME('now'), DATETIME('now'), '${workflowOwnerRole[0].insertId}', '${ownerUserId}', id from "${tablePrefix}workflow_entity"
		`);
            yield queryRunner.query(`
			INSERT INTO "${tablePrefix}shared_credentials" (createdAt, updatedAt, roleId, userId, credentialsId)
			select DATETIME('now'), DATETIME('now'), '${credentialOwnerRole[0].insertId}', '${ownerUserId}', id from "${tablePrefix}credentials_entity"
		`);
            yield queryRunner.query(`
			INSERT INTO "${tablePrefix}settings" (key, value, loadOnStartup) values
			('userManagement.isInstanceOwnerSetUp', 'false', true), ('userManagement.skipInstanceOwnerSetup', 'false', true)
		`);
            (0, migrationHelpers_1.logMigrationEnd)(this.name);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            yield queryRunner.query(`CREATE UNIQUE INDEX "IDX_${tablePrefix}943d8f922be094eb507cb9a7f9" ON "${tablePrefix}workflow_entity" ("name") `);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}shared_credentials"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}shared_workflow"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}user"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}role"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}settings"`);
        });
    }
}
exports.CreateUserManagement1646992772331 = CreateUserManagement1646992772331;

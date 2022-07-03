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
exports.CreateTagEntity1617213344594 = void 0;
const config = __importStar(require("../../../../config"));
const migrationHelpers_1 = require("../../utils/migrationHelpers");
class CreateTagEntity1617213344594 {
    constructor() {
        this.name = 'CreateTagEntity1617213344594';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, migrationHelpers_1.logMigrationStart)(this.name);
            const tablePrefix = config.getEnv('database.tablePrefix');
            // create tags table + relationship with workflow entity
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}tag_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(24) NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL)`);
            yield queryRunner.query(`CREATE UNIQUE INDEX "IDX_${tablePrefix}8f949d7a3a984759044054e89b" ON "${tablePrefix}tag_entity" ("name") `);
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}workflows_tags" ("workflowId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "FK_54b2f0343d6a2078fa137443869" FOREIGN KEY ("workflowId") REFERENCES "${tablePrefix}workflow_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_77505b341625b0b4768082e2171" FOREIGN KEY ("tagId") REFERENCES "${tablePrefix}tag_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("workflowId", "tagId"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_${tablePrefix}54b2f0343d6a2078fa13744386" ON "${tablePrefix}workflows_tags" ("workflowId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_${tablePrefix}77505b341625b0b4768082e217" ON "${tablePrefix}workflows_tags" ("tagId") `);
            // set default dates for `createdAt` and `updatedAt`
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefix}07fde106c0b471d8cc80a64fc8"`);
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}temporary_credentials_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(128) NOT NULL, "data" text NOT NULL, "type" varchar(32) NOT NULL, "nodesAccess" text NOT NULL, "createdAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "updatedAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')))`);
            yield queryRunner.query(`INSERT INTO "${tablePrefix}temporary_credentials_entity"("id", "name", "data", "type", "nodesAccess", "createdAt", "updatedAt") SELECT "id", "name", "data", "type", "nodesAccess", "createdAt", "updatedAt" FROM "${tablePrefix}credentials_entity"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}credentials_entity"`);
            yield queryRunner.query(`ALTER TABLE "${tablePrefix}temporary_credentials_entity" RENAME TO "${tablePrefix}credentials_entity"`);
            yield queryRunner.query(`CREATE INDEX "IDX_${tablePrefix}07fde106c0b471d8cc80a64fc8" ON "${tablePrefix}credentials_entity" ("type") `);
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefix}8f949d7a3a984759044054e89b"`);
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}temporary_tag_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(24) NOT NULL, "createdAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "updatedAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')))`);
            yield queryRunner.query(`INSERT INTO "${tablePrefix}temporary_tag_entity"("id", "name", "createdAt", "updatedAt") SELECT "id", "name", "createdAt", "updatedAt" FROM "${tablePrefix}tag_entity"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}tag_entity"`);
            yield queryRunner.query(`ALTER TABLE "${tablePrefix}temporary_tag_entity" RENAME TO "${tablePrefix}tag_entity"`);
            yield queryRunner.query(`CREATE UNIQUE INDEX "IDX_${tablePrefix}8f949d7a3a984759044054e89b" ON "${tablePrefix}tag_entity" ("name") `);
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}temporary_workflow_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(128) NOT NULL, "active" boolean NOT NULL, "nodes" text, "connections" text NOT NULL, "createdAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "updatedAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "settings" text, "staticData" text)`);
            yield queryRunner.query(`INSERT INTO "${tablePrefix}temporary_workflow_entity"("id", "name", "active", "nodes", "connections", "createdAt", "updatedAt", "settings", "staticData") SELECT "id", "name", "active", "nodes", "connections", "createdAt", "updatedAt", "settings", "staticData" FROM "${tablePrefix}workflow_entity"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}workflow_entity"`);
            yield queryRunner.query(`ALTER TABLE "${tablePrefix}temporary_workflow_entity" RENAME TO "${tablePrefix}workflow_entity"`);
            (0, migrationHelpers_1.logMigrationEnd)(this.name);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            // `createdAt` and `updatedAt`
            yield queryRunner.query(`ALTER TABLE "${tablePrefix}workflow_entity" RENAME TO "${tablePrefix}temporary_workflow_entity"`);
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}workflow_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(128) NOT NULL, "active" boolean NOT NULL, "nodes" text NOT NULL, "connections" text NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "settings" text, "staticData" text)`);
            yield queryRunner.query(`INSERT INTO "${tablePrefix}workflow_entity"("id", "name", "active", "nodes", "connections", "createdAt", "updatedAt", "settings", "staticData") SELECT "id", "name", "active", "nodes", "connections", "createdAt", "updatedAt", "settings", "staticData" FROM "${tablePrefix}temporary_workflow_entity"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}temporary_workflow_entity"`);
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefix}8f949d7a3a984759044054e89b"`);
            yield queryRunner.query(`ALTER TABLE "${tablePrefix}tag_entity" RENAME TO "${tablePrefix}temporary_tag_entity"`);
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}tag_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(24) NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL)`);
            yield queryRunner.query(`INSERT INTO "${tablePrefix}tag_entity"("id", "name", "createdAt", "updatedAt") SELECT "id", "name", "createdAt", "updatedAt" FROM "${tablePrefix}temporary_tag_entity"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}temporary_tag_entity"`);
            yield queryRunner.query(`CREATE UNIQUE INDEX "IDX_${tablePrefix}8f949d7a3a984759044054e89b" ON "${tablePrefix}tag_entity" ("name") `);
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefix}07fde106c0b471d8cc80a64fc8"`);
            yield queryRunner.query(`ALTER TABLE "${tablePrefix}credentials_entity" RENAME TO "temporary_credentials_entity"`);
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}credentials_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(128) NOT NULL, "data" text NOT NULL, "type" varchar(32) NOT NULL, "nodesAccess" text NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL)`);
            yield queryRunner.query(`INSERT INTO "${tablePrefix}credentials_entity"("id", "name", "data", "type", "nodesAccess", "createdAt", "updatedAt") SELECT "id", "name", "data", "type", "nodesAccess", "createdAt", "updatedAt" FROM "${tablePrefix}temporary_credentials_entity"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}temporary_credentials_entity"`);
            yield queryRunner.query(`CREATE INDEX "IDX_${tablePrefix}07fde106c0b471d8cc80a64fc8" ON "credentials_entity" ("type") `);
            // tags
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefix}77505b341625b0b4768082e217"`);
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefix}54b2f0343d6a2078fa13744386"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}workflows_tags"`);
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefix}8f949d7a3a984759044054e89b"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}tag_entity"`);
        });
    }
}
exports.CreateTagEntity1617213344594 = CreateTagEntity1617213344594;

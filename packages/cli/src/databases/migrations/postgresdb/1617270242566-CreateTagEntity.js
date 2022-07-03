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
exports.CreateTagEntity1617270242566 = void 0;
const config = __importStar(require("../../../../config"));
class CreateTagEntity1617270242566 {
    constructor() {
        this.name = 'CreateTagEntity1617270242566';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let tablePrefix = config.getEnv('database.tablePrefix');
            const tablePrefixPure = tablePrefix;
            const schema = config.getEnv('database.postgresdb.schema');
            if (schema) {
                tablePrefix = schema + '.' + tablePrefix;
            }
            yield queryRunner.query(`SET search_path TO ${schema};`);
            // create tags table + relationship with workflow entity
            yield queryRunner.query(`CREATE TABLE ${tablePrefix}tag_entity ("id" SERIAL NOT NULL, "name" character varying(24) NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_${tablePrefixPure}7a50a9b74ae6855c0dcaee25052" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE UNIQUE INDEX IDX_${tablePrefixPure}812eb05f7451ca757fb98444ce ON ${tablePrefix}tag_entity ("name") `);
            yield queryRunner.query(`CREATE TABLE ${tablePrefix}workflows_tags ("workflowId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_${tablePrefixPure}a60448a90e51a114e95e2a125b3" PRIMARY KEY ("workflowId", "tagId"))`);
            yield queryRunner.query(`CREATE INDEX IDX_${tablePrefixPure}31140eb41f019805b40d008744 ON ${tablePrefix}workflows_tags ("workflowId") `);
            yield queryRunner.query(`CREATE INDEX IDX_${tablePrefixPure}5e29bfe9e22c5d6567f509d4a4 ON ${tablePrefix}workflows_tags ("tagId") `);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflows_tags ADD CONSTRAINT "FK_${tablePrefixPure}31140eb41f019805b40d0087449" FOREIGN KEY ("workflowId") REFERENCES ${tablePrefix}workflow_entity ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflows_tags ADD CONSTRAINT "FK_${tablePrefixPure}5e29bfe9e22c5d6567f509d4a46" FOREIGN KEY ("tagId") REFERENCES ${tablePrefix}tag_entity ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            // set default dates for `createdAt` and `updatedAt`
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}credentials_entity ALTER COLUMN "createdAt" TYPE TIMESTAMP(3)`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}credentials_entity ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP(3)`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}credentials_entity ALTER COLUMN "updatedAt" TYPE TIMESTAMP(3)`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}credentials_entity ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP(3)`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}tag_entity ALTER COLUMN "createdAt" TYPE TIMESTAMP(3)`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}tag_entity ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP(3)`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}tag_entity ALTER COLUMN "updatedAt" TYPE TIMESTAMP(3)`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}tag_entity ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP(3)`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflow_entity ALTER COLUMN "createdAt" TYPE TIMESTAMP(3)`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflow_entity ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP(3)`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflow_entity ALTER COLUMN "updatedAt" TYPE TIMESTAMP(3)`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflow_entity ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP(3)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let tablePrefix = config.getEnv('database.tablePrefix');
            const tablePrefixPure = tablePrefix;
            const schema = config.getEnv('database.postgresdb.schema');
            if (schema) {
                tablePrefix = schema + '.' + tablePrefix;
            }
            yield queryRunner.query(`SET search_path TO ${schema};`);
            // `createdAt` and `updatedAt`
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflow_entity ALTER COLUMN "updatedAt" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflow_entity ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflow_entity ALTER COLUMN "createdAt" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflow_entity ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}tag_entity ALTER COLUMN "updatedAt" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}tag_entity ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}tag_entity ALTER COLUMN "createdAt" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}tag_entity ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}credentials_entity ALTER COLUMN "updatedAt" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}credentials_entity ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}credentials_entity ALTER COLUMN "createdAt" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}credentials_entity ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
            // tags
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflows_tags DROP CONSTRAINT "FK_${tablePrefixPure}5e29bfe9e22c5d6567f509d4a46"`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflows_tags DROP CONSTRAINT "FK_${tablePrefixPure}31140eb41f019805b40d0087449"`);
            yield queryRunner.query(`DROP INDEX IDX_${tablePrefixPure}5e29bfe9e22c5d6567f509d4a4`);
            yield queryRunner.query(`DROP INDEX IDX_${tablePrefixPure}31140eb41f019805b40d008744`);
            yield queryRunner.query(`DROP TABLE ${tablePrefix}workflows_tags`);
            yield queryRunner.query(`DROP INDEX IDX_${tablePrefixPure}812eb05f7451ca757fb98444ce`);
            yield queryRunner.query(`DROP TABLE ${tablePrefix}tag_entity`);
        });
    }
}
exports.CreateTagEntity1617270242566 = CreateTagEntity1617270242566;

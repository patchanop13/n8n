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
            const tablePrefix = config.getEnv('database.tablePrefix');
            yield queryRunner.query(`CREATE TABLE ${tablePrefix}role (
				\`id\` int NOT NULL AUTO_INCREMENT,
				\`name\` varchar(32) NOT NULL,
				\`scope\` varchar(255) NOT NULL,
				\`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
				\`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY (\`id\`),
				UNIQUE KEY \`UQ_${tablePrefix}5b49d0f504f7ef31045a1fb2eb8\` (\`scope\`,\`name\`)
			) ENGINE=InnoDB;`);
            yield queryRunner.query(`CREATE TABLE ${tablePrefix}user (
				\`id\` VARCHAR(36) NOT NULL,
				\`email\` VARCHAR(255) NULL DEFAULT NULL,
				\`firstName\` VARCHAR(32) NULL DEFAULT NULL,
				\`lastName\` VARCHAR(32) NULL DEFAULT NULL,
				\`password\` VARCHAR(255) NULL DEFAULT NULL,
				\`resetPasswordToken\` VARCHAR(255) NULL DEFAULT NULL,
				\`resetPasswordTokenExpiration\` INT NULL DEFAULT NULL,
				\`personalizationAnswers\` TEXT NULL DEFAULT NULL,
				\`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				\`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				\`globalRoleId\` INT NOT NULL,
				PRIMARY KEY (\`id\`),
				UNIQUE INDEX \`IDX_${tablePrefix}e12875dfb3b1d92d7d7c5377e2\` (\`email\` ASC),
				INDEX \`FK_${tablePrefix}f0609be844f9200ff4365b1bb3d\` (\`globalRoleId\` ASC)
			) ENGINE=InnoDB;`);
            yield queryRunner.query(`ALTER TABLE \`${tablePrefix}user\` ADD CONSTRAINT \`FK_${tablePrefix}f0609be844f9200ff4365b1bb3d\` FOREIGN KEY (\`globalRoleId\`) REFERENCES \`${tablePrefix}role\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`CREATE TABLE ${tablePrefix}shared_workflow (
				\`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				\`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				\`roleId\` INT NOT NULL,
				\`userId\` VARCHAR(36) NOT NULL,
				\`workflowId\` INT NOT NULL,
				INDEX \`FK_${tablePrefix}3540da03964527aa24ae014b780x\` (\`roleId\` ASC),
				INDEX \`FK_${tablePrefix}82b2fd9ec4e3e24209af8160282x\` (\`userId\` ASC),
				INDEX \`FK_${tablePrefix}b83f8d2530884b66a9c848c8b88x\` (\`workflowId\` ASC),
				PRIMARY KEY (\`userId\`, \`workflowId\`)
			) ENGINE=InnoDB;`);
            yield queryRunner.query(`ALTER TABLE \`${tablePrefix}shared_workflow\` ADD CONSTRAINT \`FK_${tablePrefix}3540da03964527aa24ae014b780\` FOREIGN KEY (\`roleId\`) REFERENCES \`${tablePrefix}role\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`${tablePrefix}shared_workflow\` ADD CONSTRAINT \`FK_${tablePrefix}82b2fd9ec4e3e24209af8160282\` FOREIGN KEY (\`userId\`) REFERENCES \`${tablePrefix}user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`${tablePrefix}shared_workflow\` ADD CONSTRAINT \`FK_${tablePrefix}b83f8d2530884b66a9c848c8b88\` FOREIGN KEY (\`workflowId\`) REFERENCES \`${tablePrefix}workflow_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`CREATE TABLE ${tablePrefix}shared_credentials (
				\`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				\`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				\`roleId\` INT NOT NULL,
				\`userId\` VARCHAR(36) NOT NULL,
				\`credentialsId\` INT NOT NULL,
				INDEX \`FK_${tablePrefix}c68e056637562000b68f480815a\` (\`roleId\` ASC),
				INDEX \`FK_${tablePrefix}484f0327e778648dd04f1d70493\` (\`userId\` ASC),
				INDEX \`FK_${tablePrefix}68661def1d4bcf2451ac8dbd949\` (\`credentialsId\` ASC),
				PRIMARY KEY (\`userId\`, \`credentialsId\`)
			) ENGINE=InnoDB;`);
            yield queryRunner.query(`ALTER TABLE \`${tablePrefix}shared_credentials\` ADD CONSTRAINT \`FK_${tablePrefix}484f0327e778648dd04f1d70493\` FOREIGN KEY (\`userId\`) REFERENCES \`${tablePrefix}user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`${tablePrefix}shared_credentials\` ADD CONSTRAINT \`FK_${tablePrefix}68661def1d4bcf2451ac8dbd949\` FOREIGN KEY (\`credentialsId\`) REFERENCES \`${tablePrefix}credentials_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`${tablePrefix}shared_credentials\` ADD CONSTRAINT \`FK_${tablePrefix}c68e056637562000b68f480815a\` FOREIGN KEY (\`roleId\`) REFERENCES \`${tablePrefix}role\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`CREATE TABLE ${tablePrefix}settings (
				\`key\` VARCHAR(255) NOT NULL,
				\`value\` TEXT NOT NULL,
				\`loadOnStartup\` TINYINT(1) NOT NULL DEFAULT 0,
				PRIMARY KEY (\`key\`)
			) ENGINE=InnoDB;`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflow_entity DROP INDEX IDX_${tablePrefix}943d8f922be094eb507cb9a7f9`);
            // Insert initial roles
            yield queryRunner.query(`INSERT INTO ${tablePrefix}role (name, scope) VALUES ("owner", "global");`);
            const instanceOwnerRole = yield queryRunner.query('SELECT LAST_INSERT_ID() as insertId');
            yield queryRunner.query(`INSERT INTO ${tablePrefix}role (name, scope) VALUES ("member", "global");`);
            yield queryRunner.query(`INSERT INTO ${tablePrefix}role (name, scope) VALUES ("owner", "workflow");`);
            const workflowOwnerRole = yield queryRunner.query('SELECT LAST_INSERT_ID() as insertId');
            yield queryRunner.query(`INSERT INTO ${tablePrefix}role (name, scope) VALUES ("owner", "credential");`);
            const credentialOwnerRole = yield queryRunner.query('SELECT LAST_INSERT_ID() as insertId');
            const survey = (0, migrationHelpers_1.loadSurveyFromDisk)();
            const ownerUserId = (0, uuid_1.v4)();
            yield queryRunner.query(`INSERT INTO ${tablePrefix}user (id, globalRoleId, personalizationAnswers) values (?, ?, ?)`, [ownerUserId, instanceOwnerRole[0].insertId, survey]);
            yield queryRunner.query(`INSERT INTO ${tablePrefix}shared_workflow (createdAt, updatedAt, roleId, userId, workflowId) select
				NOW(), NOW(), '${workflowOwnerRole[0].insertId}', '${ownerUserId}', id FROM ${tablePrefix}workflow_entity`);
            yield queryRunner.query(`INSERT INTO ${tablePrefix}shared_credentials (createdAt, updatedAt, roleId, userId, credentialsId)   SELECT NOW(), NOW(), '${credentialOwnerRole[0].insertId}', '${ownerUserId}', id FROM ${tablePrefix} credentials_entity`);
            yield queryRunner.query(`INSERT INTO ${tablePrefix}settings (\`key\`, value, loadOnStartup) VALUES ("userManagement.isInstanceOwnerSetUp", "false", 1), ("userManagement.skipInstanceOwnerSetup", "false", 1)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}workflow_entity ADD UNIQUE INDEX \`IDX_${tablePrefix}943d8f922be094eb507cb9a7f9\` (\`name\`)`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}shared_credentials"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}shared_workflow"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}user"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}role"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}settings"`);
        });
    }
}
exports.CreateUserManagement1646992772331 = CreateUserManagement1646992772331;

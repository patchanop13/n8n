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
exports.CreateTagEntity1617268711084 = void 0;
const config = __importStar(require("../../../../config"));
class CreateTagEntity1617268711084 {
    constructor() {
        this.name = 'CreateTagEntity1617268711084';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            // create tags table + relationship with workflow entity
            yield queryRunner.query('CREATE TABLE `' + tablePrefix + 'tag_entity` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(24) NOT NULL, `createdAt` datetime NOT NULL, `updatedAt` datetime NOT NULL, UNIQUE INDEX `IDX_' + tablePrefix + '8f949d7a3a984759044054e89b` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB');
            yield queryRunner.query('CREATE TABLE `' + tablePrefix + 'workflows_tags` (`workflowId` int NOT NULL, `tagId` int NOT NULL, INDEX `IDX_' + tablePrefix + '54b2f0343d6a2078fa13744386` (`workflowId`), INDEX `IDX_' + tablePrefix + '77505b341625b0b4768082e217` (`tagId`), PRIMARY KEY (`workflowId`, `tagId`)) ENGINE=InnoDB');
            yield queryRunner.query('ALTER TABLE `' + tablePrefix + 'workflows_tags` ADD CONSTRAINT `FK_' + tablePrefix + '54b2f0343d6a2078fa137443869` FOREIGN KEY (`workflowId`) REFERENCES `' + tablePrefix + 'workflow_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
            yield queryRunner.query('ALTER TABLE `' + tablePrefix + 'workflows_tags` ADD CONSTRAINT `FK_' + tablePrefix + '77505b341625b0b4768082e2171` FOREIGN KEY (`tagId`) REFERENCES `' + tablePrefix + 'tag_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
            // set default dates for `createdAt` and `updatedAt`
            yield queryRunner.query("ALTER TABLE `" + tablePrefix + "credentials_entity` CHANGE `createdAt` `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)");
            yield queryRunner.query("ALTER TABLE `" + tablePrefix + "credentials_entity` CHANGE `updatedAt` `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)");
            yield queryRunner.query("ALTER TABLE `" + tablePrefix + "tag_entity` CHANGE `createdAt` `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)");
            yield queryRunner.query("ALTER TABLE `" + tablePrefix + "tag_entity` CHANGE `updatedAt` `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)");
            yield queryRunner.query("ALTER TABLE `" + tablePrefix + "workflow_entity` CHANGE `createdAt` `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)");
            yield queryRunner.query("ALTER TABLE `" + tablePrefix + "workflow_entity` CHANGE `updatedAt` `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            // `createdAt` and `updatedAt`
            yield queryRunner.query("ALTER TABLE `" + tablePrefix + "workflow_entity` CHANGE `updatedAt` `updatedAt` datetime NOT NULL");
            yield queryRunner.query("ALTER TABLE `" + tablePrefix + "workflow_entity` CHANGE `createdAt` `createdAt` datetime NOT NULL");
            yield queryRunner.query("ALTER TABLE `" + tablePrefix + "tag_entity` CHANGE `updatedAt` `updatedAt` datetime NOT NULL");
            yield queryRunner.query("ALTER TABLE `" + tablePrefix + "tag_entity` CHANGE `createdAt` `createdAt` datetime NOT NULL");
            yield queryRunner.query("ALTER TABLE `" + tablePrefix + "credentials_entity` CHANGE `updatedAt` `updatedAt` datetime NOT NULL");
            yield queryRunner.query("ALTER TABLE `" + tablePrefix + "credentials_entity` CHANGE `createdAt` `createdAt` datetime NOT NULL");
            // tags
            yield queryRunner.query('ALTER TABLE `' + tablePrefix + 'workflows_tags` DROP FOREIGN KEY `FK_' + tablePrefix + '77505b341625b0b4768082e2171`');
            yield queryRunner.query('ALTER TABLE `' + tablePrefix + 'workflows_tags` DROP FOREIGN KEY `FK_' + tablePrefix + '54b2f0343d6a2078fa137443869`');
            yield queryRunner.query('DROP INDEX `IDX_' + tablePrefix + '77505b341625b0b4768082e217` ON `' + tablePrefix + 'workflows_tags`');
            yield queryRunner.query('DROP INDEX `IDX_' + tablePrefix + '54b2f0343d6a2078fa13744386` ON `' + tablePrefix + 'workflows_tags`');
            yield queryRunner.query('DROP TABLE `' + tablePrefix + 'workflows_tags`');
            yield queryRunner.query('DROP INDEX `IDX_' + tablePrefix + '8f949d7a3a984759044054e89b` ON `' + tablePrefix + 'tag_entity`');
            yield queryRunner.query('DROP TABLE `' + tablePrefix + 'tag_entity`');
        });
    }
}
exports.CreateTagEntity1617268711084 = CreateTagEntity1617268711084;

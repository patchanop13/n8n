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
exports.InitialMigration1588157391238 = void 0;
const config = __importStar(require("../../../../config"));
class InitialMigration1588157391238 {
    constructor() {
        this.name = 'InitialMigration1588157391238';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            yield queryRunner.query('CREATE TABLE IF NOT EXISTS `' + tablePrefix + 'credentials_entity` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(128) NOT NULL, `data` text NOT NULL, `type` varchar(32) NOT NULL, `nodesAccess` json NOT NULL, `createdAt` datetime NOT NULL, `updatedAt` datetime NOT NULL, INDEX `IDX_' + tablePrefix + '07fde106c0b471d8cc80a64fc8` (`type`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
            yield queryRunner.query('CREATE TABLE IF NOT EXISTS `' + tablePrefix + 'execution_entity` (`id` int NOT NULL AUTO_INCREMENT, `data` text NOT NULL, `finished` tinyint NOT NULL, `mode` varchar(255) NOT NULL, `retryOf` varchar(255) NULL, `retrySuccessId` varchar(255) NULL, `startedAt` datetime NOT NULL, `stoppedAt` datetime NOT NULL, `workflowData` json NOT NULL, `workflowId` varchar(255) NULL, INDEX `IDX_' + tablePrefix + 'c4d999a5e90784e8caccf5589d` (`workflowId`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
            yield queryRunner.query('CREATE TABLE IF NOT EXISTS`' + tablePrefix + 'workflow_entity` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(128) NOT NULL, `active` tinyint NOT NULL, `nodes` json NOT NULL, `connections` json NOT NULL, `createdAt` datetime NOT NULL, `updatedAt` datetime NOT NULL, `settings` json NULL, `staticData` json NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            yield queryRunner.query('DROP TABLE `' + tablePrefix + 'workflow_entity`', undefined);
            yield queryRunner.query('DROP INDEX `IDX_' + tablePrefix + 'c4d999a5e90784e8caccf5589d` ON `' + tablePrefix + 'execution_entity`', undefined);
            yield queryRunner.query('DROP TABLE `' + tablePrefix + 'execution_entity`', undefined);
            yield queryRunner.query('DROP INDEX `IDX_' + tablePrefix + '07fde106c0b471d8cc80a64fc8` ON `' + tablePrefix + 'credentials_entity`', undefined);
            yield queryRunner.query('DROP TABLE `' + tablePrefix + 'credentials_entity`', undefined);
        });
    }
}
exports.InitialMigration1588157391238 = InitialMigration1588157391238;

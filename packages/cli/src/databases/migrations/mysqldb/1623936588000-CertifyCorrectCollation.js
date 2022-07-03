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
exports.CertifyCorrectCollation1623936588000 = void 0;
const config = __importStar(require("../../../../config"));
class CertifyCorrectCollation1623936588000 {
    constructor() {
        this.name = 'CertifyCorrectCollation1623936588000';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            const databaseType = config.getEnv('database.type');
            if (databaseType === 'mariadb') {
                // This applies to MySQL only.
                return;
            }
            const checkCollationExistence = yield queryRunner.query(`show collation where collation like 'utf8mb4_0900_ai_ci';`);
            let collation = 'utf8mb4_general_ci';
            if (checkCollationExistence.length > 0) {
                collation = 'utf8mb4_0900_ai_ci';
            }
            const databaseName = config.getEnv(`database.mysqldb.database`);
            yield queryRunner.query(`ALTER DATABASE \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE ${collation};`);
            for (const tableName of [
                'credentials_entity',
                'execution_entity',
                'tag_entity',
                'webhook_entity',
                'workflow_entity',
                'workflows_tags',
            ]) {
                yield queryRunner.query(`ALTER TABLE ${tablePrefix}${tableName} CONVERT TO CHARACTER SET utf8mb4 COLLATE ${collation};`);
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // There is nothing to undo in this case as we already expect default collation to be utf8mb4
            // This migration exists simply to enforce that n8n will work with
            // older mysql versions
        });
    }
}
exports.CertifyCorrectCollation1623936588000 = CertifyCorrectCollation1623936588000;

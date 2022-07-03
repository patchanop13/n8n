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
exports.AddExecutionEntityIndexes1644422880309 = void 0;
const config = __importStar(require("../../../../config"));
class AddExecutionEntityIndexes1644422880309 {
    constructor() {
        this.name = 'AddExecutionEntityIndexes1644422880309';
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
            yield queryRunner.query(`DROP INDEX IF EXISTS "${schema}".IDX_${tablePrefixPure}c4d999a5e90784e8caccf5589d`);
            yield queryRunner.query(`DROP INDEX IF EXISTS "${schema}".IDX_${tablePrefixPure}ca4a71b47f28ac6ea88293a8e2`);
            yield queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_${tablePrefixPure}33228da131bb1112247cf52a42" ON ${tablePrefix}execution_entity ("stoppedAt") `);
            yield queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_${tablePrefixPure}58154df94c686818c99fb754ce" ON ${tablePrefix}execution_entity ("workflowId", "waitTill", "id") `);
            yield queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_${tablePrefixPure}4f474ac92be81610439aaad61e" ON ${tablePrefix}execution_entity ("workflowId", "finished", "id") `);
            yield queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_${tablePrefixPure}72ffaaab9f04c2c1f1ea86e662" ON ${tablePrefix}execution_entity ("finished", "id") `);
            yield queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_${tablePrefixPure}85b981df7b444f905f8bf50747" ON ${tablePrefix}execution_entity ("waitTill", "id") `);
            yield queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_${tablePrefixPure}d160d4771aba5a0d78943edbe3" ON ${tablePrefix}execution_entity ("workflowId", "id") `);
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
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefixPure}d160d4771aba5a0d78943edbe3"`);
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefixPure}85b981df7b444f905f8bf50747"`);
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefixPure}72ffaaab9f04c2c1f1ea86e662"`);
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefixPure}4f474ac92be81610439aaad61e"`);
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefixPure}58154df94c686818c99fb754ce"`);
            yield queryRunner.query(`DROP INDEX "IDX_${tablePrefixPure}33228da131bb1112247cf52a42"`);
            yield queryRunner.query(`CREATE INDEX "IDX_${tablePrefixPure}ca4a71b47f28ac6ea88293a8e2" ON ${tablePrefix}execution_entity ("waitTill") `);
            yield queryRunner.query(`CREATE INDEX "IDX_${tablePrefixPure}c4d999a5e90784e8caccf5589d" ON ${tablePrefix}execution_entity ("workflowId") `);
        });
    }
}
exports.AddExecutionEntityIndexes1644422880309 = AddExecutionEntityIndexes1644422880309;

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
exports.CreateIndexStoppedAt1594828256133 = void 0;
const config = __importStar(require("../../../../config"));
class CreateIndexStoppedAt1594828256133 {
    constructor() {
        this.name = 'CreateIndexStoppedAt1594828256133';
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
            yield queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_${tablePrefixPure}33228da131bb1112247cf52a42 ON ${tablePrefix}execution_entity ("stoppedAt") `);
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
            yield queryRunner.query(`DROP INDEX IDX_${tablePrefixPure}33228da131bb1112247cf52a42`);
        });
    }
}
exports.CreateIndexStoppedAt1594828256133 = CreateIndexStoppedAt1594828256133;

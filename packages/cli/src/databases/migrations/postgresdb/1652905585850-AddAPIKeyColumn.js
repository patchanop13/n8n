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
exports.AddAPIKeyColumn1652905585850 = void 0;
const config_1 = __importDefault(require("../../../../config"));
class AddAPIKeyColumn1652905585850 {
    constructor() {
        this.name = 'AddAPIKeyColumn1652905585850';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let tablePrefix = config_1.default.getEnv('database.tablePrefix');
            const schema = config_1.default.getEnv('database.postgresdb.schema');
            if (schema) {
                tablePrefix = schema + '.' + tablePrefix;
            }
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}user ADD COLUMN "apiKey" VARCHAR(255)`);
            yield queryRunner.query(`CREATE UNIQUE INDEX "UQ_${tablePrefix}ie0zomxves9w3p774drfrkxtj5" ON ${tablePrefix}user ("apiKey")`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let tablePrefix = config_1.default.getEnv('database.tablePrefix');
            const schema = config_1.default.getEnv('database.postgresdb.schema');
            if (schema) {
                tablePrefix = schema + '.' + tablePrefix;
            }
            yield queryRunner.query(`DROP INDEX "UQ_${tablePrefix}ie0zomxves9w3p774drfrkxtj5"`);
            yield queryRunner.query(`ALTER TABLE ${tablePrefix}user DROP COLUMN "apiKey"`);
        });
    }
}
exports.AddAPIKeyColumn1652905585850 = AddAPIKeyColumn1652905585850;

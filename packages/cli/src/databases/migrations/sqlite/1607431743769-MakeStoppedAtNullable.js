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
exports.MakeStoppedAtNullable1607431743769 = void 0;
const config = __importStar(require("../../../../config"));
const migrationHelpers_1 = require("../../utils/migrationHelpers");
class MakeStoppedAtNullable1607431743769 {
    constructor() {
        this.name = 'MakeStoppedAtNullable1607431743769';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, migrationHelpers_1.logMigrationStart)(this.name);
            const tablePrefix = config.getEnv('database.tablePrefix');
            // SQLite does not allow us to simply "alter column"
            // We're hacking the way sqlite identifies tables
            // Allowing a column to become nullable
            // This is a very strict case when this can be done safely
            // As no collateral effects exist.
            yield queryRunner.query(`PRAGMA writable_schema = 1; `, undefined);
            yield queryRunner.query(`UPDATE SQLITE_MASTER SET SQL = 'CREATE TABLE IF NOT EXISTS "${tablePrefix}execution_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "data" text NOT NULL, "finished" boolean NOT NULL, "mode" varchar NOT NULL, "retryOf" varchar, "retrySuccessId" varchar, "startedAt" datetime NOT NULL, "stoppedAt" datetime, "workflowData" text NOT NULL, "workflowId" varchar)' WHERE NAME = "${tablePrefix}execution_entity";`, undefined);
            yield queryRunner.query(`PRAGMA writable_schema = 0;`, undefined);
            (0, migrationHelpers_1.logMigrationEnd)(this.name);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // This cannot be undone as the table might already have nullable values
        });
    }
}
exports.MakeStoppedAtNullable1607431743769 = MakeStoppedAtNullable1607431743769;

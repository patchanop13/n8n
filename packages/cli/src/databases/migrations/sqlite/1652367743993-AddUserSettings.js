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
exports.AddUserSettings1652367743993 = void 0;
const config = __importStar(require("../../../../config"));
const migrationHelpers_1 = require("../../utils/migrationHelpers");
class AddUserSettings1652367743993 {
    constructor() {
        this.name = 'AddUserSettings1652367743993';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, migrationHelpers_1.logMigrationStart)(this.name);
            const tablePrefix = config.getEnv('database.tablePrefix');
            yield queryRunner.query('PRAGMA foreign_keys=OFF');
            yield queryRunner.query(`CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar(255), "firstName" varchar(32), "lastName" varchar(32), "password" varchar, "resetPasswordToken" varchar, "resetPasswordTokenExpiration" integer DEFAULT NULL, "personalizationAnswers" text, "createdAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "updatedAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "globalRoleId" integer NOT NULL, "settings" text, CONSTRAINT "FK_${tablePrefix}f0609be844f9200ff4365b1bb3d" FOREIGN KEY ("globalRoleId") REFERENCES "${tablePrefix}role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "temporary_user"("id", "email", "firstName", "lastName", "password", "resetPasswordToken", "resetPasswordTokenExpiration", "personalizationAnswers", "createdAt", "updatedAt", "globalRoleId") SELECT "id", "email", "firstName", "lastName", "password", "resetPasswordToken", "resetPasswordTokenExpiration", "personalizationAnswers", "createdAt", "updatedAt", "globalRoleId" FROM "${tablePrefix}user"`);
            yield queryRunner.query(`DROP TABLE "${tablePrefix}user"`);
            yield queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "${tablePrefix}user"`);
            yield queryRunner.query(`CREATE UNIQUE INDEX "UQ_${tablePrefix}e12875dfb3b1d92d7d7c5377e2" ON "${tablePrefix}user" ("email")`);
            yield queryRunner.query('PRAGMA foreign_keys=ON');
            (0, migrationHelpers_1.logMigrationEnd)(this.name);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            yield queryRunner.query('PRAGMA foreign_keys=OFF');
            yield queryRunner.query(`ALTER TABLE "${tablePrefix}user" RENAME TO "temporary_user"`);
            yield queryRunner.query(`CREATE TABLE "${tablePrefix}user" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar(255), "firstName" varchar(32), "lastName" varchar(32), "password" varchar, "resetPasswordToken" varchar, "resetPasswordTokenExpiration" integer DEFAULT NULL, "personalizationAnswers" text, "createdAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "updatedAt" datetime(3) NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')), "globalRoleId" integer NOT NULL, CONSTRAINT "FK_${tablePrefix}f0609be844f9200ff4365b1bb3d" FOREIGN KEY ("globalRoleId") REFERENCES "${tablePrefix}role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "${tablePrefix}user"("id", "email", "firstName", "lastName", "password", "resetPasswordToken", "resetPasswordTokenExpiration", "personalizationAnswers", "createdAt", "updatedAt", "globalRoleId") SELECT "id", "email", "firstName", "lastName", "password", "resetPasswordToken", "resetPasswordTokenExpiration", "personalizationAnswers", "createdAt", "updatedAt", "globalRoleId" FROM "temporary_user"`);
            yield queryRunner.query(`DROP TABLE "temporary_user"`);
            yield queryRunner.query(`CREATE UNIQUE INDEX "UQ_${tablePrefix}e12875dfb3b1d92d7d7c5377e2" ON "${tablePrefix}user" ("email")`);
            yield queryRunner.query('PRAGMA foreign_keys=ON');
        });
    }
}
exports.AddUserSettings1652367743993 = AddUserSettings1652367743993;

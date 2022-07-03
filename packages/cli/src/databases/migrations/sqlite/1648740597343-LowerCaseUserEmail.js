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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LowerCaseUserEmail1648740597343 = void 0;
const config = require("../../../../config");
const migrationHelpers_1 = require("../../utils/migrationHelpers");
class LowerCaseUserEmail1648740597343 {
    constructor() {
        this.name = 'LowerCaseUserEmail1648740597343';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, migrationHelpers_1.logMigrationStart)(this.name);
            const tablePrefix = config.get('database.tablePrefix');
            yield queryRunner.query(`
			UPDATE "${tablePrefix}user"
			SET email = LOWER(email);
		`);
            (0, migrationHelpers_1.logMigrationEnd)(this.name);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.LowerCaseUserEmail1648740597343 = LowerCaseUserEmail1648740597343;

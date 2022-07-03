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
exports.AddExecutionEntityIndexes1644424784709 = void 0;
const config = __importStar(require("../../../../config"));
class AddExecutionEntityIndexes1644424784709 {
    constructor() {
        this.name = 'AddExecutionEntityIndexes1644424784709';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            yield queryRunner.query('DROP INDEX `IDX_c4d999a5e90784e8caccf5589d` ON `' + tablePrefix + 'execution_entity`');
            yield queryRunner.query('DROP INDEX `IDX_ca4a71b47f28ac6ea88293a8e2` ON `' + tablePrefix + 'execution_entity`');
            yield queryRunner.query('CREATE INDEX `IDX_06da892aaf92a48e7d3e400003` ON `' +
                tablePrefix +
                'execution_entity` (`workflowId`, `waitTill`, `id`)');
            yield queryRunner.query('CREATE INDEX `IDX_78d62b89dc1433192b86dce18a` ON `' +
                tablePrefix +
                'execution_entity` (`workflowId`, `finished`, `id`)');
            yield queryRunner.query('CREATE INDEX `IDX_1688846335d274033e15c846a4` ON `' +
                tablePrefix +
                'execution_entity` (`finished`, `id`)');
            yield queryRunner.query('CREATE INDEX `IDX_b94b45ce2c73ce46c54f20b5f9` ON `' +
                tablePrefix +
                'execution_entity` (`waitTill`, `id`)');
            yield queryRunner.query('CREATE INDEX `IDX_81fc04c8a17de15835713505e4` ON `' +
                tablePrefix +
                'execution_entity` (`workflowId`, `id`)');
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            yield queryRunner.query('DROP INDEX `IDX_81fc04c8a17de15835713505e4` ON `' + tablePrefix + 'execution_entity`');
            yield queryRunner.query('DROP INDEX `IDX_b94b45ce2c73ce46c54f20b5f9` ON `' + tablePrefix + 'execution_entity`');
            yield queryRunner.query('DROP INDEX `IDX_1688846335d274033e15c846a4` ON `' + tablePrefix + 'execution_entity`');
            yield queryRunner.query('DROP INDEX `IDX_78d62b89dc1433192b86dce18a` ON `' + tablePrefix + 'execution_entity`');
            yield queryRunner.query('DROP INDEX `IDX_06da892aaf92a48e7d3e400003` ON `' + tablePrefix + 'execution_entity`');
            yield queryRunner.query('CREATE INDEX `IDX_ca4a71b47f28ac6ea88293a8e2` ON `' +
                tablePrefix +
                'execution_entity` (`waitTill`)');
            yield queryRunner.query('CREATE INDEX `IDX_c4d999a5e90784e8caccf5589d` ON `' +
                tablePrefix +
                'execution_entity` (`workflowId`)');
        });
    }
}
exports.AddExecutionEntityIndexes1644424784709 = AddExecutionEntityIndexes1644424784709;

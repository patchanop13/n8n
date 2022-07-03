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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionEntity = void 0;
const typeorm_1 = require("typeorm");
const config = __importStar(require("../../../config"));
function resolveDataType(dataType) {
    var _a;
    const dbType = config.getEnv('database.type');
    const typeMap = {
        sqlite: {
            json: 'simple-json',
        },
        postgresdb: {
            datetime: 'timestamptz',
        },
        mysqldb: {},
        mariadb: {},
    };
    return (_a = typeMap[dbType][dataType]) !== null && _a !== void 0 ? _a : dataType;
}
let ExecutionEntity = class ExecutionEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], ExecutionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text')
], ExecutionEntity.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)()
], ExecutionEntity.prototype, "finished", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar')
], ExecutionEntity.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true })
], ExecutionEntity.prototype, "retryOf", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true })
], ExecutionEntity.prototype, "retrySuccessId", void 0);
__decorate([
    (0, typeorm_1.Column)(resolveDataType('datetime'))
], ExecutionEntity.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: resolveDataType('datetime'), nullable: true })
], ExecutionEntity.prototype, "stoppedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(resolveDataType('json'))
], ExecutionEntity.prototype, "workflowData", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true })
], ExecutionEntity.prototype, "workflowId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: resolveDataType('datetime'), nullable: true })
], ExecutionEntity.prototype, "waitTill", void 0);
ExecutionEntity = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['workflowId', 'id']),
    (0, typeorm_1.Index)(['waitTill', 'id']),
    (0, typeorm_1.Index)(['finished', 'id']),
    (0, typeorm_1.Index)(['workflowId', 'finished', 'id']),
    (0, typeorm_1.Index)(['workflowId', 'waitTill', 'id'])
], ExecutionEntity);
exports.ExecutionEntity = ExecutionEntity;

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
exports.WorkflowEntity = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-cycle */
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const config = __importStar(require("../../../config"));
const TagEntity_1 = require("./TagEntity");
const SharedWorkflow_1 = require("./SharedWorkflow");
const transformers_1 = require("../utils/transformers");
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
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getTimestampSyntax() {
    const dbType = config.getEnv('database.type');
    const map = {
        sqlite: "STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')",
        postgresdb: 'CURRENT_TIMESTAMP(3)',
        mysqldb: 'CURRENT_TIMESTAMP(3)',
        mariadb: 'CURRENT_TIMESTAMP(3)',
    };
    return map[dbType];
}
let WorkflowEntity = class WorkflowEntity {
    setUpdateDate() {
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], WorkflowEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, class_validator_1.Length)(1, 128, {
        message: 'Workflow name must be $constraint1 to $constraint2 characters long.',
    }),
    (0, typeorm_1.Column)({ length: 128 })
], WorkflowEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)()
], WorkflowEntity.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)(resolveDataType('json'))
], WorkflowEntity.prototype, "nodes", void 0);
__decorate([
    (0, typeorm_1.Column)(resolveDataType('json'))
], WorkflowEntity.prototype, "connections", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ precision: 3, default: () => getTimestampSyntax() })
], WorkflowEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        precision: 3,
        default: () => getTimestampSyntax(),
        onUpdate: getTimestampSyntax(),
    })
], WorkflowEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: resolveDataType('json'),
        nullable: true,
    })
], WorkflowEntity.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: resolveDataType('json'),
        nullable: true,
        transformer: transformers_1.objectRetriever,
    })
], WorkflowEntity.prototype, "staticData", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => TagEntity_1.TagEntity, (tag) => tag.workflows),
    (0, typeorm_1.JoinTable)({
        name: 'workflows_tags',
        joinColumn: {
            name: 'workflowId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tagId',
            referencedColumnName: 'id',
        },
    })
], WorkflowEntity.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SharedWorkflow_1.SharedWorkflow, (sharedWorkflow) => sharedWorkflow.workflow)
], WorkflowEntity.prototype, "shared", void 0);
__decorate([
    (0, typeorm_1.BeforeUpdate)()
], WorkflowEntity.prototype, "setUpdateDate", null);
WorkflowEntity = __decorate([
    (0, typeorm_1.Entity)()
], WorkflowEntity);
exports.WorkflowEntity = WorkflowEntity;

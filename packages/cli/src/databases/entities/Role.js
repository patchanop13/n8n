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
exports.Role = void 0;
/* eslint-disable import/no-cycle */
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const config = __importStar(require("../../../config"));
const User_1 = require("./User");
const SharedWorkflow_1 = require("./SharedWorkflow");
const SharedCredentials_1 = require("./SharedCredentials");
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
let Role = class Role {
    setUpdateDate() {
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Role.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 32 }),
    (0, class_validator_1.IsString)({ message: 'Role name must be of type string.' }),
    (0, class_validator_1.Length)(1, 32, { message: 'Role name must be 1 to 32 characters long.' })
], Role.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)()
], Role.prototype, "scope", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User_1.User, (user) => user.globalRole)
], Role.prototype, "globalForUsers", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ precision: 3, default: () => getTimestampSyntax() }),
    (0, class_validator_1.IsOptional)() // ignored by validation because set at DB level
    ,
    (0, class_validator_1.IsDate)()
], Role.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        precision: 3,
        default: () => getTimestampSyntax(),
        onUpdate: getTimestampSyntax(),
    }),
    (0, class_validator_1.IsOptional)() // ignored by validation because set at DB level
    ,
    (0, class_validator_1.IsDate)()
], Role.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SharedWorkflow_1.SharedWorkflow, (sharedWorkflow) => sharedWorkflow.role)
], Role.prototype, "sharedWorkflows", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SharedCredentials_1.SharedCredentials, (sharedCredentials) => sharedCredentials.role)
], Role.prototype, "sharedCredentials", void 0);
__decorate([
    (0, typeorm_1.BeforeUpdate)()
], Role.prototype, "setUpdateDate", null);
Role = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['scope', 'name'])
], Role);
exports.Role = Role;

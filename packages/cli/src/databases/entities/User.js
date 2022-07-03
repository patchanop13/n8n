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
exports.User = exports.MAX_PASSWORD_LENGTH = exports.MIN_PASSWORD_LENGTH = void 0;
/* eslint-disable import/no-cycle */
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const config = __importStar(require("../../../config"));
const Role_1 = require("./Role");
const SharedWorkflow_1 = require("./SharedWorkflow");
const SharedCredentials_1 = require("./SharedCredentials");
const customValidators_1 = require("../utils/customValidators");
const transformers_1 = require("../utils/transformers");
exports.MIN_PASSWORD_LENGTH = 8;
exports.MAX_PASSWORD_LENGTH = 64;
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
let User = class User {
    preUpsertHook() {
        var _a, _b;
        this.email = (_b = (_a = this.email) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : null;
        this.updatedAt = new Date();
    }
    computeIsPending() {
        this.isPending = this.password == null;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 254,
        nullable: true,
        transformer: transformers_1.lowerCaser,
    }),
    (0, typeorm_1.Index)({ unique: true }),
    (0, class_validator_1.IsEmail)()
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 32, nullable: true }),
    (0, customValidators_1.NoXss)(),
    (0, class_validator_1.IsString)({ message: 'First name must be of type string.' }),
    (0, class_validator_1.Length)(1, 32, { message: 'First name must be $constraint1 to $constraint2 characters long.' })
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 32, nullable: true }),
    (0, customValidators_1.NoXss)(),
    (0, class_validator_1.IsString)({ message: 'Last name must be of type string.' }),
    (0, class_validator_1.Length)(1, 32, { message: 'Last name must be $constraint1 to $constraint2 characters long.' })
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsString)({ message: 'Password must be of type string.' })
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, nullable: true })
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Number, nullable: true })
], User.prototype, "resetPasswordTokenExpiration", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: resolveDataType('json'),
        nullable: true,
        transformer: transformers_1.objectRetriever,
    })
], User.prototype, "personalizationAnswers", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: resolveDataType('json'),
        nullable: true,
    })
], User.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Role_1.Role, (role) => role.globalForUsers, {
        cascade: true,
        nullable: false,
    })
], User.prototype, "globalRole", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SharedWorkflow_1.SharedWorkflow, (sharedWorkflow) => sharedWorkflow.user)
], User.prototype, "sharedWorkflows", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SharedCredentials_1.SharedCredentials, (sharedCredentials) => sharedCredentials.user)
], User.prototype, "sharedCredentials", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ precision: 3, default: () => getTimestampSyntax() })
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        precision: 3,
        default: () => getTimestampSyntax(),
        onUpdate: getTimestampSyntax(),
    })
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)()
], User.prototype, "preUpsertHook", null);
__decorate([
    (0, typeorm_1.Column)({ type: String, nullable: true }),
    (0, typeorm_1.Index)({ unique: true })
], User.prototype, "apiKey", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    (0, typeorm_1.AfterUpdate)()
], User.prototype, "computeIsPending", null);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;

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
exports.SharedCredentials = void 0;
/* eslint-disable import/no-cycle */
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const config = __importStar(require("../../../config"));
const CredentialsEntity_1 = require("./CredentialsEntity");
const User_1 = require("./User");
const Role_1 = require("./Role");
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
let SharedCredentials = class SharedCredentials {
    setUpdateDate() {
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => Role_1.Role, (role) => role.sharedCredentials, { nullable: false })
], SharedCredentials.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.sharedCredentials, { primary: true })
], SharedCredentials.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.RelationId)((sharedCredential) => sharedCredential.user)
], SharedCredentials.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CredentialsEntity_1.CredentialsEntity, (credentials) => credentials.shared, {
        primary: true,
        onDelete: 'CASCADE',
    })
], SharedCredentials.prototype, "credentials", void 0);
__decorate([
    (0, typeorm_1.RelationId)((sharedCredential) => sharedCredential.credentials)
], SharedCredentials.prototype, "credentialId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ precision: 3, default: () => getTimestampSyntax() }),
    (0, class_validator_1.IsOptional)() // ignored by validation because set at DB level
    ,
    (0, class_validator_1.IsDate)()
], SharedCredentials.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        precision: 3,
        default: () => getTimestampSyntax(),
        onUpdate: getTimestampSyntax(),
    }),
    (0, class_validator_1.IsOptional)() // ignored by validation because set at DB level
    ,
    (0, class_validator_1.IsDate)()
], SharedCredentials.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeUpdate)()
], SharedCredentials.prototype, "setUpdateDate", null);
SharedCredentials = __decorate([
    (0, typeorm_1.Entity)()
], SharedCredentials);
exports.SharedCredentials = SharedCredentials;

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
exports.CredentialsEntity = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const config = __importStar(require("../../../config"));
const SharedCredentials_1 = require("./SharedCredentials");
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
        sqlite: `STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')`,
        postgresdb: 'CURRENT_TIMESTAMP(3)',
        mysqldb: 'CURRENT_TIMESTAMP(3)',
        mariadb: 'CURRENT_TIMESTAMP(3)',
    };
    return map[dbType];
}
let CredentialsEntity = class CredentialsEntity {
    setUpdateDate() {
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], CredentialsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 128 }),
    (0, class_validator_1.IsString)({ message: 'Credential `name` must be of type string.' }),
    (0, class_validator_1.Length)(3, 128, {
        message: 'Credential name must be $constraint1 to $constraint2 characters long.',
    })
], CredentialsEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    (0, class_validator_1.IsObject)()
], CredentialsEntity.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, class_validator_1.IsString)({ message: 'Credential `type` must be of type string.' }),
    (0, typeorm_1.Column)({
        length: 128,
    })
], CredentialsEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SharedCredentials_1.SharedCredentials, (sharedCredentials) => sharedCredentials.credentials)
], CredentialsEntity.prototype, "shared", void 0);
__decorate([
    (0, typeorm_1.Column)(resolveDataType('json')),
    (0, class_validator_1.IsArray)()
], CredentialsEntity.prototype, "nodesAccess", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ precision: 3, default: () => getTimestampSyntax() })
], CredentialsEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        precision: 3,
        default: () => getTimestampSyntax(),
        onUpdate: getTimestampSyntax(),
    })
], CredentialsEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeUpdate)()
], CredentialsEntity.prototype, "setUpdateDate", null);
CredentialsEntity = __decorate([
    (0, typeorm_1.Entity)()
], CredentialsEntity);
exports.CredentialsEntity = CredentialsEntity;

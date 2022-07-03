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
exports.CredentialsOverwrites = void 0;
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
class CredentialsOverwritesClass {
    constructor() {
        this.credentialTypes = (0, _1.CredentialTypes)();
        this.overwriteData = {};
        this.resolvedTypes = [];
    }
    init(overwriteData) {
        return __awaiter(this, void 0, void 0, function* () {
            // If data gets reinitialized reset the resolved types cache
            this.resolvedTypes.length = 0;
            if (overwriteData !== undefined) {
                // If data is already given it can directly be set instead of
                // loaded from environment
                this.__setData(JSON.parse(JSON.stringify(overwriteData)));
                return;
            }
            const data = (yield _1.GenericHelpers.getConfigValue('credentials.overwrite.data'));
            try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-shadow
                const overwriteData = JSON.parse(data);
                this.__setData(overwriteData);
            }
            catch (error) {
                throw new Error(`The credentials-overwrite is not valid JSON.`);
            }
        });
    }
    __setData(overwriteData) {
        this.overwriteData = overwriteData;
        // eslint-disable-next-line no-restricted-syntax
        for (const credentialTypeData of this.credentialTypes.getAll()) {
            const type = credentialTypeData.name;
            const overwrites = this.__getExtended(type);
            if (overwrites && Object.keys(overwrites).length) {
                this.overwriteData[type] = overwrites;
                credentialTypeData.__overwrittenProperties = Object.keys(overwrites);
            }
        }
    }
    applyOverwrite(type, data) {
        const overwrites = this.get(type);
        if (overwrites === undefined) {
            return data;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const returnData = JSON.parse(JSON.stringify(data));
        // Overwrite only if there is currently no data set
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(overwrites)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if ([null, undefined, ''].includes(returnData[key])) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                returnData[key] = overwrites[key];
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return returnData;
    }
    __getExtended(type) {
        if (this.resolvedTypes.includes(type)) {
            // Type got already resolved and can so returned directly
            return this.overwriteData[type];
        }
        const credentialTypeData = this.credentialTypes.getByName(type);
        if (credentialTypeData === undefined) {
            throw new Error(`The credentials of type "${type}" are not known.`);
        }
        if (credentialTypeData.extends === undefined) {
            this.resolvedTypes.push(type);
            return this.overwriteData[type];
        }
        const overwrites = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const credentialsTypeName of credentialTypeData.extends) {
            Object.assign(overwrites, this.__getExtended(credentialsTypeName));
        }
        if (this.overwriteData[type] !== undefined) {
            Object.assign(overwrites, this.overwriteData[type]);
        }
        this.resolvedTypes.push(type);
        return overwrites;
    }
    get(type) {
        return this.overwriteData[type];
    }
    getAll() {
        return this.overwriteData;
    }
}
let credentialsOverwritesInstance;
// eslint-disable-next-line @typescript-eslint/naming-convention
function CredentialsOverwrites() {
    if (credentialsOverwritesInstance === undefined) {
        credentialsOverwritesInstance = new CredentialsOverwritesClass();
    }
    return credentialsOverwritesInstance;
}
exports.CredentialsOverwrites = CredentialsOverwrites;

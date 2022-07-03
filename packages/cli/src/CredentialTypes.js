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
exports.CredentialTypes = void 0;
const constants_1 = require("./constants");
class CredentialTypesClass {
    constructor() {
        this.credentialTypes = {};
    }
    init(credentialTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            this.credentialTypes = credentialTypes;
        });
    }
    getAll() {
        return Object.values(this.credentialTypes).map((data) => data.type);
    }
    getByName(credentialType) {
        try {
            return this.credentialTypes[credentialType].type;
        }
        catch (error) {
            throw new Error(`${constants_1.RESPONSE_ERROR_MESSAGES.NO_CREDENTIAL}: ${credentialType}`);
        }
    }
}
let credentialTypesInstance;
// eslint-disable-next-line @typescript-eslint/naming-convention
function CredentialTypes() {
    if (credentialTypesInstance === undefined) {
        credentialTypesInstance = new CredentialTypesClass();
    }
    return credentialTypesInstance;
}
exports.CredentialTypes = CredentialTypes;

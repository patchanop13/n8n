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
exports.SyncroMspV1 = void 0;
const versionDescription_1 = require("./actions/versionDescription");
const methods_1 = require("./methods");
const router_1 = require("./actions/router");
const transport_1 = require("./transport");
class SyncroMspV1 {
    constructor(baseDescription) {
        this.methods = {
            loadOptions: methods_1.loadOptions,
            credentialTest: {
                syncroMspApiCredentialTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield transport_1.validateCredentials.call(this, credential.data);
                        }
                        catch (error) {
                            if (error.statusCode === 401) {
                                return {
                                    status: 'Error',
                                    message: 'The API Key included in the request is invalid',
                                };
                            }
                        }
                        return {
                            status: 'OK',
                            message: 'Connection successful!',
                        };
                    });
                },
            },
        };
        this.description = Object.assign(Object.assign({}, baseDescription), versionDescription_1.versionDescription);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield router_1.router.call(this);
        });
    }
}
exports.SyncroMspV1 = SyncroMspV1;

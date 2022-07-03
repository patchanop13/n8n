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
exports.bambooHrApiCredentialTest = void 0;
function bambooHrApiCredentialTest(credential) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield validateCredentials.call(this, credential.data);
        }
        catch (error) {
            return {
                status: 'Error',
                message: 'The API Key included in the request is invalid',
            };
        }
        return {
            status: 'OK',
            message: 'Connection successful!',
        };
    });
}
exports.bambooHrApiCredentialTest = bambooHrApiCredentialTest;
function validateCredentials(decryptedCredentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = decryptedCredentials;
        const { subdomain, apiKey, } = credentials;
        const options = {
            method: 'GET',
            auth: {
                username: apiKey,
                password: 'x',
            },
            url: `https://api.bamboohr.com/api/gateway.php/${subdomain}/v1/employees/directory`,
        };
        return yield this.helpers.request(options);
    });
}

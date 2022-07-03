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
const CredentialsHelper_1 = require("../../../../CredentialsHelper");
const CredentialTypes_1 = require("../../../../CredentialTypes");
const global_middleware_1 = require("../../shared/middlewares/global.middleware");
const credentials_middleware_1 = require("./credentials.middleware");
const credentials_service_1 = require("./credentials.service");
module.exports = {
    createCredential: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        credentials_middleware_1.validCredentialType,
        credentials_middleware_1.validCredentialsProperties,
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const newCredential = yield (0, credentials_service_1.createCredential)(req.body);
                const encryptedData = yield (0, credentials_service_1.encryptCredential)(newCredential);
                Object.assign(newCredential, encryptedData);
                const savedCredential = yield (0, credentials_service_1.saveCredential)(newCredential, req.user, encryptedData);
                // LoggerProxy.verbose('New credential created', {
                // 	credentialId: newCredential.id,
                // 	ownerId: req.user.id,
                // });
                return res.json((0, credentials_service_1.sanitizeCredentials)(savedCredential));
            }
            catch ({ message, httpStatusCode }) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                return res.status(httpStatusCode !== null && httpStatusCode !== void 0 ? httpStatusCode : 500).json({ message });
            }
        }),
    ],
    deleteCredential: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { id: credentialId } = req.params;
            let credential;
            if (req.user.globalRole.name !== 'owner') {
                const shared = yield (0, credentials_service_1.getSharedCredentials)(req.user.id, credentialId, [
                    'credentials',
                    'role',
                ]);
                if ((shared === null || shared === void 0 ? void 0 : shared.role.name) === 'owner') {
                    credential = shared.credentials;
                }
            }
            else {
                credential = (yield (0, credentials_service_1.getCredentials)(credentialId));
            }
            if (!credential) {
                return res.status(404).json({ message: 'Not Found' });
            }
            yield (0, credentials_service_1.removeCredential)(credential);
            credential.id = Number(credentialId);
            return res.json((0, credentials_service_1.sanitizeCredentials)(credential));
        }),
    ],
    getCredentialType: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { credentialTypeName } = req.params;
            try {
                (0, CredentialTypes_1.CredentialTypes)().getByName(credentialTypeName);
            }
            catch (error) {
                return res.status(404).json({ message: 'Not Found' });
            }
            const schema = new CredentialsHelper_1.CredentialsHelper('')
                .getCredentialsProperties(credentialTypeName)
                .filter((property) => property.type !== 'hidden');
            return res.json((0, credentials_service_1.toJsonSchema)(schema));
        }),
    ],
};

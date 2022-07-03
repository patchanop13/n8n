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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const credentials_1 = require("@/api/credentials");
const vue_1 = __importDefault(require("vue"));
const helpers_1 = require("@/components/helpers");
const DEFAULT_CREDENTIAL_NAME = 'Unnamed credential';
const DEFAULT_CREDENTIAL_POSTFIX = 'account';
const TYPES_WITH_DEFAULT_NAME = ['httpBasicAuth', 'oAuth2Api', 'httpDigestAuth', 'oAuth1Api'];
const module = {
    namespaced: true,
    state: {
        credentialTypes: {},
        credentials: {},
    },
    mutations: {
        setCredentialTypes: (state, credentialTypes) => {
            state.credentialTypes = credentialTypes.reduce((accu, cred) => {
                accu[cred.name] = cred;
                return accu;
            }, {});
        },
        setCredentials: (state, credentials) => {
            state.credentials = credentials.reduce((accu, cred) => {
                if (cred.id) {
                    accu[cred.id] = cred;
                }
                return accu;
            }, {});
        },
        upsertCredential(state, credential) {
            if (credential.id) {
                vue_1.default.set(state.credentials, credential.id, credential);
            }
        },
        deleteCredential(state, id) {
            vue_1.default.delete(state.credentials, id);
        },
        enableOAuthCredential(state, credential) {
            // enable oauth event to track change between modals
        },
    },
    getters: {
        allCredentialTypes(state) {
            return Object.values(state.credentialTypes)
                .sort((a, b) => a.displayName.localeCompare(b.displayName));
        },
        allCredentials(state) {
            return Object.values(state.credentials)
                .sort((a, b) => a.name.localeCompare(b.name));
        },
        allCredentialsByType(state, getters) {
            const credentials = getters.allCredentials;
            const types = getters.allCredentialTypes;
            return types.reduce((accu, type) => {
                accu[type.name] = credentials.filter((cred) => cred.type === type.name);
                return accu;
            }, {});
        },
        getCredentialTypeByName: (state) => {
            return (type) => state.credentialTypes[type];
        },
        getCredentialById: (state) => {
            return (id) => state.credentials[id];
        },
        getCredentialByIdAndType: (state) => {
            return (id, type) => {
                const credential = state.credentials[id];
                return !credential || credential.type !== type ? undefined : credential;
            };
        },
        getCredentialsByType: (state, getters) => {
            return (credentialType) => {
                return getters.allCredentialsByType[credentialType] || [];
            };
        },
        getNodesWithAccess(state, getters, rootState, rootGetters) {
            return (credentialTypeName) => {
                const nodeTypes = rootGetters.allNodeTypes;
                return nodeTypes.filter((nodeType) => {
                    if (!nodeType.credentials) {
                        return false;
                    }
                    for (const credentialTypeDescription of nodeType.credentials) {
                        if (credentialTypeDescription.name === credentialTypeName) {
                            return true;
                        }
                    }
                    return false;
                });
            };
        },
        getScopesByCredentialType(_, getters) {
            return (credentialTypeName) => {
                const credentialType = getters.getCredentialTypeByName(credentialTypeName);
                const scopeProperty = credentialType.properties.find((p) => p.name === 'scope');
                if (!scopeProperty ||
                    !scopeProperty.default ||
                    typeof scopeProperty.default !== 'string' ||
                    scopeProperty.default === '') {
                    return [];
                }
                let { default: scopeDefault } = scopeProperty;
                // disregard expressions for display
                scopeDefault = scopeDefault.replace(/^=/, '').replace(/\{\{.*\}\}/, '');
                if (/ /.test(scopeDefault))
                    return scopeDefault.split(' ');
                if (/,/.test(scopeDefault))
                    return scopeDefault.split(',');
                return [scopeDefault];
            };
        },
    },
    actions: {
        fetchCredentialTypes: (context) => __awaiter(void 0, void 0, void 0, function* () {
            if (context.getters.allCredentialTypes.length > 0) {
                return;
            }
            const credentialTypes = yield (0, credentials_1.getCredentialTypes)(context.rootGetters.getRestApiContext);
            context.commit('setCredentialTypes', credentialTypes);
        }),
        fetchAllCredentials: (context) => __awaiter(void 0, void 0, void 0, function* () {
            const credentials = yield (0, credentials_1.getAllCredentials)(context.rootGetters.getRestApiContext);
            context.commit('setCredentials', credentials);
            return credentials;
        }),
        getCredentialData: (context, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, credentials_1.getCredentialData)(context.rootGetters.getRestApiContext, id);
        }),
        createNewCredential: (context, data) => __awaiter(void 0, void 0, void 0, function* () {
            const credential = yield (0, credentials_1.createNewCredential)(context.rootGetters.getRestApiContext, data);
            context.commit('upsertCredential', credential);
            return credential;
        }),
        updateCredential: (context, params) => __awaiter(void 0, void 0, void 0, function* () {
            const { id, data } = params;
            const credential = yield (0, credentials_1.updateCredential)(context.rootGetters.getRestApiContext, id, data);
            context.commit('upsertCredential', credential);
            return credential;
        }),
        deleteCredential: (context, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const deleted = yield (0, credentials_1.deleteCredential)(context.rootGetters.getRestApiContext, id);
            if (deleted) {
                context.commit('deleteCredential', id);
            }
        }),
        oAuth2Authorize: (context, data) => __awaiter(void 0, void 0, void 0, function* () {
            return (0, credentials_1.oAuth2CredentialAuthorize)(context.rootGetters.getRestApiContext, data);
        }),
        oAuth1Authorize: (context, data) => __awaiter(void 0, void 0, void 0, function* () {
            return (0, credentials_1.oAuth1CredentialAuthorize)(context.rootGetters.getRestApiContext, data);
        }),
        testCredential: (context, data) => __awaiter(void 0, void 0, void 0, function* () {
            return (0, credentials_1.testCredential)(context.rootGetters.getRestApiContext, { credentials: data });
        }),
        getNewCredentialName: (context, params) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { credentialTypeName } = params;
                let newName = DEFAULT_CREDENTIAL_NAME;
                if (!TYPES_WITH_DEFAULT_NAME.includes(credentialTypeName)) {
                    const { displayName } = context.getters.getCredentialTypeByName(credentialTypeName);
                    newName = (0, helpers_1.getAppNameFromCredType)(displayName);
                    newName = newName.length > 0 ? `${newName} ${DEFAULT_CREDENTIAL_POSTFIX}` : DEFAULT_CREDENTIAL_NAME;
                }
                const res = yield (0, credentials_1.getCredentialsNewName)(context.rootGetters.getRestApiContext, newName);
                return res.name;
            }
            catch (e) {
                return DEFAULT_CREDENTIAL_NAME;
            }
        }),
    },
};
exports.default = module;

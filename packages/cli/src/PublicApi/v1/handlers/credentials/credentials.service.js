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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJsonSchema = exports.sanitizeCredentials = exports.encryptCredential = exports.removeCredential = exports.saveCredential = exports.createCredential = exports.getSharedCredentials = exports.getCredentials = void 0;
const n8n_core_1 = require("n8n-core");
const __1 = require("../../../..");
const CredentialsEntity_1 = require("../../../../databases/entities/CredentialsEntity");
const SharedCredentials_1 = require("../../../../databases/entities/SharedCredentials");
const Server_1 = require("../../../../Server");
function getCredentials(credentialId) {
    return __awaiter(this, void 0, void 0, function* () {
        return __1.Db.collections.Credentials.findOne(credentialId);
    });
}
exports.getCredentials = getCredentials;
function getSharedCredentials(userId, credentialId, relations) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            where: {
                user: { id: userId },
                credentials: { id: credentialId },
            },
        };
        if (relations) {
            options.relations = relations;
        }
        return __1.Db.collections.SharedCredentials.findOne(options);
    });
}
exports.getSharedCredentials = getSharedCredentials;
function createCredential(properties) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const newCredential = new CredentialsEntity_1.CredentialsEntity();
        Object.assign(newCredential, properties);
        if (!newCredential.nodesAccess || newCredential.nodesAccess.length === 0) {
            newCredential.nodesAccess = [
                {
                    nodeType: `n8n-nodes-base.${(_b = (_a = properties.type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : 'unknown'}`,
                    date: new Date(),
                },
            ];
        }
        else {
            // Add the added date for node access permissions
            newCredential.nodesAccess.forEach((nodeAccess) => {
                // eslint-disable-next-line no-param-reassign
                nodeAccess.date = new Date();
            });
        }
        return newCredential;
    });
}
exports.createCredential = createCredential;
function saveCredential(credential, user, encryptedData) {
    return __awaiter(this, void 0, void 0, function* () {
        const role = yield __1.Db.collections.Role.findOneOrFail({
            name: 'owner',
            scope: 'credential',
        });
        yield Server_1.externalHooks.run('credentials.create', [encryptedData]);
        return __1.Db.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
            const savedCredential = yield transactionManager.save(credential);
            savedCredential.data = credential.data;
            const newSharedCredential = new SharedCredentials_1.SharedCredentials();
            Object.assign(newSharedCredential, {
                role,
                user,
                credentials: savedCredential,
            });
            yield transactionManager.save(newSharedCredential);
            return savedCredential;
        }));
    });
}
exports.saveCredential = saveCredential;
function removeCredential(credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Server_1.externalHooks.run('credentials.delete', [credentials.id]);
        return __1.Db.collections.Credentials.remove(credentials);
    });
}
exports.removeCredential = removeCredential;
function encryptCredential(credential) {
    return __awaiter(this, void 0, void 0, function* () {
        const encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
        // Encrypt the data
        const coreCredential = new n8n_core_1.Credentials({ id: null, name: credential.name }, credential.type, credential.nodesAccess);
        // @ts-ignore
        coreCredential.setData(credential.data, encryptionKey);
        return coreCredential.getDataToSave();
    });
}
exports.encryptCredential = encryptCredential;
function sanitizeCredentials(credentials) {
    const argIsArray = Array.isArray(credentials);
    const credentialsList = argIsArray ? credentials : [credentials];
    const sanitizedCredentials = credentialsList.map((credential) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data, nodesAccess, shared } = credential, rest = __rest(credential, ["data", "nodesAccess", "shared"]);
        return rest;
    });
    return argIsArray ? sanitizedCredentials : sanitizedCredentials[0];
}
exports.sanitizeCredentials = sanitizeCredentials;
/**
 * toJsonSchema
 * Take an array of crendentials parameter and map it
 * to a JSON Schema (see https://json-schema.org/). With
 * the JSON Schema defintion we can validate the credential's shape
 * @param properties - Credentials properties
 * @returns The credentials schema definition.
 */
function toJsonSchema(properties) {
    const jsonSchema = {
        additionalProperties: false,
        type: 'object',
        properties: {},
        allOf: [],
        required: [],
    };
    const optionsValues = {};
    const resolveProperties = [];
    // get all posible values of properties type "options"
    // so we can later resolve the displayOptions dependencies
    properties
        .filter((property) => property.type === 'options')
        .forEach((property) => {
        var _a;
        Object.assign(optionsValues, {
            [property.name]: (_a = property.options) === null || _a === void 0 ? void 0 : _a.map((option) => option.value),
        });
    });
    let requiredFields = [];
    const propertyRequiredDependencies = {};
    // add all credential's properties to the properties
    // object in the JSON Schema definition. This allows us
    // to later validate that only this properties are set in
    // the credentials sent in the API call.
    properties.forEach((property) => {
        var _a, _b, _c, _d, _e;
        requiredFields.push(property.name);
        if (property.type === 'options') {
            // if the property is type options,
            // include all possible values in the anum property.
            Object.assign(jsonSchema.properties, {
                [property.name]: {
                    type: 'string',
                    enum: (_a = property.options) === null || _a === void 0 ? void 0 : _a.map((data) => data.value),
                },
            });
        }
        else {
            Object.assign(jsonSchema.properties, {
                [property.name]: {
                    type: property.type,
                },
            });
        }
        // if the credential property has a dependency
        // then add a JSON Schema condition that satisfy each property value
        // e.x: If A has value X then required B, else required C
        // see https://json-schema.org/understanding-json-schema/reference/conditionals.html#if-then-else
        if ((_b = property.displayOptions) === null || _b === void 0 ? void 0 : _b.show) {
            const dependantName = Object.keys((_c = property.displayOptions) === null || _c === void 0 ? void 0 : _c.show)[0] || '';
            const displayOptionsValues = property.displayOptions.show[dependantName];
            let dependantValue = '';
            if (displayOptionsValues && Array.isArray(displayOptionsValues) && displayOptionsValues[0]) {
                // eslint-disable-next-line prefer-destructuring
                dependantValue = displayOptionsValues[0];
            }
            if (propertyRequiredDependencies[dependantName] === undefined) {
                propertyRequiredDependencies[dependantName] = {};
            }
            if (!resolveProperties.includes(dependantName)) {
                propertyRequiredDependencies[dependantName] = {
                    if: {
                        properties: {
                            [dependantName]: {
                                enum: [dependantValue],
                            },
                        },
                    },
                    then: {
                        oneOf: [],
                    },
                    else: {
                        allOf: [],
                    },
                };
            }
            (_d = propertyRequiredDependencies[dependantName].then) === null || _d === void 0 ? void 0 : _d.oneOf.push({ required: [property.name] });
            (_e = propertyRequiredDependencies[dependantName].else) === null || _e === void 0 ? void 0 : _e.allOf.push({
                not: { required: [property.name] },
            });
            resolveProperties.push(dependantName);
            // remove global required
            requiredFields = requiredFields.filter((field) => field !== property.name);
        }
    });
    Object.assign(jsonSchema, { required: requiredFields });
    jsonSchema.allOf = Object.values(propertyRequiredDependencies);
    if (!jsonSchema.allOf.length) {
        delete jsonSchema.allOf;
    }
    return jsonSchema;
}
exports.toJsonSchema = toJsonSchema;

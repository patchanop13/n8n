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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const n8n_core_1 = require("n8n-core");
const src_1 = require("../../../src");
const random_1 = require("../shared/random");
const utils = __importStar(require("../shared/utils"));
const testDb = __importStar(require("../shared/testDb"));
const constants_1 = require("../../../src/constants");
let app;
let testDbName = '';
let globalOwnerRole;
let globalMemberRole;
let credentialOwnerRole;
let saveCredential;
jest.mock('../../../src/telemetry');
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield utils.initTestServer({ endpointGroups: ['publicApi'], applyAuth: false });
    const initResult = yield testDb.init();
    testDbName = initResult.testDbName;
    utils.initConfigFile();
    const [fetchedGlobalOwnerRole, fetchedGlobalMemberRole, _, fetchedCredentialOwnerRole,] = yield testDb.getAllRoles();
    globalOwnerRole = fetchedGlobalOwnerRole;
    globalMemberRole = fetchedGlobalMemberRole;
    credentialOwnerRole = fetchedCredentialOwnerRole;
    saveCredential = affixRoleToSaveCredential(credentialOwnerRole);
    utils.initTestLogger();
    utils.initTestTelemetry();
    utils.initCredentialsTypes();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.truncate(['User', 'SharedCredentials', 'Credentials'], testDbName);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.terminate(testDbName);
}));
test('POST /credentials should create credentials', () => __awaiter(void 0, void 0, void 0, function* () {
    let ownerShell = yield testDb.createUserShell(globalOwnerRole);
    ownerShell = yield testDb.addApiKey(ownerShell);
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        version: 1,
        auth: true,
        user: ownerShell,
    });
    const payload = {
        name: 'test credential',
        type: 'githubApi',
        data: {
            accessToken: 'abcdefghijklmnopqrstuvwxyz',
            user: 'test',
            server: 'testServer',
        },
    };
    const response = yield authOwnerAgent.post('/credentials').send(payload);
    expect(response.statusCode).toBe(200);
    const { id, name, type } = response.body;
    expect(name).toBe(payload.name);
    expect(type).toBe(payload.type);
    const credential = yield src_1.Db.collections.Credentials.findOneOrFail(id);
    expect(credential.name).toBe(payload.name);
    expect(credential.type).toBe(payload.type);
    expect(credential.data).not.toBe(payload.data);
    const sharedCredential = yield src_1.Db.collections.SharedCredentials.findOneOrFail({
        relations: ['user', 'credentials', 'role'],
        where: { credentials: credential, user: ownerShell },
    });
    expect(sharedCredential.role).toEqual(credentialOwnerRole);
    expect(sharedCredential.credentials.name).toBe(payload.name);
}));
test('POST /credentials should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    let ownerShell = yield testDb.createUserShell(globalOwnerRole);
    ownerShell = yield testDb.addApiKey(ownerShell);
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        version: 1,
        auth: true,
        user: ownerShell,
    });
    yield Promise.all(INVALID_PAYLOADS.map((invalidPayload) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authOwnerAgent.post('/credentials').send(invalidPayload);
        expect(response.statusCode === 400 || response.statusCode === 415).toBe(true);
    })));
}));
test('POST /credentials should fail with missing encryption key', () => __awaiter(void 0, void 0, void 0, function* () {
    const mock = jest.spyOn(n8n_core_1.UserSettings, 'getEncryptionKey');
    mock.mockRejectedValue(new Error(constants_1.RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY));
    let ownerShell = yield testDb.createUserShell(globalOwnerRole);
    ownerShell = yield testDb.addApiKey(ownerShell);
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        version: 1,
        auth: true,
        user: ownerShell,
    });
    const response = yield authOwnerAgent.post('/credentials').send(credentialPayload());
    expect(response.statusCode).toBe(500);
    mock.mockRestore();
}));
test('DELETE /credentials/:id should delete owned cred for owner', () => __awaiter(void 0, void 0, void 0, function* () {
    let ownerShell = yield testDb.createUserShell(globalOwnerRole);
    ownerShell = yield testDb.addApiKey(ownerShell);
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        version: 1,
        auth: true,
        user: ownerShell,
    });
    const savedCredential = yield saveCredential(dbCredential(), { user: ownerShell });
    const response = yield authOwnerAgent.delete(`/credentials/${savedCredential.id}`);
    expect(response.statusCode).toBe(200);
    const { name, type } = response.body;
    expect(name).toBe(savedCredential.name);
    expect(type).toBe(savedCredential.type);
    const deletedCredential = yield src_1.Db.collections.Credentials.findOne(savedCredential.id);
    expect(deletedCredential).toBeUndefined(); // deleted
    const deletedSharedCredential = yield src_1.Db.collections.SharedCredentials.findOne();
    expect(deletedSharedCredential).toBeUndefined(); // deleted
}));
test('DELETE /credentials/:id should delete non-owned cred for owner', () => __awaiter(void 0, void 0, void 0, function* () {
    let ownerShell = yield testDb.createUserShell(globalOwnerRole);
    ownerShell = yield testDb.addApiKey(ownerShell);
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        version: 1,
        auth: true,
        user: ownerShell,
    });
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const savedCredential = yield saveCredential(dbCredential(), { user: member });
    const response = yield authOwnerAgent.delete(`/credentials/${savedCredential.id}`);
    expect(response.statusCode).toBe(200);
    const deletedCredential = yield src_1.Db.collections.Credentials.findOne(savedCredential.id);
    expect(deletedCredential).toBeUndefined(); // deleted
    const deletedSharedCredential = yield src_1.Db.collections.SharedCredentials.findOne();
    expect(deletedSharedCredential).toBeUndefined(); // deleted
}));
test('DELETE /credentials/:id should delete owned cred for member', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const authMemberAgent = utils.createAgent(app, {
        apiPath: 'public',
        version: 1,
        auth: true,
        user: member,
    });
    const savedCredential = yield saveCredential(dbCredential(), { user: member });
    const response = yield authMemberAgent.delete(`/credentials/${savedCredential.id}`);
    expect(response.statusCode).toBe(200);
    const { name, type } = response.body;
    expect(name).toBe(savedCredential.name);
    expect(type).toBe(savedCredential.type);
    const deletedCredential = yield src_1.Db.collections.Credentials.findOne(savedCredential.id);
    expect(deletedCredential).toBeUndefined(); // deleted
    const deletedSharedCredential = yield src_1.Db.collections.SharedCredentials.findOne();
    expect(deletedSharedCredential).toBeUndefined(); // deleted
}));
test('DELETE /credentials/:id should delete owned cred for member but leave others untouched', () => __awaiter(void 0, void 0, void 0, function* () {
    const member1 = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const member2 = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const savedCredential = yield saveCredential(dbCredential(), { user: member1 });
    const notToBeChangedCredential = yield saveCredential(dbCredential(), { user: member1 });
    const notToBeChangedCredential2 = yield saveCredential(dbCredential(), { user: member2 });
    const authMemberAgent = utils.createAgent(app, {
        apiPath: 'public',
        version: 1,
        auth: true,
        user: member1,
    });
    const response = yield authMemberAgent.delete(`/credentials/${savedCredential.id}`);
    expect(response.statusCode).toBe(200);
    const { name, type } = response.body;
    expect(name).toBe(savedCredential.name);
    expect(type).toBe(savedCredential.type);
    const deletedCredential = yield src_1.Db.collections.Credentials.findOne(savedCredential.id);
    expect(deletedCredential).toBeUndefined(); // deleted
    const deletedSharedCredential = yield src_1.Db.collections.SharedCredentials.findOne({
        where: {
            credentials: savedCredential,
        },
    });
    expect(deletedSharedCredential).toBeUndefined(); // deleted
    yield Promise.all([notToBeChangedCredential, notToBeChangedCredential2].map((credential) => __awaiter(void 0, void 0, void 0, function* () {
        const untouchedCredential = yield src_1.Db.collections.Credentials.findOne(credential.id);
        expect(untouchedCredential).toEqual(credential); // not deleted
        const untouchedSharedCredential = yield src_1.Db.collections.SharedCredentials.findOne({
            where: {
                credentials: credential,
            },
        });
        expect(untouchedSharedCredential).toBeDefined(); // not deleted
    })));
}));
test('DELETE /credentials/:id should not delete non-owned cred for member', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const member = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const authMemberAgent = utils.createAgent(app, {
        apiPath: 'public',
        version: 1,
        auth: true,
        user: member,
    });
    const savedCredential = yield saveCredential(dbCredential(), { user: ownerShell });
    const response = yield authMemberAgent.delete(`/credentials/${savedCredential.id}`);
    expect(response.statusCode).toBe(404);
    const shellCredential = yield src_1.Db.collections.Credentials.findOne(savedCredential.id);
    expect(shellCredential).toBeDefined(); // not deleted
    const deletedSharedCredential = yield src_1.Db.collections.SharedCredentials.findOne();
    expect(deletedSharedCredential).toBeDefined(); // not deleted
}));
test('DELETE /credentials/:id should fail if cred not found', () => __awaiter(void 0, void 0, void 0, function* () {
    let ownerShell = yield testDb.createUserShell(globalOwnerRole);
    ownerShell = yield testDb.addApiKey(ownerShell);
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        version: 1,
        auth: true,
        user: ownerShell,
    });
    const response = yield authOwnerAgent.delete('/credentials/123');
    expect(response.statusCode).toBe(404);
}));
test('GET /credentials/schema/:credentialType should fail due to not found type', () => __awaiter(void 0, void 0, void 0, function* () {
    let ownerShell = yield testDb.createUserShell(globalOwnerRole);
    ownerShell = yield testDb.addApiKey(ownerShell);
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        version: 1,
        auth: true,
        user: ownerShell,
    });
    const response = yield authOwnerAgent.get('/credentials/schema/testing');
    expect(response.statusCode).toBe(404);
}));
test('GET /credentials/schema/:credentialType should retrieve credential type', () => __awaiter(void 0, void 0, void 0, function* () {
    let ownerShell = yield testDb.createUserShell(globalOwnerRole);
    ownerShell = yield testDb.addApiKey(ownerShell);
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        version: 1,
        auth: true,
        user: ownerShell,
    });
    const response = yield authOwnerAgent.get('/credentials/schema/githubApi');
    const { additionalProperties, type, properties, required } = response.body;
    expect(additionalProperties).toBe(false);
    expect(type).toBe('object');
    expect(properties.server).toBeDefined();
    expect(properties.server.type).toBe('string');
    expect(properties.user.type).toBeDefined();
    expect(properties.user.type).toBe('string');
    expect(properties.accessToken.type).toBeDefined();
    expect(properties.accessToken.type).toBe('string');
    expect(required).toEqual(expect.arrayContaining(['server', 'user', 'accessToken']));
    expect(response.statusCode).toBe(200);
}));
const credentialPayload = () => ({
    name: (0, random_1.randomName)(),
    type: 'githubApi',
    data: {
        accessToken: (0, random_1.randomString)(6, 16),
        server: (0, random_1.randomString)(1, 10),
        user: (0, random_1.randomString)(1, 10),
    },
});
const dbCredential = () => {
    const credential = credentialPayload();
    credential.nodesAccess = [{ nodeType: credential.type }];
    return credential;
};
const INVALID_PAYLOADS = [
    {
        type: (0, random_1.randomName)(),
        data: { accessToken: (0, random_1.randomString)(6, 16) },
    },
    {
        name: (0, random_1.randomName)(),
        data: { accessToken: (0, random_1.randomString)(6, 16) },
    },
    {
        name: (0, random_1.randomName)(),
        type: (0, random_1.randomName)(),
    },
    {
        name: (0, random_1.randomName)(),
        type: 'githubApi',
        data: {
            server: (0, random_1.randomName)(),
        },
    },
    {},
    [],
    undefined,
];
function affixRoleToSaveCredential(role) {
    return (credentialPayload, { user }) => testDb.saveCredential(credentialPayload, { user, role });
}

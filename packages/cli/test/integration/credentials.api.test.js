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
const src_1 = require("../../src");
const random_1 = require("./shared/random");
const utils = __importStar(require("./shared/utils"));
const testDb = __importStar(require("./shared/testDb"));
const constants_1 = require("../../src/constants");
jest.mock('../../src/telemetry');
let app;
let testDbName = '';
let globalOwnerRole;
let globalMemberRole;
let saveCredential;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield utils.initTestServer({
        endpointGroups: ['credentials'],
        applyAuth: true,
    });
    const initResult = yield testDb.init();
    testDbName = initResult.testDbName;
    utils.initConfigFile();
    globalOwnerRole = yield testDb.getGlobalOwnerRole();
    globalMemberRole = yield testDb.getGlobalMemberRole();
    const credentialOwnerRole = yield testDb.getCredentialOwnerRole();
    saveCredential = affixRoleToSaveCredential(credentialOwnerRole);
    utils.initTestLogger();
    utils.initTestTelemetry();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.truncate(['User', 'SharedCredentials', 'Credentials'], testDbName);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.terminate(testDbName);
}));
test('POST /credentials should create cred', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const payload = credentialPayload();
    const response = yield authOwnerAgent.post('/credentials').send(payload);
    expect(response.statusCode).toBe(200);
    const { id, name, type, nodesAccess, data: encryptedData } = response.body.data;
    expect(name).toBe(payload.name);
    expect(type).toBe(payload.type);
    expect(nodesAccess[0].nodeType).toBe(payload.nodesAccess[0].nodeType);
    expect(encryptedData).not.toBe(payload.data);
    const credential = yield src_1.Db.collections.Credentials.findOneOrFail(id);
    expect(credential.name).toBe(payload.name);
    expect(credential.type).toBe(payload.type);
    expect(credential.nodesAccess[0].nodeType).toBe(payload.nodesAccess[0].nodeType);
    expect(credential.data).not.toBe(payload.data);
    const sharedCredential = yield src_1.Db.collections.SharedCredentials.findOneOrFail({
        relations: ['user', 'credentials'],
        where: { credentials: credential },
    });
    expect(sharedCredential.user.id).toBe(ownerShell.id);
    expect(sharedCredential.credentials.name).toBe(payload.name);
}));
test('POST /credentials should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    yield Promise.all(INVALID_PAYLOADS.map((invalidPayload) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authOwnerAgent.post('/credentials').send(invalidPayload);
        expect(response.statusCode).toBe(400);
    })));
}));
test('POST /credentials should fail with missing encryption key', () => __awaiter(void 0, void 0, void 0, function* () {
    const mock = jest.spyOn(n8n_core_1.UserSettings, 'getEncryptionKey');
    mock.mockRejectedValue(new Error(constants_1.RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY));
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const response = yield authOwnerAgent.post('/credentials').send(credentialPayload());
    expect(response.statusCode).toBe(500);
    mock.mockRestore();
}));
test('POST /credentials should ignore ID in payload', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const firstResponse = yield authOwnerAgent
        .post('/credentials')
        .send(Object.assign({ id: '8' }, credentialPayload()));
    expect(firstResponse.body.data.id).not.toBe('8');
    const secondResponse = yield authOwnerAgent
        .post('/credentials')
        .send(Object.assign({ id: 8 }, credentialPayload()));
    expect(secondResponse.body.data.id).not.toBe(8);
}));
test('DELETE /credentials/:id should delete owned cred for owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const savedCredential = yield saveCredential(credentialPayload(), { user: ownerShell });
    const response = yield authOwnerAgent.delete(`/credentials/${savedCredential.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ data: true });
    const deletedCredential = yield src_1.Db.collections.Credentials.findOne(savedCredential.id);
    expect(deletedCredential).toBeUndefined(); // deleted
    const deletedSharedCredential = yield src_1.Db.collections.SharedCredentials.findOne();
    expect(deletedSharedCredential).toBeUndefined(); // deleted
}));
test('DELETE /credentials/:id should delete non-owned cred for owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const savedCredential = yield saveCredential(credentialPayload(), { user: member });
    const response = yield authOwnerAgent.delete(`/credentials/${savedCredential.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ data: true });
    const deletedCredential = yield src_1.Db.collections.Credentials.findOne(savedCredential.id);
    expect(deletedCredential).toBeUndefined(); // deleted
    const deletedSharedCredential = yield src_1.Db.collections.SharedCredentials.findOne();
    expect(deletedSharedCredential).toBeUndefined(); // deleted
}));
test('DELETE /credentials/:id should delete owned cred for member', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
    const savedCredential = yield saveCredential(credentialPayload(), { user: member });
    const response = yield authMemberAgent.delete(`/credentials/${savedCredential.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ data: true });
    const deletedCredential = yield src_1.Db.collections.Credentials.findOne(savedCredential.id);
    expect(deletedCredential).toBeUndefined(); // deleted
    const deletedSharedCredential = yield src_1.Db.collections.SharedCredentials.findOne();
    expect(deletedSharedCredential).toBeUndefined(); // deleted
}));
test('DELETE /credentials/:id should not delete non-owned cred for member', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
    const savedCredential = yield saveCredential(credentialPayload(), { user: ownerShell });
    const response = yield authMemberAgent.delete(`/credentials/${savedCredential.id}`);
    expect(response.statusCode).toBe(404);
    const shellCredential = yield src_1.Db.collections.Credentials.findOne(savedCredential.id);
    expect(shellCredential).toBeDefined(); // not deleted
    const deletedSharedCredential = yield src_1.Db.collections.SharedCredentials.findOne();
    expect(deletedSharedCredential).toBeDefined(); // not deleted
}));
test('DELETE /credentials/:id should fail if cred not found', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const response = yield authOwnerAgent.delete('/credentials/123');
    expect(response.statusCode).toBe(404);
}));
test('PATCH /credentials/:id should update owned cred for owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const savedCredential = yield saveCredential(credentialPayload(), { user: ownerShell });
    const patchPayload = credentialPayload();
    const response = yield authOwnerAgent
        .patch(`/credentials/${savedCredential.id}`)
        .send(patchPayload);
    expect(response.statusCode).toBe(200);
    const { id, name, type, nodesAccess, data: encryptedData } = response.body.data;
    expect(name).toBe(patchPayload.name);
    expect(type).toBe(patchPayload.type);
    expect(nodesAccess[0].nodeType).toBe(patchPayload.nodesAccess[0].nodeType);
    expect(encryptedData).not.toBe(patchPayload.data);
    const credential = yield src_1.Db.collections.Credentials.findOneOrFail(id);
    expect(credential.name).toBe(patchPayload.name);
    expect(credential.type).toBe(patchPayload.type);
    expect(credential.nodesAccess[0].nodeType).toBe(patchPayload.nodesAccess[0].nodeType);
    expect(credential.data).not.toBe(patchPayload.data);
    const sharedCredential = yield src_1.Db.collections.SharedCredentials.findOneOrFail({
        relations: ['credentials'],
        where: { credentials: credential },
    });
    expect(sharedCredential.credentials.name).toBe(patchPayload.name); // updated
}));
test('PATCH /credentials/:id should update non-owned cred for owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const savedCredential = yield saveCredential(credentialPayload(), { user: member });
    const patchPayload = credentialPayload();
    const response = yield authOwnerAgent
        .patch(`/credentials/${savedCredential.id}`)
        .send(patchPayload);
    expect(response.statusCode).toBe(200);
    const { id, name, type, nodesAccess, data: encryptedData } = response.body.data;
    expect(name).toBe(patchPayload.name);
    expect(type).toBe(patchPayload.type);
    expect(nodesAccess[0].nodeType).toBe(patchPayload.nodesAccess[0].nodeType);
    expect(encryptedData).not.toBe(patchPayload.data);
    const credential = yield src_1.Db.collections.Credentials.findOneOrFail(id);
    expect(credential.name).toBe(patchPayload.name);
    expect(credential.type).toBe(patchPayload.type);
    expect(credential.nodesAccess[0].nodeType).toBe(patchPayload.nodesAccess[0].nodeType);
    expect(credential.data).not.toBe(patchPayload.data);
    const sharedCredential = yield src_1.Db.collections.SharedCredentials.findOneOrFail({
        relations: ['credentials'],
        where: { credentials: credential },
    });
    expect(sharedCredential.credentials.name).toBe(patchPayload.name); // updated
}));
test('PATCH /credentials/:id should update owned cred for member', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
    const savedCredential = yield saveCredential(credentialPayload(), { user: member });
    const patchPayload = credentialPayload();
    const response = yield authMemberAgent
        .patch(`/credentials/${savedCredential.id}`)
        .send(patchPayload);
    expect(response.statusCode).toBe(200);
    const { id, name, type, nodesAccess, data: encryptedData } = response.body.data;
    expect(name).toBe(patchPayload.name);
    expect(type).toBe(patchPayload.type);
    expect(nodesAccess[0].nodeType).toBe(patchPayload.nodesAccess[0].nodeType);
    expect(encryptedData).not.toBe(patchPayload.data);
    const credential = yield src_1.Db.collections.Credentials.findOneOrFail(id);
    expect(credential.name).toBe(patchPayload.name);
    expect(credential.type).toBe(patchPayload.type);
    expect(credential.nodesAccess[0].nodeType).toBe(patchPayload.nodesAccess[0].nodeType);
    expect(credential.data).not.toBe(patchPayload.data);
    const sharedCredential = yield src_1.Db.collections.SharedCredentials.findOneOrFail({
        relations: ['credentials'],
        where: { credentials: credential },
    });
    expect(sharedCredential.credentials.name).toBe(patchPayload.name); // updated
}));
test('PATCH /credentials/:id should not update non-owned cred for member', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
    const savedCredential = yield saveCredential(credentialPayload(), { user: ownerShell });
    const patchPayload = credentialPayload();
    const response = yield authMemberAgent
        .patch(`/credentials/${savedCredential.id}`)
        .send(patchPayload);
    expect(response.statusCode).toBe(404);
    const shellCredential = yield src_1.Db.collections.Credentials.findOneOrFail(savedCredential.id);
    expect(shellCredential.name).not.toBe(patchPayload.name); // not updated
}));
test('PATCH /credentials/:id should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const savedCredential = yield saveCredential(credentialPayload(), { user: ownerShell });
    yield Promise.all(INVALID_PAYLOADS.map((invalidPayload) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authOwnerAgent
            .patch(`/credentials/${savedCredential.id}`)
            .send(invalidPayload);
        expect(response.statusCode).toBe(400);
    })));
}));
test('PATCH /credentials/:id should fail if cred not found', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const response = yield authOwnerAgent.patch('/credentials/123').send(credentialPayload());
    expect(response.statusCode).toBe(404);
}));
test('PATCH /credentials/:id should fail with missing encryption key', () => __awaiter(void 0, void 0, void 0, function* () {
    const mock = jest.spyOn(n8n_core_1.UserSettings, 'getEncryptionKey');
    mock.mockRejectedValue(new Error(constants_1.RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY));
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const response = yield authOwnerAgent.post('/credentials').send(credentialPayload());
    expect(response.statusCode).toBe(500);
    mock.mockRestore();
}));
test('GET /credentials should retrieve all creds for owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    for (let i = 0; i < 3; i++) {
        yield saveCredential(credentialPayload(), { user: ownerShell });
    }
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    yield saveCredential(credentialPayload(), { user: member });
    const response = yield authOwnerAgent.get('/credentials');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(4); // 3 owner + 1 member
    yield Promise.all(response.body.data.map((credential) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, type, nodesAccess, data: encryptedData } = credential;
        expect(typeof name).toBe('string');
        expect(typeof type).toBe('string');
        expect(typeof nodesAccess[0].nodeType).toBe('string');
        expect(encryptedData).toBeUndefined();
    })));
}));
test('GET /credentials should retrieve owned creds for member', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
    for (let i = 0; i < 3; i++) {
        yield saveCredential(credentialPayload(), { user: member });
    }
    const response = yield authMemberAgent.get('/credentials');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(3);
    yield Promise.all(response.body.data.map((credential) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, type, nodesAccess, data: encryptedData } = credential;
        expect(typeof name).toBe('string');
        expect(typeof type).toBe('string');
        expect(typeof nodesAccess[0].nodeType).toBe('string');
        expect(encryptedData).toBeUndefined();
    })));
}));
test('GET /credentials should not retrieve non-owned creds for member', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
    for (let i = 0; i < 3; i++) {
        yield saveCredential(credentialPayload(), { user: ownerShell });
    }
    const response = yield authMemberAgent.get('/credentials');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(0); // owner's creds not returned
}));
test('GET /credentials/:id should retrieve owned cred for owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const savedCredential = yield saveCredential(credentialPayload(), { user: ownerShell });
    const firstResponse = yield authOwnerAgent.get(`/credentials/${savedCredential.id}`);
    expect(firstResponse.statusCode).toBe(200);
    expect(typeof firstResponse.body.data.name).toBe('string');
    expect(typeof firstResponse.body.data.type).toBe('string');
    expect(typeof firstResponse.body.data.nodesAccess[0].nodeType).toBe('string');
    expect(firstResponse.body.data.data).toBeUndefined();
    const secondResponse = yield authOwnerAgent
        .get(`/credentials/${savedCredential.id}`)
        .query({ includeData: true });
    expect(secondResponse.statusCode).toBe(200);
    expect(typeof secondResponse.body.data.name).toBe('string');
    expect(typeof secondResponse.body.data.type).toBe('string');
    expect(typeof secondResponse.body.data.nodesAccess[0].nodeType).toBe('string');
    expect(secondResponse.body.data.data).toBeDefined();
}));
test('GET /credentials/:id should retrieve owned cred for member', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
    const savedCredential = yield saveCredential(credentialPayload(), { user: member });
    const firstResponse = yield authMemberAgent.get(`/credentials/${savedCredential.id}`);
    expect(firstResponse.statusCode).toBe(200);
    expect(typeof firstResponse.body.data.name).toBe('string');
    expect(typeof firstResponse.body.data.type).toBe('string');
    expect(typeof firstResponse.body.data.nodesAccess[0].nodeType).toBe('string');
    expect(firstResponse.body.data.data).toBeUndefined();
    const secondResponse = yield authMemberAgent
        .get(`/credentials/${savedCredential.id}`)
        .query({ includeData: true });
    expect(secondResponse.statusCode).toBe(200);
    expect(typeof secondResponse.body.data.name).toBe('string');
    expect(typeof secondResponse.body.data.type).toBe('string');
    expect(typeof secondResponse.body.data.nodesAccess[0].nodeType).toBe('string');
    expect(secondResponse.body.data.data).toBeDefined();
}));
test('GET /credentials/:id should not retrieve non-owned cred for member', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
    const savedCredential = yield saveCredential(credentialPayload(), { user: ownerShell });
    const response = yield authMemberAgent.get(`/credentials/${savedCredential.id}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.data).toBeUndefined(); // owner's cred not returned
}));
test('GET /credentials/:id should fail with missing encryption key', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const savedCredential = yield saveCredential(credentialPayload(), { user: ownerShell });
    const mock = jest.spyOn(n8n_core_1.UserSettings, 'getEncryptionKey');
    mock.mockRejectedValue(new Error(constants_1.RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY));
    const response = yield authOwnerAgent
        .get(`/credentials/${savedCredential.id}`)
        .query({ includeData: true });
    expect(response.statusCode).toBe(500);
    mock.mockRestore();
}));
test('GET /credentials/:id should return 404 if cred not found', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authMemberAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const response = yield authMemberAgent.get('/credentials/789');
    expect(response.statusCode).toBe(404);
}));
const credentialPayload = () => ({
    name: (0, random_1.randomName)(),
    type: (0, random_1.randomName)(),
    nodesAccess: [{ nodeType: (0, random_1.randomName)() }],
    data: { accessToken: (0, random_1.randomString)(6, 16) },
});
const INVALID_PAYLOADS = [
    {
        type: (0, random_1.randomName)(),
        nodesAccess: [{ nodeType: (0, random_1.randomName)() }],
        data: { accessToken: (0, random_1.randomString)(6, 16) },
    },
    {
        name: (0, random_1.randomName)(),
        nodesAccess: [{ nodeType: (0, random_1.randomName)() }],
        data: { accessToken: (0, random_1.randomString)(6, 16) },
    },
    {
        name: (0, random_1.randomName)(),
        type: (0, random_1.randomName)(),
        data: { accessToken: (0, random_1.randomString)(6, 16) },
    },
    {
        name: (0, random_1.randomName)(),
        type: (0, random_1.randomName)(),
        nodesAccess: [{ nodeType: (0, random_1.randomName)() }],
    },
    {},
    [],
    undefined,
];
function affixRoleToSaveCredential(role) {
    return (credentialPayload, { user }) => testDb.saveCredential(credentialPayload, { user, role });
}

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const uuid_1 = require("uuid");
const src_1 = require("../../src");
const config_1 = __importDefault(require("../../config"));
const constants_1 = require("./shared/constants");
const random_1 = require("./shared/random");
const CredentialsEntity_1 = require("../../src/databases/entities/CredentialsEntity");
const WorkflowEntity_1 = require("../../src/databases/entities/WorkflowEntity");
const utils = __importStar(require("./shared/utils"));
const testDb = __importStar(require("./shared/testDb"));
const UserManagementHelper_1 = require("../../src/UserManagement/UserManagementHelper");
jest.mock('../../src/telemetry');
let app;
let testDbName = '';
let globalMemberRole;
let globalOwnerRole;
let workflowOwnerRole;
let credentialOwnerRole;
let isSmtpAvailable = false;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield utils.initTestServer({ endpointGroups: ['users'], applyAuth: true });
    const initResult = yield testDb.init();
    testDbName = initResult.testDbName;
    const [fetchedGlobalOwnerRole, fetchedGlobalMemberRole, fetchedWorkflowOwnerRole, fetchedCredentialOwnerRole,] = yield testDb.getAllRoles();
    globalOwnerRole = fetchedGlobalOwnerRole;
    globalMemberRole = fetchedGlobalMemberRole;
    workflowOwnerRole = fetchedWorkflowOwnerRole;
    credentialOwnerRole = fetchedCredentialOwnerRole;
    utils.initTestTelemetry();
    utils.initTestLogger();
    isSmtpAvailable = yield utils.isTestSmtpServiceAvailable();
}), constants_1.SMTP_TEST_TIMEOUT);
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.truncate(['User', 'SharedCredentials', 'SharedWorkflow', 'Workflow', 'Credentials'], testDbName);
    jest.mock('../../config');
    config_1.default.set('userManagement.disabled', false);
    config_1.default.set('userManagement.isInstanceOwnerSetUp', true);
    config_1.default.set('userManagement.emails.mode', '');
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.terminate(testDbName);
}));
test('GET /users should return all users', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    yield testDb.createUser({ globalRole: globalMemberRole });
    const response = yield authOwnerAgent.get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(2);
    yield Promise.all(response.body.data.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, email, firstName, lastName, personalizationAnswers, globalRole, password, resetPasswordToken, isPending, apiKey, } = user;
        expect(validator_1.default.isUUID(id)).toBe(true);
        expect(email).toBeDefined();
        expect(firstName).toBeDefined();
        expect(lastName).toBeDefined();
        expect(personalizationAnswers).toBeUndefined();
        expect(password).toBeUndefined();
        expect(resetPasswordToken).toBeUndefined();
        expect(isPending).toBe(false);
        expect(globalRole).toBeDefined();
        expect(apiKey).not.toBeDefined();
    })));
}));
test('DELETE /users/:id should delete the user', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    const userToDelete = yield testDb.createUser({ globalRole: globalMemberRole });
    const newWorkflow = new WorkflowEntity_1.WorkflowEntity();
    Object.assign(newWorkflow, {
        name: (0, random_1.randomName)(),
        active: false,
        connections: {},
        nodes: [],
    });
    const savedWorkflow = yield src_1.Db.collections.Workflow.save(newWorkflow);
    yield src_1.Db.collections.SharedWorkflow.save({
        role: workflowOwnerRole,
        user: userToDelete,
        workflow: savedWorkflow,
    });
    const newCredential = new CredentialsEntity_1.CredentialsEntity();
    Object.assign(newCredential, {
        name: (0, random_1.randomName)(),
        data: '',
        type: '',
        nodesAccess: [],
    });
    const savedCredential = yield src_1.Db.collections.Credentials.save(newCredential);
    yield src_1.Db.collections.SharedCredentials.save({
        role: credentialOwnerRole,
        user: userToDelete,
        credentials: savedCredential,
    });
    const response = yield authOwnerAgent.delete(`/users/${userToDelete.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(constants_1.SUCCESS_RESPONSE_BODY);
    const user = yield src_1.Db.collections.User.findOne(userToDelete.id);
    expect(user).toBeUndefined(); // deleted
    const sharedWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        relations: ['user'],
        where: { user: userToDelete },
    });
    expect(sharedWorkflow).toBeUndefined(); // deleted
    const sharedCredential = yield src_1.Db.collections.SharedCredentials.findOne({
        relations: ['user'],
        where: { user: userToDelete },
    });
    expect(sharedCredential).toBeUndefined(); // deleted
    const workflow = yield src_1.Db.collections.Workflow.findOne(savedWorkflow.id);
    expect(workflow).toBeUndefined(); // deleted
    // TODO: Include active workflow and check whether webhook has been removed
    const credential = yield src_1.Db.collections.Credentials.findOne(savedCredential.id);
    expect(credential).toBeUndefined(); // deleted
}));
test('DELETE /users/:id should fail to delete self', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    const response = yield authOwnerAgent.delete(`/users/${owner.id}`);
    expect(response.statusCode).toBe(400);
    const user = yield src_1.Db.collections.User.findOne(owner.id);
    expect(user).toBeDefined();
}));
test('DELETE /users/:id should fail if user to delete is transferee', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    const { id: idToDelete } = yield testDb.createUser({ globalRole: globalMemberRole });
    const response = yield authOwnerAgent.delete(`/users/${idToDelete}`).query({
        transferId: idToDelete,
    });
    expect(response.statusCode).toBe(400);
    const user = yield src_1.Db.collections.User.findOne(idToDelete);
    expect(user).toBeDefined();
}));
test('DELETE /users/:id with transferId should perform transfer', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    const userToDelete = yield src_1.Db.collections.User.save({
        id: (0, uuid_1.v4)(),
        email: (0, random_1.randomEmail)(),
        password: (0, random_1.randomValidPassword)(),
        firstName: (0, random_1.randomName)(),
        lastName: (0, random_1.randomName)(),
        createdAt: new Date(),
        updatedAt: new Date(),
        globalRole: workflowOwnerRole,
    });
    const newWorkflow = new WorkflowEntity_1.WorkflowEntity();
    Object.assign(newWorkflow, {
        name: (0, random_1.randomName)(),
        active: false,
        connections: {},
        nodes: [],
    });
    const savedWorkflow = yield src_1.Db.collections.Workflow.save(newWorkflow);
    yield src_1.Db.collections.SharedWorkflow.save({
        role: workflowOwnerRole,
        user: userToDelete,
        workflow: savedWorkflow,
    });
    const newCredential = new CredentialsEntity_1.CredentialsEntity();
    Object.assign(newCredential, {
        name: (0, random_1.randomName)(),
        data: '',
        type: '',
        nodesAccess: [],
    });
    const savedCredential = yield src_1.Db.collections.Credentials.save(newCredential);
    yield src_1.Db.collections.SharedCredentials.save({
        role: credentialOwnerRole,
        user: userToDelete,
        credentials: savedCredential,
    });
    const response = yield authOwnerAgent.delete(`/users/${userToDelete.id}`).query({
        transferId: owner.id,
    });
    expect(response.statusCode).toBe(200);
    const sharedWorkflow = yield src_1.Db.collections.SharedWorkflow.findOneOrFail({
        relations: ['user'],
        where: { user: owner },
    });
    const sharedCredential = yield src_1.Db.collections.SharedCredentials.findOneOrFail({
        relations: ['user'],
        where: { user: owner },
    });
    const deletedUser = yield src_1.Db.collections.User.findOne(userToDelete);
    expect(sharedWorkflow.user.id).toBe(owner.id);
    expect(sharedCredential.user.id).toBe(owner.id);
    expect(deletedUser).toBeUndefined();
}));
test('GET /resolve-signup-token should validate invite token', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    const memberShell = yield testDb.createUserShell(globalMemberRole);
    const response = yield authOwnerAgent
        .get('/resolve-signup-token')
        .query({ inviterId: owner.id })
        .query({ inviteeId: memberShell.id });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
        data: {
            inviter: {
                firstName: owner.firstName,
                lastName: owner.lastName,
            },
        },
    });
}));
test('GET /resolve-signup-token should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    const { id: inviteeId } = yield testDb.createUser({ globalRole: globalMemberRole });
    const first = yield authOwnerAgent.get('/resolve-signup-token').query({ inviterId: owner.id });
    const second = yield authOwnerAgent.get('/resolve-signup-token').query({ inviteeId });
    const third = yield authOwnerAgent.get('/resolve-signup-token').query({
        inviterId: '5531199e-b7ae-425b-a326-a95ef8cca59d',
        inviteeId: 'cb133beb-7729-4c34-8cd1-a06be8834d9d',
    });
    // user is already set up, so call should error
    const fourth = yield authOwnerAgent
        .get('/resolve-signup-token')
        .query({ inviterId: owner.id })
        .query({ inviteeId });
    // cause inconsistent DB state
    yield src_1.Db.collections.User.update(owner.id, { email: '' });
    const fifth = yield authOwnerAgent
        .get('/resolve-signup-token')
        .query({ inviterId: owner.id })
        .query({ inviteeId });
    for (const response of [first, second, third, fourth, fifth]) {
        expect(response.statusCode).toBe(400);
    }
}));
test('POST /users/:id should fill out a user shell', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const memberShell = yield testDb.createUserShell(globalMemberRole);
    const memberData = {
        inviterId: owner.id,
        firstName: (0, random_1.randomName)(),
        lastName: (0, random_1.randomName)(),
        password: (0, random_1.randomValidPassword)(),
    };
    const authlessAgent = utils.createAgent(app);
    const response = yield authlessAgent.post(`/users/${memberShell.id}`).send(memberData);
    const { id, email, firstName, lastName, personalizationAnswers, password, resetPasswordToken, globalRole, isPending, apiKey, } = response.body.data;
    expect(validator_1.default.isUUID(id)).toBe(true);
    expect(email).toBeDefined();
    expect(firstName).toBe(memberData.firstName);
    expect(lastName).toBe(memberData.lastName);
    expect(personalizationAnswers).toBeNull();
    expect(password).toBeUndefined();
    expect(resetPasswordToken).toBeUndefined();
    expect(isPending).toBe(false);
    expect(globalRole).toBeDefined();
    expect(apiKey).not.toBeDefined();
    const authToken = utils.getAuthToken(response);
    expect(authToken).toBeDefined();
    const member = yield src_1.Db.collections.User.findOneOrFail(memberShell.id);
    expect(member.firstName).toBe(memberData.firstName);
    expect(member.lastName).toBe(memberData.lastName);
    expect(member.password).not.toBe(memberData.password);
}));
test('POST /users/:id should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authlessAgent = utils.createAgent(app);
    const memberShellEmail = (0, random_1.randomEmail)();
    const memberShell = yield src_1.Db.collections.User.save({
        email: memberShellEmail,
        globalRole: globalMemberRole,
    });
    const invalidPayloads = [
        {
            firstName: (0, random_1.randomName)(),
            lastName: (0, random_1.randomName)(),
            password: (0, random_1.randomValidPassword)(),
        },
        {
            inviterId: owner.id,
            firstName: (0, random_1.randomName)(),
            password: (0, random_1.randomValidPassword)(),
        },
        {
            inviterId: owner.id,
            firstName: (0, random_1.randomName)(),
            password: (0, random_1.randomValidPassword)(),
        },
        {
            inviterId: owner.id,
            firstName: (0, random_1.randomName)(),
            lastName: (0, random_1.randomName)(),
        },
        {
            inviterId: owner.id,
            firstName: (0, random_1.randomName)(),
            lastName: (0, random_1.randomName)(),
            password: (0, random_1.randomInvalidPassword)(),
        },
    ];
    yield Promise.all(invalidPayloads.map((invalidPayload) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authlessAgent.post(`/users/${memberShell.id}`).send(invalidPayload);
        expect(response.statusCode).toBe(400);
        const storedUser = yield src_1.Db.collections.User.findOneOrFail({
            where: { email: memberShellEmail },
        });
        expect(storedUser.firstName).toBeNull();
        expect(storedUser.lastName).toBeNull();
        expect(storedUser.password).toBeNull();
    })));
}));
test('POST /users/:id should fail with already accepted invite', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const newMemberData = {
        inviterId: owner.id,
        firstName: (0, random_1.randomName)(),
        lastName: (0, random_1.randomName)(),
        password: (0, random_1.randomValidPassword)(),
    };
    const authlessAgent = utils.createAgent(app);
    const response = yield authlessAgent.post(`/users/${member.id}`).send(newMemberData);
    expect(response.statusCode).toBe(400);
    const storedMember = yield src_1.Db.collections.User.findOneOrFail({
        where: { email: member.email },
    });
    expect(storedMember.firstName).not.toBe(newMemberData.firstName);
    expect(storedMember.lastName).not.toBe(newMemberData.lastName);
    const comparisonResult = yield (0, UserManagementHelper_1.compareHash)(member.password, storedMember.password);
    expect(comparisonResult).toBe(false);
    expect(storedMember.password).not.toBe(newMemberData.password);
}));
test('POST /users should fail if emailing is not set up', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    const response = yield authOwnerAgent.post('/users').send([{ email: (0, random_1.randomEmail)() }]);
    expect(response.statusCode).toBe(500);
}));
test('POST /users should fail if user management is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    config_1.default.set('userManagement.disabled', true);
    const response = yield authOwnerAgent.post('/users').send([{ email: (0, random_1.randomEmail)() }]);
    expect(response.statusCode).toBe(500);
}));
test('POST /users should email invites and create user shells but ignore existing', () => __awaiter(void 0, void 0, void 0, function* () {
    if (!isSmtpAvailable)
        utils.skipSmtpTest(expect);
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const memberShell = yield testDb.createUserShell(globalMemberRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    yield utils.configureSmtp();
    const testEmails = [
        (0, random_1.randomEmail)(),
        (0, random_1.randomEmail)().toUpperCase(),
        memberShell.email,
        member.email,
    ];
    const payload = testEmails.map((e) => ({ email: e }));
    const response = yield authOwnerAgent.post('/users').send(payload);
    expect(response.statusCode).toBe(200);
    for (const { user: { id, email: receivedEmail }, error, } of response.body.data) {
        expect(validator_1.default.isUUID(id)).toBe(true);
        expect(id).not.toBe(member.id);
        const lowerCasedEmail = receivedEmail.toLowerCase();
        expect(receivedEmail).toBe(lowerCasedEmail);
        expect(payload.some(({ email }) => email.toLowerCase() === lowerCasedEmail)).toBe(true);
        if (error) {
            expect(error).toBe('Email could not be sent');
        }
        const storedUser = yield src_1.Db.collections.User.findOneOrFail(id);
        const { firstName, lastName, personalizationAnswers, password, resetPasswordToken } = storedUser;
        expect(firstName).toBeNull();
        expect(lastName).toBeNull();
        expect(personalizationAnswers).toBeNull();
        expect(password).toBeNull();
        expect(resetPasswordToken).toBeNull();
    }
}), constants_1.SMTP_TEST_TIMEOUT);
test('POST /users should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    if (!isSmtpAvailable)
        utils.skipSmtpTest(expect);
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    yield utils.configureSmtp();
    const invalidPayloads = [
        (0, random_1.randomEmail)(),
        [(0, random_1.randomEmail)()],
        {},
        [{ name: (0, random_1.randomName)() }],
        [{ email: (0, random_1.randomName)() }],
    ];
    yield Promise.all(invalidPayloads.map((invalidPayload) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authOwnerAgent.post('/users').send(invalidPayload);
        expect(response.statusCode).toBe(400);
        const users = yield src_1.Db.collections.User.find();
        expect(users.length).toBe(1); // DB unaffected
    })));
}), constants_1.SMTP_TEST_TIMEOUT);
test('POST /users should ignore an empty payload', () => __awaiter(void 0, void 0, void 0, function* () {
    if (!isSmtpAvailable)
        utils.skipSmtpTest(expect);
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    yield utils.configureSmtp();
    const response = yield authOwnerAgent.post('/users').send([]);
    const { data } = response.body;
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
    const users = yield src_1.Db.collections.User.find();
    expect(users.length).toBe(1);
}), constants_1.SMTP_TEST_TIMEOUT);
// TODO: /users/:id/reinvite route tests missing
// TODO: UserManagementMailer is a singleton - cannot reinstantiate with wrong creds
// test('POST /users should error for wrong SMTP config', async () => {
// 	const owner = await Db.collections.User.findOneOrFail();
// 	const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
// 	config.set('userManagement.emails.mode', 'smtp');
// 	config.set('userManagement.emails.smtp.host', 'XYZ'); // break SMTP config
// 	const payload = TEST_EMAILS_TO_CREATE_USER_SHELLS.map((e) => ({ email: e }));
// 	const response = await authOwnerAgent.post('/users').send(payload);
// 	expect(response.statusCode).toBe(500);
// });

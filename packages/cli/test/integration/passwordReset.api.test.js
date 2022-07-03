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
const uuid_1 = require("uuid");
const utils = __importStar(require("./shared/utils"));
const src_1 = require("../../src");
const config_1 = __importDefault(require("../../config"));
const bcryptjs_1 = require("bcryptjs");
const random_1 = require("./shared/random");
const testDb = __importStar(require("./shared/testDb"));
const constants_1 = require("./shared/constants");
jest.mock('../../src/telemetry');
let app;
let testDbName = '';
let globalOwnerRole;
let globalMemberRole;
let isSmtpAvailable = false;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield utils.initTestServer({ endpointGroups: ['passwordReset'], applyAuth: true });
    const initResult = yield testDb.init();
    testDbName = initResult.testDbName;
    globalOwnerRole = yield testDb.getGlobalOwnerRole();
    globalMemberRole = yield testDb.getGlobalMemberRole();
    utils.initTestTelemetry();
    utils.initTestLogger();
    isSmtpAvailable = yield utils.isTestSmtpServiceAvailable();
}), constants_1.SMTP_TEST_TIMEOUT);
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.truncate(['User'], testDbName);
    jest.mock('../../config');
    config_1.default.set('userManagement.isInstanceOwnerSetUp', true);
    config_1.default.set('userManagement.emails.mode', '');
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.terminate(testDbName);
}));
test('POST /forgot-password should send password reset email', () => __awaiter(void 0, void 0, void 0, function* () {
    if (!isSmtpAvailable)
        utils.skipSmtpTest(expect);
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authlessAgent = utils.createAgent(app);
    const member = yield testDb.createUser({
        email: 'test@test.com',
        globalRole: globalMemberRole,
    });
    yield utils.configureSmtp();
    yield Promise.all([{ email: owner.email }, { email: member.email.toUpperCase() }].map((payload) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authlessAgent.post('/forgot-password').send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({});
        const user = yield src_1.Db.collections.User.findOneOrFail({ email: payload.email });
        expect(user.resetPasswordToken).toBeDefined();
        expect(user.resetPasswordTokenExpiration).toBeGreaterThan(Math.ceil(Date.now() / 1000));
    })));
}), constants_1.SMTP_TEST_TIMEOUT);
test('POST /forgot-password should fail if emailing is not set up', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authlessAgent = utils.createAgent(app);
    const response = yield authlessAgent.post('/forgot-password').send({ email: owner.email });
    expect(response.statusCode).toBe(500);
    const storedOwner = yield src_1.Db.collections.User.findOneOrFail({ email: owner.email });
    expect(storedOwner.resetPasswordToken).toBeNull();
}));
test('POST /forgot-password should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authlessAgent = utils.createAgent(app);
    config_1.default.set('userManagement.emails.mode', 'smtp');
    const invalidPayloads = [
        (0, random_1.randomEmail)(),
        [(0, random_1.randomEmail)()],
        {},
        [{ name: (0, random_1.randomName)() }],
        [{ email: (0, random_1.randomName)() }],
    ];
    yield Promise.all(invalidPayloads.map((invalidPayload) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authlessAgent.post('/forgot-password').send(invalidPayload);
        expect(response.statusCode).toBe(400);
        const storedOwner = yield src_1.Db.collections.User.findOneOrFail({ email: owner.email });
        expect(storedOwner.resetPasswordToken).toBeNull();
    })));
}));
test('POST /forgot-password should fail if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
    const authlessAgent = utils.createAgent(app);
    config_1.default.set('userManagement.emails.mode', 'smtp');
    const response = yield authlessAgent.post('/forgot-password').send({ email: (0, random_1.randomEmail)() });
    expect(response.statusCode).toBe(200); // expect 200 to remain vague
}));
test('GET /resolve-password-token should succeed with valid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authlessAgent = utils.createAgent(app);
    const resetPasswordToken = (0, uuid_1.v4)();
    const resetPasswordTokenExpiration = Math.floor(Date.now() / 1000) + 100;
    yield src_1.Db.collections.User.update(owner.id, {
        resetPasswordToken,
        resetPasswordTokenExpiration,
    });
    const response = yield authlessAgent
        .get('/resolve-password-token')
        .query({ userId: owner.id, token: resetPasswordToken });
    expect(response.statusCode).toBe(200);
}));
test('GET /resolve-password-token should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authlessAgent = utils.createAgent(app);
    config_1.default.set('userManagement.emails.mode', 'smtp');
    const first = yield authlessAgent.get('/resolve-password-token').query({ token: (0, uuid_1.v4)() });
    const second = yield authlessAgent.get('/resolve-password-token').query({ userId: owner.id });
    for (const response of [first, second]) {
        expect(response.statusCode).toBe(400);
    }
}));
test('GET /resolve-password-token should fail if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authlessAgent = utils.createAgent(app);
    config_1.default.set('userManagement.emails.mode', 'smtp');
    const response = yield authlessAgent
        .get('/resolve-password-token')
        .query({ userId: owner.id, token: (0, uuid_1.v4)() });
    expect(response.statusCode).toBe(404);
}));
test('GET /resolve-password-token should fail if token is expired', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authlessAgent = utils.createAgent(app);
    const resetPasswordToken = (0, uuid_1.v4)();
    const resetPasswordTokenExpiration = Math.floor(Date.now() / 1000) - 1;
    yield src_1.Db.collections.User.update(owner.id, {
        resetPasswordToken,
        resetPasswordTokenExpiration,
    });
    config_1.default.set('userManagement.emails.mode', 'smtp');
    const response = yield authlessAgent
        .get('/resolve-password-token')
        .query({ userId: owner.id, token: resetPasswordToken });
    expect(response.statusCode).toBe(404);
}));
test('POST /change-password should succeed with valid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authlessAgent = utils.createAgent(app);
    const resetPasswordToken = (0, uuid_1.v4)();
    const resetPasswordTokenExpiration = Math.floor(Date.now() / 1000) + 100;
    yield src_1.Db.collections.User.update(owner.id, {
        resetPasswordToken,
        resetPasswordTokenExpiration,
    });
    const passwordToStore = (0, random_1.randomValidPassword)();
    const response = yield authlessAgent.post('/change-password').send({
        token: resetPasswordToken,
        userId: owner.id,
        password: passwordToStore,
    });
    expect(response.statusCode).toBe(200);
    const authToken = utils.getAuthToken(response);
    expect(authToken).toBeDefined();
    const { password: storedPassword } = yield src_1.Db.collections.User.findOneOrFail(owner.id);
    const comparisonResult = yield (0, bcryptjs_1.compare)(passwordToStore, storedPassword);
    expect(comparisonResult).toBe(true);
    expect(storedPassword).not.toBe(passwordToStore);
}));
test('POST /change-password should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authlessAgent = utils.createAgent(app);
    const resetPasswordToken = (0, uuid_1.v4)();
    const resetPasswordTokenExpiration = Math.floor(Date.now() / 1000) + 100;
    yield src_1.Db.collections.User.update(owner.id, {
        resetPasswordToken,
        resetPasswordTokenExpiration,
    });
    const invalidPayloads = [
        { token: (0, uuid_1.v4)() },
        { id: owner.id },
        { password: (0, random_1.randomValidPassword)() },
        { token: (0, uuid_1.v4)(), id: owner.id },
        { token: (0, uuid_1.v4)(), password: (0, random_1.randomValidPassword)() },
        { id: owner.id, password: (0, random_1.randomValidPassword)() },
        {
            id: owner.id,
            password: (0, random_1.randomInvalidPassword)(),
            token: resetPasswordToken,
        },
        {
            id: owner.id,
            password: (0, random_1.randomValidPassword)(),
            token: (0, uuid_1.v4)(),
        },
    ];
    yield Promise.all(invalidPayloads.map((invalidPayload) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authlessAgent.post('/change-password').query(invalidPayload);
        expect(response.statusCode).toBe(400);
        const { password: storedPassword } = yield src_1.Db.collections.User.findOneOrFail();
        expect(owner.password).toBe(storedPassword);
    })));
}));
test('POST /change-password should fail when token has expired', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authlessAgent = utils.createAgent(app);
    const resetPasswordToken = (0, uuid_1.v4)();
    const resetPasswordTokenExpiration = Math.floor(Date.now() / 1000) - 1;
    yield src_1.Db.collections.User.update(owner.id, {
        resetPasswordToken,
        resetPasswordTokenExpiration,
    });
    const passwordToStore = (0, random_1.randomValidPassword)();
    const response = yield authlessAgent.post('/change-password').send({
        token: resetPasswordToken,
        userId: owner.id,
        password: passwordToStore,
    });
    expect(response.statusCode).toBe(404);
}));

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
const config = require("../../config");
const utils = __importStar(require("./shared/utils"));
const constants_1 = require("./shared/constants");
const src_1 = require("../../src");
const random_1 = require("./shared/random");
const testDb = __importStar(require("./shared/testDb"));
const constants_2 = require("../../src/constants");
jest.mock('../../src/telemetry');
let app;
let testDbName = '';
let globalOwnerRole;
let globalMemberRole;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield utils.initTestServer({ endpointGroups: ['auth'], applyAuth: true });
    const initResult = yield testDb.init();
    testDbName = initResult.testDbName;
    globalOwnerRole = yield testDb.getGlobalOwnerRole();
    globalMemberRole = yield testDb.getGlobalMemberRole();
    utils.initTestLogger();
    utils.initTestTelemetry();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.truncate(['User'], testDbName);
    config.set('userManagement.isInstanceOwnerSetUp', true);
    yield src_1.Db.collections.Settings.update({ key: 'userManagement.isInstanceOwnerSetUp' }, { value: JSON.stringify(true) });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.terminate(testDbName);
}));
test('POST /login should log user in', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerPassword = (0, random_1.randomValidPassword)();
    const owner = yield testDb.createUser({
        password: ownerPassword,
        globalRole: globalOwnerRole,
    });
    const authlessAgent = utils.createAgent(app);
    const response = yield authlessAgent.post('/login').send({
        email: owner.email,
        password: ownerPassword,
    });
    expect(response.statusCode).toBe(200);
    const { id, email, firstName, lastName, password, personalizationAnswers, globalRole, resetPasswordToken, apiKey, } = response.body.data;
    expect(validator_1.default.isUUID(id)).toBe(true);
    expect(email).toBe(owner.email);
    expect(firstName).toBe(owner.firstName);
    expect(lastName).toBe(owner.lastName);
    expect(password).toBeUndefined();
    expect(personalizationAnswers).toBeNull();
    expect(password).toBeUndefined();
    expect(resetPasswordToken).toBeUndefined();
    expect(globalRole).toBeDefined();
    expect(globalRole.name).toBe('owner');
    expect(globalRole.scope).toBe('global');
    expect(apiKey).toBeUndefined();
    const authToken = utils.getAuthToken(response);
    expect(authToken).toBeDefined();
}));
test('GET /login should return 401 Unauthorized if no cookie', () => __awaiter(void 0, void 0, void 0, function* () {
    const authlessAgent = utils.createAgent(app);
    const response = yield authlessAgent.get('/login');
    expect(response.statusCode).toBe(401);
    const authToken = utils.getAuthToken(response);
    expect(authToken).toBeUndefined();
}));
test('GET /login should return cookie if UM is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    config.set('userManagement.isInstanceOwnerSetUp', false);
    yield src_1.Db.collections.Settings.update({ key: 'userManagement.isInstanceOwnerSetUp' }, { value: JSON.stringify(false) });
    const authOwnerShellAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const response = yield authOwnerShellAgent.get('/login');
    expect(response.statusCode).toBe(200);
    const authToken = utils.getAuthToken(response);
    expect(authToken).toBeDefined();
}));
test('GET /login should return 401 Unauthorized if invalid cookie', () => __awaiter(void 0, void 0, void 0, function* () {
    const invalidAuthAgent = utils.createAgent(app);
    invalidAuthAgent.jar.setCookie(`${constants_2.AUTH_COOKIE_NAME}=invalid`);
    const response = yield invalidAuthAgent.get('/login');
    expect(response.statusCode).toBe(401);
    const authToken = utils.getAuthToken(response);
    expect(authToken).toBeUndefined();
}));
test('GET /login should return logged-in owner shell', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authMemberAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const response = yield authMemberAgent.get('/login');
    expect(response.statusCode).toBe(200);
    const { id, email, firstName, lastName, password, personalizationAnswers, globalRole, resetPasswordToken, apiKey, } = response.body.data;
    expect(validator_1.default.isUUID(id)).toBe(true);
    expect(email).toBeDefined();
    expect(firstName).toBeNull();
    expect(lastName).toBeNull();
    expect(password).toBeUndefined();
    expect(personalizationAnswers).toBeNull();
    expect(password).toBeUndefined();
    expect(resetPasswordToken).toBeUndefined();
    expect(globalRole).toBeDefined();
    expect(globalRole.name).toBe('owner');
    expect(globalRole.scope).toBe('global');
    expect(apiKey).toBeUndefined();
    const authToken = utils.getAuthToken(response);
    expect(authToken).toBeUndefined();
}));
test('GET /login should return logged-in member shell', () => __awaiter(void 0, void 0, void 0, function* () {
    const memberShell = yield testDb.createUserShell(globalMemberRole);
    const authMemberAgent = utils.createAgent(app, { auth: true, user: memberShell });
    const response = yield authMemberAgent.get('/login');
    expect(response.statusCode).toBe(200);
    const { id, email, firstName, lastName, password, personalizationAnswers, globalRole, resetPasswordToken, apiKey, } = response.body.data;
    expect(validator_1.default.isUUID(id)).toBe(true);
    expect(email).toBeDefined();
    expect(firstName).toBeNull();
    expect(lastName).toBeNull();
    expect(password).toBeUndefined();
    expect(personalizationAnswers).toBeNull();
    expect(password).toBeUndefined();
    expect(resetPasswordToken).toBeUndefined();
    expect(globalRole).toBeDefined();
    expect(globalRole.name).toBe('member');
    expect(globalRole.scope).toBe('global');
    expect(apiKey).toBeUndefined();
    const authToken = utils.getAuthToken(response);
    expect(authToken).toBeUndefined();
}));
test('GET /login should return logged-in owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    const response = yield authOwnerAgent.get('/login');
    expect(response.statusCode).toBe(200);
    const { id, email, firstName, lastName, password, personalizationAnswers, globalRole, resetPasswordToken, apiKey, } = response.body.data;
    expect(validator_1.default.isUUID(id)).toBe(true);
    expect(email).toBe(owner.email);
    expect(firstName).toBe(owner.firstName);
    expect(lastName).toBe(owner.lastName);
    expect(password).toBeUndefined();
    expect(personalizationAnswers).toBeNull();
    expect(password).toBeUndefined();
    expect(resetPasswordToken).toBeUndefined();
    expect(globalRole).toBeDefined();
    expect(globalRole.name).toBe('owner');
    expect(globalRole.scope).toBe('global');
    expect(apiKey).toBeUndefined();
    const authToken = utils.getAuthToken(response);
    expect(authToken).toBeUndefined();
}));
test('GET /login should return logged-in member', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
    const response = yield authMemberAgent.get('/login');
    expect(response.statusCode).toBe(200);
    const { id, email, firstName, lastName, password, personalizationAnswers, globalRole, resetPasswordToken, apiKey, } = response.body.data;
    expect(validator_1.default.isUUID(id)).toBe(true);
    expect(email).toBe(member.email);
    expect(firstName).toBe(member.firstName);
    expect(lastName).toBe(member.lastName);
    expect(password).toBeUndefined();
    expect(personalizationAnswers).toBeNull();
    expect(password).toBeUndefined();
    expect(resetPasswordToken).toBeUndefined();
    expect(globalRole).toBeDefined();
    expect(globalRole.name).toBe('member');
    expect(globalRole.scope).toBe('global');
    expect(apiKey).toBeUndefined();
    const authToken = utils.getAuthToken(response);
    expect(authToken).toBeUndefined();
}));
test('POST /logout should log user out', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
    const response = yield authOwnerAgent.post('/logout');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(constants_1.LOGGED_OUT_RESPONSE_BODY);
    const authToken = utils.getAuthToken(response);
    expect(authToken).toBeUndefined();
}));

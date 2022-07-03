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
const utils = __importStar(require("./shared/utils"));
const testDb = __importStar(require("./shared/testDb"));
const src_1 = require("../../src");
const config_1 = __importDefault(require("../../config"));
const random_1 = require("./shared/random");
jest.mock('../../src/telemetry');
let app;
let testDbName = '';
let globalOwnerRole;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield utils.initTestServer({ endpointGroups: ['owner'], applyAuth: true });
    const initResult = yield testDb.init();
    testDbName = initResult.testDbName;
    globalOwnerRole = yield testDb.getGlobalOwnerRole();
    utils.initTestLogger();
    utils.initTestTelemetry();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    config_1.default.set('userManagement.isInstanceOwnerSetUp', false);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.truncate(['User'], testDbName);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.terminate(testDbName);
}));
test('POST /owner should create owner and enable isInstanceOwnerSetUp', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const newOwnerData = {
        email: (0, random_1.randomEmail)(),
        firstName: (0, random_1.randomName)(),
        lastName: (0, random_1.randomName)(),
        password: (0, random_1.randomValidPassword)(),
    };
    const response = yield authOwnerAgent.post('/owner').send(newOwnerData);
    expect(response.statusCode).toBe(200);
    const { id, email, firstName, lastName, personalizationAnswers, globalRole, password, resetPasswordToken, isPending, apiKey, } = response.body.data;
    expect(validator_1.default.isUUID(id)).toBe(true);
    expect(email).toBe(newOwnerData.email);
    expect(firstName).toBe(newOwnerData.firstName);
    expect(lastName).toBe(newOwnerData.lastName);
    expect(personalizationAnswers).toBeNull();
    expect(password).toBeUndefined();
    expect(isPending).toBe(false);
    expect(resetPasswordToken).toBeUndefined();
    expect(globalRole.name).toBe('owner');
    expect(globalRole.scope).toBe('global');
    expect(apiKey).toBeUndefined();
    const storedOwner = yield src_1.Db.collections.User.findOneOrFail(id);
    expect(storedOwner.password).not.toBe(newOwnerData.password);
    expect(storedOwner.email).toBe(newOwnerData.email);
    expect(storedOwner.firstName).toBe(newOwnerData.firstName);
    expect(storedOwner.lastName).toBe(newOwnerData.lastName);
    const isInstanceOwnerSetUpConfig = config_1.default.getEnv('userManagement.isInstanceOwnerSetUp');
    expect(isInstanceOwnerSetUpConfig).toBe(true);
    const isInstanceOwnerSetUpSetting = yield utils.isInstanceOwnerSetUp();
    expect(isInstanceOwnerSetUpSetting).toBe(true);
}));
test('POST /owner should create owner with lowercased email', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const newOwnerData = {
        email: (0, random_1.randomEmail)().toUpperCase(),
        firstName: (0, random_1.randomName)(),
        lastName: (0, random_1.randomName)(),
        password: (0, random_1.randomValidPassword)(),
    };
    const response = yield authOwnerAgent.post('/owner').send(newOwnerData);
    expect(response.statusCode).toBe(200);
    const { id, email } = response.body.data;
    expect(id).toBe(ownerShell.id);
    expect(email).toBe(newOwnerData.email.toLowerCase());
    const storedOwner = yield src_1.Db.collections.User.findOneOrFail(id);
    expect(storedOwner.email).toBe(newOwnerData.email.toLowerCase());
}));
test('POST /owner should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    yield Promise.all(INVALID_POST_OWNER_PAYLOADS.map((invalidPayload) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authOwnerAgent.post('/owner').send(invalidPayload);
        expect(response.statusCode).toBe(400);
    })));
}));
test('POST /owner/skip-setup should persist skipping setup to the DB', () => __awaiter(void 0, void 0, void 0, function* () {
    const ownerShell = yield testDb.createUserShell(globalOwnerRole);
    const authOwnerAgent = utils.createAgent(app, { auth: true, user: ownerShell });
    const response = yield authOwnerAgent.post('/owner/skip-setup').send();
    expect(response.statusCode).toBe(200);
    const skipConfig = config_1.default.getEnv('userManagement.skipInstanceOwnerSetup');
    expect(skipConfig).toBe(true);
    const { value } = yield src_1.Db.collections.Settings.findOneOrFail({
        key: 'userManagement.skipInstanceOwnerSetup',
    });
    expect(value).toBe('true');
}));
const INVALID_POST_OWNER_PAYLOADS = [
    {
        email: '',
        firstName: (0, random_1.randomName)(),
        lastName: (0, random_1.randomName)(),
        password: (0, random_1.randomValidPassword)(),
    },
    {
        email: (0, random_1.randomEmail)(),
        firstName: '',
        lastName: (0, random_1.randomName)(),
        password: (0, random_1.randomValidPassword)(),
    },
    {
        email: (0, random_1.randomEmail)(),
        firstName: (0, random_1.randomName)(),
        lastName: '',
        password: (0, random_1.randomValidPassword)(),
    },
    {
        email: (0, random_1.randomEmail)(),
        firstName: (0, random_1.randomName)(),
        lastName: (0, random_1.randomName)(),
        password: (0, random_1.randomInvalidPassword)(),
    },
    {
        firstName: (0, random_1.randomName)(),
        lastName: (0, random_1.randomName)(),
    },
    {
        firstName: (0, random_1.randomName)(),
    },
    {
        lastName: (0, random_1.randomName)(),
    },
    {
        email: (0, random_1.randomEmail)(),
        firstName: 'John <script',
        lastName: (0, random_1.randomName)(),
    },
    {
        email: (0, random_1.randomEmail)(),
        firstName: 'John <a',
        lastName: (0, random_1.randomName)(),
    },
];

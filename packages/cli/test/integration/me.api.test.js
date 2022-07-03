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
const typeorm_1 = require("typeorm");
const config_1 = __importDefault(require("../../config"));
const utils = __importStar(require("./shared/utils"));
const constants_1 = require("./shared/constants");
const src_1 = require("../../src");
const random_1 = require("./shared/random");
const testDb = __importStar(require("./shared/testDb"));
jest.mock('../../src/telemetry');
let app;
let testDbName = '';
let globalOwnerRole;
let globalMemberRole;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield utils.initTestServer({ endpointGroups: ['me'], applyAuth: true });
    const initResult = yield testDb.init();
    testDbName = initResult.testDbName;
    globalOwnerRole = yield testDb.getGlobalOwnerRole();
    globalMemberRole = yield testDb.getGlobalMemberRole();
    utils.initTestLogger();
    utils.initTestTelemetry();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.terminate(testDbName);
}));
describe('Owner shell', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield testDb.truncate(['User'], testDbName);
    }));
    test('GET /me should return sanitized owner shell', () => __awaiter(void 0, void 0, void 0, function* () {
        const ownerShell = yield testDb.createUserShell(globalOwnerRole);
        const authOwnerShellAgent = utils.createAgent(app, { auth: true, user: ownerShell });
        const response = yield authOwnerShellAgent.get('/me');
        expect(response.statusCode).toBe(200);
        const { id, email, firstName, lastName, personalizationAnswers, globalRole, password, resetPasswordToken, isPending, apiKey, } = response.body.data;
        expect(validator_1.default.isUUID(id)).toBe(true);
        expect(email).toBeNull();
        expect(firstName).toBeNull();
        expect(lastName).toBeNull();
        expect(personalizationAnswers).toBeNull();
        expect(password).toBeUndefined();
        expect(resetPasswordToken).toBeUndefined();
        expect(isPending).toBe(true);
        expect(globalRole.name).toBe('owner');
        expect(globalRole.scope).toBe('global');
        expect(apiKey).toBeUndefined();
    }));
    test('PATCH /me should succeed with valid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
        const ownerShell = yield testDb.createUserShell(globalOwnerRole);
        const authOwnerShellAgent = utils.createAgent(app, { auth: true, user: ownerShell });
        for (const validPayload of VALID_PATCH_ME_PAYLOADS) {
            const response = yield authOwnerShellAgent.patch('/me').send(validPayload);
            expect(response.statusCode).toBe(200);
            const { id, email, firstName, lastName, personalizationAnswers, globalRole, password, resetPasswordToken, isPending, apiKey, } = response.body.data;
            expect(validator_1.default.isUUID(id)).toBe(true);
            expect(email).toBe(validPayload.email.toLowerCase());
            expect(firstName).toBe(validPayload.firstName);
            expect(lastName).toBe(validPayload.lastName);
            expect(personalizationAnswers).toBeNull();
            expect(password).toBeUndefined();
            expect(resetPasswordToken).toBeUndefined();
            expect(isPending).toBe(false);
            expect(globalRole.name).toBe('owner');
            expect(globalRole.scope).toBe('global');
            expect(apiKey).toBeUndefined();
            const storedOwnerShell = yield src_1.Db.collections.User.findOneOrFail(id);
            expect(storedOwnerShell.email).toBe(validPayload.email.toLowerCase());
            expect(storedOwnerShell.firstName).toBe(validPayload.firstName);
            expect(storedOwnerShell.lastName).toBe(validPayload.lastName);
        }
    }));
    test('PATCH /me should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
        const ownerShell = yield testDb.createUserShell(globalOwnerRole);
        const authOwnerShellAgent = utils.createAgent(app, { auth: true, user: ownerShell });
        for (const invalidPayload of INVALID_PATCH_ME_PAYLOADS) {
            const response = yield authOwnerShellAgent.patch('/me').send(invalidPayload);
            expect(response.statusCode).toBe(400);
            const storedOwnerShell = yield src_1.Db.collections.User.findOneOrFail();
            expect(storedOwnerShell.email).toBeNull();
            expect(storedOwnerShell.firstName).toBeNull();
            expect(storedOwnerShell.lastName).toBeNull();
        }
    }));
    test('PATCH /me/password should fail for shell', () => __awaiter(void 0, void 0, void 0, function* () {
        const ownerShell = yield testDb.createUserShell(globalOwnerRole);
        const authOwnerShellAgent = utils.createAgent(app, { auth: true, user: ownerShell });
        const validPasswordPayload = {
            currentPassword: (0, random_1.randomValidPassword)(),
            newPassword: (0, random_1.randomValidPassword)(),
        };
        const validPayloads = [validPasswordPayload, ...INVALID_PASSWORD_PAYLOADS];
        yield Promise.all(validPayloads.map((payload) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield authOwnerShellAgent.patch('/me/password').send(payload);
            expect([400, 500].includes(response.statusCode)).toBe(true);
            const storedMember = yield src_1.Db.collections.User.findOneOrFail();
            if (payload.newPassword) {
                expect(storedMember.password).not.toBe(payload.newPassword);
            }
            if (payload.currentPassword) {
                expect(storedMember.password).not.toBe(payload.currentPassword);
            }
        })));
        const storedOwnerShell = yield src_1.Db.collections.User.findOneOrFail();
        expect(storedOwnerShell.password).toBeNull();
    }));
    test('POST /me/survey should succeed with valid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
        const ownerShell = yield testDb.createUserShell(globalOwnerRole);
        const authOwnerShellAgent = utils.createAgent(app, { auth: true, user: ownerShell });
        const validPayloads = [SURVEY, {}];
        for (const validPayload of validPayloads) {
            const response = yield authOwnerShellAgent.post('/me/survey').send(validPayload);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(constants_1.SUCCESS_RESPONSE_BODY);
            const storedShellOwner = yield src_1.Db.collections.User.findOneOrFail({
                where: { email: (0, typeorm_1.IsNull)() },
            });
            expect(storedShellOwner.personalizationAnswers).toEqual(validPayload);
        }
    }));
    test('POST /me/api-key should create an api key', () => __awaiter(void 0, void 0, void 0, function* () {
        const ownerShell = yield testDb.createUserShell(globalOwnerRole);
        const authOwnerShellAgent = utils.createAgent(app, { auth: true, user: ownerShell });
        const response = yield authOwnerShellAgent.post('/me/api-key');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.apiKey).toBeDefined();
        expect(response.body.data.apiKey).not.toBeNull();
        const storedShellOwner = yield src_1.Db.collections.User.findOneOrFail({
            where: { email: (0, typeorm_1.IsNull)() },
        });
        expect(storedShellOwner.apiKey).toEqual(response.body.data.apiKey);
    }));
    test('GET /me/api-key should fetch the api key', () => __awaiter(void 0, void 0, void 0, function* () {
        let ownerShell = yield testDb.createUserShell(globalOwnerRole);
        ownerShell = yield testDb.addApiKey(ownerShell);
        const authOwnerShellAgent = utils.createAgent(app, { auth: true, user: ownerShell });
        const response = yield authOwnerShellAgent.get('/me/api-key');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.apiKey).toEqual(ownerShell.apiKey);
    }));
    test('DELETE /me/api-key should fetch the api key', () => __awaiter(void 0, void 0, void 0, function* () {
        let ownerShell = yield testDb.createUserShell(globalOwnerRole);
        ownerShell = yield testDb.addApiKey(ownerShell);
        const authOwnerShellAgent = utils.createAgent(app, { auth: true, user: ownerShell });
        const response = yield authOwnerShellAgent.delete('/me/api-key');
        expect(response.statusCode).toBe(200);
        const storedShellOwner = yield src_1.Db.collections.User.findOneOrFail({
            where: { email: (0, typeorm_1.IsNull)() },
        });
        expect(storedShellOwner.apiKey).toBeNull();
    }));
});
describe('Member', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        config_1.default.set('userManagement.isInstanceOwnerSetUp', true);
        yield src_1.Db.collections.Settings.update({ key: 'userManagement.isInstanceOwnerSetUp' }, { value: JSON.stringify(true) });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield testDb.truncate(['User'], testDbName);
    }));
    test('GET /me should return sanitized member', () => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield testDb.createUser({ globalRole: globalMemberRole });
        const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
        const response = yield authMemberAgent.get('/me');
        expect(response.statusCode).toBe(200);
        const { id, email, firstName, lastName, personalizationAnswers, globalRole, password, resetPasswordToken, isPending, apiKey, } = response.body.data;
        expect(validator_1.default.isUUID(id)).toBe(true);
        expect(email).toBe(member.email);
        expect(firstName).toBe(member.firstName);
        expect(lastName).toBe(member.lastName);
        expect(personalizationAnswers).toBeNull();
        expect(password).toBeUndefined();
        expect(resetPasswordToken).toBeUndefined();
        expect(isPending).toBe(false);
        expect(globalRole.name).toBe('member');
        expect(globalRole.scope).toBe('global');
        expect(apiKey).toBeUndefined();
    }));
    test('PATCH /me should succeed with valid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield testDb.createUser({ globalRole: globalMemberRole });
        const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
        for (const validPayload of VALID_PATCH_ME_PAYLOADS) {
            const response = yield authMemberAgent.patch('/me').send(validPayload);
            expect(response.statusCode).toBe(200);
            const { id, email, firstName, lastName, personalizationAnswers, globalRole, password, resetPasswordToken, isPending, apiKey, } = response.body.data;
            expect(validator_1.default.isUUID(id)).toBe(true);
            expect(email).toBe(validPayload.email.toLowerCase());
            expect(firstName).toBe(validPayload.firstName);
            expect(lastName).toBe(validPayload.lastName);
            expect(personalizationAnswers).toBeNull();
            expect(password).toBeUndefined();
            expect(resetPasswordToken).toBeUndefined();
            expect(isPending).toBe(false);
            expect(globalRole.name).toBe('member');
            expect(globalRole.scope).toBe('global');
            expect(apiKey).toBeUndefined();
            const storedMember = yield src_1.Db.collections.User.findOneOrFail(id);
            expect(storedMember.email).toBe(validPayload.email.toLowerCase());
            expect(storedMember.firstName).toBe(validPayload.firstName);
            expect(storedMember.lastName).toBe(validPayload.lastName);
        }
    }));
    test('PATCH /me should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield testDb.createUser({ globalRole: globalMemberRole });
        const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
        for (const invalidPayload of INVALID_PATCH_ME_PAYLOADS) {
            const response = yield authMemberAgent.patch('/me').send(invalidPayload);
            expect(response.statusCode).toBe(400);
            const storedMember = yield src_1.Db.collections.User.findOneOrFail();
            expect(storedMember.email).toBe(member.email);
            expect(storedMember.firstName).toBe(member.firstName);
            expect(storedMember.lastName).toBe(member.lastName);
        }
    }));
    test('PATCH /me/password should succeed with valid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
        const memberPassword = (0, random_1.randomValidPassword)();
        const member = yield testDb.createUser({
            password: memberPassword,
            globalRole: globalMemberRole,
        });
        const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
        const validPayload = {
            currentPassword: memberPassword,
            newPassword: (0, random_1.randomValidPassword)(),
        };
        const response = yield authMemberAgent.patch('/me/password').send(validPayload);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(constants_1.SUCCESS_RESPONSE_BODY);
        const storedMember = yield src_1.Db.collections.User.findOneOrFail();
        expect(storedMember.password).not.toBe(member.password);
        expect(storedMember.password).not.toBe(validPayload.newPassword);
    }));
    test('PATCH /me/password should fail with invalid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield testDb.createUser({ globalRole: globalMemberRole });
        const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
        for (const payload of INVALID_PASSWORD_PAYLOADS) {
            const response = yield authMemberAgent.patch('/me/password').send(payload);
            expect([400, 500].includes(response.statusCode)).toBe(true);
            const storedMember = yield src_1.Db.collections.User.findOneOrFail();
            if (payload.newPassword) {
                expect(storedMember.password).not.toBe(payload.newPassword);
            }
            if (payload.currentPassword) {
                expect(storedMember.password).not.toBe(payload.currentPassword);
            }
        }
    }));
    test('POST /me/survey should succeed with valid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield testDb.createUser({ globalRole: globalMemberRole });
        const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
        const validPayloads = [SURVEY, {}];
        for (const validPayload of validPayloads) {
            const response = yield authMemberAgent.post('/me/survey').send(validPayload);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(constants_1.SUCCESS_RESPONSE_BODY);
            const { personalizationAnswers: storedAnswers } = yield src_1.Db.collections.User.findOneOrFail();
            expect(storedAnswers).toEqual(validPayload);
        }
    }));
    test('POST /me/api-key should create an api key', () => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield testDb.createUser({
            globalRole: globalMemberRole,
            apiKey: (0, random_1.randomApiKey)(),
        });
        const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
        const response = yield authMemberAgent.post('/me/api-key');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.apiKey).toBeDefined();
        expect(response.body.data.apiKey).not.toBeNull();
        const storedMember = yield src_1.Db.collections.User.findOneOrFail(member.id);
        expect(storedMember.apiKey).toEqual(response.body.data.apiKey);
    }));
    test('GET /me/api-key should fetch the api key', () => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield testDb.createUser({
            globalRole: globalMemberRole,
            apiKey: (0, random_1.randomApiKey)(),
        });
        const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
        const response = yield authMemberAgent.get('/me/api-key');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.apiKey).toEqual(member.apiKey);
    }));
    test('DELETE /me/api-key should fetch the api key', () => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield testDb.createUser({
            globalRole: globalMemberRole,
            apiKey: (0, random_1.randomApiKey)(),
        });
        const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
        const response = yield authMemberAgent.delete('/me/api-key');
        expect(response.statusCode).toBe(200);
        const storedMember = yield src_1.Db.collections.User.findOneOrFail(member.id);
        expect(storedMember.apiKey).toBeNull();
    }));
});
describe('Owner', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        config_1.default.set('userManagement.isInstanceOwnerSetUp', true);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield testDb.truncate(['User'], testDbName);
    }));
    test('GET /me should return sanitized owner', () => __awaiter(void 0, void 0, void 0, function* () {
        const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
        const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
        const response = yield authOwnerAgent.get('/me');
        expect(response.statusCode).toBe(200);
        const { id, email, firstName, lastName, personalizationAnswers, globalRole, password, resetPasswordToken, isPending, apiKey, } = response.body.data;
        expect(validator_1.default.isUUID(id)).toBe(true);
        expect(email).toBe(owner.email);
        expect(firstName).toBe(owner.firstName);
        expect(lastName).toBe(owner.lastName);
        expect(personalizationAnswers).toBeNull();
        expect(password).toBeUndefined();
        expect(resetPasswordToken).toBeUndefined();
        expect(isPending).toBe(false);
        expect(globalRole.name).toBe('owner');
        expect(globalRole.scope).toBe('global');
        expect(apiKey).toBeUndefined();
    }));
    test('PATCH /me should succeed with valid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
        const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
        const authOwnerAgent = utils.createAgent(app, { auth: true, user: owner });
        for (const validPayload of VALID_PATCH_ME_PAYLOADS) {
            const response = yield authOwnerAgent.patch('/me').send(validPayload);
            expect(response.statusCode).toBe(200);
            const { id, email, firstName, lastName, personalizationAnswers, globalRole, password, resetPasswordToken, isPending, apiKey, } = response.body.data;
            expect(validator_1.default.isUUID(id)).toBe(true);
            expect(email).toBe(validPayload.email.toLowerCase());
            expect(firstName).toBe(validPayload.firstName);
            expect(lastName).toBe(validPayload.lastName);
            expect(personalizationAnswers).toBeNull();
            expect(password).toBeUndefined();
            expect(resetPasswordToken).toBeUndefined();
            expect(isPending).toBe(false);
            expect(globalRole.name).toBe('owner');
            expect(globalRole.scope).toBe('global');
            expect(apiKey).toBeUndefined();
            const storedOwner = yield src_1.Db.collections.User.findOneOrFail(id);
            expect(storedOwner.email).toBe(validPayload.email.toLowerCase());
            expect(storedOwner.firstName).toBe(validPayload.firstName);
            expect(storedOwner.lastName).toBe(validPayload.lastName);
        }
    }));
});
const SURVEY = [
    'codingSkill',
    'companyIndustry',
    'companySize',
    'otherCompanyIndustry',
    'otherWorkArea',
    'workArea',
].reduce((acc, cur) => {
    return (acc[cur] = (0, random_1.randomString)(2, 10)), acc;
}, {});
const VALID_PATCH_ME_PAYLOADS = [
    {
        email: (0, random_1.randomEmail)(),
        firstName: (0, random_1.randomName)(),
        lastName: (0, random_1.randomName)(),
        password: (0, random_1.randomValidPassword)(),
    },
    {
        email: (0, random_1.randomEmail)().toUpperCase(),
        firstName: (0, random_1.randomName)(),
        lastName: (0, random_1.randomName)(),
        password: (0, random_1.randomValidPassword)(),
    },
];
const INVALID_PATCH_ME_PAYLOADS = [
    {
        email: 'invalid',
        firstName: (0, random_1.randomName)(),
        lastName: (0, random_1.randomName)(),
    },
    {
        email: (0, random_1.randomEmail)(),
        firstName: '',
        lastName: (0, random_1.randomName)(),
    },
    {
        email: (0, random_1.randomEmail)(),
        firstName: (0, random_1.randomName)(),
        lastName: '',
    },
    {
        email: (0, random_1.randomEmail)(),
        firstName: 123,
        lastName: (0, random_1.randomName)(),
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
const INVALID_PASSWORD_PAYLOADS = [
    {
        currentPassword: null,
        newPassword: (0, random_1.randomValidPassword)(),
    },
    {
        currentPassword: '',
        newPassword: (0, random_1.randomValidPassword)(),
    },
    {
        currentPassword: {},
        newPassword: (0, random_1.randomValidPassword)(),
    },
    {
        currentPassword: [],
        newPassword: (0, random_1.randomValidPassword)(),
    },
    {
        currentPassword: (0, random_1.randomValidPassword)(),
    },
    {
        newPassword: (0, random_1.randomValidPassword)(),
    },
    {
        currentPassword: (0, random_1.randomValidPassword)(),
        newPassword: null,
    },
    {
        currentPassword: (0, random_1.randomValidPassword)(),
        newPassword: '',
    },
    {
        currentPassword: (0, random_1.randomValidPassword)(),
        newPassword: {},
    },
    {
        currentPassword: (0, random_1.randomValidPassword)(),
        newPassword: [],
    },
];

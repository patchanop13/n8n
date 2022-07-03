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
const config_1 = __importDefault(require("../../../config"));
const random_1 = require("../shared/random");
const utils = __importStar(require("../shared/utils"));
const testDb = __importStar(require("../shared/testDb"));
jest.mock('../../../src/telemetry');
let app;
let testDbName = '';
let globalOwnerRole;
let workflowRunner;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield utils.initTestServer({ endpointGroups: ['publicApi'], applyAuth: false });
    const initResult = yield testDb.init();
    testDbName = initResult.testDbName;
    globalOwnerRole = yield testDb.getGlobalOwnerRole();
    utils.initTestTelemetry();
    utils.initTestLogger();
    yield utils.initBinaryManager();
    yield utils.initNodeTypes();
    workflowRunner = yield utils.initActiveWorkflowRunner();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.truncate([
        'SharedCredentials',
        'SharedWorkflow',
        'User',
        'Workflow',
        'Credentials',
        'Execution',
        'Settings',
    ], testDbName);
    config_1.default.set('userManagement.disabled', false);
    config_1.default.set('userManagement.isInstanceOwnerSetUp', true);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield workflowRunner.removeAll();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.terminate(testDbName);
}));
test('GET /executions/:id should fail due to missing API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.get('/executions/1');
    expect(response.statusCode).toBe(401);
}));
test('GET /executions/:id should fail due to invalid API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    owner.apiKey = 'abcXYZ';
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.get('/executions/1');
    expect(response.statusCode).toBe(401);
}));
test('GET /executions/:id should get an execution', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const workflow = yield testDb.createWorkflow({}, owner);
    const execution = yield testDb.createSuccessfulExecution(workflow);
    const response = yield authOwnerAgent.get(`/executions/${execution.id}`);
    expect(response.statusCode).toBe(200);
    const { id, finished, mode, retryOf, retrySuccessId, startedAt, stoppedAt, workflowId, waitTill, } = response.body;
    expect(id).toBeDefined();
    expect(finished).toBe(true);
    expect(mode).toEqual(execution.mode);
    expect(retrySuccessId).toBeNull();
    expect(retryOf).toBeNull();
    expect(startedAt).not.toBeNull();
    expect(stoppedAt).not.toBeNull();
    expect(workflowId).toBe(execution.workflowId);
    expect(waitTill).toBeNull();
}));
test('DELETE /executions/:id should fail due to missing API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.delete('/executions/1');
    expect(response.statusCode).toBe(401);
}));
test('DELETE /executions/:id should fail due to invalid API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    owner.apiKey = 'abcXYZ';
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.delete('/executions/1');
    expect(response.statusCode).toBe(401);
}));
test('DELETE /executions/:id should delete an execution', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const workflow = yield testDb.createWorkflow({}, owner);
    const execution = yield testDb.createSuccessfulExecution(workflow);
    const response = yield authOwnerAgent.delete(`/executions/${execution.id}`);
    expect(response.statusCode).toBe(200);
    const { id, finished, mode, retryOf, retrySuccessId, startedAt, stoppedAt, workflowId, waitTill, } = response.body;
    expect(id).toBeDefined();
    expect(finished).toBe(true);
    expect(mode).toEqual(execution.mode);
    expect(retrySuccessId).toBeNull();
    expect(retryOf).toBeNull();
    expect(startedAt).not.toBeNull();
    expect(stoppedAt).not.toBeNull();
    expect(workflowId).toBe(execution.workflowId);
    expect(waitTill).toBeNull();
}));
test('GET /executions should fail due to missing API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.get('/executions');
    expect(response.statusCode).toBe(401);
}));
test('GET /executions should fail due to invalid API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    owner.apiKey = 'abcXYZ';
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.get('/executions');
    expect(response.statusCode).toBe(401);
}));
test('GET /executions should retrieve all successfull executions', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const workflow = yield testDb.createWorkflow({}, owner);
    const successfullExecution = yield testDb.createSuccessfulExecution(workflow);
    yield testDb.createErrorExecution(workflow);
    const response = yield authOwnerAgent.get(`/executions`).query({
        status: 'success',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.nextCursor).toBe(null);
    const { id, finished, mode, retryOf, retrySuccessId, startedAt, stoppedAt, workflowId, waitTill, } = response.body.data[0];
    expect(id).toBeDefined();
    expect(finished).toBe(true);
    expect(mode).toEqual(successfullExecution.mode);
    expect(retrySuccessId).toBeNull();
    expect(retryOf).toBeNull();
    expect(startedAt).not.toBeNull();
    expect(stoppedAt).not.toBeNull();
    expect(workflowId).toBe(successfullExecution.workflowId);
    expect(waitTill).toBeNull();
}));
test('GET /executions should retrieve all error executions', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const workflow = yield testDb.createWorkflow({}, owner);
    yield testDb.createSuccessfulExecution(workflow);
    const errorExecution = yield testDb.createErrorExecution(workflow);
    const response = yield authOwnerAgent.get(`/executions`).query({
        status: 'error',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.nextCursor).toBe(null);
    const { id, finished, mode, retryOf, retrySuccessId, startedAt, stoppedAt, workflowId, waitTill, } = response.body.data[0];
    expect(id).toBeDefined();
    expect(finished).toBe(false);
    expect(mode).toEqual(errorExecution.mode);
    expect(retrySuccessId).toBeNull();
    expect(retryOf).toBeNull();
    expect(startedAt).not.toBeNull();
    expect(stoppedAt).not.toBeNull();
    expect(workflowId).toBe(errorExecution.workflowId);
    expect(waitTill).toBeNull();
}));
test('GET /executions should return all waiting executions', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const workflow = yield testDb.createWorkflow({}, owner);
    yield testDb.createSuccessfulExecution(workflow);
    yield testDb.createErrorExecution(workflow);
    const waitingExecution = yield testDb.createWaitingExecution(workflow);
    const response = yield authOwnerAgent.get(`/executions`).query({
        status: 'waiting',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.nextCursor).toBe(null);
    const { id, finished, mode, retryOf, retrySuccessId, startedAt, stoppedAt, workflowId, waitTill, } = response.body.data[0];
    expect(id).toBeDefined();
    expect(finished).toBe(false);
    expect(mode).toEqual(waitingExecution.mode);
    expect(retrySuccessId).toBeNull();
    expect(retryOf).toBeNull();
    expect(startedAt).not.toBeNull();
    expect(stoppedAt).not.toBeNull();
    expect(workflowId).toBe(waitingExecution.workflowId);
    expect(new Date(waitTill).getTime()).toBeGreaterThan(Date.now() - 1000);
}));
test('GET /executions should retrieve all executions of specific workflow', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const [workflow, workflow2] = yield testDb.createManyWorkflows(2, {}, owner);
    const savedExecutions = yield testDb.createManyExecutions(2, workflow, 
    // @ts-ignore
    testDb.createSuccessfulExecution);
    // @ts-ignore
    yield testDb.createManyExecutions(2, workflow2, testDb.createSuccessfulExecution);
    const response = yield authOwnerAgent.get(`/executions`).query({
        workflowId: workflow.id.toString(),
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(2);
    expect(response.body.nextCursor).toBe(null);
    for (const execution of response.body.data) {
        const { id, finished, mode, retryOf, retrySuccessId, startedAt, stoppedAt, workflowId, waitTill, } = execution;
        expect(savedExecutions.some((exec) => exec.id === id)).toBe(true);
        expect(finished).toBe(true);
        expect(mode).toBeDefined();
        expect(retrySuccessId).toBeNull();
        expect(retryOf).toBeNull();
        expect(startedAt).not.toBeNull();
        expect(stoppedAt).not.toBeNull();
        expect(workflowId).toBe(workflow.id.toString());
        expect(waitTill).toBeNull();
    }
}));

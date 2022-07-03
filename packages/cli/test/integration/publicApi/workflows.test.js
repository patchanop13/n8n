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
const src_1 = require("../../../src");
const config_1 = __importDefault(require("../../../config"));
const random_1 = require("../shared/random");
const utils = __importStar(require("../shared/utils"));
const testDb = __importStar(require("../shared/testDb"));
let app;
let testDbName = '';
let globalOwnerRole;
let globalMemberRole;
let workflowOwnerRole;
let workflowRunner;
jest.mock('../../../src/telemetry');
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield utils.initTestServer({ endpointGroups: ['publicApi'], applyAuth: false });
    const initResult = yield testDb.init();
    testDbName = initResult.testDbName;
    const [fetchedGlobalOwnerRole, fetchedGlobalMemberRole, fetchedWorkflowOwnerRole] = yield testDb.getAllRoles();
    globalOwnerRole = fetchedGlobalOwnerRole;
    globalMemberRole = fetchedGlobalMemberRole;
    workflowOwnerRole = fetchedWorkflowOwnerRole;
    utils.initTestTelemetry();
    utils.initTestLogger();
    utils.initConfigFile();
    yield utils.initNodeTypes();
    workflowRunner = yield utils.initActiveWorkflowRunner();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.truncate(['SharedWorkflow', 'User', 'Workflow'], testDbName);
    config_1.default.set('userManagement.disabled', false);
    config_1.default.set('userManagement.isInstanceOwnerSetUp', true);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield workflowRunner.removeAll();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.terminate(testDbName);
}));
test('GET /workflows should fail due to missing API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.get('/workflows');
    expect(response.statusCode).toBe(401);
}));
test('GET /workflows should fail due to invalid API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    owner.apiKey = 'abcXYZ';
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.get('/workflows');
    expect(response.statusCode).toBe(401);
}));
test('GET /workflows should return all owned workflows', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: member,
        version: 1,
    });
    yield Promise.all([
        testDb.createWorkflow({}, member),
        testDb.createWorkflow({}, member),
        testDb.createWorkflow({}, member),
    ]);
    const response = yield authAgent.get('/workflows');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(3);
    expect(response.body.nextCursor).toBeNull();
    for (const workflow of response.body.data) {
        const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt, tags, } = workflow;
        expect(id).toBeDefined();
        expect(name).toBeDefined();
        expect(connections).toBeDefined();
        expect(active).toBe(false);
        expect(staticData).toBeDefined();
        expect(nodes).toBeDefined();
        expect(tags).toBeDefined();
        expect(settings).toBeDefined();
        expect(createdAt).toBeDefined();
        expect(updatedAt).toBeDefined();
    }
}));
test('GET /workflows should return all owned workflows with pagination', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: member,
        version: 1,
    });
    yield Promise.all([
        testDb.createWorkflow({}, member),
        testDb.createWorkflow({}, member),
        testDb.createWorkflow({}, member),
    ]);
    const response = yield authAgent.get('/workflows?limit=1');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.nextCursor).not.toBeNull();
    const response2 = yield authAgent.get(`/workflows?limit=1&cursor=${response.body.nextCursor}`);
    expect(response2.statusCode).toBe(200);
    expect(response2.body.data.length).toBe(1);
    expect(response2.body.nextCursor).not.toBeNull();
    expect(response2.body.nextCursor).not.toBe(response.body.nextCursor);
    const responses = [...response.body.data, ...response2.body.data];
    for (const workflow of responses) {
        const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt, tags, } = workflow;
        expect(id).toBeDefined();
        expect(name).toBeDefined();
        expect(connections).toBeDefined();
        expect(active).toBe(false);
        expect(staticData).toBeDefined();
        expect(nodes).toBeDefined();
        expect(tags).toBeDefined();
        expect(settings).toBeDefined();
        expect(createdAt).toBeDefined();
        expect(updatedAt).toBeDefined();
    }
    // check that we really received a different result
    expect(response.body.data[0].id).toBeLessThan(response2.body.data[0].id);
}));
test('GET /workflows should return all owned workflows filtered by tag', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: member,
        version: 1,
    });
    const tag = yield testDb.createTag({});
    const [workflow] = yield Promise.all([
        testDb.createWorkflow({ tags: [tag] }, member),
        testDb.createWorkflow({}, member),
    ]);
    const response = yield authAgent.get(`/workflows?tags=${tag.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt, tags: wfTags, } = response.body.data[0];
    expect(id).toBe(workflow.id);
    expect(name).toBeDefined();
    expect(connections).toBeDefined();
    expect(active).toBe(false);
    expect(staticData).toBeDefined();
    expect(nodes).toBeDefined();
    expect(settings).toBeDefined();
    expect(createdAt).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(wfTags.length).toBe(1);
    expect(wfTags[0].id).toBe(tag.id);
}));
test('GET /workflows should return all owned workflows filtered by tags', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: member,
        version: 1,
    });
    const tags = yield Promise.all([yield testDb.createTag({}), yield testDb.createTag({})]);
    const tagNames = tags.map((tag) => tag.name).join(',');
    const [workflow1, workflow2] = yield Promise.all([
        testDb.createWorkflow({ tags }, member),
        testDb.createWorkflow({ tags }, member),
        testDb.createWorkflow({}, member),
        testDb.createWorkflow({ tags: [tags[0]] }, member),
        testDb.createWorkflow({ tags: [tags[1]] }, member),
    ]);
    const response = yield authAgent.get(`/workflows?tags=${tagNames}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(2);
    for (const workflow of response.body.data) {
        const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt } = workflow;
        expect(id).toBeDefined();
        expect([workflow1.id, workflow2.id].includes(id)).toBe(true);
        expect(name).toBeDefined();
        expect(connections).toBeDefined();
        expect(active).toBe(false);
        expect(staticData).toBeDefined();
        expect(nodes).toBeDefined();
        expect(settings).toBeDefined();
        expect(createdAt).toBeDefined();
        expect(updatedAt).toBeDefined();
        expect(workflow.tags.length).toBe(2);
        workflow.tags.forEach((tag) => {
            expect(tags.some((savedTag) => savedTag.id === tag.id)).toBe(true);
        });
    }
}));
test('GET /workflows should return all workflows for owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    yield Promise.all([
        testDb.createWorkflow({}, owner),
        testDb.createWorkflow({}, member),
        testDb.createWorkflow({}, owner),
        testDb.createWorkflow({}, member),
        testDb.createWorkflow({}, owner),
    ]);
    const response = yield authOwnerAgent.get('/workflows');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(5);
    expect(response.body.nextCursor).toBeNull();
    for (const workflow of response.body.data) {
        const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt, tags, } = workflow;
        expect(id).toBeDefined();
        expect(name).toBeDefined();
        expect(connections).toBeDefined();
        expect(active).toBe(false);
        expect(staticData).toBeDefined();
        expect(nodes).toBeDefined();
        expect(tags).toBeDefined();
        expect(settings).toBeDefined();
        expect(createdAt).toBeDefined();
        expect(updatedAt).toBeDefined();
    }
}));
test('GET /workflows/:id should fail due to missing API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    owner.apiKey = null;
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.get(`/workflows/2`);
    expect(response.statusCode).toBe(401);
}));
test('GET /workflows/:id should fail due to invalid API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    owner.apiKey = 'abcXYZ';
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.get(`/workflows/2`);
    expect(response.statusCode).toBe(401);
}));
test('GET /workflows/:id should fail due to non-existing workflow', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.get(`/workflows/2`);
    expect(response.statusCode).toBe(404);
}));
test('GET /workflows/:id should retrieve workflow', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: member,
        version: 1,
    });
    // create and assign workflow to owner
    const workflow = yield testDb.createWorkflow({}, member);
    const response = yield authAgent.get(`/workflows/${workflow.id}`);
    expect(response.statusCode).toBe(200);
    const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt, tags } = response.body;
    expect(id).toEqual(workflow.id);
    expect(name).toEqual(workflow.name);
    expect(connections).toEqual(workflow.connections);
    expect(active).toBe(false);
    expect(staticData).toEqual(workflow.staticData);
    expect(nodes).toEqual(workflow.nodes);
    expect(tags).toEqual([]);
    expect(settings).toEqual(workflow.settings);
    expect(createdAt).toEqual(workflow.createdAt.toISOString());
    expect(updatedAt).toEqual(workflow.updatedAt.toISOString());
}));
test('GET /workflows/:id should retrieve non-owned workflow for owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    // create and assign workflow to owner
    const workflow = yield testDb.createWorkflow({}, member);
    const response = yield authOwnerAgent.get(`/workflows/${workflow.id}`);
    expect(response.statusCode).toBe(200);
    const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt } = response.body;
    expect(id).toEqual(workflow.id);
    expect(name).toEqual(workflow.name);
    expect(connections).toEqual(workflow.connections);
    expect(active).toBe(false);
    expect(staticData).toEqual(workflow.staticData);
    expect(nodes).toEqual(workflow.nodes);
    expect(settings).toEqual(workflow.settings);
    expect(createdAt).toEqual(workflow.createdAt.toISOString());
    expect(updatedAt).toEqual(workflow.updatedAt.toISOString());
}));
test('DELETE /workflows/:id should fail due to missing API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.delete(`/workflows/2`);
    expect(response.statusCode).toBe(401);
}));
test('DELETE /workflows/:id should fail due to invalid API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    owner.apiKey = 'abcXYZ';
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.delete(`/workflows/2`);
    expect(response.statusCode).toBe(401);
}));
test('DELETE /workflows/:id should fail due to non-existing workflow', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.delete(`/workflows/2`);
    expect(response.statusCode).toBe(404);
}));
test('DELETE /workflows/:id should delete the workflow', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: member,
        version: 1,
    });
    // create and assign workflow to owner
    const workflow = yield testDb.createWorkflow({}, member);
    const response = yield authAgent.delete(`/workflows/${workflow.id}`);
    expect(response.statusCode).toBe(200);
    const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt } = response.body;
    expect(id).toEqual(workflow.id);
    expect(name).toEqual(workflow.name);
    expect(connections).toEqual(workflow.connections);
    expect(active).toBe(false);
    expect(staticData).toEqual(workflow.staticData);
    expect(nodes).toEqual(workflow.nodes);
    expect(settings).toEqual(workflow.settings);
    expect(createdAt).toEqual(workflow.createdAt.toISOString());
    expect(updatedAt).toEqual(workflow.updatedAt.toISOString());
    // make sure the workflow actually deleted from the db
    const sharedWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        workflow,
    });
    expect(sharedWorkflow).toBeUndefined();
}));
test('DELETE /workflows/:id should delete non-owned workflow when owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    // create and assign workflow to owner
    const workflow = yield testDb.createWorkflow({}, member);
    const response = yield authAgent.delete(`/workflows/${workflow.id}`);
    expect(response.statusCode).toBe(200);
    const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt } = response.body;
    expect(id).toEqual(workflow.id);
    expect(name).toEqual(workflow.name);
    expect(connections).toEqual(workflow.connections);
    expect(active).toBe(false);
    expect(staticData).toEqual(workflow.staticData);
    expect(nodes).toEqual(workflow.nodes);
    expect(settings).toEqual(workflow.settings);
    expect(createdAt).toEqual(workflow.createdAt.toISOString());
    expect(updatedAt).toEqual(workflow.updatedAt.toISOString());
    // make sure the workflow actually deleted from the db
    const sharedWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        workflow,
    });
    expect(sharedWorkflow).toBeUndefined();
}));
test('POST /workflows/:id/activate should fail due to missing API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.post(`/workflows/2/activate`);
    expect(response.statusCode).toBe(401);
}));
test('POST /workflows/:id/activate should fail due to invalid API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    owner.apiKey = 'abcXYZ';
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.post(`/workflows/2/activate`);
    expect(response.statusCode).toBe(401);
}));
test('POST /workflows/:id/activate should fail due to non-existing workflow', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.post(`/workflows/2/activate`);
    expect(response.statusCode).toBe(404);
}));
test('POST /workflows/:id/activate should fail due to trying to activate a workflow without a trigger', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const workflow = yield testDb.createWorkflow({}, owner);
    const response = yield authOwnerAgent.post(`/workflows/${workflow.id}/activate`);
    expect(response.statusCode).toBe(400);
}));
test('POST /workflows/:id/activate should set workflow as active', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: member,
        version: 1,
    });
    const workflow = yield testDb.createWorkflowWithTrigger({}, member);
    const response = yield authAgent.post(`/workflows/${workflow.id}/activate`);
    expect(response.statusCode).toBe(200);
    const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt } = response.body;
    expect(id).toEqual(workflow.id);
    expect(name).toEqual(workflow.name);
    expect(connections).toEqual(workflow.connections);
    expect(active).toBe(true);
    expect(staticData).toEqual(workflow.staticData);
    expect(nodes).toEqual(workflow.nodes);
    expect(settings).toEqual(workflow.settings);
    expect(createdAt).toEqual(workflow.createdAt.toISOString());
    expect(updatedAt).toEqual(workflow.updatedAt.toISOString());
    // check whether the workflow is on the database
    const sharedWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        where: {
            user: member,
            workflow,
        },
        relations: ['workflow'],
    });
    expect(sharedWorkflow === null || sharedWorkflow === void 0 ? void 0 : sharedWorkflow.workflow.active).toBe(true);
    // check whether the workflow is on the active workflow runner
    expect(yield workflowRunner.isActive(workflow.id.toString())).toBe(true);
}));
test('POST /workflows/:id/activate should set non-owned workflow as active when owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const workflow = yield testDb.createWorkflowWithTrigger({}, member);
    const response = yield authAgent.post(`/workflows/${workflow.id}/activate`);
    expect(response.statusCode).toBe(200);
    const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt } = response.body;
    expect(id).toEqual(workflow.id);
    expect(name).toEqual(workflow.name);
    expect(connections).toEqual(workflow.connections);
    expect(active).toBe(true);
    expect(staticData).toEqual(workflow.staticData);
    expect(nodes).toEqual(workflow.nodes);
    expect(settings).toEqual(workflow.settings);
    expect(createdAt).toEqual(workflow.createdAt.toISOString());
    expect(updatedAt).toEqual(workflow.updatedAt.toISOString());
    // check whether the workflow is on the database
    const sharedOwnerWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        where: {
            user: owner,
            workflow,
        },
    });
    expect(sharedOwnerWorkflow).toBeUndefined();
    const sharedWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        where: {
            user: member,
            workflow,
        },
        relations: ['workflow'],
    });
    expect(sharedWorkflow === null || sharedWorkflow === void 0 ? void 0 : sharedWorkflow.workflow.active).toBe(true);
    // check whether the workflow is on the active workflow runner
    expect(yield workflowRunner.isActive(workflow.id.toString())).toBe(true);
}));
test('POST /workflows/:id/deactivate should fail due to missing API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.post(`/workflows/2/deactivate`);
    expect(response.statusCode).toBe(401);
}));
test('POST /workflows/:id/deactivate should fail due to invalid API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    owner.apiKey = 'abcXYZ';
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.post(`/workflows/2/deactivate`);
    expect(response.statusCode).toBe(401);
}));
test('POST /workflows/:id/deactivate should fail due to non-existing workflow', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.post(`/workflows/2/deactivate`);
    expect(response.statusCode).toBe(404);
}));
test('POST /workflows/:id/deactivate should deactive workflow', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: member,
        version: 1,
    });
    const workflow = yield testDb.createWorkflowWithTrigger({}, member);
    yield authAgent.post(`/workflows/${workflow.id}/activate`);
    const workflowDeactivationResponse = yield authAgent.post(`/workflows/${workflow.id}/deactivate`);
    const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt } = workflowDeactivationResponse.body;
    expect(id).toEqual(workflow.id);
    expect(name).toEqual(workflow.name);
    expect(connections).toEqual(workflow.connections);
    expect(active).toBe(false);
    expect(staticData).toEqual(workflow.staticData);
    expect(nodes).toEqual(workflow.nodes);
    expect(settings).toEqual(workflow.settings);
    expect(createdAt).toBeDefined();
    expect(updatedAt).toBeDefined();
    // get the workflow after it was deactivated
    const sharedWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        where: {
            user: member,
            workflow,
        },
        relations: ['workflow'],
    });
    // check whether the workflow is deactivated in the database
    expect(sharedWorkflow === null || sharedWorkflow === void 0 ? void 0 : sharedWorkflow.workflow.active).toBe(false);
    expect(yield workflowRunner.isActive(workflow.id.toString())).toBe(false);
}));
test('POST /workflows/:id/deactivate should deactive non-owned workflow when owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const workflow = yield testDb.createWorkflowWithTrigger({}, member);
    yield authAgent.post(`/workflows/${workflow.id}/activate`);
    const workflowDeactivationResponse = yield authAgent.post(`/workflows/${workflow.id}/deactivate`);
    const { id, connections, active, staticData, nodes, settings, name, createdAt, updatedAt } = workflowDeactivationResponse.body;
    expect(id).toEqual(workflow.id);
    expect(name).toEqual(workflow.name);
    expect(connections).toEqual(workflow.connections);
    expect(active).toBe(false);
    expect(staticData).toEqual(workflow.staticData);
    expect(nodes).toEqual(workflow.nodes);
    expect(settings).toEqual(workflow.settings);
    expect(createdAt).toBeDefined();
    expect(updatedAt).toBeDefined();
    // check whether the workflow is deactivated in the database
    const sharedOwnerWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        where: {
            user: owner,
            workflow,
        },
    });
    expect(sharedOwnerWorkflow).toBeUndefined();
    const sharedWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        where: {
            user: member,
            workflow,
        },
        relations: ['workflow'],
    });
    expect(sharedWorkflow === null || sharedWorkflow === void 0 ? void 0 : sharedWorkflow.workflow.active).toBe(false);
    expect(yield workflowRunner.isActive(workflow.id.toString())).toBe(false);
}));
test('POST /workflows should fail due to missing API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.post('/workflows');
    expect(response.statusCode).toBe(401);
}));
test('POST /workflows should fail due to invalid API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    owner.apiKey = 'abcXYZ';
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.post('/workflows');
    expect(response.statusCode).toBe(401);
}));
test('POST /workflows should fail due to invalid body', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.post('/workflows').send({});
    expect(response.statusCode).toBe(400);
}));
test('POST /workflows should create workflow', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalMemberRole, apiKey: (0, random_1.randomApiKey)() });
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: member,
        version: 1,
    });
    const payload = {
        name: 'testing',
        nodes: [
            {
                parameters: {},
                name: 'Start',
                type: 'n8n-nodes-base.start',
                typeVersion: 1,
                position: [240, 300],
            },
        ],
        connections: {},
        staticData: null,
        settings: {
            saveExecutionProgress: true,
            saveManualExecutions: true,
            saveDataErrorExecution: 'all',
            saveDataSuccessExecution: 'all',
            executionTimeout: 3600,
            timezone: 'America/New_York',
        },
    };
    const response = yield authAgent.post('/workflows').send(payload);
    expect(response.statusCode).toBe(200);
    const { id, name, nodes, connections, staticData, active, settings, createdAt, updatedAt } = response.body;
    expect(id).toBeDefined();
    expect(name).toBe(payload.name);
    expect(connections).toEqual(payload.connections);
    expect(settings).toEqual(payload.settings);
    expect(staticData).toEqual(payload.staticData);
    expect(nodes).toEqual(payload.nodes);
    expect(active).toBe(false);
    expect(createdAt).toBeDefined();
    expect(updatedAt).toEqual(createdAt);
    // check if created workflow in DB
    const sharedWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        where: {
            user: member,
            workflow: response.body,
        },
        relations: ['workflow', 'role'],
    });
    expect(sharedWorkflow === null || sharedWorkflow === void 0 ? void 0 : sharedWorkflow.workflow.name).toBe(name);
    expect(sharedWorkflow === null || sharedWorkflow === void 0 ? void 0 : sharedWorkflow.workflow.createdAt.toISOString()).toBe(createdAt);
    expect(sharedWorkflow === null || sharedWorkflow === void 0 ? void 0 : sharedWorkflow.role).toEqual(workflowOwnerRole);
}));
test('PUT /workflows/:id should fail due to missing API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.put(`/workflows/1`);
    expect(response.statusCode).toBe(401);
}));
test('PUT /workflows/:id should fail due to invalid API Key', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    owner.apiKey = 'abcXYZ';
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.put(`/workflows/1`).send({});
    expect(response.statusCode).toBe(401);
}));
test('PUT /workflows/:id should fail due to non-existing workflow', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.put(`/workflows/1`).send({
        name: 'testing',
        nodes: [
            {
                parameters: {},
                name: 'Start',
                type: 'n8n-nodes-base.start',
                typeVersion: 1,
                position: [240, 300],
            },
        ],
        connections: {},
        staticData: null,
        settings: {
            saveExecutionProgress: true,
            saveManualExecutions: true,
            saveDataErrorExecution: 'all',
            saveDataSuccessExecution: 'all',
            executionTimeout: 3600,
            timezone: 'America/New_York',
        },
    });
    expect(response.statusCode).toBe(404);
}));
test('PUT /workflows/:id should fail due to invalid body', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const authOwnerAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const response = yield authOwnerAgent.put(`/workflows/1`).send({
        nodes: [
            {
                parameters: {},
                name: 'Start',
                type: 'n8n-nodes-base.start',
                typeVersion: 1,
                position: [240, 300],
            },
        ],
        connections: {},
        staticData: null,
        settings: {
            saveExecutionProgress: true,
            saveManualExecutions: true,
            saveDataErrorExecution: 'all',
            saveDataSuccessExecution: 'all',
            executionTimeout: 3600,
            timezone: 'America/New_York',
        },
    });
    expect(response.statusCode).toBe(400);
}));
test('PUT /workflows/:id should update workflow', () => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const workflow = yield testDb.createWorkflow({}, member);
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: member,
        version: 1,
    });
    const payload = {
        name: 'name updated',
        nodes: [
            {
                parameters: {},
                name: 'Start',
                type: 'n8n-nodes-base.start',
                typeVersion: 1,
                position: [240, 300],
            },
            {
                parameters: {},
                name: 'Cron',
                type: 'n8n-nodes-base.cron',
                typeVersion: 1,
                position: [400, 300],
            },
        ],
        connections: {},
        staticData: '{"id":1}',
        settings: {
            saveExecutionProgress: false,
            saveManualExecutions: false,
            saveDataErrorExecution: 'all',
            saveDataSuccessExecution: 'all',
            executionTimeout: 3600,
            timezone: 'America/New_York',
        },
    };
    const response = yield authAgent.put(`/workflows/${workflow.id}`).send(payload);
    const { id, name, nodes, connections, staticData, active, settings, createdAt, updatedAt } = response.body;
    expect(response.statusCode).toBe(200);
    expect(id).toBe(workflow.id);
    expect(name).toBe(payload.name);
    expect(connections).toEqual(payload.connections);
    expect(settings).toEqual(payload.settings);
    expect(staticData).toMatchObject(JSON.parse(payload.staticData));
    expect(nodes).toEqual(payload.nodes);
    expect(active).toBe(false);
    expect(createdAt).toBe(workflow.createdAt.toISOString());
    expect(updatedAt).not.toBe(workflow.updatedAt.toISOString());
    // check updated workflow in DB
    const sharedWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        where: {
            user: member,
            workflow: response.body,
        },
        relations: ['workflow'],
    });
    expect(sharedWorkflow === null || sharedWorkflow === void 0 ? void 0 : sharedWorkflow.workflow.name).toBe(payload.name);
    expect(sharedWorkflow === null || sharedWorkflow === void 0 ? void 0 : sharedWorkflow.workflow.updatedAt.getTime()).toBeGreaterThan(workflow.updatedAt.getTime());
}));
test('PUT /workflows/:id should update non-owned workflow if owner', () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield testDb.createUser({ globalRole: globalOwnerRole, apiKey: (0, random_1.randomApiKey)() });
    const member = yield testDb.createUser({ globalRole: globalMemberRole });
    const workflow = yield testDb.createWorkflow({}, member);
    const authAgent = utils.createAgent(app, {
        apiPath: 'public',
        auth: true,
        user: owner,
        version: 1,
    });
    const payload = {
        name: 'name owner updated',
        nodes: [
            {
                parameters: {},
                name: 'Start',
                type: 'n8n-nodes-base.start',
                typeVersion: 1,
                position: [240, 300],
            },
            {
                parameters: {},
                name: 'Cron',
                type: 'n8n-nodes-base.cron',
                typeVersion: 1,
                position: [400, 300],
            },
        ],
        connections: {},
        staticData: '{"id":1}',
        settings: {
            saveExecutionProgress: false,
            saveManualExecutions: false,
            saveDataErrorExecution: 'all',
            saveDataSuccessExecution: 'all',
            executionTimeout: 3600,
            timezone: 'America/New_York',
        },
    };
    const response = yield authAgent.put(`/workflows/${workflow.id}`).send(payload);
    const { id, name, nodes, connections, staticData, active, settings, createdAt, updatedAt } = response.body;
    expect(response.statusCode).toBe(200);
    expect(id).toBe(workflow.id);
    expect(name).toBe(payload.name);
    expect(connections).toEqual(payload.connections);
    expect(settings).toEqual(payload.settings);
    expect(staticData).toMatchObject(JSON.parse(payload.staticData));
    expect(nodes).toEqual(payload.nodes);
    expect(active).toBe(false);
    expect(createdAt).toBe(workflow.createdAt.toISOString());
    expect(updatedAt).not.toBe(workflow.updatedAt.toISOString());
    // check updated workflow in DB
    const sharedOwnerWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        where: {
            user: owner,
            workflow: response.body,
        },
    });
    expect(sharedOwnerWorkflow).toBeUndefined();
    const sharedWorkflow = yield src_1.Db.collections.SharedWorkflow.findOne({
        where: {
            user: member,
            workflow: response.body,
        },
        relations: ['workflow', 'role'],
    });
    expect(sharedWorkflow === null || sharedWorkflow === void 0 ? void 0 : sharedWorkflow.workflow.name).toBe(payload.name);
    expect(sharedWorkflow === null || sharedWorkflow === void 0 ? void 0 : sharedWorkflow.workflow.updatedAt.getTime()).toBeGreaterThan(workflow.updatedAt.getTime());
    expect(sharedWorkflow === null || sharedWorkflow === void 0 ? void 0 : sharedWorkflow.role).toEqual(workflowOwnerRole);
}));

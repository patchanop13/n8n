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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTagNames = exports.getStartNode = exports.hasStartNode = exports.updateWorkflow = exports.getWorkflowsCount = exports.getWorkflows = exports.deleteWorkflow = exports.setWorkflowAsInactive = exports.setWorkflowAsActive = exports.createWorkflow = exports.getWorkflowIdsViaTags = exports.getWorkflowById = exports.getSharedWorkflows = exports.getSharedWorkflow = exports.getSharedWorkflowIds = void 0;
const typeorm_1 = require("typeorm");
const lodash_1 = require("lodash");
const __1 = require("../../../..");
const WorkflowEntity_1 = require("../../../../databases/entities/WorkflowEntity");
const SharedWorkflow_1 = require("../../../../databases/entities/SharedWorkflow");
const users_service_1 = require("../users/users.service");
const config_1 = __importDefault(require("../../../../../config"));
function insertIf(condition, elements) {
    return condition ? elements : [];
}
function getSharedWorkflowIds(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const sharedWorkflows = yield __1.Db.collections.SharedWorkflow.find({
            where: { user },
        });
        return sharedWorkflows.map((workflow) => workflow.workflowId);
    });
}
exports.getSharedWorkflowIds = getSharedWorkflowIds;
function getSharedWorkflow(user, workflowId) {
    return __awaiter(this, void 0, void 0, function* () {
        return __1.Db.collections.SharedWorkflow.findOne({
            where: Object.assign(Object.assign({}, (!(0, users_service_1.isInstanceOwner)(user) && { user })), (workflowId && { workflow: { id: workflowId } })),
            relations: [...insertIf(!config_1.default.getEnv('workflowTagsDisabled'), ['workflow.tags']), 'workflow'],
        });
    });
}
exports.getSharedWorkflow = getSharedWorkflow;
function getSharedWorkflows(user, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return __1.Db.collections.SharedWorkflow.find(Object.assign({ where: Object.assign(Object.assign({}, (!(0, users_service_1.isInstanceOwner)(user) && { user })), (options.workflowIds && { workflow: { id: (0, typeorm_1.In)(options.workflowIds) } })) }, (options.relations && { relations: options.relations })));
    });
}
exports.getSharedWorkflows = getSharedWorkflows;
function getWorkflowById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return __1.Db.collections.Workflow.findOne({
            where: { id },
        });
    });
}
exports.getWorkflowById = getWorkflowById;
/**
 * Returns the workflow IDs that have certain tags.
 * Intersection! e.g. workflow needs to have all provided tags.
 */
function getWorkflowIdsViaTags(tags) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbTags = yield __1.Db.collections.Tag.find({
            where: { name: (0, typeorm_1.In)(tags) },
            relations: ['workflows'],
        });
        const workflowIdsPerTag = dbTags.map((tag) => tag.workflows.map((workflow) => workflow.id));
        return (0, lodash_1.intersection)(...workflowIdsPerTag);
    });
}
exports.getWorkflowIdsViaTags = getWorkflowIdsViaTags;
function createWorkflow(workflow, user, role) {
    return __awaiter(this, void 0, void 0, function* () {
        return __1.Db.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
            const newWorkflow = new WorkflowEntity_1.WorkflowEntity();
            Object.assign(newWorkflow, workflow);
            const savedWorkflow = yield transactionManager.save(newWorkflow);
            const newSharedWorkflow = new SharedWorkflow_1.SharedWorkflow();
            Object.assign(newSharedWorkflow, {
                role,
                user,
                workflow: savedWorkflow,
            });
            yield transactionManager.save(newSharedWorkflow);
            return savedWorkflow;
        }));
    });
}
exports.createWorkflow = createWorkflow;
function setWorkflowAsActive(workflow) {
    return __awaiter(this, void 0, void 0, function* () {
        return __1.Db.collections.Workflow.update(workflow.id, { active: true, updatedAt: new Date() });
    });
}
exports.setWorkflowAsActive = setWorkflowAsActive;
function setWorkflowAsInactive(workflow) {
    return __awaiter(this, void 0, void 0, function* () {
        return __1.Db.collections.Workflow.update(workflow.id, { active: false, updatedAt: new Date() });
    });
}
exports.setWorkflowAsInactive = setWorkflowAsInactive;
function deleteWorkflow(workflow) {
    return __awaiter(this, void 0, void 0, function* () {
        return __1.Db.collections.Workflow.remove(workflow);
    });
}
exports.deleteWorkflow = deleteWorkflow;
function getWorkflows(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return __1.Db.collections.Workflow.find(options);
    });
}
exports.getWorkflows = getWorkflows;
function getWorkflowsCount(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return __1.Db.collections.Workflow.count(options);
    });
}
exports.getWorkflowsCount = getWorkflowsCount;
function updateWorkflow(workflowId, updateData) {
    return __awaiter(this, void 0, void 0, function* () {
        return __1.Db.collections.Workflow.update(workflowId, updateData);
    });
}
exports.updateWorkflow = updateWorkflow;
function hasStartNode(workflow) {
    if (!workflow.nodes.length)
        return false;
    const found = workflow.nodes.find((node) => node.type === 'n8n-nodes-base.start');
    return Boolean(found);
}
exports.hasStartNode = hasStartNode;
function getStartNode() {
    return {
        parameters: {},
        name: 'Start',
        type: 'n8n-nodes-base.start',
        typeVersion: 1,
        position: [240, 300],
    };
}
exports.getStartNode = getStartNode;
function parseTagNames(tags) {
    return tags.split(',').map((tag) => tag.trim());
}
exports.parseTagNames = parseTagNames;

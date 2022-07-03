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
const typeorm_1 = require("typeorm");
const __1 = require("../../../..");
const config = require("../../../../../config");
const WorkflowEntity_1 = require("../../../../databases/entities/WorkflowEntity");
const InternalHooksManager_1 = require("../../../../InternalHooksManager");
const Server_1 = require("../../../../Server");
const WorkflowHelpers_1 = require("../../../../WorkflowHelpers");
const global_middleware_1 = require("../../shared/middlewares/global.middleware");
const pagination_service_1 = require("../../shared/services/pagination.service");
const users_service_1 = require("../users/users.service");
const workflows_service_1 = require("./workflows.service");
module.exports = {
    createWorkflow: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const workflow = req.body;
            workflow.active = false;
            if (!(0, workflows_service_1.hasStartNode)(workflow)) {
                workflow.nodes.push((0, workflows_service_1.getStartNode)());
            }
            yield (0, WorkflowHelpers_1.replaceInvalidCredentials)(workflow);
            const role = yield (0, users_service_1.getWorkflowOwnerRole)();
            const createdWorkflow = yield (0, workflows_service_1.createWorkflow)(workflow, req.user, role);
            yield Server_1.externalHooks.run('workflow.afterCreate', [createdWorkflow]);
            void InternalHooksManager_1.InternalHooksManager.getInstance().onWorkflowCreated(req.user.id, createdWorkflow, true);
            return res.json(createdWorkflow);
        }),
    ],
    deleteWorkflow: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.params;
            const sharedWorkflow = yield (0, workflows_service_1.getSharedWorkflow)(req.user, id.toString());
            if (!sharedWorkflow) {
                // user trying to access a workflow he does not own
                // or workflow does not exist
                return res.status(404).json({ message: 'Not Found' });
            }
            if (sharedWorkflow.workflow.active) {
                // deactivate before deleting
                yield __1.ActiveWorkflowRunner.getInstance().remove(id.toString());
            }
            yield __1.Db.collections.Workflow.delete(id);
            void InternalHooksManager_1.InternalHooksManager.getInstance().onWorkflowDeleted(req.user.id, id.toString(), true);
            yield Server_1.externalHooks.run('workflow.afterDelete', [id.toString()]);
            return res.json(sharedWorkflow.workflow);
        }),
    ],
    getWorkflow: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.params;
            const sharedWorkflow = yield (0, workflows_service_1.getSharedWorkflow)(req.user, id.toString());
            if (!sharedWorkflow) {
                // user trying to access a workflow he does not own
                // or workflow does not exist
                return res.status(404).json({ message: 'Not Found' });
            }
            void InternalHooksManager_1.InternalHooksManager.getInstance().onUserRetrievedWorkflow({
                user_id: req.user.id,
                public_api: true,
            });
            return res.json(sharedWorkflow.workflow);
        }),
    ],
    getWorkflows: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        global_middleware_1.validCursor,
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { offset = 0, limit = 100, active = undefined, tags = undefined } = req.query;
            let workflows;
            let count;
            const query = Object.assign({ skip: offset, take: limit, where: Object.assign({}, (active !== undefined && { active })) }, (!config.getEnv('workflowTagsDisabled') && { relations: ['tags'] }));
            if ((0, users_service_1.isInstanceOwner)(req.user)) {
                if (tags) {
                    const workflowIds = yield (0, workflows_service_1.getWorkflowIdsViaTags)((0, workflows_service_1.parseTagNames)(tags));
                    Object.assign(query.where, { id: (0, typeorm_1.In)(workflowIds) });
                }
                workflows = yield (0, workflows_service_1.getWorkflows)(query);
                count = yield (0, workflows_service_1.getWorkflowsCount)(query);
            }
            else {
                const options = {};
                if (tags) {
                    options.workflowIds = yield (0, workflows_service_1.getWorkflowIdsViaTags)((0, workflows_service_1.parseTagNames)(tags));
                }
                const sharedWorkflows = yield (0, workflows_service_1.getSharedWorkflows)(req.user, options);
                if (!sharedWorkflows.length) {
                    return res.status(200).json({
                        data: [],
                        nextCursor: null,
                    });
                }
                const workflowsIds = sharedWorkflows.map((shareWorkflow) => shareWorkflow.workflowId);
                Object.assign(query.where, { id: (0, typeorm_1.In)(workflowsIds) });
                workflows = yield (0, workflows_service_1.getWorkflows)(query);
                count = yield (0, workflows_service_1.getWorkflowsCount)(query);
            }
            void InternalHooksManager_1.InternalHooksManager.getInstance().onUserRetrievedAllWorkflows({
                user_id: req.user.id,
                public_api: true,
            });
            return res.json({
                data: workflows,
                nextCursor: (0, pagination_service_1.encodeNextCursor)({
                    offset,
                    limit,
                    numberOfTotalRecords: count,
                }),
            });
        }),
    ],
    updateWorkflow: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.params;
            const updateData = new WorkflowEntity_1.WorkflowEntity();
            Object.assign(updateData, req.body);
            const sharedWorkflow = yield (0, workflows_service_1.getSharedWorkflow)(req.user, id.toString());
            if (!sharedWorkflow) {
                // user trying to access a workflow he does not own
                // or workflow does not exist
                return res.status(404).json({ message: 'Not Found' });
            }
            if (!(0, workflows_service_1.hasStartNode)(updateData)) {
                updateData.nodes.push((0, workflows_service_1.getStartNode)());
            }
            yield (0, WorkflowHelpers_1.replaceInvalidCredentials)(updateData);
            const workflowRunner = __1.ActiveWorkflowRunner.getInstance();
            if (sharedWorkflow.workflow.active) {
                // When workflow gets saved always remove it as the triggers could have been
                // changed and so the changes would not take effect
                yield workflowRunner.remove(id.toString());
            }
            yield (0, workflows_service_1.updateWorkflow)(sharedWorkflow.workflowId, updateData);
            if (sharedWorkflow.workflow.active) {
                try {
                    yield workflowRunner.add(sharedWorkflow.workflowId.toString(), 'update');
                }
                catch (error) {
                    if (error instanceof Error) {
                        return res.status(400).json({ message: error.message });
                    }
                }
            }
            const updatedWorkflow = yield (0, workflows_service_1.getWorkflowById)(sharedWorkflow.workflowId);
            yield Server_1.externalHooks.run('workflow.afterUpdate', [updateData]);
            void InternalHooksManager_1.InternalHooksManager.getInstance().onWorkflowSaved(req.user.id, updateData, true);
            return res.json(updatedWorkflow);
        }),
    ],
    activateWorkflow: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.params;
            const sharedWorkflow = yield (0, workflows_service_1.getSharedWorkflow)(req.user, id.toString());
            if (!sharedWorkflow) {
                // user trying to access a workflow he does not own
                // or workflow does not exist
                return res.status(404).json({ message: 'Not Found' });
            }
            if (!sharedWorkflow.workflow.active) {
                try {
                    yield __1.ActiveWorkflowRunner.getInstance().add(sharedWorkflow.workflowId.toString(), 'activate');
                }
                catch (error) {
                    if (error instanceof Error) {
                        return res.status(400).json({ message: error.message });
                    }
                }
                // change the status to active in the DB
                yield (0, workflows_service_1.setWorkflowAsActive)(sharedWorkflow.workflow);
                sharedWorkflow.workflow.active = true;
                return res.json(sharedWorkflow.workflow);
            }
            // nothing to do as the wokflow is already active
            return res.json(sharedWorkflow.workflow);
        }),
    ],
    deactivateWorkflow: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.params;
            const sharedWorkflow = yield (0, workflows_service_1.getSharedWorkflow)(req.user, id.toString());
            if (!sharedWorkflow) {
                // user trying to access a workflow he does not own
                // or workflow does not exist
                return res.status(404).json({ message: 'Not Found' });
            }
            const workflowRunner = __1.ActiveWorkflowRunner.getInstance();
            if (sharedWorkflow.workflow.active) {
                yield workflowRunner.remove(sharedWorkflow.workflowId.toString());
                yield (0, workflows_service_1.setWorkflowAsInactive)(sharedWorkflow.workflow);
                sharedWorkflow.workflow.active = false;
                return res.json(sharedWorkflow.workflow);
            }
            // nothing to do as the wokflow is already inactive
            return res.json(sharedWorkflow.workflow);
        }),
    ],
};

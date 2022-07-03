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
const n8n_core_1 = require("n8n-core");
const executions_service_1 = require("./executions.service");
const __1 = require("../../../..");
const global_middleware_1 = require("../../shared/middlewares/global.middleware");
const workflows_service_1 = require("../workflows/workflows.service");
const pagination_service_1 = require("../../shared/services/pagination.service");
const InternalHooksManager_1 = require("../../../../InternalHooksManager");
module.exports = {
    deleteExecution: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const sharedWorkflowsIds = yield (0, workflows_service_1.getSharedWorkflowIds)(req.user);
            // user does not have workflows hence no executions
            // or the execution he is trying to access belongs to a workflow he does not own
            if (!sharedWorkflowsIds.length) {
                return res.status(404).json({ message: 'Not Found' });
            }
            const { id } = req.params;
            // look for the execution on the workflow the user owns
            const execution = yield (0, executions_service_1.getExecutionInWorkflows)(id, sharedWorkflowsIds, false);
            if (!execution) {
                return res.status(404).json({ message: 'Not Found' });
            }
            yield n8n_core_1.BinaryDataManager.getInstance().deleteBinaryDataByExecutionId(execution.id.toString());
            yield (0, executions_service_1.deleteExecution)(execution);
            execution.id = id;
            return res.json(execution);
        }),
    ],
    getExecution: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const sharedWorkflowsIds = yield (0, workflows_service_1.getSharedWorkflowIds)(req.user);
            // user does not have workflows hence no executions
            // or the execution he is trying to access belongs to a workflow he does not own
            if (!sharedWorkflowsIds.length) {
                return res.status(404).json({ message: 'Not Found' });
            }
            const { id } = req.params;
            const { includeData = false } = req.query;
            // look for the execution on the workflow the user owns
            const execution = yield (0, executions_service_1.getExecutionInWorkflows)(id, sharedWorkflowsIds, includeData);
            if (!execution) {
                return res.status(404).json({ message: 'Not Found' });
            }
            void InternalHooksManager_1.InternalHooksManager.getInstance().onUserRetrievedExecution({
                user_id: req.user.id,
                public_api: true,
            });
            return res.json(execution);
        }),
    ],
    getExecutions: [
        (0, global_middleware_1.authorize)(['owner', 'member']),
        global_middleware_1.validCursor,
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { lastId = undefined, limit = 100, status = undefined, includeData = false, workflowId = undefined, } = req.query;
            const sharedWorkflowsIds = yield (0, workflows_service_1.getSharedWorkflowIds)(req.user);
            // user does not have workflows hence no executions
            // or the execution he is trying to access belongs to a workflow he does not own
            if (!sharedWorkflowsIds.length) {
                return res.status(200).json({ data: [], nextCursor: null });
            }
            // get running workflows so we exclude them from the result
            const runningExecutionsIds = __1.ActiveExecutions.getInstance()
                .getActiveExecutions()
                .map(({ id }) => Number(id));
            const filters = Object.assign(Object.assign({ status,
                limit,
                lastId,
                includeData }, (workflowId && { workflowIds: [workflowId] })), { excludedExecutionsIds: runningExecutionsIds });
            const executions = yield (0, executions_service_1.getExecutions)(filters);
            const newLastId = !executions.length ? 0 : executions.slice(-1)[0].id;
            filters.lastId = newLastId;
            const count = yield (0, executions_service_1.getExecutionsCount)(filters);
            void InternalHooksManager_1.InternalHooksManager.getInstance().onUserRetrievedAllExecutions({
                user_id: req.user.id,
                public_api: true,
            });
            return res.json({
                data: executions,
                nextCursor: (0, pagination_service_1.encodeNextCursor)({
                    lastId: newLastId,
                    limit,
                    numberOfNextRecords: count,
                }),
            });
        }),
    ],
};

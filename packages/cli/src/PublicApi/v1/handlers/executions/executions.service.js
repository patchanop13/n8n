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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExecution = exports.getExecutionInWorkflows = exports.getExecutionsCount = exports.getExecutions = void 0;
const flatted_1 = require("flatted");
const typeorm_1 = require("typeorm");
const __1 = require("../../../..");
function prepareExecutionData(execution) {
    if (!execution)
        return undefined;
    // @ts-ignore
    if (!execution.data)
        return execution;
    return Object.assign(Object.assign({}, execution), { data: (0, flatted_1.parse)(execution.data) });
}
function getStatusCondition(status) {
    const condition = {};
    if (status === 'success') {
        condition.finished = true;
    }
    else if (status === 'waiting') {
        condition.waitTill = (0, typeorm_1.Not)((0, typeorm_1.IsNull)());
    }
    else if (status === 'error') {
        condition.stoppedAt = (0, typeorm_1.Not)((0, typeorm_1.IsNull)());
        condition.finished = false;
    }
    return condition;
}
function getExecutionSelectableProperties(includeData) {
    const selectFields = [
        'id',
        'mode',
        'retryOf',
        'retrySuccessId',
        'startedAt',
        'stoppedAt',
        'workflowId',
        'waitTill',
        'finished',
    ];
    if (includeData)
        selectFields.push('data');
    return selectFields;
}
function getExecutions(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const executions = yield __1.Db.collections.Execution.find({
            select: getExecutionSelectableProperties(data.includeData),
            where: Object.assign(Object.assign(Object.assign(Object.assign({}, (data.lastId && { id: (0, typeorm_1.LessThan)(data.lastId) })), (data.status && Object.assign({}, getStatusCondition(data.status)))), (data.workflowIds && { workflowId: (0, typeorm_1.In)(data.workflowIds.map(String)) })), (data.excludedExecutionsIds && { id: (0, typeorm_1.Not)((0, typeorm_1.In)(data.excludedExecutionsIds)) })),
            order: { id: 'DESC' },
            take: data.limit,
        });
        return executions.map((execution) => prepareExecutionData(execution));
    });
}
exports.getExecutions = getExecutions;
function getExecutionsCount(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const executions = yield __1.Db.collections.Execution.count({
            where: Object.assign(Object.assign(Object.assign(Object.assign({}, (data.lastId && { id: (0, typeorm_1.LessThan)(data.lastId) })), (data.status && Object.assign({}, getStatusCondition(data.status)))), (data.workflowIds && { workflowId: (0, typeorm_1.In)(data.workflowIds) })), (data.excludedWorkflowIds && { workflowId: (0, typeorm_1.Not)((0, typeorm_1.In)(data.excludedWorkflowIds)) })),
            take: data.limit,
        });
        return executions;
    });
}
exports.getExecutionsCount = getExecutionsCount;
function getExecutionInWorkflows(id, workflows, includeData) {
    return __awaiter(this, void 0, void 0, function* () {
        const execution = yield __1.Db.collections.Execution.findOne({
            select: getExecutionSelectableProperties(includeData),
            where: {
                id,
                workflowId: (0, typeorm_1.In)(workflows),
            },
        });
        return prepareExecutionData(execution);
    });
}
exports.getExecutionInWorkflows = getExecutionInWorkflows;
function deleteExecution(execution) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        return __1.Db.collections.Execution.remove(execution);
    });
}
exports.deleteExecution = deleteExecution;

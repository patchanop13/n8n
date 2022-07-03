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
exports.WaitTracker = exports.WaitTrackerClass = void 0;
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const n8n_workflow_1 = require("n8n-workflow");
const typeorm_1 = require("typeorm");
const DateUtils_1 = require("typeorm/util/DateUtils");
const _1 = require(".");
const UserManagementHelper_1 = require("./UserManagement/UserManagementHelper");
class WaitTrackerClass {
    constructor() {
        this.waitingExecutions = {};
        this.activeExecutionsInstance = _1.ActiveExecutions.getInstance();
        // Poll every 60 seconds a list of upcoming executions
        this.mainTimer = setInterval(() => {
            this.getwaitingExecutions();
        }, 60000);
        this.getwaitingExecutions();
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    getwaitingExecutions() {
        return __awaiter(this, void 0, void 0, function* () {
            n8n_workflow_1.LoggerProxy.debug('Wait tracker querying database for waiting executions');
            // Find all the executions which should be triggered in the next 70 seconds
            const findQuery = {
                select: ['id', 'waitTill'],
                where: {
                    waitTill: (0, typeorm_1.LessThanOrEqual)(new Date(Date.now() + 70000)),
                },
                order: {
                    waitTill: 'ASC',
                },
            };
            const dbType = (yield _1.GenericHelpers.getConfigValue('database.type'));
            if (dbType === 'sqlite') {
                // This is needed because of issue in TypeORM <> SQLite:
                // https://github.com/typeorm/typeorm/issues/2286
                findQuery.where.waitTill = (0, typeorm_1.LessThanOrEqual)(DateUtils_1.DateUtils.mixedDateToUtcDatetimeString(new Date(Date.now() + 70000)));
            }
            const executions = yield _1.Db.collections.Execution.find(findQuery);
            if (executions.length === 0) {
                return;
            }
            const executionIds = executions.map((execution) => execution.id.toString()).join(', ');
            n8n_workflow_1.LoggerProxy.debug(`Wait tracker found ${executions.length} executions. Setting timer for IDs: ${executionIds}`);
            // Add timers for each waiting execution that they get started at the correct time
            // eslint-disable-next-line no-restricted-syntax
            for (const execution of executions) {
                const executionId = execution.id.toString();
                if (this.waitingExecutions[executionId] === undefined) {
                    const triggerTime = execution.waitTill.getTime() - new Date().getTime();
                    this.waitingExecutions[executionId] = {
                        executionId,
                        timer: setTimeout(() => {
                            this.startExecution(executionId);
                        }, triggerTime),
                    };
                }
            }
        });
    }
    stopExecution(executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.waitingExecutions[executionId] !== undefined) {
                // The waiting execution was already sheduled to execute.
                // So stop timer and remove.
                clearTimeout(this.waitingExecutions[executionId].timer);
                delete this.waitingExecutions[executionId];
            }
            // Also check in database
            const execution = yield _1.Db.collections.Execution.findOne(executionId);
            if (execution === undefined || !execution.waitTill) {
                throw new Error(`The execution ID "${executionId}" could not be found.`);
            }
            const fullExecutionData = _1.ResponseHelper.unflattenExecutionData(execution);
            // Set in execution in DB as failed and remove waitTill time
            const error = new n8n_workflow_1.WorkflowOperationError('Workflow-Execution has been canceled!');
            fullExecutionData.data.resultData.error = Object.assign(Object.assign({}, error), { message: error.message, stack: error.stack });
            fullExecutionData.stoppedAt = new Date();
            fullExecutionData.waitTill = undefined;
            yield _1.Db.collections.Execution.update(executionId, _1.ResponseHelper.flattenExecutionData(fullExecutionData));
            return {
                mode: fullExecutionData.mode,
                startedAt: new Date(fullExecutionData.startedAt),
                stoppedAt: fullExecutionData.stoppedAt ? new Date(fullExecutionData.stoppedAt) : undefined,
                finished: fullExecutionData.finished,
            };
        });
    }
    startExecution(executionId) {
        n8n_workflow_1.LoggerProxy.debug(`Wait tracker resuming execution ${executionId}`, { executionId });
        delete this.waitingExecutions[executionId];
        (() => __awaiter(this, void 0, void 0, function* () {
            // Get the data to execute
            const fullExecutionDataFlatted = yield _1.Db.collections.Execution.findOne(executionId);
            if (fullExecutionDataFlatted === undefined) {
                throw new Error(`The execution with the id "${executionId}" does not exist.`);
            }
            const fullExecutionData = _1.ResponseHelper.unflattenExecutionData(fullExecutionDataFlatted);
            if (fullExecutionData.finished) {
                throw new Error('The execution did succeed and can so not be started again.');
            }
            if (!fullExecutionData.workflowData.id) {
                throw new Error('Only saved workflows can be resumed.');
            }
            const user = yield (0, UserManagementHelper_1.getWorkflowOwner)(fullExecutionData.workflowData.id.toString());
            const data = {
                executionMode: fullExecutionData.mode,
                executionData: fullExecutionData.data,
                workflowData: fullExecutionData.workflowData,
                userId: user.id,
            };
            // Start the execution again
            const workflowRunner = new _1.WorkflowRunner();
            yield workflowRunner.run(data, false, false, executionId);
        }))().catch((error) => {
            n8n_workflow_1.LoggerProxy.error(`There was a problem starting the waiting execution with id "${executionId}": "${error.message}"`, { executionId });
        });
    }
}
exports.WaitTrackerClass = WaitTrackerClass;
let waitTrackerInstance;
function WaitTracker() {
    if (waitTrackerInstance === undefined) {
        waitTrackerInstance = new WaitTrackerClass();
    }
    return waitTrackerInstance;
}
exports.WaitTracker = WaitTracker;

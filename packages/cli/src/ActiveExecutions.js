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
exports.getInstance = exports.ActiveExecutions = void 0;
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const n8n_workflow_1 = require("n8n-workflow");
const flatted_1 = require("flatted");
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
class ActiveExecutions {
    constructor() {
        this.activeExecutions = {};
    }
    /**
     * Add a new active execution
     *
     * @param {ChildProcess} process
     * @param {IWorkflowExecutionDataProcess} executionData
     * @returns {string}
     * @memberof ActiveExecutions
     */
    add(executionData, process, executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (executionId === undefined) {
                // Is a new execution so save in DB
                const fullExecutionData = {
                    data: executionData.executionData,
                    mode: executionData.executionMode,
                    finished: false,
                    startedAt: new Date(),
                    workflowData: executionData.workflowData,
                };
                if (executionData.retryOf !== undefined) {
                    fullExecutionData.retryOf = executionData.retryOf.toString();
                }
                if (executionData.workflowData.id !== undefined &&
                    _1.WorkflowHelpers.isWorkflowIdValid(executionData.workflowData.id.toString())) {
                    fullExecutionData.workflowId = executionData.workflowData.id.toString();
                }
                const execution = _1.ResponseHelper.flattenExecutionData(fullExecutionData);
                const executionResult = yield _1.Db.collections.Execution.save(execution);
                executionId =
                    typeof executionResult.id === 'object'
                        ? // @ts-ignore
                            executionResult.id.toString()
                        : executionResult.id + '';
            }
            else {
                // Is an existing execution we want to finish so update in DB
                const execution = {
                    id: executionId,
                    data: (0, flatted_1.stringify)(executionData.executionData),
                    waitTill: null,
                };
                yield _1.Db.collections.Execution.update(executionId, execution);
            }
            // @ts-ignore
            this.activeExecutions[executionId] = {
                executionData,
                process,
                startedAt: new Date(),
                postExecutePromises: [],
            };
            // @ts-ignore
            return executionId;
        });
    }
    /**
     * Attaches an execution
     *
     * @param {string} executionId
     * @param {PCancelable<IRun>} workflowExecution
     * @memberof ActiveExecutions
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    attachWorkflowExecution(executionId, workflowExecution) {
        if (this.activeExecutions[executionId] === undefined) {
            throw new Error(`No active execution with id "${executionId}" got found to attach to workflowExecution to!`);
        }
        this.activeExecutions[executionId].workflowExecution = workflowExecution;
    }
    attachResponsePromise(executionId, responsePromise) {
        if (this.activeExecutions[executionId] === undefined) {
            throw new Error(`No active execution with id "${executionId}" got found to attach to workflowExecution to!`);
        }
        this.activeExecutions[executionId].responsePromise = responsePromise;
    }
    resolveResponsePromise(executionId, response) {
        var _a;
        if (this.activeExecutions[executionId] === undefined) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (_a = this.activeExecutions[executionId].responsePromise) === null || _a === void 0 ? void 0 : _a.resolve(response);
    }
    /**
     * Remove an active execution
     *
     * @param {string} executionId
     * @param {IRun} fullRunData
     * @returns {void}
     * @memberof ActiveExecutions
     */
    remove(executionId, fullRunData) {
        if (this.activeExecutions[executionId] === undefined) {
            return;
        }
        // Resolve all the waiting promises
        // eslint-disable-next-line no-restricted-syntax
        for (const promise of this.activeExecutions[executionId].postExecutePromises) {
            promise.resolve(fullRunData);
        }
        // Remove from the list of active executions
        delete this.activeExecutions[executionId];
    }
    /**
     * Forces an execution to stop
     *
     * @param {string} executionId The id of the execution to stop
     * @param {string} timeout String 'timeout' given if stop due to timeout
     * @returns {(Promise<IRun | undefined>)}
     * @memberof ActiveExecutions
     */
    stopExecution(executionId, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.activeExecutions[executionId] === undefined) {
                // There is no execution running with that id
                return;
            }
            // In case something goes wrong make sure that promise gets first
            // returned that it gets then also resolved correctly.
            if (this.activeExecutions[executionId].process !== undefined) {
                // Workflow is running in subprocess
                if (this.activeExecutions[executionId].process.connected) {
                    setTimeout(() => {
                        // execute on next event loop tick;
                        this.activeExecutions[executionId].process.send({
                            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                            type: timeout || 'stopExecution',
                        });
                    }, 1);
                }
            }
            else {
                // Workflow is running in current process
                this.activeExecutions[executionId].workflowExecution.cancel();
            }
            // eslint-disable-next-line consistent-return
            return this.getPostExecutePromise(executionId);
        });
    }
    /**
     * Returns a promise which will resolve with the data of the execution
     * with the given id
     *
     * @param {string} executionId The id of the execution to wait for
     * @returns {Promise<IRun>}
     * @memberof ActiveExecutions
     */
    getPostExecutePromise(executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the promise which will be resolved when the execution finished
            const waitPromise = yield (0, n8n_workflow_1.createDeferredPromise)();
            if (this.activeExecutions[executionId] === undefined) {
                throw new Error(`There is no active execution with id "${executionId}".`);
            }
            this.activeExecutions[executionId].postExecutePromises.push(waitPromise);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
            return waitPromise.promise();
        });
    }
    /**
     * Returns all the currently active executions
     *
     * @returns {IExecutionsCurrentSummary[]}
     * @memberof ActiveExecutions
     */
    getActiveExecutions() {
        const returnData = [];
        let data;
        // eslint-disable-next-line no-restricted-syntax
        for (const id of Object.keys(this.activeExecutions)) {
            data = this.activeExecutions[id];
            returnData.push({
                id,
                retryOf: data.executionData.retryOf,
                startedAt: data.startedAt,
                mode: data.executionData.executionMode,
                workflowId: data.executionData.workflowData.id,
            });
        }
        return returnData;
    }
}
exports.ActiveExecutions = ActiveExecutions;
let activeExecutionsInstance;
function getInstance() {
    if (activeExecutionsInstance === undefined) {
        activeExecutionsInstance = new ActiveExecutions();
    }
    return activeExecutionsInstance;
}
exports.getInstance = getInstance;

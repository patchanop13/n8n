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
exports.getWorkflowHooksMain = exports.getWorkflowHooksWorkerMain = exports.getWorkflowHooksWorkerExecuter = exports.getWorkflowHooksIntegrated = exports.getBase = exports.sendMessageToUI = exports.executeWorkflow = exports.getWorkflowData = exports.getRunData = exports.hookFunctionsPreExecute = exports.executeErrorWorkflow = void 0;
/* eslint-disable import/no-cycle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable id-denylist */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const typeorm_1 = require("typeorm");
const DateUtils_1 = require("typeorm/util/DateUtils");
const config_1 = __importDefault(require("../config"));
const _1 = require(".");
const UserManagementHelper_1 = require("./UserManagement/UserManagementHelper");
const WorkflowHelpers_1 = require("./WorkflowHelpers");
const ERROR_TRIGGER_TYPE = config_1.default.getEnv('nodes.errorTriggerType');
/**
 * Checks if there was an error and if errorWorkflow or a trigger is defined. If so it collects
 * all the data and executes it
 *
 * @param {IWorkflowBase} workflowData The workflow which got executed
 * @param {IRun} fullRunData The run which produced the error
 * @param {WorkflowExecuteMode} mode The mode in which the workflow got started in
 * @param {string} [executionId] The id the execution got saved as
 */
function executeErrorWorkflow(workflowData, fullRunData, mode, executionId, retryOf) {
    // Check if there was an error and if so if an errorWorkflow or a trigger is set
    let pastExecutionUrl;
    if (executionId !== undefined) {
        pastExecutionUrl = `${_1.WebhookHelpers.getWebhookBaseUrl()}execution/${executionId}`;
    }
    if (fullRunData.data.resultData.error !== undefined) {
        let workflowErrorData;
        if (executionId) {
            // The error did happen in an execution
            workflowErrorData = {
                execution: {
                    id: executionId,
                    url: pastExecutionUrl,
                    error: fullRunData.data.resultData.error,
                    lastNodeExecuted: fullRunData.data.resultData.lastNodeExecuted,
                    mode,
                    retryOf,
                },
                workflow: {
                    id: workflowData.id !== undefined ? workflowData.id.toString() : undefined,
                    name: workflowData.name,
                },
            };
        }
        else {
            // The error did happen in a trigger
            workflowErrorData = {
                trigger: {
                    error: fullRunData.data.resultData.error,
                    mode,
                },
                workflow: {
                    id: workflowData.id !== undefined ? workflowData.id.toString() : undefined,
                    name: workflowData.name,
                },
            };
        }
        // Run the error workflow
        // To avoid an infinite loop do not run the error workflow again if the error-workflow itself failed and it is its own error-workflow.
        if (
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        workflowData.settings !== undefined &&
            workflowData.settings.errorWorkflow &&
            !(mode === 'error' &&
                workflowData.id &&
                workflowData.settings.errorWorkflow.toString() === workflowData.id.toString())) {
            n8n_workflow_1.LoggerProxy.verbose(`Start external error workflow`, {
                executionId,
                errorWorkflowId: workflowData.settings.errorWorkflow.toString(),
                workflowId: workflowData.id,
            });
            // If a specific error workflow is set run only that one
            // First, do permission checks.
            if (!workflowData.id) {
                // Manual executions do not trigger error workflows
                // So this if should never happen. It was added to
                // make sure there are no possible security gaps
                return;
            }
            (0, UserManagementHelper_1.getWorkflowOwner)(workflowData.id)
                .then((user) => {
                void _1.WorkflowHelpers.executeErrorWorkflow(workflowData.settings.errorWorkflow, workflowErrorData, user);
            })
                .catch((error) => {
                n8n_workflow_1.LoggerProxy.error(`Could not execute ErrorWorkflow for execution ID ${this.executionId} because of error querying the workflow owner`, {
                    executionId,
                    errorWorkflowId: workflowData.settings.errorWorkflow.toString(),
                    workflowId: workflowData.id,
                    error,
                    workflowErrorData,
                });
            });
        }
        else if (mode !== 'error' &&
            workflowData.id !== undefined &&
            workflowData.nodes.some((node) => node.type === ERROR_TRIGGER_TYPE)) {
            n8n_workflow_1.LoggerProxy.verbose(`Start internal error workflow`, { executionId, workflowId: workflowData.id });
            void (0, UserManagementHelper_1.getWorkflowOwner)(workflowData.id).then((user) => {
                void _1.WorkflowHelpers.executeErrorWorkflow(workflowData.id.toString(), workflowErrorData, user);
            });
        }
    }
}
exports.executeErrorWorkflow = executeErrorWorkflow;
/**
 * Prunes Saved Execution which are older than configured.
 * Throttled to be executed just once in configured timeframe.
 *
 */
let throttling = false;
function pruneExecutionData() {
    if (!throttling) {
        n8n_workflow_1.LoggerProxy.verbose('Pruning execution data from database');
        throttling = true;
        const timeout = config_1.default.getEnv('executions.pruneDataTimeout'); // in seconds
        const maxAge = config_1.default.getEnv('executions.pruneDataMaxAge'); // in h
        const date = new Date(); // today
        date.setHours(date.getHours() - maxAge);
        // date reformatting needed - see https://github.com/typeorm/typeorm/issues/2286
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const utcDate = DateUtils_1.DateUtils.mixedDateToUtcDatetimeString(date);
        // throttle just on success to allow for self healing on failure
        _1.Db.collections.Execution.delete({ stoppedAt: (0, typeorm_1.LessThanOrEqual)(utcDate) })
            .then((data) => setTimeout(() => {
            throttling = false;
        }, timeout * 1000))
            .catch((error) => {
            throttling = false;
            n8n_workflow_1.LoggerProxy.error(`Failed pruning execution data from database for execution ID ${this.executionId} (hookFunctionsSave)`, Object.assign(Object.assign({}, error), { executionId: this.executionId, sessionId: this.sessionId, workflowId: this.workflowData.id }));
        });
    }
}
/**
 * Returns hook functions to push data to Editor-UI
 *
 * @returns {IWorkflowExecuteHooks}
 */
function hookFunctionsPush() {
    return {
        nodeExecuteBefore: [
            function (nodeName) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Push data to session which started workflow before each
                    // node which starts rendering
                    if (this.sessionId === undefined) {
                        return;
                    }
                    n8n_workflow_1.LoggerProxy.debug(`Executing hook on node "${nodeName}" (hookFunctionsPush)`, {
                        executionId: this.executionId,
                        sessionId: this.sessionId,
                        workflowId: this.workflowData.id,
                    });
                    const pushInstance = _1.Push.getInstance();
                    pushInstance.send('nodeExecuteBefore', {
                        executionId: this.executionId,
                        nodeName,
                    }, this.sessionId);
                });
            },
        ],
        nodeExecuteAfter: [
            function (nodeName, data) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Push data to session which started workflow after each rendered node
                    if (this.sessionId === undefined) {
                        return;
                    }
                    n8n_workflow_1.LoggerProxy.debug(`Executing hook on node "${nodeName}" (hookFunctionsPush)`, {
                        executionId: this.executionId,
                        sessionId: this.sessionId,
                        workflowId: this.workflowData.id,
                    });
                    const pushInstance = _1.Push.getInstance();
                    pushInstance.send('nodeExecuteAfter', {
                        executionId: this.executionId,
                        nodeName,
                        data,
                    }, this.sessionId);
                });
            },
        ],
        workflowExecuteBefore: [
            function () {
                return __awaiter(this, void 0, void 0, function* () {
                    n8n_workflow_1.LoggerProxy.debug(`Executing hook (hookFunctionsPush)`, {
                        executionId: this.executionId,
                        sessionId: this.sessionId,
                        workflowId: this.workflowData.id,
                    });
                    // Push data to session which started the workflow
                    if (this.sessionId === undefined) {
                        return;
                    }
                    const pushInstance = _1.Push.getInstance();
                    pushInstance.send('executionStarted', {
                        executionId: this.executionId,
                        mode: this.mode,
                        startedAt: new Date(),
                        retryOf: this.retryOf,
                        workflowId: this.workflowData.id,
                        sessionId: this.sessionId,
                        workflowName: this.workflowData.name,
                    }, this.sessionId);
                });
            },
        ],
        workflowExecuteAfter: [
            function (fullRunData, newStaticData) {
                return __awaiter(this, void 0, void 0, function* () {
                    n8n_workflow_1.LoggerProxy.debug(`Executing hook (hookFunctionsPush)`, {
                        executionId: this.executionId,
                        sessionId: this.sessionId,
                        workflowId: this.workflowData.id,
                    });
                    // Push data to session which started the workflow
                    if (this.sessionId === undefined) {
                        return;
                    }
                    // Clone the object except the runData. That one is not supposed
                    // to be send. Because that data got send piece by piece after
                    // each node which finished executing
                    const pushRunData = Object.assign(Object.assign({}, fullRunData), { data: Object.assign(Object.assign({}, fullRunData.data), { resultData: Object.assign(Object.assign({}, fullRunData.data.resultData), { runData: {} }) }) });
                    // Push data to editor-ui once workflow finished
                    n8n_workflow_1.LoggerProxy.debug(`Save execution progress to database for execution ID ${this.executionId} `, {
                        executionId: this.executionId,
                        workflowId: this.workflowData.id,
                    });
                    // TODO: Look at this again
                    const sendData = {
                        executionId: this.executionId,
                        data: pushRunData,
                        retryOf: this.retryOf,
                    };
                    const pushInstance = _1.Push.getInstance();
                    pushInstance.send('executionFinished', sendData, this.sessionId);
                });
            },
        ],
    };
}
function hookFunctionsPreExecute(parentProcessMode) {
    const externalHooks = (0, _1.ExternalHooks)();
    return {
        workflowExecuteBefore: [
            function (workflow) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield externalHooks.run('workflow.preExecute', [workflow, this.mode]);
                });
            },
        ],
        nodeExecuteAfter: [
            function (nodeName, data, executionData) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.workflowData.settings !== undefined) {
                        if (this.workflowData.settings.saveExecutionProgress === false) {
                            return;
                        }
                        if (this.workflowData.settings.saveExecutionProgress !== true &&
                            !config_1.default.getEnv('executions.saveExecutionProgress')) {
                            return;
                        }
                    }
                    else if (!config_1.default.getEnv('executions.saveExecutionProgress')) {
                        return;
                    }
                    try {
                        n8n_workflow_1.LoggerProxy.debug(`Save execution progress to database for execution ID ${this.executionId} `, { executionId: this.executionId, nodeName });
                        const execution = yield _1.Db.collections.Execution.findOne(this.executionId);
                        if (execution === undefined) {
                            // Something went badly wrong if this happens.
                            // This check is here mostly to make typescript happy.
                            return;
                        }
                        const fullExecutionData = _1.ResponseHelper.unflattenExecutionData(execution);
                        if (fullExecutionData.finished) {
                            // We already received ´workflowExecuteAfter´ webhook, so this is just an async call
                            // that was left behind. We skip saving because the other call should have saved everything
                            // so this one is safe to ignore
                            return;
                        }
                        if (fullExecutionData.data === undefined) {
                            fullExecutionData.data = {
                                startData: {},
                                resultData: {
                                    runData: {},
                                },
                                executionData: {
                                    contextData: {},
                                    nodeExecutionStack: [],
                                    waitingExecution: {},
                                    waitingExecutionSource: {},
                                },
                            };
                        }
                        if (Array.isArray(fullExecutionData.data.resultData.runData[nodeName])) {
                            // Append data if array exists
                            fullExecutionData.data.resultData.runData[nodeName].push(data);
                        }
                        else {
                            // Initialize array and save data
                            fullExecutionData.data.resultData.runData[nodeName] = [data];
                        }
                        fullExecutionData.data.executionData = executionData.executionData;
                        // Set last executed node so that it may resume on failure
                        fullExecutionData.data.resultData.lastNodeExecuted = nodeName;
                        const flattenedExecutionData = _1.ResponseHelper.flattenExecutionData(fullExecutionData);
                        yield _1.Db.collections.Execution.update(this.executionId, flattenedExecutionData);
                    }
                    catch (err) {
                        // TODO: Improve in the future!
                        // Errors here might happen because of database access
                        // For busy machines, we may get "Database is locked" errors.
                        // We do this to prevent crashes and executions ending in `unknown` state.
                        n8n_workflow_1.LoggerProxy.error(`Failed saving execution progress to database for execution ID ${this.executionId} (hookFunctionsPreExecute, nodeExecuteAfter)`, Object.assign(Object.assign({}, err), { executionId: this.executionId, sessionId: this.sessionId, workflowId: this.workflowData.id }));
                    }
                });
            },
        ],
    };
}
exports.hookFunctionsPreExecute = hookFunctionsPreExecute;
/**
 * Returns hook functions to save workflow execution and call error workflow
 *
 * @returns {IWorkflowExecuteHooks}
 */
function hookFunctionsSave(parentProcessMode) {
    return {
        nodeExecuteBefore: [],
        nodeExecuteAfter: [],
        workflowExecuteBefore: [],
        workflowExecuteAfter: [
            function (fullRunData, newStaticData) {
                return __awaiter(this, void 0, void 0, function* () {
                    n8n_workflow_1.LoggerProxy.debug(`Executing hook (hookFunctionsSave)`, {
                        executionId: this.executionId,
                        workflowId: this.workflowData.id,
                    });
                    // Prune old execution data
                    if (config_1.default.getEnv('executions.pruneData')) {
                        pruneExecutionData.call(this);
                    }
                    const isManualMode = [this.mode, parentProcessMode].includes('manual');
                    try {
                        if (!isManualMode &&
                            _1.WorkflowHelpers.isWorkflowIdValid(this.workflowData.id) &&
                            newStaticData) {
                            // Workflow is saved so update in database
                            try {
                                yield _1.WorkflowHelpers.saveStaticDataById(this.workflowData.id, newStaticData);
                            }
                            catch (e) {
                                n8n_workflow_1.LoggerProxy.error(`There was a problem saving the workflow with id "${this.workflowData.id}" to save changed staticData: "${e.message}" (hookFunctionsSave)`, { executionId: this.executionId, workflowId: this.workflowData.id });
                            }
                        }
                        let saveManualExecutions = config_1.default.getEnv('executions.saveDataManualExecutions');
                        if (this.workflowData.settings !== undefined &&
                            this.workflowData.settings.saveManualExecutions !== undefined) {
                            // Apply to workflow override
                            saveManualExecutions = this.workflowData.settings.saveManualExecutions;
                        }
                        if (isManualMode && !saveManualExecutions && !fullRunData.waitTill) {
                            // Data is always saved, so we remove from database
                            yield _1.Db.collections.Execution.delete(this.executionId);
                            yield n8n_core_1.BinaryDataManager.getInstance().markDataForDeletionByExecutionId(this.executionId);
                            return;
                        }
                        // Check config to know if execution should be saved or not
                        let saveDataErrorExecution = config_1.default.getEnv('executions.saveDataOnError');
                        let saveDataSuccessExecution = config_1.default.getEnv('executions.saveDataOnSuccess');
                        if (this.workflowData.settings !== undefined) {
                            saveDataErrorExecution =
                                this.workflowData.settings.saveDataErrorExecution ||
                                    saveDataErrorExecution;
                            saveDataSuccessExecution =
                                this.workflowData.settings.saveDataSuccessExecution ||
                                    saveDataSuccessExecution;
                        }
                        const workflowDidSucceed = !fullRunData.data.resultData.error;
                        if ((workflowDidSucceed && saveDataSuccessExecution === 'none') ||
                            (!workflowDidSucceed && saveDataErrorExecution === 'none')) {
                            if (!fullRunData.waitTill) {
                                if (!isManualMode) {
                                    executeErrorWorkflow(this.workflowData, fullRunData, this.mode, this.executionId, this.retryOf);
                                }
                                // Data is always saved, so we remove from database
                                yield _1.Db.collections.Execution.delete(this.executionId);
                                yield n8n_core_1.BinaryDataManager.getInstance().markDataForDeletionByExecutionId(this.executionId);
                                return;
                            }
                        }
                        const fullExecutionData = {
                            data: fullRunData.data,
                            mode: fullRunData.mode,
                            finished: fullRunData.finished ? fullRunData.finished : false,
                            startedAt: fullRunData.startedAt,
                            stoppedAt: fullRunData.stoppedAt,
                            workflowData: this.workflowData,
                            waitTill: fullRunData.waitTill,
                        };
                        if (this.retryOf !== undefined) {
                            fullExecutionData.retryOf = this.retryOf.toString();
                        }
                        if (this.workflowData.id !== undefined &&
                            _1.WorkflowHelpers.isWorkflowIdValid(this.workflowData.id.toString())) {
                            fullExecutionData.workflowId = this.workflowData.id.toString();
                        }
                        // Leave log message before flatten as that operation increased memory usage a lot and the chance of a crash is highest here
                        n8n_workflow_1.LoggerProxy.debug(`Save execution data to database for execution ID ${this.executionId}`, {
                            executionId: this.executionId,
                            workflowId: this.workflowData.id,
                            finished: fullExecutionData.finished,
                            stoppedAt: fullExecutionData.stoppedAt,
                        });
                        const executionData = _1.ResponseHelper.flattenExecutionData(fullExecutionData);
                        // Save the Execution in DB
                        yield _1.Db.collections.Execution.update(this.executionId, executionData);
                        if (fullRunData.finished === true && this.retryOf !== undefined) {
                            // If the retry was successful save the reference it on the original execution
                            // await Db.collections.Execution.save(executionData as IExecutionFlattedDb);
                            yield _1.Db.collections.Execution.update(this.retryOf, {
                                retrySuccessId: this.executionId,
                            });
                        }
                        if (!isManualMode) {
                            executeErrorWorkflow(this.workflowData, fullRunData, this.mode, this.executionId, this.retryOf);
                        }
                    }
                    catch (error) {
                        n8n_workflow_1.LoggerProxy.error(`Failed saving execution data to DB on execution ID ${this.executionId}`, {
                            executionId: this.executionId,
                            workflowId: this.workflowData.id,
                            error,
                        });
                        if (!isManualMode) {
                            executeErrorWorkflow(this.workflowData, fullRunData, this.mode, this.executionId, this.retryOf);
                        }
                    }
                });
            },
        ],
    };
}
/**
 * Returns hook functions to save workflow execution and call error workflow
 * for running with queues. Manual executions should never run on queues as
 * they are always executed in the main process.
 *
 * @returns {IWorkflowExecuteHooks}
 */
function hookFunctionsSaveWorker() {
    return {
        nodeExecuteBefore: [],
        nodeExecuteAfter: [],
        workflowExecuteBefore: [],
        workflowExecuteAfter: [
            function (fullRunData, newStaticData) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (_1.WorkflowHelpers.isWorkflowIdValid(this.workflowData.id) && newStaticData) {
                            // Workflow is saved so update in database
                            try {
                                yield _1.WorkflowHelpers.saveStaticDataById(this.workflowData.id, newStaticData);
                            }
                            catch (e) {
                                n8n_workflow_1.LoggerProxy.error(`There was a problem saving the workflow with id "${this.workflowData.id}" to save changed staticData: "${e.message}" (workflowExecuteAfter)`, { sessionId: this.sessionId, workflowId: this.workflowData.id });
                            }
                        }
                        const workflowDidSucceed = !fullRunData.data.resultData.error;
                        if (!workflowDidSucceed) {
                            executeErrorWorkflow(this.workflowData, fullRunData, this.mode, this.executionId, this.retryOf);
                        }
                        const fullExecutionData = {
                            data: fullRunData.data,
                            mode: fullRunData.mode,
                            finished: fullRunData.finished ? fullRunData.finished : false,
                            startedAt: fullRunData.startedAt,
                            stoppedAt: fullRunData.stoppedAt,
                            workflowData: this.workflowData,
                            waitTill: fullRunData.data.waitTill,
                        };
                        if (this.retryOf !== undefined) {
                            fullExecutionData.retryOf = this.retryOf.toString();
                        }
                        if (this.workflowData.id !== undefined &&
                            _1.WorkflowHelpers.isWorkflowIdValid(this.workflowData.id.toString())) {
                            fullExecutionData.workflowId = this.workflowData.id.toString();
                        }
                        const executionData = _1.ResponseHelper.flattenExecutionData(fullExecutionData);
                        // Save the Execution in DB
                        yield _1.Db.collections.Execution.update(this.executionId, executionData);
                        if (fullRunData.finished === true && this.retryOf !== undefined) {
                            // If the retry was successful save the reference it on the original execution
                            yield _1.Db.collections.Execution.update(this.retryOf, {
                                retrySuccessId: this.executionId,
                            });
                        }
                    }
                    catch (error) {
                        executeErrorWorkflow(this.workflowData, fullRunData, this.mode, this.executionId, this.retryOf);
                    }
                });
            },
        ],
    };
}
function getRunData(workflowData, userId, inputData) {
    return __awaiter(this, void 0, void 0, function* () {
        const mode = 'integrated';
        // Find Start-Node
        const requiredNodeTypes = ['n8n-nodes-base.start'];
        let startNode;
        // eslint-disable-next-line no-restricted-syntax
        for (const node of workflowData.nodes) {
            if (requiredNodeTypes.includes(node.type)) {
                startNode = node;
                break;
            }
        }
        if (startNode === undefined) {
            // If the workflow does not contain a start-node we can not know what
            // should be executed and with what data to start.
            throw new Error(`The workflow does not contain a "Start" node and can so not be executed.`);
        }
        // Always start with empty data if no inputData got supplied
        inputData = inputData || [
            {
                json: {},
            },
        ];
        // Initialize the incoming data
        const nodeExecutionStack = [];
        nodeExecutionStack.push({
            node: startNode,
            data: {
                main: [inputData],
            },
            source: null,
        });
        const runExecutionData = {
            startData: {},
            resultData: {
                runData: {},
            },
            executionData: {
                contextData: {},
                nodeExecutionStack,
                waitingExecution: {},
                waitingExecutionSource: {},
            },
        };
        const runData = {
            executionMode: mode,
            executionData: runExecutionData,
            // @ts-ignore
            workflowData,
            userId,
        };
        return runData;
    });
}
exports.getRunData = getRunData;
function getWorkflowData(workflowInfo, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (workflowInfo.id === undefined && workflowInfo.code === undefined) {
            throw new Error(`No information about the workflow to execute found. Please provide either the "id" or "code"!`);
        }
        let workflowData;
        if (workflowInfo.id !== undefined) {
            if (!_1.Db.isInitialized) {
                // The first time executeWorkflow gets called the Database has
                // to get initialized first
                yield _1.Db.init();
            }
            const user = yield (0, UserManagementHelper_1.getUserById)(userId);
            let relations = ['workflow', 'workflow.tags'];
            if (config_1.default.getEnv('workflowTagsDisabled')) {
                relations = relations.filter((relation) => relation !== 'workflow.tags');
            }
            const shared = yield _1.Db.collections.SharedWorkflow.findOne({
                relations,
                where: (0, WorkflowHelpers_1.whereClause)({
                    user,
                    entityType: 'workflow',
                    entityId: workflowInfo.id,
                }),
            });
            workflowData = shared === null || shared === void 0 ? void 0 : shared.workflow;
            if (workflowData === undefined) {
                throw new Error(`The workflow with the id "${workflowInfo.id}" does not exist.`);
            }
        }
        else {
            workflowData = workflowInfo.code;
        }
        return workflowData;
    });
}
exports.getWorkflowData = getWorkflowData;
/**
 * Executes the workflow with the given ID
 *
 * @export
 * @param {string} workflowId The id of the workflow to execute
 * @param {IWorkflowExecuteAdditionalData} additionalData
 * @param {INodeExecutionData[]} [inputData]
 * @returns {(Promise<Array<INodeExecutionData[] | null>>)}
 */
function executeWorkflow(workflowInfo, additionalData, inputData, parentExecutionId, loadedWorkflowData, loadedRunData) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const externalHooks = (0, _1.ExternalHooks)();
        yield externalHooks.init();
        const nodeTypes = (0, _1.NodeTypes)();
        const workflowData = loadedWorkflowData !== null && loadedWorkflowData !== void 0 ? loadedWorkflowData : (yield getWorkflowData(workflowInfo, additionalData.userId));
        const workflowName = workflowData ? workflowData.name : undefined;
        const workflow = new n8n_workflow_1.Workflow({
            id: workflowInfo.id,
            name: workflowName,
            nodes: workflowData.nodes,
            connections: workflowData.connections,
            active: workflowData.active,
            nodeTypes,
            staticData: workflowData.staticData,
        });
        const runData = loadedRunData !== null && loadedRunData !== void 0 ? loadedRunData : (yield getRunData(workflowData, additionalData.userId, inputData));
        let executionId;
        if (parentExecutionId !== undefined) {
            executionId = parentExecutionId;
        }
        else {
            executionId =
                parentExecutionId !== undefined
                    ? parentExecutionId
                    : yield _1.ActiveExecutions.getInstance().add(runData);
        }
        let data;
        try {
            yield (0, UserManagementHelper_1.checkPermissionsForExecution)(workflow, additionalData.userId);
            // Create new additionalData to have different workflow loaded and to call
            // different webooks
            const additionalDataIntegrated = yield getBase(additionalData.userId);
            additionalDataIntegrated.hooks = getWorkflowHooksIntegrated(runData.executionMode, executionId, workflowData, { parentProcessMode: additionalData.hooks.mode });
            additionalDataIntegrated.executionId = executionId;
            // Make sure we pass on the original executeWorkflow function we received
            // This one already contains changes to talk to parent process
            // and get executionID from `activeExecutions` running on main process
            additionalDataIntegrated.executeWorkflow = additionalData.executeWorkflow;
            let subworkflowTimeout = additionalData.executionTimeoutTimestamp;
            if (((_a = workflowData.settings) === null || _a === void 0 ? void 0 : _a.executionTimeout) !== undefined &&
                workflowData.settings.executionTimeout > 0) {
                // We might have received a max timeout timestamp from the parent workflow
                // If we did, then we get the minimum time between the two timeouts
                // If no timeout was given from the parent, then we use our timeout.
                subworkflowTimeout = Math.min(additionalData.executionTimeoutTimestamp || Number.MAX_SAFE_INTEGER, Date.now() + workflowData.settings.executionTimeout * 1000);
            }
            additionalDataIntegrated.executionTimeoutTimestamp = subworkflowTimeout;
            const runExecutionData = runData.executionData;
            // Execute the workflow
            const workflowExecute = new n8n_core_1.WorkflowExecute(additionalDataIntegrated, runData.executionMode, runExecutionData);
            if (parentExecutionId !== undefined) {
                // Must be changed to become typed
                return {
                    startedAt: new Date(),
                    workflow,
                    workflowExecute,
                };
            }
            data = yield workflowExecute.processRunExecutionData(workflow);
        }
        catch (error) {
            const fullRunData = {
                data: {
                    resultData: {
                        error,
                        runData: {},
                    },
                },
                finished: false,
                mode: 'integrated',
                startedAt: new Date(),
                stoppedAt: new Date(),
            };
            // When failing, we might not have finished the execution
            // Therefore, database might not contain finished errors.
            // Force an update to db as there should be no harm doing this
            const fullExecutionData = {
                data: fullRunData.data,
                mode: fullRunData.mode,
                finished: fullRunData.finished ? fullRunData.finished : false,
                startedAt: fullRunData.startedAt,
                stoppedAt: fullRunData.stoppedAt,
                workflowData,
            };
            if (workflowData.id) {
                fullExecutionData.workflowId = workflowData.id;
            }
            const executionData = _1.ResponseHelper.flattenExecutionData(fullExecutionData);
            yield _1.Db.collections.Execution.update(executionId, executionData);
            throw Object.assign(Object.assign({}, error), { stack: error.stack });
        }
        yield externalHooks.run('workflow.postExecute', [data, workflowData, executionId]);
        void _1.InternalHooksManager.getInstance().onWorkflowPostExecute(executionId, workflowData, data, additionalData.userId);
        if (data.finished === true) {
            // Workflow did finish successfully
            yield _1.ActiveExecutions.getInstance().remove(executionId, data);
            const returnData = _1.WorkflowHelpers.getDataLastExecutedNodeData(data);
            return returnData.data.main;
        }
        yield _1.ActiveExecutions.getInstance().remove(executionId, data);
        // Workflow did fail
        const { error } = data.data.resultData;
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw Object.assign(Object.assign({}, error), { stack: error.stack });
    });
}
exports.executeWorkflow = executeWorkflow;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sendMessageToUI(source, messages) {
    if (this.sessionId === undefined) {
        return;
    }
    // Push data to session which started workflow
    try {
        const pushInstance = _1.Push.getInstance();
        pushInstance.send('sendConsoleMessage', {
            source: `Node: "${source}"`,
            messages,
        }, this.sessionId);
    }
    catch (error) {
        n8n_workflow_1.LoggerProxy.warn(`There was a problem sending messsage to UI: ${error.message}`);
    }
}
exports.sendMessageToUI = sendMessageToUI;
/**
 * Returns the base additional data without webhooks
 *
 * @export
 * @param {userId} string
 * @param {INodeParameters} currentNodeParameters
 * @returns {Promise<IWorkflowExecuteAdditionalData>}
 */
function getBase(userId, currentNodeParameters, executionTimeoutTimestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlBaseWebhook = _1.WebhookHelpers.getWebhookBaseUrl();
        const timezone = config_1.default.getEnv('generic.timezone');
        const webhookBaseUrl = urlBaseWebhook + config_1.default.getEnv('endpoints.webhook');
        const webhookWaitingBaseUrl = urlBaseWebhook + config_1.default.getEnv('endpoints.webhookWaiting');
        const webhookTestBaseUrl = urlBaseWebhook + config_1.default.getEnv('endpoints.webhookTest');
        const encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
        return {
            credentialsHelper: new _1.CredentialsHelper(encryptionKey),
            encryptionKey,
            executeWorkflow,
            restApiUrl: urlBaseWebhook + config_1.default.getEnv('endpoints.rest'),
            timezone,
            webhookBaseUrl,
            webhookWaitingBaseUrl,
            webhookTestBaseUrl,
            currentNodeParameters,
            executionTimeoutTimestamp,
            userId,
        };
    });
}
exports.getBase = getBase;
/**
 * Returns WorkflowHooks instance for running integrated workflows
 * (Workflows which get started inside of another workflow)
 */
function getWorkflowHooksIntegrated(mode, executionId, workflowData, optionalParameters) {
    optionalParameters = optionalParameters || {};
    const hookFunctions = hookFunctionsSave(optionalParameters.parentProcessMode);
    const preExecuteFunctions = hookFunctionsPreExecute(optionalParameters.parentProcessMode);
    for (const key of Object.keys(preExecuteFunctions)) {
        if (hookFunctions[key] === undefined) {
            hookFunctions[key] = [];
        }
        hookFunctions[key].push.apply(hookFunctions[key], preExecuteFunctions[key]);
    }
    return new n8n_workflow_1.WorkflowHooks(hookFunctions, mode, executionId, workflowData, optionalParameters);
}
exports.getWorkflowHooksIntegrated = getWorkflowHooksIntegrated;
/**
 * Returns WorkflowHooks instance for running integrated workflows
 * (Workflows which get started inside of another workflow)
 */
function getWorkflowHooksWorkerExecuter(mode, executionId, workflowData, optionalParameters) {
    optionalParameters = optionalParameters || {};
    const hookFunctions = hookFunctionsSaveWorker();
    const preExecuteFunctions = hookFunctionsPreExecute(optionalParameters.parentProcessMode);
    for (const key of Object.keys(preExecuteFunctions)) {
        if (hookFunctions[key] === undefined) {
            hookFunctions[key] = [];
        }
        hookFunctions[key].push.apply(hookFunctions[key], preExecuteFunctions[key]);
    }
    return new n8n_workflow_1.WorkflowHooks(hookFunctions, mode, executionId, workflowData, optionalParameters);
}
exports.getWorkflowHooksWorkerExecuter = getWorkflowHooksWorkerExecuter;
/**
 * Returns WorkflowHooks instance for main process if workflow runs via worker
 */
function getWorkflowHooksWorkerMain(mode, executionId, workflowData, optionalParameters) {
    optionalParameters = optionalParameters || {};
    const hookFunctions = hookFunctionsPush();
    const preExecuteFunctions = hookFunctionsPreExecute(optionalParameters.parentProcessMode);
    for (const key of Object.keys(preExecuteFunctions)) {
        if (hookFunctions[key] === undefined) {
            hookFunctions[key] = [];
        }
        hookFunctions[key].push.apply(hookFunctions[key], preExecuteFunctions[key]);
    }
    // When running with worker mode, main process executes
    // Only workflowExecuteBefore + workflowExecuteAfter
    // So to avoid confusion, we are removing other hooks.
    hookFunctions.nodeExecuteBefore = [];
    hookFunctions.nodeExecuteAfter = [];
    return new n8n_workflow_1.WorkflowHooks(hookFunctions, mode, executionId, workflowData, optionalParameters);
}
exports.getWorkflowHooksWorkerMain = getWorkflowHooksWorkerMain;
/**
 * Returns WorkflowHooks instance for running the main workflow
 *
 * @export
 * @param {IWorkflowExecutionDataProcess} data
 * @param {string} executionId
 * @returns {WorkflowHooks}
 */
function getWorkflowHooksMain(data, executionId, isMainProcess = false) {
    const hookFunctions = hookFunctionsSave();
    const pushFunctions = hookFunctionsPush();
    for (const key of Object.keys(pushFunctions)) {
        if (hookFunctions[key] === undefined) {
            hookFunctions[key] = [];
        }
        hookFunctions[key].push.apply(hookFunctions[key], pushFunctions[key]);
    }
    if (isMainProcess) {
        const preExecuteFunctions = hookFunctionsPreExecute();
        for (const key of Object.keys(preExecuteFunctions)) {
            if (hookFunctions[key] === undefined) {
                hookFunctions[key] = [];
            }
            hookFunctions[key].push.apply(hookFunctions[key], preExecuteFunctions[key]);
        }
    }
    return new n8n_workflow_1.WorkflowHooks(hookFunctions, data.executionMode, executionId, data.workflowData, {
        sessionId: data.sessionId,
        retryOf: data.retryOf,
    });
}
exports.getWorkflowHooksMain = getWorkflowHooksMain;

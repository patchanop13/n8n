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
exports.WorkflowRunner = void 0;
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
// eslint-disable-next-line import/no-extraneous-dependencies
const p_cancelable_1 = __importDefault(require("p-cancelable"));
const path_1 = require("path");
const child_process_1 = require("child_process");
const config_1 = __importDefault(require("../config"));
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
const Queue = __importStar(require("./Queue"));
const InternalHooksManager_1 = require("./InternalHooksManager");
const UserManagementHelper_1 = require("./UserManagement/UserManagementHelper");
class WorkflowRunner {
    constructor() {
        this.push = _1.Push.getInstance();
        this.activeExecutions = _1.ActiveExecutions.getInstance();
        this.credentialsOverwrites = (0, _1.CredentialsOverwrites)().getAll();
        const executionsMode = config_1.default.getEnv('executions.mode');
        if (executionsMode === 'queue') {
            this.jobQueue = Queue.getInstance().getBullObjectInstance();
        }
    }
    /**
     * The process did send a hook message so execute the appropiate hook
     *
     * @param {WorkflowHooks} workflowHooks
     * @param {IProcessMessageDataHook} hookData
     * @memberof WorkflowRunner
     */
    processHookMessage(workflowHooks, hookData) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        workflowHooks.executeHookFunctions(hookData.hook, hookData.parameters);
    }
    /**
     * The process did error
     *
     * @param {ExecutionError} error
     * @param {Date} startedAt
     * @param {WorkflowExecuteMode} executionMode
     * @param {string} executionId
     * @memberof WorkflowRunner
     */
    processError(error, startedAt, executionMode, executionId, hooks) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullRunData = {
                data: {
                    resultData: {
                        error: Object.assign(Object.assign({}, error), { message: error.message, stack: error.stack }),
                        runData: {},
                    },
                },
                finished: false,
                mode: executionMode,
                startedAt,
                stoppedAt: new Date(),
            };
            // Remove from active execution with empty data. That will
            // set the execution to failed.
            this.activeExecutions.remove(executionId, fullRunData);
            if (hooks) {
                yield hooks.executeHookFunctions('workflowExecuteAfter', [fullRunData]);
            }
        });
    }
    /**
     * Run the workflow
     *
     * @param {IWorkflowExecutionDataProcess} data
     * @param {boolean} [loadStaticData] If set will the static data be loaded from
     *                                   the workflow and added to input data
     * @returns {Promise<string>}
     * @memberof WorkflowRunner
     */
    run(data, loadStaticData, realtime, executionId, responsePromise) {
        return __awaiter(this, void 0, void 0, function* () {
            const executionsProcess = config_1.default.getEnv('executions.process');
            const executionsMode = config_1.default.getEnv('executions.mode');
            if (executionsMode === 'queue' && data.executionMode !== 'manual') {
                // Do not run "manual" executions in bull because sending events to the
                // frontend would not be possible
                executionId = yield this.runBull(data, loadStaticData, realtime, executionId, responsePromise);
            }
            else if (executionsProcess === 'main') {
                executionId = yield this.runMainProcess(data, loadStaticData, executionId, responsePromise);
            }
            else {
                executionId = yield this.runSubprocess(data, loadStaticData, executionId, responsePromise);
            }
            const postExecutePromise = this.activeExecutions.getPostExecutePromise(executionId);
            const externalHooks = (0, _1.ExternalHooks)();
            postExecutePromise
                .then((executionData) => __awaiter(this, void 0, void 0, function* () {
                void InternalHooksManager_1.InternalHooksManager.getInstance().onWorkflowPostExecute(executionId, data.workflowData, executionData, data.userId);
            }))
                .catch((error) => {
                console.error('There was a problem running internal hook "onWorkflowPostExecute"', error);
            });
            if (externalHooks.exists('workflow.postExecute')) {
                postExecutePromise
                    .then((executionData) => __awaiter(this, void 0, void 0, function* () {
                    yield externalHooks.run('workflow.postExecute', [
                        executionData,
                        data.workflowData,
                        executionId,
                    ]);
                }))
                    .catch((error) => {
                    console.error('There was a problem running hook "workflow.postExecute"', error);
                });
            }
            return executionId;
        });
    }
    /**
     * Run the workflow in current process
     *
     * @param {IWorkflowExecutionDataProcess} data
     * @param {boolean} [loadStaticData] If set will the static data be loaded from
     *                                   the workflow and added to input data
     * @returns {Promise<string>}
     * @memberof WorkflowRunner
     */
    runMainProcess(data, loadStaticData, restartExecutionId, responsePromise) {
        return __awaiter(this, void 0, void 0, function* () {
            if (loadStaticData === true && data.workflowData.id) {
                data.workflowData.staticData = yield _1.WorkflowHelpers.getStaticDataById(data.workflowData.id);
            }
            const nodeTypes = (0, _1.NodeTypes)();
            // Soft timeout to stop workflow execution after current running node
            // Changes were made by adding the `workflowTimeout` to the `additionalData`
            // So that the timeout will also work for executions with nested workflows.
            let executionTimeout;
            let workflowTimeout = config_1.default.getEnv('executions.timeout'); // initialize with default
            if (data.workflowData.settings && data.workflowData.settings.executionTimeout) {
                workflowTimeout = data.workflowData.settings.executionTimeout; // preference on workflow setting
            }
            if (workflowTimeout > 0) {
                workflowTimeout = Math.min(workflowTimeout, config_1.default.getEnv('executions.maxTimeout'));
            }
            const workflow = new n8n_workflow_1.Workflow({
                id: data.workflowData.id,
                name: data.workflowData.name,
                nodes: data.workflowData.nodes,
                connections: data.workflowData.connections,
                active: data.workflowData.active,
                nodeTypes,
                staticData: data.workflowData.staticData,
            });
            const additionalData = yield _1.WorkflowExecuteAdditionalData.getBase(data.userId, undefined, workflowTimeout <= 0 ? undefined : Date.now() + workflowTimeout * 1000);
            // Register the active execution
            const executionId = yield this.activeExecutions.add(data, undefined, restartExecutionId);
            additionalData.executionId = executionId;
            n8n_workflow_1.LoggerProxy.verbose(`Execution for workflow ${data.workflowData.name} was assigned id ${executionId}`, { executionId });
            let workflowExecution;
            try {
                n8n_workflow_1.LoggerProxy.verbose(`Execution for workflow ${data.workflowData.name} was assigned id ${executionId}`, { executionId });
                yield (0, UserManagementHelper_1.checkPermissionsForExecution)(workflow, data.userId);
                additionalData.hooks = _1.WorkflowExecuteAdditionalData.getWorkflowHooksMain(data, executionId, true);
                additionalData.hooks.hookFunctions.sendResponse = [
                    (response) => __awaiter(this, void 0, void 0, function* () {
                        if (responsePromise) {
                            responsePromise.resolve(response);
                        }
                    }),
                ];
                additionalData.sendMessageToUI = _1.WorkflowExecuteAdditionalData.sendMessageToUI.bind({
                    sessionId: data.sessionId,
                });
                if (data.executionData !== undefined) {
                    n8n_workflow_1.LoggerProxy.debug(`Execution ID ${executionId} had Execution data. Running with payload.`, {
                        executionId,
                    });
                    const workflowExecute = new n8n_core_1.WorkflowExecute(additionalData, data.executionMode, data.executionData);
                    workflowExecution = workflowExecute.processRunExecutionData(workflow);
                }
                else if (data.runData === undefined ||
                    data.startNodes === undefined ||
                    data.startNodes.length === 0 ||
                    data.destinationNode === undefined) {
                    n8n_workflow_1.LoggerProxy.debug(`Execution ID ${executionId} will run executing all nodes.`, { executionId });
                    // Execute all nodes
                    // Can execute without webhook so go on
                    const workflowExecute = new n8n_core_1.WorkflowExecute(additionalData, data.executionMode);
                    workflowExecution = workflowExecute.run(workflow, undefined, data.destinationNode);
                }
                else {
                    n8n_workflow_1.LoggerProxy.debug(`Execution ID ${executionId} is a partial execution.`, { executionId });
                    // Execute only the nodes between start and destination nodes
                    const workflowExecute = new n8n_core_1.WorkflowExecute(additionalData, data.executionMode);
                    workflowExecution = workflowExecute.runPartialWorkflow(workflow, data.runData, data.startNodes, data.destinationNode);
                }
                this.activeExecutions.attachWorkflowExecution(executionId, workflowExecution);
                if (workflowTimeout > 0) {
                    const timeout = Math.min(workflowTimeout, config_1.default.getEnv('executions.maxTimeout')) * 1000; // as seconds
                    executionTimeout = setTimeout(() => {
                        this.activeExecutions.stopExecution(executionId, 'timeout');
                    }, timeout);
                }
                workflowExecution
                    .then((fullRunData) => {
                    clearTimeout(executionTimeout);
                    if (workflowExecution.isCanceled) {
                        fullRunData.finished = false;
                    }
                    this.activeExecutions.remove(executionId, fullRunData);
                })
                    .catch((error) => {
                    this.processError(error, new Date(), data.executionMode, executionId, additionalData.hooks);
                });
            }
            catch (error) {
                yield this.processError(error, new Date(), data.executionMode, executionId, additionalData.hooks);
                throw error;
            }
            return executionId;
        });
    }
    runBull(data, loadStaticData, realtime, restartExecutionId, responsePromise) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: If "loadStaticData" is set to true it has to load data new on worker
            // Register the active execution
            const executionId = yield this.activeExecutions.add(data, undefined, restartExecutionId);
            if (responsePromise) {
                this.activeExecutions.attachResponsePromise(executionId, responsePromise);
            }
            const jobData = {
                executionId,
                loadStaticData: !!loadStaticData,
            };
            let priority = 100;
            if (realtime === true) {
                // Jobs which require a direct response get a higher priority
                priority = 50;
            }
            // TODO: For realtime jobs should probably also not do retry or not retry if they are older than x seconds.
            //       Check if they get retried by default and how often.
            const jobOptions = {
                priority,
                removeOnComplete: true,
                removeOnFail: true,
            };
            let job;
            let hooks;
            try {
                job = yield this.jobQueue.add(jobData, jobOptions);
                console.log(`Started with job ID: ${job.id.toString()} (Execution ID: ${executionId})`);
                hooks = _1.WorkflowExecuteAdditionalData.getWorkflowHooksWorkerMain(data.executionMode, executionId, data.workflowData, { retryOf: data.retryOf ? data.retryOf.toString() : undefined });
                // Normally also workflow should be supplied here but as it only used for sending
                // data to editor-UI is not needed.
                hooks.executeHookFunctions('workflowExecuteBefore', []);
            }
            catch (error) {
                // We use "getWorkflowHooksWorkerExecuter" as "getWorkflowHooksWorkerMain" does not contain the
                // "workflowExecuteAfter" which we require.
                const hooks = _1.WorkflowExecuteAdditionalData.getWorkflowHooksWorkerExecuter(data.executionMode, executionId, data.workflowData, { retryOf: data.retryOf ? data.retryOf.toString() : undefined });
                yield this.processError(error, new Date(), data.executionMode, executionId, hooks);
                throw error;
            }
            const workflowExecution = new p_cancelable_1.default((resolve, reject, onCancel) => __awaiter(this, void 0, void 0, function* () {
                onCancel.shouldReject = false;
                onCancel(() => __awaiter(this, void 0, void 0, function* () {
                    yield Queue.getInstance().stopJob(job);
                    // We use "getWorkflowHooksWorkerExecuter" as "getWorkflowHooksWorkerMain" does not contain the
                    // "workflowExecuteAfter" which we require.
                    const hooksWorker = _1.WorkflowExecuteAdditionalData.getWorkflowHooksWorkerExecuter(data.executionMode, executionId, data.workflowData, { retryOf: data.retryOf ? data.retryOf.toString() : undefined });
                    const error = new n8n_workflow_1.WorkflowOperationError('Workflow-Execution has been canceled!');
                    yield this.processError(error, new Date(), data.executionMode, executionId, hooksWorker);
                    reject(error);
                }));
                const jobData = job.finished();
                const queueRecoveryInterval = config_1.default.getEnv('queue.bull.queueRecoveryInterval');
                const racingPromises = [jobData];
                let clearWatchdogInterval;
                if (queueRecoveryInterval > 0) {
                    /** ***********************************************
                     * Long explanation about what this solves:      *
                     * This only happens in a very specific scenario *
                     * when Redis crashes and recovers shortly       *
                     * but during this time, some execution(s)       *
                     * finished. The end result is that the main     *
                     * process will wait indefinitively and never    *
                     * get a response. This adds an active polling to*
                     * the queue that allows us to identify that the *
                     * execution finished and get information from   *
                     * the database.                                 *
                     ************************************************ */
                    let watchDogInterval;
                    const watchDog = new Promise((res) => {
                        watchDogInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                            const currentJob = yield this.jobQueue.getJob(job.id);
                            // When null means job is finished (not found in queue)
                            if (currentJob === null) {
                                // Mimic worker's success message
                                res({ success: true });
                            }
                        }), queueRecoveryInterval * 1000);
                    });
                    racingPromises.push(watchDog);
                    clearWatchdogInterval = () => {
                        if (watchDogInterval) {
                            clearInterval(watchDogInterval);
                            watchDogInterval = undefined;
                        }
                    };
                }
                try {
                    yield Promise.race(racingPromises);
                    if (clearWatchdogInterval !== undefined) {
                        clearWatchdogInterval();
                    }
                }
                catch (error) {
                    // We use "getWorkflowHooksWorkerExecuter" as "getWorkflowHooksWorkerMain" does not contain the
                    // "workflowExecuteAfter" which we require.
                    const hooks = _1.WorkflowExecuteAdditionalData.getWorkflowHooksWorkerExecuter(data.executionMode, executionId, data.workflowData, { retryOf: data.retryOf ? data.retryOf.toString() : undefined });
                    n8n_workflow_1.LoggerProxy.error(`Problem with execution ${executionId}: ${error.message}. Aborting.`);
                    if (clearWatchdogInterval !== undefined) {
                        clearWatchdogInterval();
                    }
                    yield this.processError(error, new Date(), data.executionMode, executionId, hooks);
                    reject(error);
                }
                const executionDb = (yield _1.Db.collections.Execution.findOne(executionId));
                const fullExecutionData = _1.ResponseHelper.unflattenExecutionData(executionDb);
                const runData = {
                    data: fullExecutionData.data,
                    finished: fullExecutionData.finished,
                    mode: fullExecutionData.mode,
                    startedAt: fullExecutionData.startedAt,
                    stoppedAt: fullExecutionData.stoppedAt,
                };
                this.activeExecutions.remove(executionId, runData);
                // Normally also static data should be supplied here but as it only used for sending
                // data to editor-UI is not needed.
                hooks.executeHookFunctions('workflowExecuteAfter', [runData]);
                try {
                    // Check if this execution data has to be removed from database
                    // based on workflow settings.
                    let saveDataErrorExecution = config_1.default.getEnv('executions.saveDataOnError');
                    let saveDataSuccessExecution = config_1.default.getEnv('executions.saveDataOnSuccess');
                    if (data.workflowData.settings !== undefined) {
                        saveDataErrorExecution =
                            data.workflowData.settings.saveDataErrorExecution ||
                                saveDataErrorExecution;
                        saveDataSuccessExecution =
                            data.workflowData.settings.saveDataSuccessExecution ||
                                saveDataSuccessExecution;
                    }
                    const workflowDidSucceed = !runData.data.resultData.error;
                    if ((workflowDidSucceed && saveDataSuccessExecution === 'none') ||
                        (!workflowDidSucceed && saveDataErrorExecution === 'none')) {
                        yield _1.Db.collections.Execution.delete(executionId);
                        yield n8n_core_1.BinaryDataManager.getInstance().markDataForDeletionByExecutionId(executionId);
                    }
                    // eslint-disable-next-line id-denylist
                }
                catch (err) {
                    // We don't want errors here to crash n8n. Just log and proceed.
                    console.log('Error removing saved execution from database. More details: ', err);
                }
                resolve(runData);
            }));
            workflowExecution.catch(() => {
                // We `reject` this promise if the execution fails
                // but the error is handled already by processError
                // So we're just preventing crashes here.
            });
            this.activeExecutions.attachWorkflowExecution(executionId, workflowExecution);
            return executionId;
        });
    }
    /**
     * Run the workflow
     *
     * @param {IWorkflowExecutionDataProcess} data
     * @param {boolean} [loadStaticData] If set will the static data be loaded from
     *                                   the workflow and added to input data
     * @returns {Promise<string>}
     * @memberof WorkflowRunner
     */
    runSubprocess(data, loadStaticData, restartExecutionId, responsePromise) {
        return __awaiter(this, void 0, void 0, function* () {
            let startedAt = new Date();
            const subprocess = (0, child_process_1.fork)((0, path_1.join)(__dirname, 'WorkflowRunnerProcess.js'));
            if (loadStaticData === true && data.workflowData.id) {
                data.workflowData.staticData = yield _1.WorkflowHelpers.getStaticDataById(data.workflowData.id);
            }
            // Register the active execution
            const executionId = yield this.activeExecutions.add(data, subprocess, restartExecutionId);
            // Check if workflow contains a "executeWorkflow" Node as in this
            // case we can not know which nodeTypes and credentialTypes will
            // be needed and so have to load all of them in the workflowRunnerProcess
            let loadAllNodeTypes = false;
            for (const node of data.workflowData.nodes) {
                if (node.type === 'n8n-nodes-base.executeWorkflow' && node.disabled !== true) {
                    loadAllNodeTypes = true;
                    break;
                }
            }
            let nodeTypeData;
            let credentialTypeData;
            // eslint-disable-next-line prefer-destructuring
            let credentialsOverwrites = this.credentialsOverwrites;
            if (loadAllNodeTypes) {
                // Supply all nodeTypes and credentialTypes
                nodeTypeData = _1.WorkflowHelpers.getAllNodeTypeData();
                credentialTypeData = _1.WorkflowHelpers.getAllCredentalsTypeData();
            }
            else {
                // Supply only nodeTypes, credentialTypes and overwrites that the workflow needs
                nodeTypeData = _1.WorkflowHelpers.getNodeTypeData(data.workflowData.nodes);
                credentialTypeData = _1.WorkflowHelpers.getCredentialsDataByNodes(data.workflowData.nodes);
                credentialsOverwrites = {};
                for (const credentialName of Object.keys(credentialTypeData)) {
                    if (this.credentialsOverwrites[credentialName] !== undefined) {
                        credentialsOverwrites[credentialName] = this.credentialsOverwrites[credentialName];
                    }
                }
            }
            data.executionId = executionId;
            data.nodeTypeData = nodeTypeData;
            data.credentialsOverwrite =
                this.credentialsOverwrites;
            data.credentialsTypeData =
                credentialTypeData;
            const workflowHooks = _1.WorkflowExecuteAdditionalData.getWorkflowHooksMain(data, executionId);
            try {
                // Send all data to subprocess it needs to run the workflow
                subprocess.send({ type: 'startWorkflow', data });
            }
            catch (error) {
                yield this.processError(error, new Date(), data.executionMode, executionId, workflowHooks);
                return executionId;
            }
            // Start timeout for the execution
            let executionTimeout;
            let workflowTimeout = config_1.default.getEnv('executions.timeout'); // initialize with default
            if (data.workflowData.settings && data.workflowData.settings.executionTimeout) {
                workflowTimeout = data.workflowData.settings.executionTimeout; // preference on workflow setting
            }
            const processTimeoutFunction = (timeout) => {
                this.activeExecutions.stopExecution(executionId, 'timeout');
                executionTimeout = setTimeout(() => subprocess.kill(), Math.max(timeout * 0.2, 5000)); // minimum 5 seconds
            };
            if (workflowTimeout > 0) {
                workflowTimeout = Math.min(workflowTimeout, config_1.default.getEnv('executions.maxTimeout')) * 1000; // as seconds
                // Start timeout already now but give process at least 5 seconds to start.
                // Without it could would it be possible that the workflow executions times out before it even got started if
                // the timeout time is very short as the process start time can be quite long.
                executionTimeout = setTimeout(processTimeoutFunction, Math.max(5000, workflowTimeout), workflowTimeout);
            }
            // Create a list of child spawned executions
            // If after the child process exits we have
            // outstanding executions, we remove them
            const childExecutionIds = [];
            // Listen to data from the subprocess
            subprocess.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
                n8n_workflow_1.LoggerProxy.debug(`Received child process message of type ${message.type} for execution ID ${executionId}.`, { executionId });
                if (message.type === 'start') {
                    // Now that the execution actually started set the timeout again so that does not time out to early.
                    startedAt = new Date();
                    if (workflowTimeout > 0) {
                        clearTimeout(executionTimeout);
                        executionTimeout = setTimeout(processTimeoutFunction, workflowTimeout, workflowTimeout);
                    }
                }
                else if (message.type === 'end') {
                    clearTimeout(executionTimeout);
                    this.activeExecutions.remove(executionId, message.data.runData);
                }
                else if (message.type === 'sendResponse') {
                    if (responsePromise) {
                        responsePromise.resolve(_1.WebhookHelpers.decodeWebhookResponse(message.data.response));
                    }
                }
                else if (message.type === 'sendMessageToUI') {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    _1.WorkflowExecuteAdditionalData.sendMessageToUI.bind({ sessionId: data.sessionId })(message.data.source, message.data.message);
                }
                else if (message.type === 'processError') {
                    clearTimeout(executionTimeout);
                    const executionError = message.data.executionError;
                    yield this.processError(executionError, startedAt, data.executionMode, executionId, workflowHooks);
                }
                else if (message.type === 'processHook') {
                    this.processHookMessage(workflowHooks, message.data);
                }
                else if (message.type === 'timeout') {
                    // Execution timed out and its process has been terminated
                    const timeoutError = new n8n_workflow_1.WorkflowOperationError('Workflow execution timed out!');
                    // No need to add hook here as the subprocess takes care of calling the hooks
                    this.processError(timeoutError, startedAt, data.executionMode, executionId);
                }
                else if (message.type === 'startExecution') {
                    const executionId = yield this.activeExecutions.add(message.data.runData);
                    childExecutionIds.push(executionId);
                    subprocess.send({ type: 'executionId', data: { executionId } });
                }
                else if (message.type === 'finishExecution') {
                    const executionIdIndex = childExecutionIds.indexOf(message.data.executionId);
                    if (executionIdIndex !== -1) {
                        childExecutionIds.splice(executionIdIndex, 1);
                    }
                    // eslint-disable-next-line @typescript-eslint/await-thenable
                    yield this.activeExecutions.remove(message.data.executionId, message.data.result);
                }
            }));
            // Also get informed when the processes does exit especially when it did crash or timed out
            subprocess.on('exit', (code, signal) => __awaiter(this, void 0, void 0, function* () {
                if (signal === 'SIGTERM') {
                    n8n_workflow_1.LoggerProxy.debug(`Subprocess for execution ID ${executionId} timed out.`, { executionId });
                    // Execution timed out and its process has been terminated
                    const timeoutError = new n8n_workflow_1.WorkflowOperationError('Workflow execution timed out!');
                    yield this.processError(timeoutError, startedAt, data.executionMode, executionId, workflowHooks);
                }
                else if (code !== 0) {
                    n8n_workflow_1.LoggerProxy.debug(`Subprocess for execution ID ${executionId} finished with error code ${code}.`, { executionId });
                    // Process did exit with error code, so something went wrong.
                    const executionError = new n8n_workflow_1.WorkflowOperationError('Workflow execution process did crash for an unknown reason!');
                    yield this.processError(executionError, startedAt, data.executionMode, executionId, workflowHooks);
                }
                for (const executionId of childExecutionIds) {
                    // When the child process exits, if we still have
                    // pending child executions, we mark them as finished
                    // They will display as unknown to the user
                    // Instead of pending forever as executing when it
                    // actually isn't anymore.
                    // eslint-disable-next-line @typescript-eslint/await-thenable, no-await-in-loop
                    yield this.activeExecutions.remove(executionId);
                }
                clearTimeout(executionTimeout);
            }));
            return executionId;
        });
    }
}
exports.WorkflowRunner = WorkflowRunner;

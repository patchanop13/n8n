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
exports.WorkflowRunnerProcess = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/unbound-method */
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const _1 = require(".");
const Logger_1 = require("./Logger");
const config_1 = __importDefault(require("../config"));
const InternalHooksManager_1 = require("./InternalHooksManager");
const UserManagementHelper_1 = require("./UserManagement/UserManagementHelper");
class WorkflowRunnerProcess {
    constructor() {
        this.startedAt = new Date();
        this.childExecutions = {};
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static stopProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => {
                // Attempt a graceful shutdown, giving executions 30 seconds to finish
                process.exit(0);
            }, 30000);
        });
    }
    runWorkflow(inputData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            process.on('SIGTERM', WorkflowRunnerProcess.stopProcess);
            process.on('SIGINT', WorkflowRunnerProcess.stopProcess);
            // eslint-disable-next-line no-multi-assign
            const logger = (this.logger = (0, Logger_1.getLogger)());
            n8n_workflow_1.LoggerProxy.init(logger);
            this.data = inputData;
            const { userId } = inputData;
            logger.verbose('Initializing n8n sub-process', {
                pid: process.pid,
                workflowId: this.data.workflowData.id,
            });
            let className;
            let tempNode;
            let tempCredential;
            let filePath;
            this.startedAt = new Date();
            // Load the required nodes
            const nodeTypesData = {};
            // eslint-disable-next-line no-restricted-syntax
            for (const nodeTypeName of Object.keys(this.data.nodeTypeData)) {
                className = this.data.nodeTypeData[nodeTypeName].className;
                filePath = this.data.nodeTypeData[nodeTypeName].sourcePath;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
                const tempModule = require(filePath);
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    const nodeObject = new tempModule[className]();
                    if (nodeObject.getNodeType !== undefined) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        tempNode = nodeObject.getNodeType();
                    }
                    else {
                        tempNode = nodeObject;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    tempNode = new tempModule[className]();
                }
                catch (error) {
                    throw new Error(`Error loading node "${nodeTypeName}" from: "${filePath}"`);
                }
                nodeTypesData[nodeTypeName] = {
                    type: tempNode,
                    sourcePath: filePath,
                };
            }
            const nodeTypes = (0, _1.NodeTypes)();
            yield nodeTypes.init(nodeTypesData);
            // Load the required credentials
            const credentialsTypeData = {};
            // eslint-disable-next-line no-restricted-syntax
            for (const credentialTypeName of Object.keys(this.data.credentialsTypeData)) {
                className = this.data.credentialsTypeData[credentialTypeName].className;
                filePath = this.data.credentialsTypeData[credentialTypeName].sourcePath;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
                const tempModule = require(filePath);
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    tempCredential = new tempModule[className]();
                }
                catch (error) {
                    throw new Error(`Error loading credential "${credentialTypeName}" from: "${filePath}"`);
                }
                credentialsTypeData[credentialTypeName] = {
                    type: tempCredential,
                    sourcePath: filePath,
                };
            }
            // Init credential types the workflow uses (is needed to apply default values to credentials)
            const credentialTypes = (0, _1.CredentialTypes)();
            yield credentialTypes.init(credentialsTypeData);
            // Load the credentials overwrites if any exist
            const credentialsOverwrites = (0, _1.CredentialsOverwrites)();
            yield credentialsOverwrites.init(inputData.credentialsOverwrite);
            // Load all external hooks
            const externalHooks = (0, _1.ExternalHooks)();
            yield externalHooks.init();
            const instanceId = (_a = (yield n8n_core_1.UserSettings.prepareUserSettings()).instanceId) !== null && _a !== void 0 ? _a : '';
            const { cli } = yield _1.GenericHelpers.getVersions();
            InternalHooksManager_1.InternalHooksManager.init(instanceId, cli, nodeTypes);
            const binaryDataConfig = config_1.default.getEnv('binaryDataManager');
            yield n8n_core_1.BinaryDataManager.init(binaryDataConfig);
            // Credentials should now be loaded from database.
            // We check if any node uses credentials. If it does, then
            // init database.
            let shouldInitializaDb = false;
            // eslint-disable-next-line array-callback-return
            inputData.workflowData.nodes.map((node) => {
                if (Object.keys(node.credentials === undefined ? {} : node.credentials).length > 0) {
                    shouldInitializaDb = true;
                }
            });
            // This code has been split into 4 ifs just to make it easier to understand
            // Can be made smaller but in the end it will make it impossible to read.
            if (shouldInitializaDb) {
                // initialize db as we need to load credentials
                yield _1.Db.init();
            }
            else if (inputData.workflowData.settings !== undefined &&
                inputData.workflowData.settings.saveExecutionProgress === true) {
                // Workflow settings specifying it should save
                yield _1.Db.init();
            }
            else if (inputData.workflowData.settings !== undefined &&
                inputData.workflowData.settings.saveExecutionProgress !== false &&
                config_1.default.getEnv('executions.saveExecutionProgress')) {
                // Workflow settings not saying anything about saving but default settings says so
                yield _1.Db.init();
            }
            else if (inputData.workflowData.settings === undefined &&
                config_1.default.getEnv('executions.saveExecutionProgress')) {
                // Workflow settings not saying anything about saving but default settings says so
                yield _1.Db.init();
            }
            // Start timeout for the execution
            let workflowTimeout = config_1.default.getEnv('executions.timeout'); // initialize with default
            // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
            if (this.data.workflowData.settings && this.data.workflowData.settings.executionTimeout) {
                workflowTimeout = this.data.workflowData.settings.executionTimeout; // preference on workflow setting
            }
            if (workflowTimeout > 0) {
                workflowTimeout = Math.min(workflowTimeout, config_1.default.getEnv('executions.maxTimeout'));
            }
            this.workflow = new n8n_workflow_1.Workflow({
                id: this.data.workflowData.id,
                name: this.data.workflowData.name,
                nodes: this.data.workflowData.nodes,
                connections: this.data.workflowData.connections,
                active: this.data.workflowData.active,
                nodeTypes,
                staticData: this.data.workflowData.staticData,
                settings: this.data.workflowData.settings,
            });
            yield (0, UserManagementHelper_1.checkPermissionsForExecution)(this.workflow, userId);
            const additionalData = yield _1.WorkflowExecuteAdditionalData.getBase(userId, undefined, workflowTimeout <= 0 ? undefined : Date.now() + workflowTimeout * 1000);
            additionalData.hooks = this.getProcessForwardHooks();
            additionalData.hooks.hookFunctions.sendResponse = [
                (response) => __awaiter(this, void 0, void 0, function* () {
                    yield sendToParentProcess('sendResponse', {
                        response: _1.WebhookHelpers.encodeWebhookResponse(response),
                    });
                }),
            ];
            additionalData.executionId = inputData.executionId;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            additionalData.sendMessageToUI = (source, message) => __awaiter(this, void 0, void 0, function* () {
                if (workflowRunner.data.executionMode !== 'manual') {
                    return;
                }
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    yield sendToParentProcess('sendMessageToUI', { source, message });
                }
                catch (error) {
                    this.logger.error(
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                    `There was a problem sending UI data to parent process: "${error.message}"`);
                }
            });
            const executeWorkflowFunction = additionalData.executeWorkflow;
            additionalData.executeWorkflow = (workflowInfo, additionalData, inputData) => __awaiter(this, void 0, void 0, function* () {
                const workflowData = yield _1.WorkflowExecuteAdditionalData.getWorkflowData(workflowInfo, userId);
                const runData = yield _1.WorkflowExecuteAdditionalData.getRunData(workflowData, additionalData.userId, inputData);
                yield sendToParentProcess('startExecution', { runData });
                const executionId = yield new Promise((resolve) => {
                    this.executionIdCallback = (executionId) => {
                        resolve(executionId);
                    };
                });
                let result;
                try {
                    const executeWorkflowFunctionOutput = (yield executeWorkflowFunction(workflowInfo, additionalData, inputData, executionId, workflowData, runData));
                    const { workflowExecute } = executeWorkflowFunctionOutput;
                    this.childExecutions[executionId] = executeWorkflowFunctionOutput;
                    const { workflow } = executeWorkflowFunctionOutput;
                    result = yield workflowExecute.processRunExecutionData(workflow);
                    yield externalHooks.run('workflow.postExecute', [result, workflowData, executionId]);
                    void InternalHooksManager_1.InternalHooksManager.getInstance().onWorkflowPostExecute(executionId, workflowData, result, additionalData.userId);
                    yield sendToParentProcess('finishExecution', { executionId, result });
                    delete this.childExecutions[executionId];
                }
                catch (e) {
                    yield sendToParentProcess('finishExecution', { executionId });
                    delete this.childExecutions[executionId];
                    // Throw same error we had
                    throw e;
                }
                yield sendToParentProcess('finishExecution', { executionId, result });
                const returnData = _1.WorkflowHelpers.getDataLastExecutedNodeData(result);
                if (returnData.error) {
                    const error = new Error(returnData.error.message);
                    error.stack = returnData.error.stack;
                    throw error;
                }
                return returnData.data.main;
            });
            if (this.data.executionData !== undefined) {
                this.workflowExecute = new n8n_core_1.WorkflowExecute(additionalData, this.data.executionMode, this.data.executionData);
                return this.workflowExecute.processRunExecutionData(this.workflow);
            }
            if (this.data.runData === undefined ||
                this.data.startNodes === undefined ||
                this.data.startNodes.length === 0 ||
                this.data.destinationNode === undefined) {
                // Execute all nodes
                // Can execute without webhook so go on
                this.workflowExecute = new n8n_core_1.WorkflowExecute(additionalData, this.data.executionMode);
                return this.workflowExecute.run(this.workflow, undefined, this.data.destinationNode);
            }
            // Execute only the nodes between start and destination nodes
            this.workflowExecute = new n8n_core_1.WorkflowExecute(additionalData, this.data.executionMode);
            return this.workflowExecute.runPartialWorkflow(this.workflow, this.data.runData, this.data.startNodes, this.data.destinationNode);
        });
    }
    /**
     * Sends hook data to the parent process that it executes them
     *
     * @param {string} hook
     * @param {any[]} parameters
     * @memberof WorkflowRunnerProcess
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    sendHookToParentProcess(hook, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield sendToParentProcess('processHook', {
                    hook,
                    parameters,
                });
            }
            catch (error) {
                this.logger.error(`There was a problem sending hook: "${hook}"`, { parameters, error });
            }
        });
    }
    /**
     * Create a wrapper for hooks which simply forwards the data to
     * the parent process where they then can be executed with access
     * to database and to PushService
     *
     * @returns
     */
    getProcessForwardHooks() {
        const hookFunctions = {
            nodeExecuteBefore: [
                (nodeName) => __awaiter(this, void 0, void 0, function* () {
                    yield this.sendHookToParentProcess('nodeExecuteBefore', [nodeName]);
                }),
            ],
            nodeExecuteAfter: [
                (nodeName, data) => __awaiter(this, void 0, void 0, function* () {
                    yield this.sendHookToParentProcess('nodeExecuteAfter', [nodeName, data]);
                }),
            ],
            workflowExecuteBefore: [
                () => __awaiter(this, void 0, void 0, function* () {
                    yield this.sendHookToParentProcess('workflowExecuteBefore', []);
                }),
            ],
            workflowExecuteAfter: [
                (fullRunData, newStaticData) => __awaiter(this, void 0, void 0, function* () {
                    yield this.sendHookToParentProcess('workflowExecuteAfter', [fullRunData, newStaticData]);
                }),
            ],
        };
        const preExecuteFunctions = _1.WorkflowExecuteAdditionalData.hookFunctionsPreExecute();
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(preExecuteFunctions)) {
            if (hookFunctions[key] === undefined) {
                hookFunctions[key] = [];
            }
            hookFunctions[key].push.apply(hookFunctions[key], preExecuteFunctions[key]);
        }
        return new n8n_workflow_1.WorkflowHooks(hookFunctions, this.data.executionMode, this.data.executionId, this.data.workflowData, { sessionId: this.data.sessionId, retryOf: this.data.retryOf });
    }
}
exports.WorkflowRunnerProcess = WorkflowRunnerProcess;
/**
 * Sends data to parent process
 *
 * @param {string} type The type of data to send
 * @param {*} data The data
 * @returns {Promise<void>}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sendToParentProcess(type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            process.send({
                type,
                data,
            }, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });
    });
}
const workflowRunner = new WorkflowRunnerProcess();
// Listen to messages from parent process which send the data of
// the worflow to process
process.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (message.type === 'startWorkflow') {
            yield sendToParentProcess('start', {});
            const runData = yield workflowRunner.runWorkflow(message.data);
            yield sendToParentProcess('end', {
                runData,
            });
            // Once the workflow got executed make sure the process gets killed again
            process.exit();
        }
        else if (message.type === 'stopExecution' || message.type === 'timeout') {
            // The workflow execution should be stopped
            let runData;
            if (workflowRunner.workflowExecute !== undefined) {
                const executionIds = Object.keys(workflowRunner.childExecutions);
                // eslint-disable-next-line no-restricted-syntax
                for (const executionId of executionIds) {
                    const childWorkflowExecute = workflowRunner.childExecutions[executionId];
                    runData = childWorkflowExecute.workflowExecute.getFullRunData(workflowRunner.childExecutions[executionId].startedAt);
                    const timeOutError = message.type === 'timeout'
                        ? new n8n_workflow_1.WorkflowOperationError('Workflow execution timed out!')
                        : new n8n_workflow_1.WorkflowOperationError('Workflow-Execution has been canceled!');
                    // If there is any data send it to parent process, if execution timedout add the error
                    // eslint-disable-next-line no-await-in-loop
                    yield childWorkflowExecute.workflowExecute.processSuccessExecution(workflowRunner.childExecutions[executionId].startedAt, childWorkflowExecute.workflow, timeOutError);
                }
                // Workflow started already executing
                runData = workflowRunner.workflowExecute.getFullRunData(workflowRunner.startedAt);
                const timeOutError = message.type === 'timeout'
                    ? new n8n_workflow_1.WorkflowOperationError('Workflow execution timed out!')
                    : new n8n_workflow_1.WorkflowOperationError('Workflow-Execution has been canceled!');
                // If there is any data send it to parent process, if execution timedout add the error
                yield workflowRunner.workflowExecute.processSuccessExecution(workflowRunner.startedAt, workflowRunner.workflow, timeOutError);
            }
            else {
                // Workflow did not get started yet
                runData = {
                    data: {
                        resultData: {
                            runData: {},
                        },
                    },
                    finished: false,
                    mode: workflowRunner.data
                        ? workflowRunner.data.executionMode
                        : 'own',
                    startedAt: workflowRunner.startedAt,
                    stoppedAt: new Date(),
                };
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                workflowRunner.sendHookToParentProcess('workflowExecuteAfter', [runData]);
            }
            yield sendToParentProcess(message.type === 'timeout' ? message.type : 'end', {
                runData,
            });
            // Stop process
            process.exit();
        }
        else if (message.type === 'executionId') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            workflowRunner.executionIdCallback(message.data.executionId);
        }
    }
    catch (error) {
        // Catch all uncaught errors and forward them to parent process
        const executionError = Object.assign(Object.assign({}, error), { name: error.name || 'Error', message: error.message, stack: error.stack });
        yield sendToParentProcess('processError', {
            executionError,
        });
        process.exit();
    }
}));

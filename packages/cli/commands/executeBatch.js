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
exports.ExecuteBatch = void 0;
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-console */
const fs_1 = __importDefault(require("fs"));
const command_1 = require("@oclif/command");
const n8n_core_1 = require("n8n-core");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const n8n_workflow_1 = require("n8n-workflow");
const path_1 = require("path");
const json_diff_1 = require("json-diff");
// eslint-disable-next-line import/no-extraneous-dependencies
const lodash_1 = require("lodash");
const Logger_1 = require("../src/Logger");
const src_1 = require("../src");
const config_1 = __importDefault(require("../config"));
const UserManagementHelper_1 = require("../src/UserManagement/UserManagementHelper");
class ExecuteBatch extends command_1.Command {
    /**
     * Gracefully handles exit.
     * @param {boolean} skipExit Whether to skip exit or number according to received signal
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static stopProcess(skipExit = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ExecuteBatch.cancelled) {
                process.exit(0);
            }
            ExecuteBatch.cancelled = true;
            const activeExecutionsInstance = src_1.ActiveExecutions.getInstance();
            const stopPromises = activeExecutionsInstance.getActiveExecutions().map((execution) => __awaiter(this, void 0, void 0, function* () {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                activeExecutionsInstance.stopExecution(execution.id);
            }));
            yield Promise.allSettled(stopPromises);
            setTimeout(() => {
                process.exit(0);
            }, 30000);
            let executingWorkflows = activeExecutionsInstance.getActiveExecutions();
            let count = 0;
            while (executingWorkflows.length !== 0) {
                if (count++ % 4 === 0) {
                    console.log(`Waiting for ${executingWorkflows.length} active executions to finish...`);
                    executingWorkflows.map((execution) => {
                        console.log(` - Execution ID ${execution.id}, workflow ID: ${execution.workflowId}`);
                    });
                }
                // eslint-disable-next-line no-await-in-loop
                yield new Promise((resolve) => {
                    setTimeout(resolve, 500);
                });
                executingWorkflows = activeExecutionsInstance.getActiveExecutions();
            }
            // We may receive true but when called from `process.on`
            // we get the signal (SIGNIT, etc.)
            if (skipExit !== true) {
                process.exit(0);
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    formatJsonOutput(data) {
        return JSON.stringify(data, null, 2);
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    shouldBeConsideredAsWarning(errorMessage) {
        const warningStrings = [
            'refresh token is invalid',
            'unable to connect to',
            'econnreset',
            '429',
            'econnrefused',
            'missing a required parameter',
            'insufficient credit balance',
            'request timed out',
            'status code 401',
        ];
        // eslint-disable-next-line no-param-reassign
        errorMessage = errorMessage.toLowerCase();
        for (let i = 0; i < warningStrings.length; i++) {
            if (errorMessage.includes(warningStrings[i])) {
                return true;
            }
        }
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            process.on('SIGTERM', ExecuteBatch.stopProcess);
            process.on('SIGINT', ExecuteBatch.stopProcess);
            const logger = (0, Logger_1.getLogger)();
            n8n_workflow_1.LoggerProxy.init(logger);
            const binaryDataConfig = config_1.default.getEnv('binaryDataManager');
            yield n8n_core_1.BinaryDataManager.init(binaryDataConfig, true);
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { flags } = this.parse(ExecuteBatch);
            ExecuteBatch.debug = flags.debug;
            ExecuteBatch.concurrency = flags.concurrency || 1;
            const ids = [];
            const skipIds = [];
            if (flags.snapshot !== undefined) {
                if (fs_1.default.existsSync(flags.snapshot)) {
                    if (!fs_1.default.lstatSync(flags.snapshot).isDirectory()) {
                        console.log(`The parameter --snapshot must be an existing directory`);
                        return;
                    }
                }
                else {
                    console.log(`The parameter --snapshot must be an existing directory`);
                    return;
                }
                ExecuteBatch.snapshot = flags.snapshot;
            }
            if (flags.compare !== undefined) {
                if (fs_1.default.existsSync(flags.compare)) {
                    if (!fs_1.default.lstatSync(flags.compare).isDirectory()) {
                        console.log(`The parameter --compare must be an existing directory`);
                        return;
                    }
                }
                else {
                    console.log(`The parameter --compare must be an existing directory`);
                    return;
                }
                ExecuteBatch.compare = flags.compare;
            }
            if (flags.output !== undefined) {
                if (fs_1.default.existsSync(flags.output)) {
                    if (fs_1.default.lstatSync(flags.output).isDirectory()) {
                        console.log(`The parameter --output must be a writable file`);
                        return;
                    }
                }
            }
            if (flags.ids !== undefined) {
                if (fs_1.default.existsSync(flags.ids)) {
                    const contents = fs_1.default.readFileSync(flags.ids, { encoding: 'utf-8' });
                    ids.push(...contents.split(',').map((id) => parseInt(id.trim(), 10)));
                }
                else {
                    const paramIds = flags.ids.split(',');
                    const re = /\d+/;
                    const matchedIds = paramIds
                        .filter((id) => re.exec(id))
                        .map((id) => parseInt(id.trim(), 10));
                    if (matchedIds.length === 0) {
                        console.log(`The parameter --ids must be a list of numeric IDs separated by a comma or a file with this content.`);
                        return;
                    }
                    ids.push(...matchedIds);
                }
            }
            if (flags.skipList !== undefined) {
                if (fs_1.default.existsSync(flags.skipList)) {
                    const contents = fs_1.default.readFileSync(flags.skipList, { encoding: 'utf-8' });
                    skipIds.push(...contents.split(',').map((id) => parseInt(id.trim(), 10)));
                }
                else {
                    console.log('Skip list file not found. Exiting.');
                    return;
                }
            }
            if (flags.shallow) {
                ExecuteBatch.shallow = true;
            }
            // Start directly with the init of the database to improve startup time
            const startDbInitPromise = src_1.Db.init();
            // Load all node and credential types
            const loadNodesAndCredentials = (0, src_1.LoadNodesAndCredentials)();
            const loadNodesAndCredentialsPromise = loadNodesAndCredentials.init();
            // Make sure the settings exist
            yield n8n_core_1.UserSettings.prepareUserSettings();
            // Wait till the database is ready
            yield startDbInitPromise;
            ExecuteBatch.instanceOwner = yield (0, UserManagementHelper_1.getInstanceOwner)();
            let allWorkflows;
            const query = src_1.Db.collections.Workflow.createQueryBuilder('workflows');
            if (ids.length > 0) {
                query.andWhere(`workflows.id in (:...ids)`, { ids });
            }
            if (skipIds.length > 0) {
                query.andWhere(`workflows.id not in (:...skipIds)`, { skipIds });
            }
            // eslint-disable-next-line prefer-const
            allWorkflows = (yield query.getMany());
            if (ExecuteBatch.debug) {
                process.stdout.write(`Found ${allWorkflows.length} workflows to execute.\n`);
            }
            // Wait till the n8n-packages have been read
            yield loadNodesAndCredentialsPromise;
            // Load the credentials overwrites if any exist
            yield (0, src_1.CredentialsOverwrites)().init();
            // Load all external hooks
            const externalHooks = (0, src_1.ExternalHooks)();
            yield externalHooks.init();
            // Add the found types to an instance other parts of the application can use
            const nodeTypes = (0, src_1.NodeTypes)();
            yield nodeTypes.init(loadNodesAndCredentials.nodeTypes);
            const credentialTypes = (0, src_1.CredentialTypes)();
            yield credentialTypes.init(loadNodesAndCredentials.credentialTypes);
            const instanceId = yield n8n_core_1.UserSettings.getInstanceId();
            const { cli } = yield src_1.GenericHelpers.getVersions();
            src_1.InternalHooksManager.init(instanceId, cli, nodeTypes);
            // Send a shallow copy of allWorkflows so we still have all workflow data.
            const results = yield this.runTests([...allWorkflows]);
            let { retries } = flags;
            while (retries > 0 &&
                results.summary.warningExecutions + results.summary.failedExecutions > 0 &&
                !ExecuteBatch.cancelled) {
                const failedWorkflowIds = results.summary.errors.map((execution) => execution.workflowId);
                failedWorkflowIds.push(...results.summary.warnings.map((execution) => execution.workflowId));
                const newWorkflowList = allWorkflows.filter((workflow) => failedWorkflowIds.includes(workflow.id));
                // eslint-disable-next-line no-await-in-loop
                const retryResults = yield this.runTests(newWorkflowList);
                this.mergeResults(results, retryResults);
                // By now, `results` has been updated with the new successful executions.
                retries--;
            }
            if (flags.output !== undefined) {
                fs_1.default.writeFileSync(flags.output, this.formatJsonOutput(results));
                console.log('\nExecution finished.');
                console.log('Summary:');
                console.log(`\tSuccess: ${results.summary.successfulExecutions}`);
                console.log(`\tFailures: ${results.summary.failedExecutions}`);
                console.log(`\tWarnings: ${results.summary.warningExecutions}`);
                console.log('\nNodes successfully tested:');
                Object.entries(results.coveredNodes).forEach(([nodeName, nodeCount]) => {
                    console.log(`\t${nodeName}: ${nodeCount}`);
                });
                console.log('\nCheck the JSON file for more details.');
            }
            else if (flags.shortOutput) {
                console.log(this.formatJsonOutput(Object.assign(Object.assign({}, results), { executions: results.executions.filter((execution) => execution.executionStatus !== 'success') })));
            }
            else {
                console.log(this.formatJsonOutput(results));
            }
            yield ExecuteBatch.stopProcess(true);
            if (results.summary.failedExecutions > 0) {
                this.exit(1);
            }
            this.exit(0);
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    mergeResults(results, retryResults) {
        if (retryResults.summary.successfulExecutions === 0) {
            // Nothing to replace.
            return;
        }
        // Find successful executions and replace them on previous result.
        retryResults.executions.forEach((newExecution) => {
            if (newExecution.executionStatus === 'success') {
                // Remove previous execution from list.
                results.executions = results.executions.filter((previousExecutions) => previousExecutions.workflowId !== newExecution.workflowId);
                const errorIndex = results.summary.errors.findIndex((summaryInformation) => summaryInformation.workflowId === newExecution.workflowId);
                if (errorIndex !== -1) {
                    // This workflow errored previously. Decrement error count.
                    results.summary.failedExecutions--;
                    // Remove from the list of errors.
                    results.summary.errors.splice(errorIndex, 1);
                }
                const warningIndex = results.summary.warnings.findIndex((summaryInformation) => summaryInformation.workflowId === newExecution.workflowId);
                if (warningIndex !== -1) {
                    // This workflow errored previously. Decrement error count.
                    results.summary.warningExecutions--;
                    // Remove from the list of errors.
                    results.summary.warnings.splice(warningIndex, 1);
                }
                // Increment successful executions count and push it to all executions array.
                results.summary.successfulExecutions++;
                results.executions.push(newExecution);
            }
        });
    }
    runTests(allWorkflows) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {
                totalWorkflows: allWorkflows.length,
                summary: {
                    failedExecutions: 0,
                    warningExecutions: 0,
                    successfulExecutions: 0,
                    errors: [],
                    warnings: [],
                },
                coveredNodes: {},
                executions: [],
            };
            if (ExecuteBatch.debug) {
                this.initializeLogs();
            }
            return new Promise((res) => __awaiter(this, void 0, void 0, function* () {
                const promisesArray = [];
                for (let i = 0; i < ExecuteBatch.concurrency; i++) {
                    const promise = new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        let workflow;
                        while (allWorkflows.length > 0) {
                            workflow = allWorkflows.shift();
                            if (ExecuteBatch.cancelled) {
                                process.stdout.write(`Thread ${i + 1} resolving and quitting.`);
                                resolve(true);
                                break;
                            }
                            // This if shouldn't be really needed
                            // but it's a concurrency precaution.
                            if (workflow === undefined) {
                                resolve(true);
                                return;
                            }
                            if (ExecuteBatch.debug) {
                                ExecuteBatch.workflowExecutionsProgress[i].push({
                                    workflowId: workflow.id,
                                    status: 'running',
                                });
                                this.updateStatus();
                            }
                            // eslint-disable-next-line @typescript-eslint/no-loop-func
                            yield this.startThread(workflow).then((executionResult) => {
                                if (ExecuteBatch.debug) {
                                    ExecuteBatch.workflowExecutionsProgress[i].pop();
                                }
                                result.executions.push(executionResult);
                                if (executionResult.executionStatus === 'success') {
                                    if (ExecuteBatch.debug) {
                                        ExecuteBatch.workflowExecutionsProgress[i].push({
                                            workflowId: workflow.id,
                                            status: 'success',
                                        });
                                        this.updateStatus();
                                    }
                                    result.summary.successfulExecutions++;
                                    const nodeNames = Object.keys(executionResult.coveredNodes);
                                    nodeNames.map((nodeName) => {
                                        if (result.coveredNodes[nodeName] === undefined) {
                                            result.coveredNodes[nodeName] = 0;
                                        }
                                        result.coveredNodes[nodeName] += executionResult.coveredNodes[nodeName];
                                    });
                                }
                                else if (executionResult.executionStatus === 'warning') {
                                    result.summary.warningExecutions++;
                                    result.summary.warnings.push({
                                        workflowId: executionResult.workflowId,
                                        error: executionResult.error,
                                    });
                                    if (ExecuteBatch.debug) {
                                        ExecuteBatch.workflowExecutionsProgress[i].push({
                                            workflowId: workflow.id,
                                            status: 'warning',
                                        });
                                        this.updateStatus();
                                    }
                                }
                                else if (executionResult.executionStatus === 'error') {
                                    result.summary.failedExecutions++;
                                    result.summary.errors.push({
                                        workflowId: executionResult.workflowId,
                                        error: executionResult.error,
                                    });
                                    if (ExecuteBatch.debug) {
                                        ExecuteBatch.workflowExecutionsProgress[i].push({
                                            workflowId: workflow.id,
                                            status: 'error',
                                        });
                                        this.updateStatus();
                                    }
                                }
                                else {
                                    throw new Error('Wrong execution status - cannot proceed');
                                }
                            });
                        }
                        resolve(true);
                    }));
                    promisesArray.push(promise);
                }
                yield Promise.allSettled(promisesArray);
                res(result);
            }));
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    updateStatus() {
        if (ExecuteBatch.cancelled) {
            return;
        }
        if (process.stdout.isTTY) {
            process.stdout.moveCursor(0, -ExecuteBatch.concurrency);
            process.stdout.cursorTo(0);
            process.stdout.clearLine(0);
        }
        ExecuteBatch.workflowExecutionsProgress.map((concurrentThread, index) => {
            let message = `${index + 1}: `;
            concurrentThread.map((executionItem, workflowIndex) => {
                let openColor = '\x1b[0m';
                const closeColor = '\x1b[0m';
                switch (executionItem.status) {
                    case 'success':
                        openColor = '\x1b[32m';
                        break;
                    case 'error':
                        openColor = '\x1b[31m';
                        break;
                    case 'warning':
                        openColor = '\x1b[33m';
                        break;
                    default:
                        break;
                }
                message += `${workflowIndex > 0 ? ', ' : ''}${openColor}${executionItem.workflowId}${closeColor}`;
            });
            if (process.stdout.isTTY) {
                process.stdout.cursorTo(0);
                process.stdout.clearLine(0);
            }
            process.stdout.write(`${message}\n`);
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    initializeLogs() {
        process.stdout.write('**********************************************\n');
        process.stdout.write('              n8n test workflows\n');
        process.stdout.write('**********************************************\n');
        process.stdout.write('\n');
        process.stdout.write('Batch number:\n');
        ExecuteBatch.workflowExecutionsProgress = [];
        for (let i = 0; i < ExecuteBatch.concurrency; i++) {
            ExecuteBatch.workflowExecutionsProgress.push([]);
            process.stdout.write(`${i + 1}: \n`);
        }
    }
    startThread(workflowData) {
        return __awaiter(this, void 0, void 0, function* () {
            // This will be the object returned by the promise.
            // It will be updated according to execution progress below.
            const executionResult = {
                workflowId: workflowData.id,
                workflowName: workflowData.name,
                executionTime: 0,
                finished: false,
                executionStatus: 'running',
                coveredNodes: {},
            };
            const requiredNodeTypes = ['n8n-nodes-base.start'];
            let startNode;
            // eslint-disable-next-line no-restricted-syntax
            for (const node of workflowData.nodes) {
                if (requiredNodeTypes.includes(node.type)) {
                    startNode = node;
                    break;
                }
            }
            // We have a cool feature here.
            // On each node, on the Settings tab in the node editor you can change
            // the `Notes` field to add special cases for comparison and snapshots.
            // You need to set one configuration per line with the following possible keys:
            // CAP_RESULTS_LENGTH=x where x is a number. Cap the number of rows from this node to x.
            // This means if you set CAP_RESULTS_LENGTH=1 we will have only 1 row in the output
            // IGNORED_PROPERTIES=x,y,z where x, y and z are JSON property names. Removes these
            //    properties from the JSON object (useful for optional properties that can
            //    cause the comparison to detect changes when not true).
            const nodeEdgeCases = {};
            workflowData.nodes.forEach((node) => {
                executionResult.coveredNodes[node.type] = (executionResult.coveredNodes[node.type] || 0) + 1;
                if (node.notes !== undefined && node.notes !== '') {
                    node.notes.split('\n').forEach((note) => {
                        const parts = note.split('=');
                        if (parts.length === 2) {
                            if (nodeEdgeCases[node.name] === undefined) {
                                nodeEdgeCases[node.name] = {};
                            }
                            if (parts[0] === 'CAP_RESULTS_LENGTH') {
                                nodeEdgeCases[node.name].capResults = parseInt(parts[1], 10);
                            }
                            else if (parts[0] === 'IGNORED_PROPERTIES') {
                                nodeEdgeCases[node.name].ignoredProperties = parts[1]
                                    .split(',')
                                    .map((property) => property.trim());
                            }
                            else if (parts[0] === 'KEEP_ONLY_PROPERTIES') {
                                nodeEdgeCases[node.name].keepOnlyProperties = parts[1]
                                    .split(',')
                                    .map((property) => property.trim());
                            }
                        }
                    });
                }
            });
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                if (startNode === undefined) {
                    // If the workflow does not contain a start-node we can not know what
                    // should be executed and with which data to start.
                    executionResult.error = 'Workflow cannot be started as it does not contain a "Start" node.';
                    executionResult.executionStatus = 'warning';
                    resolve(executionResult);
                }
                let gotCancel = false;
                // Timeouts execution after 5 minutes.
                const timeoutTimer = setTimeout(() => {
                    gotCancel = true;
                    executionResult.error = 'Workflow execution timed out.';
                    executionResult.executionStatus = 'warning';
                    resolve(executionResult);
                }, ExecuteBatch.executionTimeout);
                try {
                    const runData = {
                        executionMode: 'cli',
                        startNodes: [startNode.name],
                        workflowData,
                        userId: ExecuteBatch.instanceOwner.id,
                    };
                    const workflowRunner = new src_1.WorkflowRunner();
                    const executionId = yield workflowRunner.run(runData);
                    const activeExecutions = src_1.ActiveExecutions.getInstance();
                    const data = yield activeExecutions.getPostExecutePromise(executionId);
                    if (gotCancel || ExecuteBatch.cancelled) {
                        clearTimeout(timeoutTimer);
                        // The promise was settled already so we simply ignore.
                        return;
                    }
                    if (data === undefined) {
                        executionResult.error = 'Workflow did not return any data.';
                        executionResult.executionStatus = 'error';
                    }
                    else {
                        executionResult.executionTime =
                            (Date.parse(data.stoppedAt) -
                                Date.parse(data.startedAt)) /
                                1000;
                        executionResult.finished = (data === null || data === void 0 ? void 0 : data.finished) !== undefined;
                        if (data.data.resultData.error) {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-prototype-builtins
                            executionResult.error = data.data.resultData.error.hasOwnProperty('description')
                                ? // @ts-ignore
                                    data.data.resultData.error.description
                                : data.data.resultData.error.message;
                            if (data.data.resultData.lastNodeExecuted !== undefined) {
                                executionResult.error += ` on node ${data.data.resultData.lastNodeExecuted}`;
                            }
                            executionResult.executionStatus = 'error';
                            if (this.shouldBeConsideredAsWarning(executionResult.error || '')) {
                                executionResult.executionStatus = 'warning';
                            }
                        }
                        else {
                            if (ExecuteBatch.shallow) {
                                // What this does is guarantee that top-level attributes
                                // from the JSON are kept and the are the same type.
                                // We convert nested JSON objects to a simple {object:true}
                                // and we convert nested arrays to ['json array']
                                // This reduces the chance of false positives but may
                                // result in not detecting deeper changes.
                                Object.keys(data.data.resultData.runData).map((nodeName) => {
                                    data.data.resultData.runData[nodeName].map((taskData) => {
                                        if (taskData.data === undefined) {
                                            return;
                                        }
                                        Object.keys(taskData.data).map((connectionName) => {
                                            const connection = taskData.data[connectionName];
                                            connection.map((executionDataArray) => {
                                                if (executionDataArray === null) {
                                                    return;
                                                }
                                                if (nodeEdgeCases[nodeName] !== undefined &&
                                                    nodeEdgeCases[nodeName].capResults !== undefined) {
                                                    executionDataArray.splice(nodeEdgeCases[nodeName].capResults);
                                                }
                                                executionDataArray.map((executionData) => {
                                                    if (executionData.json === undefined) {
                                                        return;
                                                    }
                                                    if (nodeEdgeCases[nodeName] !== undefined &&
                                                        nodeEdgeCases[nodeName].ignoredProperties !== undefined) {
                                                        nodeEdgeCases[nodeName].ignoredProperties.forEach((ignoredProperty) => delete executionData.json[ignoredProperty]);
                                                    }
                                                    let keepOnlyFields = [];
                                                    if (nodeEdgeCases[nodeName] !== undefined &&
                                                        nodeEdgeCases[nodeName].keepOnlyProperties !== undefined) {
                                                        keepOnlyFields = nodeEdgeCases[nodeName].keepOnlyProperties;
                                                    }
                                                    executionData.json =
                                                        keepOnlyFields.length > 0
                                                            ? (0, lodash_1.pick)(executionData.json, keepOnlyFields)
                                                            : executionData.json;
                                                    const jsonProperties = executionData.json;
                                                    const nodeOutputAttributes = Object.keys(jsonProperties);
                                                    nodeOutputAttributes.map((attributeName) => {
                                                        if (Array.isArray(jsonProperties[attributeName])) {
                                                            jsonProperties[attributeName] = ['json array'];
                                                        }
                                                        else if (typeof jsonProperties[attributeName] === 'object') {
                                                            jsonProperties[attributeName] = { object: true };
                                                        }
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                            else {
                                // If not using shallow comparison then we only treat nodeEdgeCases.
                                const specialCases = Object.keys(nodeEdgeCases);
                                specialCases.forEach((nodeName) => {
                                    data.data.resultData.runData[nodeName].map((taskData) => {
                                        if (taskData.data === undefined) {
                                            return;
                                        }
                                        Object.keys(taskData.data).map((connectionName) => {
                                            const connection = taskData.data[connectionName];
                                            connection.map((executionDataArray) => {
                                                if (executionDataArray === null) {
                                                    return;
                                                }
                                                if (nodeEdgeCases[nodeName].capResults !== undefined) {
                                                    executionDataArray.splice(nodeEdgeCases[nodeName].capResults);
                                                }
                                                if (nodeEdgeCases[nodeName].ignoredProperties !== undefined) {
                                                    executionDataArray.map((executionData) => {
                                                        if (executionData.json === undefined) {
                                                            return;
                                                        }
                                                        nodeEdgeCases[nodeName].ignoredProperties.forEach((ignoredProperty) => delete executionData.json[ignoredProperty]);
                                                    });
                                                }
                                            });
                                        });
                                    });
                                });
                            }
                            const serializedData = this.formatJsonOutput(data);
                            if (ExecuteBatch.compare === undefined) {
                                executionResult.executionStatus = 'success';
                            }
                            else {
                                const fileName = `${ExecuteBatch.compare.endsWith(path_1.sep)
                                    ? ExecuteBatch.compare
                                    : ExecuteBatch.compare + path_1.sep}${workflowData.id}-snapshot.json`;
                                if (fs_1.default.existsSync(fileName)) {
                                    const contents = fs_1.default.readFileSync(fileName, { encoding: 'utf-8' });
                                    const changes = (0, json_diff_1.diff)(JSON.parse(contents), data, { keysOnly: true });
                                    if (changes !== undefined) {
                                        // If we had only additions with no removals
                                        // Then we treat as a warning and not an error.
                                        // To find this, we convert the object to JSON
                                        // and search for the `__deleted` string
                                        const changesJson = JSON.stringify(changes);
                                        if (changesJson.includes('__deleted')) {
                                            // we have structural changes. Report them.
                                            executionResult.error = 'Workflow may contain breaking changes';
                                            executionResult.changes = changes;
                                            executionResult.executionStatus = 'error';
                                        }
                                        else {
                                            executionResult.error =
                                                'Workflow contains new data that previously did not exist.';
                                            executionResult.changes = changes;
                                            executionResult.executionStatus = 'warning';
                                        }
                                    }
                                    else {
                                        executionResult.executionStatus = 'success';
                                    }
                                }
                                else {
                                    executionResult.error = 'Snapshot for not found.';
                                    executionResult.executionStatus = 'warning';
                                }
                            }
                            // Save snapshots only after comparing - this is to make sure we're updating
                            // After comparing to existing verion.
                            if (ExecuteBatch.snapshot !== undefined) {
                                const fileName = `${ExecuteBatch.snapshot.endsWith(path_1.sep)
                                    ? ExecuteBatch.snapshot
                                    : ExecuteBatch.snapshot + path_1.sep}${workflowData.id}-snapshot.json`;
                                fs_1.default.writeFileSync(fileName, serializedData);
                            }
                        }
                    }
                }
                catch (e) {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                    executionResult.error = `Workflow failed to execute: ${e.message}`;
                    executionResult.executionStatus = 'error';
                }
                clearTimeout(timeoutTimer);
                resolve(executionResult);
            }));
        });
    }
}
exports.ExecuteBatch = ExecuteBatch;
ExecuteBatch.description = '\nExecutes multiple workflows once';
ExecuteBatch.cancelled = false;
ExecuteBatch.shallow = false;
ExecuteBatch.concurrency = 1;
ExecuteBatch.debug = false;
ExecuteBatch.executionTimeout = 3 * 60 * 1000;
ExecuteBatch.examples = [
    `$ n8n executeBatch`,
    `$ n8n executeBatch --concurrency=10 --skipList=/data/skipList.txt`,
    `$ n8n executeBatch --debug --output=/data/output.json`,
    `$ n8n executeBatch --ids=10,13,15 --shortOutput`,
    `$ n8n executeBatch --snapshot=/data/snapshots --shallow`,
    `$ n8n executeBatch --compare=/data/previousExecutionData --retries=2`,
];
ExecuteBatch.flags = {
    help: command_1.flags.help({ char: 'h' }),
    debug: command_1.flags.boolean({
        description: 'Toggles on displaying all errors and debug messages.',
    }),
    ids: command_1.flags.string({
        description: 'Specifies workflow IDs to get executed, separated by a comma or a file containing the ids',
    }),
    concurrency: command_1.flags.integer({
        default: 1,
        description: 'How many workflows can run in parallel. Defaults to 1 which means no concurrency.',
    }),
    output: command_1.flags.string({
        description: 'Enable execution saving, You must inform an existing folder to save execution via this param',
    }),
    snapshot: command_1.flags.string({
        description: 'Enables snapshot saving. You must inform an existing folder to save snapshots via this param.',
    }),
    compare: command_1.flags.string({
        description: 'Compares current execution with an existing snapshot. You must inform an existing folder where the snapshots are saved.',
    }),
    shallow: command_1.flags.boolean({
        description: 'Compares only if attributes output from node are the same, with no regards to neste JSON objects.',
    }),
    skipList: command_1.flags.string({
        description: 'File containing a comma separated list of workflow IDs to skip.',
    }),
    retries: command_1.flags.integer({
        description: 'Retries failed workflows up to N tries. Default is 1. Set 0 to disable.',
        default: 1,
    }),
    shortOutput: command_1.flags.boolean({
        description: 'Omits the full execution information from output, displaying only summary.',
    }),
};

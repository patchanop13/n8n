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
exports.Worker = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const command_1 = require("@oclif/command");
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const typeorm_1 = require("typeorm");
const src_1 = require("../src");
const Logger_1 = require("../src/Logger");
const config_1 = __importDefault(require("../config"));
const Queue = __importStar(require("../src/Queue"));
const UserManagementHelper_1 = require("../src/UserManagement/UserManagementHelper");
class Worker extends command_1.Command {
    // static activeExecutions = ActiveExecutions.getInstance();
    /**
     * Stoppes the n8n in a graceful way.
     * Make for example sure that all the webhooks from third party services
     * get removed.
     */
    static stopProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            n8n_workflow_1.LoggerProxy.info(`Stopping n8n...`);
            // Stop accepting new jobs
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Worker.jobQueue.pause(true);
            try {
                const externalHooks = (0, src_1.ExternalHooks)();
                yield externalHooks.run('n8n.stop', []);
                const maxStopTime = 30000;
                const stopTime = new Date().getTime() + maxStopTime;
                setTimeout(() => {
                    // In case that something goes wrong with shutdown we
                    // kill after max. 30 seconds no matter what
                    process.exit(Worker.processExistCode);
                }, maxStopTime);
                // Wait for active workflow executions to finish
                let count = 0;
                while (Object.keys(Worker.runningJobs).length !== 0) {
                    if (count++ % 4 === 0) {
                        const waitLeft = Math.ceil((stopTime - new Date().getTime()) / 1000);
                        n8n_workflow_1.LoggerProxy.info(`Waiting for ${Object.keys(Worker.runningJobs).length} active executions to finish... (wait ${waitLeft} more seconds)`);
                    }
                    // eslint-disable-next-line no-await-in-loop
                    yield new Promise((resolve) => {
                        setTimeout(resolve, 500);
                    });
                }
            }
            catch (error) {
                n8n_workflow_1.LoggerProxy.error('There was an error shutting down n8n.', error);
            }
            process.exit(Worker.processExistCode);
        });
    }
    runJob(job, nodeTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobData = job.data;
            const executionDb = yield src_1.Db.collections.Execution.findOne(jobData.executionId);
            if (!executionDb) {
                n8n_workflow_1.LoggerProxy.error(`Worker failed to find data of execution "${jobData.executionId}" in database. Cannot continue.`, {
                    executionId: jobData.executionId,
                });
                throw new Error(`Unable to find data of execution "${jobData.executionId}" in database. Aborting execution.`);
            }
            const currentExecutionDb = src_1.ResponseHelper.unflattenExecutionData(executionDb);
            n8n_workflow_1.LoggerProxy.info(`Start job: ${job.id} (Workflow ID: ${currentExecutionDb.workflowData.id} | Execution: ${jobData.executionId})`);
            const workflowOwner = yield (0, UserManagementHelper_1.getWorkflowOwner)(currentExecutionDb.workflowData.id.toString());
            let { staticData } = currentExecutionDb.workflowData;
            if (jobData.loadStaticData) {
                const findOptions = {
                    select: ['id', 'staticData'],
                };
                const workflowData = yield src_1.Db.collections.Workflow.findOne(currentExecutionDb.workflowData.id, findOptions);
                if (workflowData === undefined) {
                    n8n_workflow_1.LoggerProxy.error('Worker execution failed because workflow could not be found in database.', {
                        workflowId: currentExecutionDb.workflowData.id,
                        executionId: jobData.executionId,
                    });
                    throw new Error(`The workflow with the ID "${currentExecutionDb.workflowData.id}" could not be found`);
                }
                staticData = workflowData.staticData;
            }
            let workflowTimeout = config_1.default.getEnv('executions.timeout'); // initialize with default
            if (
            // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
            currentExecutionDb.workflowData.settings &&
                currentExecutionDb.workflowData.settings.executionTimeout) {
                workflowTimeout = currentExecutionDb.workflowData.settings.executionTimeout; // preference on workflow setting
            }
            let executionTimeoutTimestamp;
            if (workflowTimeout > 0) {
                workflowTimeout = Math.min(workflowTimeout, config_1.default.getEnv('executions.maxTimeout'));
                executionTimeoutTimestamp = Date.now() + workflowTimeout * 1000;
            }
            const workflow = new n8n_workflow_1.Workflow({
                id: currentExecutionDb.workflowData.id,
                name: currentExecutionDb.workflowData.name,
                nodes: currentExecutionDb.workflowData.nodes,
                connections: currentExecutionDb.workflowData.connections,
                active: currentExecutionDb.workflowData.active,
                nodeTypes,
                staticData,
                settings: currentExecutionDb.workflowData.settings,
            });
            yield (0, UserManagementHelper_1.checkPermissionsForExecution)(workflow, workflowOwner.id);
            const additionalData = yield src_1.WorkflowExecuteAdditionalData.getBase(workflowOwner.id, undefined, executionTimeoutTimestamp);
            additionalData.hooks = src_1.WorkflowExecuteAdditionalData.getWorkflowHooksWorkerExecuter(currentExecutionDb.mode, job.data.executionId, currentExecutionDb.workflowData, { retryOf: currentExecutionDb.retryOf });
            additionalData.hooks.hookFunctions.sendResponse = [
                (response) => __awaiter(this, void 0, void 0, function* () {
                    yield job.progress({
                        executionId: job.data.executionId,
                        response: src_1.WebhookHelpers.encodeWebhookResponse(response),
                    });
                }),
            ];
            additionalData.executionId = jobData.executionId;
            let workflowExecute;
            let workflowRun;
            if (currentExecutionDb.data !== undefined) {
                workflowExecute = new n8n_core_1.WorkflowExecute(additionalData, currentExecutionDb.mode, currentExecutionDb.data);
                workflowRun = workflowExecute.processRunExecutionData(workflow);
            }
            else {
                // Execute all nodes
                // Can execute without webhook so go on
                workflowExecute = new n8n_core_1.WorkflowExecute(additionalData, currentExecutionDb.mode);
                workflowRun = workflowExecute.run(workflow);
            }
            Worker.runningJobs[job.id] = workflowRun;
            // Wait till the execution is finished
            yield workflowRun;
            delete Worker.runningJobs[job.id];
            return {
                success: true,
            };
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = (0, Logger_1.getLogger)();
            n8n_workflow_1.LoggerProxy.init(logger);
            // eslint-disable-next-line no-console
            console.info('Starting n8n worker...');
            // Make sure that n8n shuts down gracefully if possible
            process.on('SIGTERM', Worker.stopProcess);
            process.on('SIGINT', Worker.stopProcess);
            // Wrap that the process does not close but we can still use async
            yield (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { flags } = this.parse(Worker);
                    // Start directly with the init of the database to improve startup time
                    const startDbInitPromise = src_1.Db.init().catch((error) => {
                        logger.error(`There was an error initializing DB: "${error.message}"`);
                        Worker.processExistCode = 1;
                        // @ts-ignore
                        process.emit('SIGINT');
                        process.exit(1);
                    });
                    // Make sure the settings exist
                    yield n8n_core_1.UserSettings.prepareUserSettings();
                    // Load all node and credential types
                    const loadNodesAndCredentials = (0, src_1.LoadNodesAndCredentials)();
                    yield loadNodesAndCredentials.init();
                    // Load the credentials overwrites if any exist
                    const credentialsOverwrites = (0, src_1.CredentialsOverwrites)();
                    yield credentialsOverwrites.init();
                    // Load all external hooks
                    const externalHooks = (0, src_1.ExternalHooks)();
                    yield externalHooks.init();
                    // Add the found types to an instance other parts of the application can use
                    const nodeTypes = (0, src_1.NodeTypes)();
                    yield nodeTypes.init(loadNodesAndCredentials.nodeTypes);
                    const credentialTypes = (0, src_1.CredentialTypes)();
                    yield credentialTypes.init(loadNodesAndCredentials.credentialTypes);
                    // Wait till the database is ready
                    yield startDbInitPromise;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const redisConnectionTimeoutLimit = config_1.default.getEnv('queue.bull.redis.timeoutThreshold');
                    Worker.jobQueue = Queue.getInstance().getBullObjectInstance();
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    Worker.jobQueue.process(flags.concurrency, (job) => __awaiter(this, void 0, void 0, function* () { return this.runJob(job, nodeTypes); }));
                    const versions = yield src_1.GenericHelpers.getVersions();
                    const instanceId = yield n8n_core_1.UserSettings.getInstanceId();
                    src_1.InternalHooksManager.init(instanceId, versions.cli, nodeTypes);
                    const binaryDataConfig = config_1.default.getEnv('binaryDataManager');
                    yield n8n_core_1.BinaryDataManager.init(binaryDataConfig);
                    console.info('\nn8n worker is now ready');
                    console.info(` * Version: ${versions.cli}`);
                    console.info(` * Concurrency: ${flags.concurrency}`);
                    console.info('');
                    Worker.jobQueue.on('global:progress', (jobId, progress) => {
                        // Progress of a job got updated which does get used
                        // to communicate that a job got canceled.
                        if (progress === -1) {
                            // Job has to get canceled
                            if (Worker.runningJobs[jobId] !== undefined) {
                                // Job is processed by current worker so cancel
                                Worker.runningJobs[jobId].cancel();
                                delete Worker.runningJobs[jobId];
                            }
                        }
                    });
                    let lastTimer = 0;
                    let cumulativeTimeout = 0;
                    Worker.jobQueue.on('error', (error) => {
                        if (error.toString().includes('ECONNREFUSED')) {
                            const now = Date.now();
                            if (now - lastTimer > 30000) {
                                // Means we had no timeout at all or last timeout was temporary and we recovered
                                lastTimer = now;
                                cumulativeTimeout = 0;
                            }
                            else {
                                cumulativeTimeout += now - lastTimer;
                                lastTimer = now;
                                if (cumulativeTimeout > redisConnectionTimeoutLimit) {
                                    logger.error(`Unable to connect to Redis after ${redisConnectionTimeoutLimit}. Exiting process.`);
                                    process.exit(1);
                                }
                            }
                            logger.warn('Redis unavailable - trying to reconnect...');
                        }
                        else if (error.toString().includes('Error initializing Lua scripts')) {
                            // This is a non-recoverable error
                            // Happens when worker starts and Redis is unavailable
                            // Even if Redis comes back online, worker will be zombie
                            logger.error('Error initializing worker.');
                            process.exit(2);
                        }
                        else {
                            logger.error('Error from queue: ', error);
                            throw error;
                        }
                    });
                    if (config_1.default.getEnv('queue.health.active')) {
                        const port = config_1.default.getEnv('queue.health.port');
                        const app = (0, express_1.default)();
                        const server = http_1.default.createServer(app);
                        app.get('/healthz', 
                        // eslint-disable-next-line consistent-return
                        (req, res) => __awaiter(this, void 0, void 0, function* () {
                            n8n_workflow_1.LoggerProxy.debug('Health check started!');
                            const connection = (0, typeorm_1.getConnectionManager)().get();
                            try {
                                if (!connection.isConnected) {
                                    // Connection is not active
                                    throw new Error('No active database connection!');
                                }
                                // DB ping
                                yield connection.query('SELECT 1');
                            }
                            catch (e) {
                                n8n_workflow_1.LoggerProxy.error('No Database connection!', e);
                                const error = new src_1.ResponseHelper.ResponseError('No Database connection!', undefined, 503);
                                return src_1.ResponseHelper.sendErrorResponse(res, error);
                            }
                            // Just to be complete, generally will the worker stop automatically
                            // if it loses the conection to redis
                            try {
                                // Redis ping
                                yield Worker.jobQueue.client.ping();
                            }
                            catch (e) {
                                n8n_workflow_1.LoggerProxy.error('No Redis connection!', e);
                                const error = new src_1.ResponseHelper.ResponseError('No Redis connection!', undefined, 503);
                                return src_1.ResponseHelper.sendErrorResponse(res, error);
                            }
                            // Everything fine
                            const responseData = {
                                status: 'ok',
                            };
                            n8n_workflow_1.LoggerProxy.debug('Health check completed successfully!');
                            src_1.ResponseHelper.sendSuccessResponse(res, responseData, true, 200);
                        }));
                        server.listen(port, () => {
                            console.info(`\nn8n worker health check via, port ${port}`);
                        });
                        server.on('error', (error) => {
                            if (error.code === 'EADDRINUSE') {
                                console.log(`n8n's port ${port} is already in use. Do you have the n8n main process running on that port?`);
                                process.exit(1);
                            }
                        });
                    }
                }
                catch (error) {
                    logger.error(`Worker process cannot continue. "${error.message}"`);
                    Worker.processExistCode = 1;
                    // @ts-ignore
                    process.emit('SIGINT');
                    process.exit(1);
                }
            }))();
        });
    }
}
exports.Worker = Worker;
Worker.description = '\nStarts a n8n worker';
Worker.examples = [`$ n8n worker --concurrency=5`];
Worker.flags = {
    help: command_1.flags.help({ char: 'h' }),
    concurrency: command_1.flags.integer({
        default: 10,
        description: 'How many jobs can run in parallel.',
    }),
};
Worker.runningJobs = {};
Worker.processExistCode = 0;

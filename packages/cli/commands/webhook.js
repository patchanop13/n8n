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
exports.Webhook = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
const n8n_core_1 = require("n8n-core");
const command_1 = require("@oclif/command");
// eslint-disable-next-line import/no-extraneous-dependencies
const ioredis_1 = __importDefault(require("ioredis"));
const n8n_workflow_1 = require("n8n-workflow");
const config_1 = __importDefault(require("../config"));
const src_1 = require("../src");
const Logger_1 = require("../src/Logger");
let activeWorkflowRunner;
let processExistCode = 0;
class Webhook extends command_1.Command {
    /**
     * Stops the n8n in a graceful way.
     * Make for example sure that all the webhooks from third party services
     * get removed.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static stopProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            n8n_workflow_1.LoggerProxy.info(`\nStopping n8n...`);
            try {
                const externalHooks = (0, src_1.ExternalHooks)();
                yield externalHooks.run('n8n.stop', []);
                setTimeout(() => {
                    // In case that something goes wrong with shutdown we
                    // kill after max. 30 seconds no matter what
                    process.exit(processExistCode);
                }, 30000);
                // Wait for active workflow executions to finish
                const activeExecutionsInstance = src_1.ActiveExecutions.getInstance();
                let executingWorkflows = activeExecutionsInstance.getActiveExecutions();
                let count = 0;
                while (executingWorkflows.length !== 0) {
                    if (count++ % 4 === 0) {
                        n8n_workflow_1.LoggerProxy.info(`Waiting for ${executingWorkflows.length} active executions to finish...`);
                    }
                    // eslint-disable-next-line no-await-in-loop
                    yield new Promise((resolve) => {
                        setTimeout(resolve, 500);
                    });
                    executingWorkflows = activeExecutionsInstance.getActiveExecutions();
                }
            }
            catch (error) {
                n8n_workflow_1.LoggerProxy.error('There was an error shutting down n8n.', error);
            }
            process.exit(processExistCode);
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = (0, Logger_1.getLogger)();
            n8n_workflow_1.LoggerProxy.init(logger);
            // Make sure that n8n shuts down gracefully if possible
            process.on('SIGTERM', Webhook.stopProcess);
            process.on('SIGINT', Webhook.stopProcess);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-shadow
            const { flags } = this.parse(Webhook);
            // Wrap that the process does not close but we can still use async
            yield (() => __awaiter(this, void 0, void 0, function* () {
                if (config_1.default.getEnv('executions.mode') !== 'queue') {
                    /**
                     * It is technically possible to run without queues but
                     * there are 2 known bugs when running in this mode:
                     * - Executions list will be problematic as the main process
                     * is not aware of current executions in the webhook processes
                     * and therefore will display all current executions as error
                     * as it is unable to determine if it is still running or crashed
                     * - You cannot stop currently executing jobs from webhook processes
                     * when running without queues as the main process cannot talk to
                     * the wehbook processes to communicate workflow execution interruption.
                     */
                    this.error('Webhook processes can only run with execution mode as queue.');
                }
                try {
                    // Start directly with the init of the database to improve startup time
                    const startDbInitPromise = src_1.Db.init().catch((error) => {
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                        logger.error(`There was an error initializing DB: "${error.message}"`);
                        processExistCode = 1;
                        // @ts-ignore
                        process.emit('SIGINT');
                        process.exit(1);
                    });
                    // Make sure the settings exist
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const userSettings = yield n8n_core_1.UserSettings.prepareUserSettings();
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
                    const instanceId = yield n8n_core_1.UserSettings.getInstanceId();
                    const { cli } = yield src_1.GenericHelpers.getVersions();
                    src_1.InternalHooksManager.init(instanceId, cli, nodeTypes);
                    const binaryDataConfig = config_1.default.getEnv('binaryDataManager');
                    yield n8n_core_1.BinaryDataManager.init(binaryDataConfig);
                    if (config_1.default.getEnv('executions.mode') === 'queue') {
                        const redisHost = config_1.default.getEnv('queue.bull.redis.host');
                        const redisPassword = config_1.default.getEnv('queue.bull.redis.password');
                        const redisPort = config_1.default.getEnv('queue.bull.redis.port');
                        const redisDB = config_1.default.getEnv('queue.bull.redis.db');
                        const redisConnectionTimeoutLimit = config_1.default.getEnv('queue.bull.redis.timeoutThreshold');
                        let lastTimer = 0;
                        let cumulativeTimeout = 0;
                        const settings = {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            retryStrategy: (times) => {
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
                                        logger.error(
                                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                        `Unable to connect to Redis after ${redisConnectionTimeoutLimit}. Exiting process.`);
                                        process.exit(1);
                                    }
                                }
                                return 500;
                            },
                        };
                        if (redisHost) {
                            settings.host = redisHost;
                        }
                        if (redisPassword) {
                            settings.password = redisPassword;
                        }
                        if (redisPort) {
                            settings.port = redisPort;
                        }
                        if (redisDB) {
                            settings.db = redisDB;
                        }
                        // This connection is going to be our heartbeat
                        // IORedis automatically pings redis and tries to reconnect
                        // We will be using the retryStrategy above
                        // to control how and when to exit.
                        const redis = new ioredis_1.default(settings);
                        redis.on('error', (error) => {
                            if (error.toString().includes('ECONNREFUSED') === true) {
                                logger.warn('Redis unavailable - trying to reconnect...');
                            }
                            else {
                                logger.warn('Error with Redis: ', error);
                            }
                        });
                    }
                    yield src_1.WebhookServer.start();
                    // Start to get active workflows and run their triggers
                    activeWorkflowRunner = src_1.ActiveWorkflowRunner.getInstance();
                    yield activeWorkflowRunner.initWebhooks();
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const editorUrl = src_1.GenericHelpers.getBaseUrl();
                    console.info('Webhook listener waiting for requests.');
                }
                catch (error) {
                    console.error('Exiting due to error. See log message for details.');
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    logger.error(`Webhook process cannot continue. "${error.message}"`);
                    processExistCode = 1;
                    // @ts-ignore
                    process.emit('SIGINT');
                    process.exit(1);
                }
            }))();
        });
    }
}
exports.Webhook = Webhook;
Webhook.description = 'Starts n8n webhook process. Intercepts only production URLs.';
Webhook.examples = [`$ n8n webhook`];
Webhook.flags = {
    help: command_1.flags.help({ char: 'h' }),
};

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
exports.Start = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const localtunnel_1 = __importDefault(require("localtunnel"));
const n8n_core_1 = require("n8n-core");
const command_1 = require("@oclif/command");
// eslint-disable-next-line import/no-extraneous-dependencies
const ioredis_1 = __importDefault(require("ioredis"));
const n8n_workflow_1 = require("n8n-workflow");
const crypto_1 = require("crypto");
const config_1 = __importDefault(require("../config"));
const src_1 = require("../src");
const Logger_1 = require("../src/Logger");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const open = require('open');
let activeWorkflowRunner;
let processExitCode = 0;
class Start extends command_1.Command {
    /**
     * Opens the UI in browser
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static openBrowser() {
        const editorUrl = src_1.GenericHelpers.getBaseUrl();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        open(editorUrl, { wait: true }).catch((error) => {
            console.log(`\nWas not able to open URL in browser. Please open manually by visiting:\n${editorUrl}\n`);
        });
    }
    /**
     * Stoppes the n8n in a graceful way.
     * Make for example sure that all the webhooks from third party services
     * get removed.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static stopProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Logger_1.getLogger)().info('\nStopping n8n...');
            try {
                const externalHooks = (0, src_1.ExternalHooks)();
                yield externalHooks.run('n8n.stop', []);
                setTimeout(() => {
                    // In case that something goes wrong with shutdown we
                    // kill after max. 30 seconds no matter what
                    console.log(`process exited after 30s`);
                    process.exit(processExitCode);
                }, 30000);
                yield src_1.InternalHooksManager.getInstance().onN8nStop();
                const skipWebhookDeregistration = config_1.default.getEnv('endpoints.skipWebhoooksDeregistrationOnShutdown');
                const removePromises = [];
                if (activeWorkflowRunner !== undefined && !skipWebhookDeregistration) {
                    removePromises.push(activeWorkflowRunner.removeAll());
                }
                // Remove all test webhooks
                const testWebhooks = src_1.TestWebhooks.getInstance();
                removePromises.push(testWebhooks.removeAll());
                yield Promise.all(removePromises);
                // Wait for active workflow executions to finish
                const activeExecutionsInstance = src_1.ActiveExecutions.getInstance();
                let executingWorkflows = activeExecutionsInstance.getActiveExecutions();
                let count = 0;
                while (executingWorkflows.length !== 0) {
                    if (count++ % 4 === 0) {
                        console.log(`Waiting for ${executingWorkflows.length} active executions to finish...`);
                        // eslint-disable-next-line array-callback-return
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
            }
            catch (error) {
                console.error('There was an error shutting down n8n.', error);
            }
            process.exit(processExitCode);
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // Make sure that n8n shuts down gracefully if possible
            process.on('SIGTERM', Start.stopProcess);
            process.on('SIGINT', Start.stopProcess);
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { flags } = this.parse(Start);
            // Wrap that the process does not close but we can still use async
            yield (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const logger = (0, Logger_1.getLogger)();
                    n8n_workflow_1.LoggerProxy.init(logger);
                    logger.info('Initializing n8n process');
                    // Start directly with the init of the database to improve startup time
                    const startDbInitPromise = src_1.Db.init().catch((error) => {
                        logger.error(`There was an error initializing DB: "${error.message}"`);
                        processExitCode = 1;
                        // @ts-ignore
                        process.emit('SIGINT');
                        process.exit(1);
                    });
                    // Make sure the settings exist
                    const userSettings = yield n8n_core_1.UserSettings.prepareUserSettings();
                    if (!config_1.default.getEnv('userManagement.jwtSecret')) {
                        // If we don't have a JWT secret set, generate
                        // one based and save to config.
                        const encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
                        // For a key off every other letter from encryption key
                        // CAREFUL: do not change this or it breaks all existing tokens.
                        let baseKey = '';
                        for (let i = 0; i < encryptionKey.length; i += 2) {
                            baseKey += encryptionKey[i];
                        }
                        config_1.default.set('userManagement.jwtSecret', (0, crypto_1.createHash)('sha256').update(baseKey).digest('hex'));
                    }
                    // Load all node and credential types
                    const loadNodesAndCredentials = (0, src_1.LoadNodesAndCredentials)();
                    yield loadNodesAndCredentials.init();
                    // Load all external hooks
                    const externalHooks = (0, src_1.ExternalHooks)();
                    yield externalHooks.init();
                    // Add the found types to an instance other parts of the application can use
                    const nodeTypes = (0, src_1.NodeTypes)();
                    yield nodeTypes.init(loadNodesAndCredentials.nodeTypes);
                    const credentialTypes = (0, src_1.CredentialTypes)();
                    yield credentialTypes.init(loadNodesAndCredentials.credentialTypes);
                    // Load the credentials overwrites if any exist
                    const credentialsOverwrites = (0, src_1.CredentialsOverwrites)();
                    yield credentialsOverwrites.init();
                    // Wait till the database is ready
                    yield startDbInitPromise;
                    yield n8n_core_1.UserSettings.getEncryptionKey();
                    // Load settings from database and set them to config.
                    const databaseSettings = yield src_1.Db.collections.Settings.find({ loadOnStartup: true });
                    databaseSettings.forEach((setting) => {
                        config_1.default.set(setting.key, JSON.parse(setting.value));
                    });
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
                    const dbType = (yield src_1.GenericHelpers.getConfigValue('database.type'));
                    if (dbType === 'sqlite') {
                        const shouldRunVacuum = config_1.default.getEnv('database.sqlite.executeVacuumOnStartup');
                        if (shouldRunVacuum) {
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            yield src_1.Db.collections.Execution.query('VACUUM;');
                        }
                    }
                    if (flags.tunnel) {
                        this.log('\nWaiting for tunnel ...');
                        let tunnelSubdomain;
                        if (process.env[n8n_core_1.TUNNEL_SUBDOMAIN_ENV] !== undefined &&
                            process.env[n8n_core_1.TUNNEL_SUBDOMAIN_ENV] !== '') {
                            tunnelSubdomain = process.env[n8n_core_1.TUNNEL_SUBDOMAIN_ENV];
                        }
                        else if (userSettings.tunnelSubdomain !== undefined) {
                            tunnelSubdomain = userSettings.tunnelSubdomain;
                        }
                        if (tunnelSubdomain === undefined) {
                            // When no tunnel subdomain did exist yet create a new random one
                            const availableCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
                            userSettings.tunnelSubdomain = Array.from({ length: 24 })
                                .map(() => {
                                return availableCharacters.charAt(Math.floor(Math.random() * availableCharacters.length));
                            })
                                .join('');
                            yield n8n_core_1.UserSettings.writeUserSettings(userSettings);
                        }
                        const tunnelSettings = {
                            host: 'https://hooks.n8n.cloud',
                            subdomain: tunnelSubdomain,
                        };
                        const port = config_1.default.getEnv('port');
                        // @ts-ignore
                        const webhookTunnel = yield (0, localtunnel_1.default)(port, tunnelSettings);
                        process.env.WEBHOOK_URL = `${webhookTunnel.url}/`;
                        this.log(`Tunnel URL: ${process.env.WEBHOOK_URL}\n`);
                        this.log('IMPORTANT! Do not share with anybody as it would give people access to your n8n instance!');
                    }
                    const instanceId = yield n8n_core_1.UserSettings.getInstanceId();
                    const { cli } = yield src_1.GenericHelpers.getVersions();
                    src_1.InternalHooksManager.init(instanceId, cli, nodeTypes);
                    const binaryDataConfig = config_1.default.getEnv('binaryDataManager');
                    yield n8n_core_1.BinaryDataManager.init(binaryDataConfig, true);
                    yield src_1.Server.start();
                    // Start to get active workflows and run their triggers
                    activeWorkflowRunner = src_1.ActiveWorkflowRunner.getInstance();
                    yield activeWorkflowRunner.init();
                    (0, src_1.WaitTracker)();
                    const editorUrl = src_1.GenericHelpers.getBaseUrl();
                    this.log(`\nEditor is now accessible via:\n${editorUrl}`);
                    const saveManualExecutions = config_1.default.getEnv('executions.saveDataManualExecutions');
                    if (saveManualExecutions) {
                        this.log('\nManual executions will be visible only for the owner');
                    }
                    // Allow to open n8n editor by pressing "o"
                    if (Boolean(process.stdout.isTTY) && process.stdin.setRawMode) {
                        process.stdin.setRawMode(true);
                        process.stdin.resume();
                        process.stdin.setEncoding('utf8');
                        let inputText = '';
                        if (flags.open) {
                            Start.openBrowser();
                        }
                        this.log(`\nPress "o" to open in Browser.`);
                        process.stdin.on('data', (key) => {
                            if (key === 'o') {
                                Start.openBrowser();
                                inputText = '';
                            }
                            else if (key.charCodeAt(0) === 3) {
                                // Ctrl + c got pressed
                                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                Start.stopProcess();
                            }
                            else {
                                // When anything else got pressed, record it and send it on enter into the child process
                                // eslint-disable-next-line no-lonely-if
                                if (key.charCodeAt(0) === 13) {
                                    // send to child process and print in terminal
                                    process.stdout.write('\n');
                                    inputText = '';
                                }
                                else {
                                    // record it and write into terminal
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    inputText += key;
                                    process.stdout.write(key);
                                }
                            }
                        });
                    }
                }
                catch (error) {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    this.error(`There was an error: ${error.message}`);
                    processExitCode = 1;
                    // @ts-ignore
                    process.emit('SIGINT');
                }
            }))();
        });
    }
}
exports.Start = Start;
Start.description = 'Starts n8n. Makes Web-UI available and starts active workflows';
Start.examples = [
    `$ n8n start`,
    `$ n8n start --tunnel`,
    `$ n8n start -o`,
    `$ n8n start --tunnel -o`,
];
Start.flags = {
    help: command_1.flags.help({ char: 'h' }),
    open: command_1.flags.boolean({
        char: 'o',
        description: 'opens the UI automatically in browser',
    }),
    tunnel: command_1.flags.boolean({
        description: 'runs the webhooks via a hooks.n8n.cloud tunnel server. Use only for testing and development!',
    }),
};

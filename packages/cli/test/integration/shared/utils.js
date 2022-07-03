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
exports.getPostgresSchemaSection = exports.categorize = exports.skipSmtpTest = exports.isTestSmtpServiceAvailable = exports.configureSmtp = exports.isInstanceOwnerSetUp = exports.getAuthToken = exports.prefix = exports.createAgent = exports.initConfigFile = exports.initBinaryManager = exports.initTestLogger = exports.initNodeTypes = exports.initCredentialsTypes = exports.gitHubCredentialType = exports.initActiveWorkflowRunner = exports.initTestTelemetry = exports.initTestServer = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const url_1 = require("url");
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = __importDefault(require("util"));
const nodemailer_1 = require("nodemailer");
const lodash_1 = require("lodash");
const cron_1 = require("cron");
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const config_1 = __importDefault(require("../../../config"));
const constants_1 = require("./constants");
const constants_2 = require("../../../src/constants");
const routes_1 = require("../../../src/UserManagement/routes");
const src_1 = require("../../../src");
const me_1 = require("../../../src/UserManagement/routes/me");
const users_1 = require("../../../src/UserManagement/routes/users");
const auth_1 = require("../../../src/UserManagement/routes/auth");
const owner_1 = require("../../../src/UserManagement/routes/owner");
const passwordReset_1 = require("../../../src/UserManagement/routes/passwordReset");
const jwt_1 = require("../../../src/UserManagement/auth/jwt");
const Logger_1 = require("../../../src/Logger");
const credentials_api_1 = require("../../../src/api/credentials.api");
const PublicApi_1 = require("../../../src/PublicApi/");
const UserManagementMailer = __importStar(require("../../../src/UserManagement/email/UserManagementMailer"));
/**
 * Initialize a test server.
 *
 * @param applyAuth Whether to apply auth middleware to test server.
 * @param endpointGroups Groups of endpoints to apply to test server.
 */
function initTestServer({ applyAuth, endpointGroups, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const testServer = {
            app: (0, express_1.default)(),
            restEndpoint: constants_1.REST_PATH_SEGMENT,
            publicApiEndpoint: constants_1.PUBLIC_API_REST_PATH_SEGMENT,
            externalHooks: {},
        };
        testServer.app.use(body_parser_1.default.json());
        testServer.app.use(body_parser_1.default.urlencoded({ extended: true }));
        config_1.default.set('userManagement.jwtSecret', 'My JWT secret');
        config_1.default.set('userManagement.isInstanceOwnerSetUp', false);
        if (applyAuth) {
            routes_1.addRoutes.apply(testServer, [constants_1.AUTHLESS_ENDPOINTS, constants_1.REST_PATH_SEGMENT]);
        }
        if (!endpointGroups)
            return testServer.app;
        if (endpointGroups.includes('credentials')) {
            testServer.externalHooks = (0, src_1.ExternalHooks)();
        }
        const [routerEndpoints, functionEndpoints] = classifyEndpointGroups(endpointGroups);
        if (routerEndpoints.length) {
            const { apiRouters } = yield (0, PublicApi_1.loadPublicApiVersions)(testServer.publicApiEndpoint);
            const map = {
                credentials: credentials_api_1.credentialsController,
                publicApi: apiRouters,
            };
            for (const group of routerEndpoints) {
                if (group === 'publicApi') {
                    testServer.app.use(...map[group]);
                }
                else {
                    testServer.app.use(`/${testServer.restEndpoint}/${group}`, map[group]);
                }
            }
        }
        if (functionEndpoints.length) {
            const map = {
                me: me_1.meNamespace,
                users: users_1.usersNamespace,
                auth: auth_1.authenticationMethods,
                owner: owner_1.ownerNamespace,
                passwordReset: passwordReset_1.passwordResetNamespace,
            };
            for (const group of functionEndpoints) {
                map[group].apply(testServer);
            }
        }
        return testServer.app;
    });
}
exports.initTestServer = initTestServer;
/**
 * Pre-requisite: Mock the telemetry module before calling.
 */
function initTestTelemetry() {
    const mockNodeTypes = { nodeTypes: {} };
    void src_1.InternalHooksManager.init('test-instance-id', 'test-version', mockNodeTypes);
}
exports.initTestTelemetry = initTestTelemetry;
/**
 * Classify endpoint groups into `routerEndpoints` (newest, using `express.Router`),
 * and `functionEndpoints` (legacy, namespaced inside a function).
 */
const classifyEndpointGroups = (endpointGroups) => {
    const routerEndpoints = [];
    const functionEndpoints = [];
    endpointGroups.forEach((group) => (group === 'credentials' || group === 'publicApi' ? routerEndpoints : functionEndpoints).push(group));
    return [routerEndpoints, functionEndpoints];
};
// ----------------------------------
//          initializers
// ----------------------------------
/**
 * Initialize node types.
 */
function initActiveWorkflowRunner() {
    return __awaiter(this, void 0, void 0, function* () {
        const workflowRunner = src_1.ActiveWorkflowRunner.getInstance();
        workflowRunner.init();
        return workflowRunner;
    });
}
exports.initActiveWorkflowRunner = initActiveWorkflowRunner;
function gitHubCredentialType() {
    return {
        name: 'githubApi',
        displayName: 'Github API',
        documentationUrl: 'github',
        properties: [
            {
                displayName: 'Github Server',
                name: 'server',
                type: 'string',
                default: 'https://api.github.com',
                description: 'The server to connect to. Only has to be set if Github Enterprise is used.',
            },
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ],
    };
}
exports.gitHubCredentialType = gitHubCredentialType;
/**
 * Initialize node types.
 */
function initCredentialsTypes() {
    return __awaiter(this, void 0, void 0, function* () {
        const credentialTypes = (0, src_1.CredentialTypes)();
        yield credentialTypes.init({
            githubApi: {
                type: gitHubCredentialType(),
                sourcePath: '',
            },
        });
    });
}
exports.initCredentialsTypes = initCredentialsTypes;
/**
 * Initialize node types.
 */
function initNodeTypes() {
    return __awaiter(this, void 0, void 0, function* () {
        const types = {
            'n8n-nodes-base.start': {
                sourcePath: '',
                type: {
                    description: {
                        displayName: 'Start',
                        name: 'start',
                        group: ['input'],
                        version: 1,
                        description: 'Starts the workflow execution from this node',
                        defaults: {
                            name: 'Start',
                            color: '#553399',
                        },
                        inputs: [],
                        outputs: ['main'],
                        properties: [],
                    },
                    execute() {
                        const items = this.getInputData();
                        return this.prepareOutputData(items);
                    },
                },
            },
            'n8n-nodes-base.cron': {
                sourcePath: '',
                type: {
                    description: {
                        displayName: 'Cron',
                        name: 'cron',
                        icon: 'fa:calendar',
                        group: ['trigger', 'schedule'],
                        version: 1,
                        description: 'Triggers the workflow at a specific time',
                        eventTriggerDescription: '',
                        activationMessage: 'Your cron trigger will now trigger executions on the schedule you have defined.',
                        defaults: {
                            name: 'Cron',
                            color: '#00FF00',
                        },
                        inputs: [],
                        outputs: ['main'],
                        properties: [
                            {
                                displayName: 'Trigger Times',
                                name: 'triggerTimes',
                                type: 'fixedCollection',
                                typeOptions: {
                                    multipleValues: true,
                                    multipleValueButtonText: 'Add Time',
                                },
                                default: {},
                                description: 'Triggers for the workflow',
                                placeholder: 'Add Cron Time',
                                options: [
                                    {
                                        name: 'item',
                                        displayName: 'Item',
                                        values: [
                                            {
                                                displayName: 'Mode',
                                                name: 'mode',
                                                type: 'options',
                                                options: [
                                                    {
                                                        name: 'Every Minute',
                                                        value: 'everyMinute',
                                                    },
                                                    {
                                                        name: 'Every Hour',
                                                        value: 'everyHour',
                                                    },
                                                    {
                                                        name: 'Every Day',
                                                        value: 'everyDay',
                                                    },
                                                    {
                                                        name: 'Every Week',
                                                        value: 'everyWeek',
                                                    },
                                                    {
                                                        name: 'Every Month',
                                                        value: 'everyMonth',
                                                    },
                                                    {
                                                        name: 'Every X',
                                                        value: 'everyX',
                                                    },
                                                    {
                                                        name: 'Custom',
                                                        value: 'custom',
                                                    },
                                                ],
                                                default: 'everyDay',
                                                description: 'How often to trigger.',
                                            },
                                            {
                                                displayName: 'Hour',
                                                name: 'hour',
                                                type: 'number',
                                                typeOptions: {
                                                    minValue: 0,
                                                    maxValue: 23,
                                                },
                                                displayOptions: {
                                                    hide: {
                                                        mode: ['custom', 'everyHour', 'everyMinute', 'everyX'],
                                                    },
                                                },
                                                default: 14,
                                                description: 'The hour of the day to trigger (24h format).',
                                            },
                                            {
                                                displayName: 'Minute',
                                                name: 'minute',
                                                type: 'number',
                                                typeOptions: {
                                                    minValue: 0,
                                                    maxValue: 59,
                                                },
                                                displayOptions: {
                                                    hide: {
                                                        mode: ['custom', 'everyMinute', 'everyX'],
                                                    },
                                                },
                                                default: 0,
                                                description: 'The minute of the day to trigger.',
                                            },
                                            {
                                                displayName: 'Day of Month',
                                                name: 'dayOfMonth',
                                                type: 'number',
                                                displayOptions: {
                                                    show: {
                                                        mode: ['everyMonth'],
                                                    },
                                                },
                                                typeOptions: {
                                                    minValue: 1,
                                                    maxValue: 31,
                                                },
                                                default: 1,
                                                description: 'The day of the month to trigger.',
                                            },
                                            {
                                                displayName: 'Weekday',
                                                name: 'weekday',
                                                type: 'options',
                                                displayOptions: {
                                                    show: {
                                                        mode: ['everyWeek'],
                                                    },
                                                },
                                                options: [
                                                    {
                                                        name: 'Monday',
                                                        value: '1',
                                                    },
                                                    {
                                                        name: 'Tuesday',
                                                        value: '2',
                                                    },
                                                    {
                                                        name: 'Wednesday',
                                                        value: '3',
                                                    },
                                                    {
                                                        name: 'Thursday',
                                                        value: '4',
                                                    },
                                                    {
                                                        name: 'Friday',
                                                        value: '5',
                                                    },
                                                    {
                                                        name: 'Saturday',
                                                        value: '6',
                                                    },
                                                    {
                                                        name: 'Sunday',
                                                        value: '0',
                                                    },
                                                ],
                                                default: '1',
                                                description: 'The weekday to trigger.',
                                            },
                                            {
                                                displayName: 'Cron Expression',
                                                name: 'cronExpression',
                                                type: 'string',
                                                displayOptions: {
                                                    show: {
                                                        mode: ['custom'],
                                                    },
                                                },
                                                default: '* * * * * *',
                                                description: 'Use custom cron expression. Values and ranges as follows:<ul><li>Seconds: 0-59</li><li>Minutes: 0 - 59</li><li>Hours: 0 - 23</li><li>Day of Month: 1 - 31</li><li>Months: 0 - 11 (Jan - Dec)</li><li>Day of Week: 0 - 6 (Sun - Sat)</li></ul>.',
                                            },
                                            {
                                                displayName: 'Value',
                                                name: 'value',
                                                type: 'number',
                                                typeOptions: {
                                                    minValue: 0,
                                                    maxValue: 1000,
                                                },
                                                displayOptions: {
                                                    show: {
                                                        mode: ['everyX'],
                                                    },
                                                },
                                                default: 2,
                                                description: 'All how many X minutes/hours it should trigger.',
                                            },
                                            {
                                                displayName: 'Unit',
                                                name: 'unit',
                                                type: 'options',
                                                displayOptions: {
                                                    show: {
                                                        mode: ['everyX'],
                                                    },
                                                },
                                                options: [
                                                    {
                                                        name: 'Minutes',
                                                        value: 'minutes',
                                                    },
                                                    {
                                                        name: 'Hours',
                                                        value: 'hours',
                                                    },
                                                ],
                                                default: 'hours',
                                                description: 'If it should trigger all X minutes or hours.',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    trigger() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const triggerTimes = this.getNodeParameter('triggerTimes');
                            // Define the order the cron-time-parameter appear
                            const parameterOrder = [
                                'second',
                                'minute',
                                'hour',
                                'dayOfMonth',
                                'month',
                                'weekday', // 0 - 6(Sun - Sat)
                            ];
                            // Get all the trigger times
                            const cronTimes = [];
                            let cronTime;
                            let parameterName;
                            if (triggerTimes.item !== undefined) {
                                for (const item of triggerTimes.item) {
                                    cronTime = [];
                                    if (item.mode === 'custom') {
                                        cronTimes.push(item.cronExpression);
                                        continue;
                                    }
                                    if (item.mode === 'everyMinute') {
                                        cronTimes.push(`${Math.floor(Math.random() * 60).toString()} * * * * *`);
                                        continue;
                                    }
                                    if (item.mode === 'everyX') {
                                        if (item.unit === 'minutes') {
                                            cronTimes.push(`${Math.floor(Math.random() * 60).toString()} */${item.value} * * * *`);
                                        }
                                        else if (item.unit === 'hours') {
                                            cronTimes.push(`${Math.floor(Math.random() * 60).toString()} 0 */${item.value} * * *`);
                                        }
                                        continue;
                                    }
                                    for (parameterName of parameterOrder) {
                                        if (item[parameterName] !== undefined) {
                                            // Value is set so use it
                                            cronTime.push(item[parameterName]);
                                        }
                                        else if (parameterName === 'second') {
                                            // For seconds we use by default a random one to make sure to
                                            // balance the load a little bit over time
                                            cronTime.push(Math.floor(Math.random() * 60).toString());
                                        }
                                        else {
                                            // For all others set "any"
                                            cronTime.push('*');
                                        }
                                    }
                                    cronTimes.push(cronTime.join(' '));
                                }
                            }
                            // The trigger function to execute when the cron-time got reached
                            // or when manually triggered
                            const executeTrigger = () => {
                                this.emit([this.helpers.returnJsonArray([{}])]);
                            };
                            const timezone = this.getTimezone();
                            // Start the cron-jobs
                            const cronJobs = [];
                            for (const cronTime of cronTimes) {
                                cronJobs.push(new cron_1.CronJob(cronTime, executeTrigger, undefined, true, timezone));
                            }
                            // Stop the cron-jobs
                            function closeFunction() {
                                return __awaiter(this, void 0, void 0, function* () {
                                    for (const cronJob of cronJobs) {
                                        cronJob.stop();
                                    }
                                });
                            }
                            function manualTriggerFunction() {
                                return __awaiter(this, void 0, void 0, function* () {
                                    executeTrigger();
                                });
                            }
                            return {
                                closeFunction,
                                manualTriggerFunction,
                            };
                        });
                    },
                },
            },
            'n8n-nodes-base.set': {
                sourcePath: '',
                type: {
                    description: {
                        displayName: 'Set',
                        name: 'set',
                        icon: 'fa:pen',
                        group: ['input'],
                        version: 1,
                        description: 'Sets values on items and optionally remove other values',
                        defaults: {
                            name: 'Set',
                            color: '#0000FF',
                        },
                        inputs: ['main'],
                        outputs: ['main'],
                        properties: [
                            {
                                displayName: 'Keep Only Set',
                                name: 'keepOnlySet',
                                type: 'boolean',
                                default: false,
                                description: 'If only the values set on this node should be kept and all others removed.',
                            },
                            {
                                displayName: 'Values to Set',
                                name: 'values',
                                placeholder: 'Add Value',
                                type: 'fixedCollection',
                                typeOptions: {
                                    multipleValues: true,
                                    sortable: true,
                                },
                                description: 'The value to set.',
                                default: {},
                                options: [
                                    {
                                        name: 'boolean',
                                        displayName: 'Boolean',
                                        values: [
                                            {
                                                displayName: 'Name',
                                                name: 'name',
                                                type: 'string',
                                                default: 'propertyName',
                                                description: 'Name of the property to write data to. Supports dot-notation. Example: "data.person[0].name"',
                                            },
                                            {
                                                displayName: 'Value',
                                                name: 'value',
                                                type: 'boolean',
                                                default: false,
                                                description: 'The boolean value to write in the property.',
                                            },
                                        ],
                                    },
                                    {
                                        name: 'number',
                                        displayName: 'Number',
                                        values: [
                                            {
                                                displayName: 'Name',
                                                name: 'name',
                                                type: 'string',
                                                default: 'propertyName',
                                                description: 'Name of the property to write data to. Supports dot-notation. Example: "data.person[0].name"',
                                            },
                                            {
                                                displayName: 'Value',
                                                name: 'value',
                                                type: 'number',
                                                default: 0,
                                                description: 'The number value to write in the property.',
                                            },
                                        ],
                                    },
                                    {
                                        name: 'string',
                                        displayName: 'String',
                                        values: [
                                            {
                                                displayName: 'Name',
                                                name: 'name',
                                                type: 'string',
                                                default: 'propertyName',
                                                description: 'Name of the property to write data to. Supports dot-notation. Example: "data.person[0].name"',
                                            },
                                            {
                                                displayName: 'Value',
                                                name: 'value',
                                                type: 'string',
                                                default: '',
                                                description: 'The string value to write in the property.',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                displayName: 'Options',
                                name: 'options',
                                type: 'collection',
                                placeholder: 'Add Option',
                                default: {},
                                options: [
                                    {
                                        displayName: 'Dot Notation',
                                        name: 'dotNotation',
                                        type: 'boolean',
                                        default: true,
                                        description: `<p>By default, dot-notation is used in property names. This means that "a.b" will set the property "b" underneath "a" so { "a": { "b": value} }.<p></p>If that is not intended this can be deactivated, it will then set { "a.b": value } instead.</p>
									`,
                                    },
                                ],
                            },
                        ],
                    },
                    execute() {
                        const items = this.getInputData();
                        if (items.length === 0) {
                            items.push({ json: {} });
                        }
                        const returnData = [];
                        let item;
                        let keepOnlySet;
                        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                            keepOnlySet = this.getNodeParameter('keepOnlySet', itemIndex, false);
                            item = items[itemIndex];
                            const options = this.getNodeParameter('options', itemIndex, {});
                            const newItem = {
                                json: {},
                            };
                            if (keepOnlySet !== true) {
                                if (item.binary !== undefined) {
                                    // Create a shallow copy of the binary data so that the old
                                    // data references which do not get changed still stay behind
                                    // but the incoming data does not get changed.
                                    newItem.binary = {};
                                    Object.assign(newItem.binary, item.binary);
                                }
                                newItem.json = JSON.parse(JSON.stringify(item.json));
                            }
                            // Add boolean values
                            this.getNodeParameter('values.boolean', itemIndex, []).forEach((setItem) => {
                                if (options.dotNotation === false) {
                                    newItem.json[setItem.name] = !!setItem.value;
                                }
                                else {
                                    (0, lodash_1.set)(newItem.json, setItem.name, !!setItem.value);
                                }
                            });
                            // Add number values
                            this.getNodeParameter('values.number', itemIndex, []).forEach((setItem) => {
                                if (options.dotNotation === false) {
                                    newItem.json[setItem.name] = setItem.value;
                                }
                                else {
                                    (0, lodash_1.set)(newItem.json, setItem.name, setItem.value);
                                }
                            });
                            // Add string values
                            this.getNodeParameter('values.string', itemIndex, []).forEach((setItem) => {
                                if (options.dotNotation === false) {
                                    newItem.json[setItem.name] = setItem.value;
                                }
                                else {
                                    (0, lodash_1.set)(newItem.json, setItem.name, setItem.value);
                                }
                            });
                            returnData.push(newItem);
                        }
                        return this.prepareOutputData(returnData);
                    },
                },
            },
        };
        yield (0, src_1.NodeTypes)().init(types);
    });
}
exports.initNodeTypes = initNodeTypes;
/**
 * Initialize a logger for test runs.
 */
function initTestLogger() {
    n8n_workflow_1.LoggerProxy.init((0, Logger_1.getLogger)());
}
exports.initTestLogger = initTestLogger;
/**
 * Initialize a BinaryManager for test runs.
 */
function initBinaryManager() {
    return __awaiter(this, void 0, void 0, function* () {
        const binaryDataConfig = config_1.default.getEnv('binaryDataManager');
        yield n8n_core_1.BinaryDataManager.init(binaryDataConfig);
    });
}
exports.initBinaryManager = initBinaryManager;
/**
 * Initialize a user settings config file if non-existent.
 */
function initConfigFile() {
    const settingsPath = n8n_core_1.UserSettings.getUserSettingsPath();
    if (!(0, fs_1.existsSync)(settingsPath)) {
        const userSettings = { encryptionKey: (0, crypto_1.randomBytes)(24).toString('base64') };
        n8n_core_1.UserSettings.writeUserSettings(userSettings, settingsPath);
    }
}
exports.initConfigFile = initConfigFile;
// ----------------------------------
//           request agent
// ----------------------------------
/**
 * Create a request agent, optionally with an auth cookie.
 */
function createAgent(app, options) {
    const agent = supertest_1.default.agent(app);
    if ((options === null || options === void 0 ? void 0 : options.apiPath) === undefined || (options === null || options === void 0 ? void 0 : options.apiPath) === 'internal') {
        agent.use(prefix(constants_1.REST_PATH_SEGMENT));
        if ((options === null || options === void 0 ? void 0 : options.auth) && (options === null || options === void 0 ? void 0 : options.user)) {
            const { token } = (0, jwt_1.issueJWT)(options.user);
            agent.jar.setCookie(`${constants_2.AUTH_COOKIE_NAME}=${token}`);
        }
    }
    if ((options === null || options === void 0 ? void 0 : options.apiPath) === 'public') {
        agent.use(prefix(`${constants_1.PUBLIC_API_REST_PATH_SEGMENT}/v${options === null || options === void 0 ? void 0 : options.version}`));
        if ((options === null || options === void 0 ? void 0 : options.auth) && (options === null || options === void 0 ? void 0 : options.user.apiKey)) {
            agent.set({ 'X-N8N-API-KEY': options.user.apiKey });
        }
    }
    return agent;
}
exports.createAgent = createAgent;
/**
 * Plugin to prefix a path segment into a request URL pathname.
 *
 * Example: http://127.0.0.1:62100/me/password → http://127.0.0.1:62100/rest/me/password
 */
function prefix(pathSegment) {
    return function (request) {
        const url = new url_1.URL(request.url);
        // enforce consistency at call sites
        if (url.pathname[0] !== '/') {
            throw new Error('Pathname must start with a forward slash');
        }
        url.pathname = pathSegment + url.pathname;
        request.url = url.toString();
        return request;
    };
}
exports.prefix = prefix;
/**
 * Extract the value (token) of the auth cookie in a response.
 */
function getAuthToken(response, authCookieName = constants_2.AUTH_COOKIE_NAME) {
    const cookies = response.headers['set-cookie'];
    if (!cookies)
        return undefined;
    const authCookie = cookies.find((c) => c.startsWith(`${authCookieName}=`));
    if (!authCookie)
        return undefined;
    const match = authCookie.match(new RegExp(`(^| )${authCookieName}=(?<token>[^;]+)`));
    if (!match || !match.groups)
        return undefined;
    return match.groups.token;
}
exports.getAuthToken = getAuthToken;
// ----------------------------------
//            settings
// ----------------------------------
function isInstanceOwnerSetUp() {
    return __awaiter(this, void 0, void 0, function* () {
        const { value } = yield src_1.Db.collections.Settings.findOneOrFail({
            key: 'userManagement.isInstanceOwnerSetUp',
        });
        return Boolean(value);
    });
}
exports.isInstanceOwnerSetUp = isInstanceOwnerSetUp;
// ----------------------------------
//              SMTP
// ----------------------------------
/**
 * Get an SMTP test account from https://ethereal.email to test sending emails.
 */
const getSmtpTestAccount = util_1.default.promisify(nodemailer_1.createTestAccount);
function configureSmtp() {
    return __awaiter(this, void 0, void 0, function* () {
        const { user, pass, smtp: { host, port, secure }, } = yield getSmtpTestAccount();
        config_1.default.set('userManagement.emails.mode', 'smtp');
        config_1.default.set('userManagement.emails.smtp.host', host);
        config_1.default.set('userManagement.emails.smtp.port', port);
        config_1.default.set('userManagement.emails.smtp.secure', secure);
        config_1.default.set('userManagement.emails.smtp.auth.user', user);
        config_1.default.set('userManagement.emails.smtp.auth.pass', pass);
    });
}
exports.configureSmtp = configureSmtp;
function isTestSmtpServiceAvailable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield configureSmtp();
            yield UserManagementMailer.getInstance();
            return true;
        }
        catch (_) {
            return false;
        }
    });
}
exports.isTestSmtpServiceAvailable = isTestSmtpServiceAvailable;
function skipSmtpTest(expect) {
    console.warn(`SMTP service unavailable - Skipping test ${expect.getState().currentTestName}`);
    return;
}
exports.skipSmtpTest = skipSmtpTest;
// ----------------------------------
//              misc
// ----------------------------------
/**
 * Categorize array items into two groups based on whether they pass a test.
 */
const categorize = (arr, test) => {
    return arr.reduce((acc, cur) => {
        test(cur) ? acc.pass.push(cur) : acc.fail.push(cur);
        return acc;
    }, { pass: [], fail: [] });
};
exports.categorize = categorize;
function getPostgresSchemaSection(schema = config_1.default.getSchema()) {
    for (const [key, value] of Object.entries(schema)) {
        if (key === 'postgresdb') {
            return value._cvtProperties;
        }
    }
    return null;
}
exports.getPostgresSchemaSection = getPostgresSchemaSection;

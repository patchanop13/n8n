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
exports.getInstance = exports.ActiveWorkflowRunner = void 0;
/* eslint-disable import/no-cycle */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
const config_1 = __importDefault(require("../config"));
const WorkflowHelpers_1 = require("./WorkflowHelpers");
const ActiveExecutions = __importStar(require("./ActiveExecutions"));
const activeExecutions = ActiveExecutions.getInstance();
const WEBHOOK_PROD_UNREGISTERED_HINT = `The workflow must be active for a production URL to run successfully. You can activate the workflow using the toggle in the top-right of the editor. Note that unlike test URL calls, production URL calls aren't shown on the canvas (only in the executions list)`;
class ActiveWorkflowRunner {
    constructor() {
        this.activeWorkflows = null;
        this.activationErrors = {};
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the active workflows from database
            // NOTE
            // Here I guess we can have a flag on the workflow table like hasTrigger
            // so intead of pulling all the active wehhooks just pull the actives that have a trigger
            const workflowsData = (yield _1.Db.collections.Workflow.find({
                where: { active: true },
                relations: ['shared', 'shared.user', 'shared.user.globalRole'],
            }));
            if (!config_1.default.getEnv('endpoints.skipWebhoooksDeregistrationOnShutdown')) {
                // Do not clean up database when skip registration is done.
                // This flag is set when n8n is running in scaled mode.
                // Impact is minimal, but for a short while, n8n will stop accepting requests.
                // Also, users had issues when running multiple "main process"
                // instances if many of them start at the same time
                // This is not officially supported but there is no reason
                // it should not work.
                // Clear up active workflow table
                yield _1.Db.collections.Webhook.clear();
            }
            this.activeWorkflows = new n8n_core_1.ActiveWorkflows();
            if (workflowsData.length !== 0) {
                console.info(' ================================');
                console.info('   Start Active Workflows:');
                console.info(' ================================');
                for (const workflowData of workflowsData) {
                    console.log(`   - ${workflowData.name}`);
                    n8n_workflow_1.LoggerProxy.debug(`Initializing active workflow "${workflowData.name}" (startup)`, {
                        workflowName: workflowData.name,
                        workflowId: workflowData.id,
                    });
                    try {
                        yield this.add(workflowData.id.toString(), 'init', workflowData);
                        n8n_workflow_1.LoggerProxy.verbose(`Successfully started workflow "${workflowData.name}"`, {
                            workflowName: workflowData.name,
                            workflowId: workflowData.id,
                        });
                        console.log(`     => Started`);
                    }
                    catch (error) {
                        console.log(`     => ERROR: Workflow could not be activated`);
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        console.log(`               ${error.message}`);
                        n8n_workflow_1.LoggerProxy.error(`Unable to initialize workflow "${workflowData.name}" (startup)`, {
                            workflowName: workflowData.name,
                            workflowId: workflowData.id,
                        });
                        this.executeErrorWorkflow(error, workflowData, 'internal');
                    }
                }
                n8n_workflow_1.LoggerProxy.verbose('Finished initializing active workflows (startup)');
            }
            const externalHooks = (0, _1.ExternalHooks)();
            yield externalHooks.run('activeWorkflows.initialized', []);
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    initWebhooks() {
        return __awaiter(this, void 0, void 0, function* () {
            this.activeWorkflows = new n8n_core_1.ActiveWorkflows();
        });
    }
    /**
     * Removes all the currently active workflows
     *
     * @returns {Promise<void>}
     * @memberof ActiveWorkflowRunner
     */
    removeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let activeWorkflowIds = [];
            n8n_workflow_1.LoggerProxy.verbose('Call to remove all active workflows received (removeAll)');
            if (this.activeWorkflows !== null) {
                activeWorkflowIds.push.apply(activeWorkflowIds, this.activeWorkflows.allActiveWorkflows());
            }
            const activeWorkflows = yield this.getActiveWorkflows();
            activeWorkflowIds = [
                ...activeWorkflowIds,
                ...activeWorkflows.map((workflow) => workflow.id.toString()),
            ];
            // Make sure IDs are unique
            activeWorkflowIds = Array.from(new Set(activeWorkflowIds));
            const removePromises = [];
            for (const workflowId of activeWorkflowIds) {
                removePromises.push(this.remove(workflowId));
            }
            yield Promise.all(removePromises);
        });
    }
    /**
     * Checks if a webhook for the given method and path exists and executes the workflow.
     *
     * @param {WebhookHttpMethod} httpMethod
     * @param {string} path
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {Promise<object>}
     * @memberof ActiveWorkflowRunner
     */
    executeWebhook(httpMethod, path, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            n8n_workflow_1.LoggerProxy.debug(`Received webhoook "${httpMethod}" for path "${path}"`);
            if (this.activeWorkflows === null) {
                throw new _1.ResponseHelper.ResponseError('The "activeWorkflows" instance did not get initialized yet.', 404, 404);
            }
            // Reset request parameters
            req.params = {};
            // Remove trailing slash
            if (path.endsWith('/')) {
                path = path.slice(0, -1);
            }
            let webhook = (yield _1.Db.collections.Webhook.findOne({
                webhookPath: path,
                method: httpMethod,
            }));
            let webhookId;
            // check if path is dynamic
            if (webhook === undefined) {
                // check if a dynamic webhook path exists
                const pathElements = path.split('/');
                webhookId = pathElements.shift();
                const dynamicWebhooks = yield _1.Db.collections.Webhook.find({
                    webhookId,
                    method: httpMethod,
                    pathLength: pathElements.length,
                });
                if (dynamicWebhooks === undefined || dynamicWebhooks.length === 0) {
                    // The requested webhook is not registered
                    throw new _1.ResponseHelper.ResponseError(`The requested webhook "${httpMethod} ${path}" is not registered.`, 404, 404, WEBHOOK_PROD_UNREGISTERED_HINT);
                }
                let maxMatches = 0;
                const pathElementsSet = new Set(pathElements);
                // check if static elements match in path
                // if more results have been returned choose the one with the most static-route matches
                dynamicWebhooks.forEach((dynamicWebhook) => {
                    const staticElements = dynamicWebhook.webhookPath
                        .split('/')
                        .filter((ele) => !ele.startsWith(':'));
                    const allStaticExist = staticElements.every((staticEle) => pathElementsSet.has(staticEle));
                    if (allStaticExist && staticElements.length > maxMatches) {
                        maxMatches = staticElements.length;
                        webhook = dynamicWebhook;
                    }
                    // handle routes with no static elements
                    else if (staticElements.length === 0 && !webhook) {
                        webhook = dynamicWebhook;
                    }
                });
                if (webhook === undefined) {
                    throw new _1.ResponseHelper.ResponseError(`The requested webhook "${httpMethod} ${path}" is not registered.`, 404, 404, WEBHOOK_PROD_UNREGISTERED_HINT);
                }
                // @ts-ignore
                // eslint-disable-next-line no-param-reassign
                path = webhook.webhookPath;
                // extracting params from path
                // @ts-ignore
                webhook.webhookPath.split('/').forEach((ele, index) => {
                    if (ele.startsWith(':')) {
                        // write params to req.params
                        req.params[ele.slice(1)] = pathElements[index];
                    }
                });
            }
            const workflowData = yield _1.Db.collections.Workflow.findOne(webhook.workflowId, {
                relations: ['shared', 'shared.user', 'shared.user.globalRole'],
            });
            if (workflowData === undefined) {
                throw new _1.ResponseHelper.ResponseError(`Could not find workflow with id "${webhook.workflowId}"`, 404, 404);
            }
            const nodeTypes = (0, _1.NodeTypes)();
            const workflow = new n8n_workflow_1.Workflow({
                id: webhook.workflowId.toString(),
                name: workflowData.name,
                nodes: workflowData.nodes,
                connections: workflowData.connections,
                active: workflowData.active,
                nodeTypes,
                staticData: workflowData.staticData,
                settings: workflowData.settings,
            });
            const additionalData = yield _1.WorkflowExecuteAdditionalData.getBase(workflowData.shared[0].user.id);
            const webhookData = n8n_workflow_1.NodeHelpers.getNodeWebhooks(workflow, workflow.getNode(webhook.node), additionalData).filter((webhook) => {
                return webhook.httpMethod === httpMethod && webhook.path === path;
            })[0];
            // Get the node which has the webhook defined to know where to start from and to
            // get additional data
            const workflowStartNode = workflow.getNode(webhookData.node);
            if (workflowStartNode === null) {
                throw new _1.ResponseHelper.ResponseError('Could not find node to process webhook.', 404, 404);
            }
            return new Promise((resolve, reject) => {
                const executionMode = 'webhook';
                // @ts-ignore
                _1.WebhookHelpers.executeWebhook(workflow, webhookData, workflowData, workflowStartNode, executionMode, undefined, undefined, undefined, req, res, 
                // eslint-disable-next-line consistent-return
                (error, data) => {
                    if (error !== null) {
                        return reject(error);
                    }
                    resolve(data);
                });
            });
        });
    }
    /**
     * Gets all request methods associated with a single webhook
     *
     * @param {string} path webhook path
     * @returns {Promise<string[]>}
     * @memberof ActiveWorkflowRunner
     */
    getWebhookMethods(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhooks = yield _1.Db.collections.Webhook.find({ webhookPath: path });
            // Gather all request methods in string array
            const webhookMethods = webhooks.map((webhook) => webhook.method);
            return webhookMethods;
        });
    }
    /**
     * Returns the ids of the currently active workflows
     *
     * @returns {string[]}
     * @memberof ActiveWorkflowRunner
     */
    getActiveWorkflows(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let activeWorkflows = [];
            if (!user || user.globalRole.name === 'owner') {
                activeWorkflows = yield _1.Db.collections.Workflow.find({
                    select: ['id'],
                    where: { active: true },
                });
            }
            else {
                const shared = yield _1.Db.collections.SharedWorkflow.find({
                    relations: ['workflow'],
                    where: (0, WorkflowHelpers_1.whereClause)({
                        user,
                        entityType: 'workflow',
                    }),
                });
                activeWorkflows = shared.reduce((acc, cur) => {
                    if (cur.workflow.active)
                        acc.push(cur.workflow);
                    return acc;
                }, []);
            }
            return activeWorkflows.filter((workflow) => this.activationErrors[workflow.id] === undefined);
        });
    }
    /**
     * Returns if the workflow is active
     *
     * @param {string} id The id of the workflow to check
     * @returns {boolean}
     * @memberof ActiveWorkflowRunner
     */
    isActive(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const workflow = yield _1.Db.collections.Workflow.findOne(id);
            return !!(workflow === null || workflow === void 0 ? void 0 : workflow.active);
        });
    }
    /**
     * Return error if there was a problem activating the workflow
     *
     * @param {string} id The id of the workflow to return the error of
     * @returns {(IActivationError | undefined)}
     * @memberof ActiveWorkflowRunner
     */
    getActivationError(id) {
        if (this.activationErrors[id] === undefined) {
            return undefined;
        }
        return this.activationErrors[id];
    }
    /**
     * Adds all the webhooks of the workflow
     *
     * @param {Workflow} workflow
     * @param {IWorkflowExecuteAdditionalDataWorkflow} additionalData
     * @param {WorkflowExecuteMode} mode
     * @returns {Promise<void>}
     * @memberof ActiveWorkflowRunner
     */
    addWorkflowWebhooks(workflow, additionalData, mode, activation) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhooks = _1.WebhookHelpers.getWorkflowWebhooks(workflow, additionalData, undefined, true);
            let path = '';
            for (const webhookData of webhooks) {
                const node = workflow.getNode(webhookData.node);
                node.name = webhookData.node;
                path = webhookData.path;
                const webhook = {
                    workflowId: webhookData.workflowId,
                    webhookPath: path,
                    node: node.name,
                    method: webhookData.httpMethod,
                };
                if (webhook.webhookPath.startsWith('/')) {
                    webhook.webhookPath = webhook.webhookPath.slice(1);
                }
                if (webhook.webhookPath.endsWith('/')) {
                    webhook.webhookPath = webhook.webhookPath.slice(0, -1);
                }
                if ((path.startsWith(':') || path.includes('/:')) && node.webhookId) {
                    webhook.webhookId = node.webhookId;
                    webhook.pathLength = webhook.webhookPath.split('/').length;
                }
                try {
                    // eslint-disable-next-line no-await-in-loop
                    yield _1.Db.collections.Webhook.insert(webhook);
                    const webhookExists = yield workflow.runWebhookMethod('checkExists', webhookData, n8n_core_1.NodeExecuteFunctions, mode, activation, false);
                    if (webhookExists !== true) {
                        // If webhook does not exist yet create it
                        yield workflow.runWebhookMethod('create', webhookData, n8n_core_1.NodeExecuteFunctions, mode, activation, false);
                    }
                }
                catch (error) {
                    if (activation === 'init' &&
                        config_1.default.getEnv('endpoints.skipWebhoooksDeregistrationOnShutdown') &&
                        error.name === 'QueryFailedError') {
                        // When skipWebhoooksDeregistrationOnShutdown is enabled,
                        // n8n does not remove the registered webhooks on exit.
                        // This means that further initializations will always fail
                        // when inserting to database. This is why we ignore this error
                        // as it's expected to happen.
                        // eslint-disable-next-line no-continue
                        continue;
                    }
                    try {
                        yield this.removeWorkflowWebhooks(workflow.id);
                    }
                    catch (error) {
                        console.error(
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        `Could not remove webhooks of workflow "${workflow.id}" because of error: "${error.message}"`);
                    }
                    // if it's a workflow from the the insert
                    // TODO check if there is standard error code for duplicate key violation that works
                    // with all databases
                    if (error.name === 'QueryFailedError') {
                        error.message = `The URL path that the "${webhook.node}" node uses is already taken. Please change it to something else.`;
                    }
                    else if (error.detail) {
                        // it's a error runnig the webhook methods (checkExists, create)
                        error.message = error.detail;
                    }
                    throw error;
                }
            }
            // Save static data!
            yield _1.WorkflowHelpers.saveStaticData(workflow);
        });
    }
    /**
     * Remove all the webhooks of the workflow
     *
     * @param {string} workflowId
     * @returns
     * @memberof ActiveWorkflowRunner
     */
    removeWorkflowWebhooks(workflowId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workflowData = yield _1.Db.collections.Workflow.findOne(workflowId, {
                relations: ['shared', 'shared.user', 'shared.user.globalRole'],
            });
            if (workflowData === undefined) {
                throw new Error(`Could not find workflow with id "${workflowId}"`);
            }
            const nodeTypes = (0, _1.NodeTypes)();
            const workflow = new n8n_workflow_1.Workflow({
                id: workflowId,
                name: workflowData.name,
                nodes: workflowData.nodes,
                connections: workflowData.connections,
                active: workflowData.active,
                nodeTypes,
                staticData: workflowData.staticData,
                settings: workflowData.settings,
            });
            const mode = 'internal';
            const additionalData = yield _1.WorkflowExecuteAdditionalData.getBase(workflowData.shared[0].user.id);
            const webhooks = _1.WebhookHelpers.getWorkflowWebhooks(workflow, additionalData, undefined, true);
            for (const webhookData of webhooks) {
                yield workflow.runWebhookMethod('delete', webhookData, n8n_core_1.NodeExecuteFunctions, mode, 'update', false);
            }
            yield _1.WorkflowHelpers.saveStaticData(workflow);
            const webhook = {
                workflowId: workflowData.id,
            };
            yield _1.Db.collections.Webhook.delete(webhook);
        });
    }
    /**
     * Runs the given workflow
     *
     * @param {IWorkflowDb} workflowData
     * @param {INode} node
     * @param {INodeExecutionData[][]} data
     * @param {IWorkflowExecuteAdditionalDataWorkflow} additionalData
     * @param {WorkflowExecuteMode} mode
     * @returns
     * @memberof ActiveWorkflowRunner
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    runWorkflow(workflowData, node, data, additionalData, mode, responsePromise) {
        return __awaiter(this, void 0, void 0, function* () {
            const nodeExecutionStack = [
                {
                    node,
                    data: {
                        main: data,
                    },
                    source: null,
                },
            ];
            const executionData = {
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
            // Start the workflow
            const runData = {
                userId: additionalData.userId,
                executionMode: mode,
                executionData,
                workflowData,
            };
            const workflowRunner = new _1.WorkflowRunner();
            return workflowRunner.run(runData, true, undefined, undefined, responsePromise);
        });
    }
    /**
     * Return poll function which gets the global functions from n8n-core
     * and overwrites the __emit to be able to start it in subprocess
     *
     * @param {IWorkflowDb} workflowData
     * @param {IWorkflowExecuteAdditionalDataWorkflow} additionalData
     * @param {WorkflowExecuteMode} mode
     * @returns {IGetExecutePollFunctions}
     * @memberof ActiveWorkflowRunner
     */
    getExecutePollFunctions(workflowData, additionalData, mode, activation) {
        return (workflow, node) => {
            const returnFunctions = n8n_core_1.NodeExecuteFunctions.getExecutePollFunctions(workflow, node, additionalData, mode, activation);
            // eslint-disable-next-line no-underscore-dangle
            returnFunctions.__emit = (data) => {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                n8n_workflow_1.LoggerProxy.debug(`Received event to trigger execution for workflow "${workflow.name}"`);
                this.runWorkflow(workflowData, node, data, additionalData, mode);
            };
            return returnFunctions;
        };
    }
    /**
     * Return trigger function which gets the global functions from n8n-core
     * and overwrites the emit to be able to start it in subprocess
     *
     * @param {IWorkflowDb} workflowData
     * @param {IWorkflowExecuteAdditionalDataWorkflow} additionalData
     * @param {WorkflowExecuteMode} mode
     * @returns {IGetExecuteTriggerFunctions}
     * @memberof ActiveWorkflowRunner
     */
    getExecuteTriggerFunctions(workflowData, additionalData, mode, activation) {
        return (workflow, node) => {
            const returnFunctions = n8n_core_1.NodeExecuteFunctions.getExecuteTriggerFunctions(workflow, node, additionalData, mode, activation);
            returnFunctions.emit = (data, responsePromise, donePromise) => {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                n8n_workflow_1.LoggerProxy.debug(`Received trigger for workflow "${workflow.name}"`);
                _1.WorkflowHelpers.saveStaticData(workflow);
                // eslint-disable-next-line id-denylist
                const executePromise = this.runWorkflow(workflowData, node, data, additionalData, mode, responsePromise);
                if (donePromise) {
                    executePromise.then((executionId) => {
                        activeExecutions
                            .getPostExecutePromise(executionId)
                            .then(donePromise.resolve)
                            .catch(donePromise.reject);
                    });
                }
                else {
                    executePromise.catch(console.error);
                }
            };
            returnFunctions.emitError = (error) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                yield ((_a = this.activeWorkflows) === null || _a === void 0 ? void 0 : _a.remove(workflowData.id.toString()));
                this.activationErrors[workflowData.id.toString()] = {
                    time: new Date().getTime(),
                    error: {
                        message: error.message,
                    },
                };
                const activationError = new n8n_workflow_1.WorkflowActivationError('There was a problem with the trigger, for that reason did the workflow had to be deactivated', error, node);
                this.executeErrorWorkflow(activationError, workflowData, mode);
            });
            return returnFunctions;
        };
    }
    executeErrorWorkflow(error, workflowData, mode) {
        const fullRunData = {
            data: {
                resultData: {
                    error,
                    runData: {},
                },
            },
            finished: false,
            mode,
            startedAt: new Date(),
            stoppedAt: new Date(),
        };
        _1.WorkflowExecuteAdditionalData.executeErrorWorkflow(workflowData, fullRunData, mode);
    }
    /**
     * Makes a workflow active
     *
     * @param {string} workflowId The id of the workflow to activate
     * @param {IWorkflowDb} [workflowData] If workflowData is given it saves the DB query
     * @returns {Promise<void>}
     * @memberof ActiveWorkflowRunner
     */
    add(workflowId, activation, workflowData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.activeWorkflows === null) {
                throw new Error(`The "activeWorkflows" instance did not get initialized yet.`);
            }
            let workflowInstance;
            try {
                if (workflowData === undefined) {
                    workflowData = (yield _1.Db.collections.Workflow.findOne(workflowId, {
                        relations: ['shared', 'shared.user', 'shared.user.globalRole'],
                    }));
                }
                if (!workflowData) {
                    throw new Error(`Could not find workflow with id "${workflowId}".`);
                }
                const nodeTypes = (0, _1.NodeTypes)();
                workflowInstance = new n8n_workflow_1.Workflow({
                    id: workflowId,
                    name: workflowData.name,
                    nodes: workflowData.nodes,
                    connections: workflowData.connections,
                    active: workflowData.active,
                    nodeTypes,
                    staticData: workflowData.staticData,
                    settings: workflowData.settings,
                });
                const canBeActivated = workflowInstance.checkIfWorkflowCanBeActivated([
                    'n8n-nodes-base.start',
                ]);
                if (!canBeActivated) {
                    n8n_workflow_1.LoggerProxy.error(`Unable to activate workflow "${workflowData.name}"`);
                    throw new Error(`The workflow can not be activated because it does not contain any nodes which could start the workflow. Only workflows which have trigger or webhook nodes can be activated.`);
                }
                const mode = 'trigger';
                const additionalData = yield _1.WorkflowExecuteAdditionalData.getBase(workflowData.shared[0].user.id);
                const getTriggerFunctions = this.getExecuteTriggerFunctions(workflowData, additionalData, mode, activation);
                const getPollFunctions = this.getExecutePollFunctions(workflowData, additionalData, mode, activation);
                // Add the workflows which have webhooks defined
                yield this.addWorkflowWebhooks(workflowInstance, additionalData, mode, activation);
                if (workflowInstance.getTriggerNodes().length !== 0 ||
                    workflowInstance.getPollNodes().length !== 0) {
                    yield this.activeWorkflows.add(workflowId, workflowInstance, additionalData, mode, activation, getTriggerFunctions, getPollFunctions);
                    n8n_workflow_1.LoggerProxy.verbose(`Successfully activated workflow "${workflowData.name}"`, {
                        workflowId,
                        workflowName: workflowData.name,
                    });
                }
                if (this.activationErrors[workflowId] !== undefined) {
                    // If there were activation errors delete them
                    delete this.activationErrors[workflowId];
                }
            }
            catch (error) {
                // There was a problem activating the workflow
                // Save the error
                this.activationErrors[workflowId] = {
                    time: new Date().getTime(),
                    error: {
                        message: error.message,
                    },
                };
                throw error;
            }
            // If for example webhooks get created it sometimes has to save the
            // id of them in the static data. So make sure that data gets persisted.
            yield _1.WorkflowHelpers.saveStaticData(workflowInstance);
        });
    }
    /**
     * Makes a workflow inactive
     *
     * @param {string} workflowId The id of the workflow to deactivate
     * @returns {Promise<void>}
     * @memberof ActiveWorkflowRunner
     */
    remove(workflowId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.activeWorkflows !== null) {
                // Remove all the webhooks of the workflow
                try {
                    yield this.removeWorkflowWebhooks(workflowId);
                }
                catch (error) {
                    console.error(
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    `Could not remove webhooks of workflow "${workflowId}" because of error: "${error.message}"`);
                }
                if (this.activationErrors[workflowId] !== undefined) {
                    // If there were any activation errors delete them
                    delete this.activationErrors[workflowId];
                }
                // if it's active in memory then it's a trigger
                // so remove from list of actives workflows
                if (this.activeWorkflows.isActive(workflowId)) {
                    yield this.activeWorkflows.remove(workflowId);
                    n8n_workflow_1.LoggerProxy.verbose(`Successfully deactivated workflow "${workflowId}"`, { workflowId });
                }
                return;
            }
            throw new Error(`The "activeWorkflows" instance did not get initialized yet.`);
        });
    }
}
exports.ActiveWorkflowRunner = ActiveWorkflowRunner;
let workflowRunnerInstance;
function getInstance() {
    if (workflowRunnerInstance === undefined) {
        workflowRunnerInstance = new ActiveWorkflowRunner();
    }
    return workflowRunnerInstance;
}
exports.getInstance = getInstance;

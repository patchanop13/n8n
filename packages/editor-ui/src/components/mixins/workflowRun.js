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
exports.workflowRun = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const externalHooks_1 = require("@/components/mixins/externalHooks");
const restApi_1 = require("@/components/mixins/restApi");
const workflowHelpers_1 = require("@/components/mixins/workflowHelpers");
const showMessage_1 = require("@/components/mixins/showMessage");
const vue_typed_mixins_1 = __importDefault(require("vue-typed-mixins"));
const titleChange_1 = require("./titleChange");
exports.workflowRun = (0, vue_typed_mixins_1.default)(externalHooks_1.externalHooks, restApi_1.restApi, workflowHelpers_1.workflowHelpers, showMessage_1.showMessage, titleChange_1.titleChange).extend({
    methods: {
        // Starts to executes a workflow on server.
        runWorkflowApi(runData) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.$store.getters.pushConnectionActive === false) {
                    // Do not start if the connection to server is not active
                    // because then it can not receive the data as it executes.
                    throw new Error(this.$locale.baseText('workflowRun.noActiveConnectionToTheServer'));
                }
                this.$store.commit('addActiveAction', 'workflowRunning');
                let response;
                try {
                    response = yield this.restApi().runWorkflow(runData);
                }
                catch (error) {
                    this.$store.commit('removeActiveAction', 'workflowRunning');
                    throw error;
                }
                if (response.executionId !== undefined) {
                    this.$store.commit('setActiveExecutionId', response.executionId);
                }
                if (response.waitingForWebhook === true) {
                    this.$store.commit('setExecutionWaitingForWebhook', true);
                }
                return response;
            });
        },
        runWorkflow(nodeName, source) {
            return __awaiter(this, void 0, void 0, function* () {
                const workflow = this.getWorkflow();
                if (this.$store.getters.isActionActive('workflowRunning') === true) {
                    return;
                }
                this.$titleSet(workflow.name, 'EXECUTING');
                this.clearAllStickyNotifications();
                try {
                    // Check first if the workflow has any issues before execute it
                    const issuesExist = this.$store.getters.nodesIssuesExist;
                    if (issuesExist === true) {
                        // If issues exist get all of the issues of all nodes
                        const workflowIssues = this.checkReadyForExecution(workflow, nodeName);
                        if (workflowIssues !== null) {
                            const errorMessages = [];
                            let nodeIssues;
                            for (const nodeName of Object.keys(workflowIssues)) {
                                nodeIssues = n8n_workflow_1.NodeHelpers.nodeIssuesToString(workflowIssues[nodeName]);
                                for (const nodeIssue of nodeIssues) {
                                    errorMessages.push(`${nodeName}: ${nodeIssue}`);
                                }
                            }
                            this.$showMessage({
                                title: this.$locale.baseText('workflowRun.showMessage.title'),
                                message: this.$locale.baseText('workflowRun.showMessage.message') + ':<br />&nbsp;&nbsp;- ' + errorMessages.join('<br />&nbsp;&nbsp;- '),
                                type: 'error',
                                duration: 0,
                            });
                            this.$titleSet(workflow.name, 'ERROR');
                            this.$externalHooks().run('workflowRun.runError', { errorMessages, nodeName });
                            return;
                        }
                    }
                    // Get the direct parents of the node
                    let directParentNodes = [];
                    if (nodeName !== undefined) {
                        directParentNodes = workflow.getParentNodes(nodeName, 'main', 1);
                    }
                    const runData = this.$store.getters.getWorkflowRunData;
                    let newRunData;
                    const startNodes = [];
                    if (runData !== null && Object.keys(runData).length !== 0) {
                        newRunData = {};
                        // Go over the direct parents of the node
                        for (const directParentNode of directParentNodes) {
                            // Go over the parents of that node so that we can get a start
                            // node for each of the branches
                            const parentNodes = workflow.getParentNodes(directParentNode, 'main');
                            // Add also the direct parent to be checked
                            parentNodes.push(directParentNode);
                            for (const parentNode of parentNodes) {
                                if (runData[parentNode] === undefined || runData[parentNode].length === 0) {
                                    // When we hit a node which has no data we stop and set it
                                    // as a start node the execution from and then go on with other
                                    // direct input nodes
                                    startNodes.push(parentNode);
                                    break;
                                }
                                newRunData[parentNode] = runData[parentNode].slice(0, 1);
                            }
                        }
                        if (Object.keys(newRunData).length === 0) {
                            // If there is no data for any of the parent nodes make sure
                            // that run data is empty that it runs regularly
                            newRunData = undefined;
                        }
                    }
                    if (startNodes.length === 0 && nodeName !== undefined) {
                        startNodes.push(nodeName);
                    }
                    const isNewWorkflow = this.$store.getters.isNewWorkflow;
                    const hasWebhookNode = this.$store.getters.currentWorkflowHasWebhookNode;
                    if (isNewWorkflow && hasWebhookNode) {
                        yield this.saveCurrentWorkflow();
                    }
                    const workflowData = yield this.getWorkflowDataToSave();
                    const startRunData = {
                        workflowData,
                        runData: newRunData,
                        startNodes,
                    };
                    if (nodeName) {
                        startRunData.destinationNode = nodeName;
                    }
                    // Init the execution data to represent the start of the execution
                    // that data which gets reused is already set and data of newly executed
                    // nodes can be added as it gets pushed in
                    const executionData = {
                        id: '__IN_PROGRESS__',
                        finished: false,
                        mode: 'manual',
                        startedAt: new Date(),
                        stoppedAt: undefined,
                        workflowId: workflow.id,
                        executedNode: nodeName,
                        data: {
                            resultData: {
                                runData: newRunData || {},
                                startNodes,
                                workflowData,
                            },
                        },
                        workflowData: Object.assign({ id: this.$store.getters.workflowId, name: workflowData.name, active: workflowData.active, createdAt: 0, updatedAt: 0 }, workflowData),
                    };
                    this.$store.commit('setWorkflowExecutionData', executionData);
                    this.updateNodesExecutionIssues();
                    const runWorkflowApiResponse = yield this.runWorkflowApi(startRunData);
                    this.$externalHooks().run('workflowRun.runWorkflow', { nodeName, source });
                    return runWorkflowApiResponse;
                }
                catch (error) {
                    this.$titleSet(workflow.name, 'ERROR');
                    this.$showError(error, this.$locale.baseText('workflowRun.showError.title'));
                    return undefined;
                }
            });
        },
    },
});

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
exports.pushConnection = void 0;
const externalHooks_1 = require("@/components/mixins/externalHooks");
const nodeHelpers_1 = require("@/components/mixins/nodeHelpers");
const showMessage_1 = require("@/components/mixins/showMessage");
const titleChange_1 = require("@/components/mixins/titleChange");
const workflowHelpers_1 = require("@/components/mixins/workflowHelpers");
const vue_typed_mixins_1 = __importDefault(require("vue-typed-mixins"));
const constants_1 = require("@/constants");
const helpers_1 = require("../helpers");
exports.pushConnection = (0, vue_typed_mixins_1.default)(externalHooks_1.externalHooks, nodeHelpers_1.nodeHelpers, showMessage_1.showMessage, titleChange_1.titleChange, workflowHelpers_1.workflowHelpers)
    .extend({
    data() {
        return {
            eventSource: null,
            reconnectTimeout: null,
            retryTimeout: null,
            pushMessageQueue: [],
        };
    },
    computed: {
        sessionId() {
            return this.$store.getters.sessionId;
        },
    },
    methods: {
        pushAutomaticReconnect() {
            if (this.reconnectTimeout !== null) {
                return;
            }
            this.reconnectTimeout = setTimeout(() => {
                this.pushConnect();
            }, 3000);
        },
        /**
         * Connect to server to receive data via EventSource
         */
        pushConnect() {
            // Make sure existing event-source instances get
            // always removed that we do not end up with multiple ones
            this.pushDisconnect();
            const connectionUrl = `${this.$store.getters.getRestUrl}/push?sessionId=${this.sessionId}`;
            this.eventSource = new EventSource(connectionUrl, { withCredentials: true });
            this.eventSource.addEventListener('message', this.pushMessageReceived, false);
            this.eventSource.addEventListener('open', () => {
                this.$store.commit('setPushConnectionActive', true);
                if (this.reconnectTimeout !== null) {
                    clearTimeout(this.reconnectTimeout);
                    this.reconnectTimeout = null;
                }
            }, false);
            this.eventSource.addEventListener('error', () => {
                this.pushDisconnect();
                if (this.reconnectTimeout !== null) {
                    clearTimeout(this.reconnectTimeout);
                    this.reconnectTimeout = null;
                }
                this.$store.commit('setPushConnectionActive', false);
                this.pushAutomaticReconnect();
            }, false);
        },
        /**
         * Close connection to server
         */
        pushDisconnect() {
            if (this.eventSource !== null) {
                this.eventSource.close();
                this.eventSource = null;
                this.$store.commit('setPushConnectionActive', false);
            }
        },
        /**
         * Sometimes the push message is faster as the result from
         * the REST API so we do not know yet what execution ID
         * is currently active. So internally resend the message
         * a few more times
         *
         * @param {Event} event
         * @param {number} retryAttempts
         * @returns
         */
        queuePushMessage(event, retryAttempts) {
            this.pushMessageQueue.push({ event, retriesLeft: retryAttempts });
            if (this.retryTimeout === null) {
                this.retryTimeout = setTimeout(this.processWaitingPushMessages, 20);
            }
        },
        /**
         * Process the push messages which are waiting in the queue
         */
        processWaitingPushMessages() {
            if (this.retryTimeout !== null) {
                clearTimeout(this.retryTimeout);
                this.retryTimeout = null;
            }
            const queueLength = this.pushMessageQueue.length;
            for (let i = 0; i < queueLength; i++) {
                const messageData = this.pushMessageQueue.shift();
                if (this.pushMessageReceived(messageData.event, true) === false) {
                    // Was not successful
                    messageData.retriesLeft -= 1;
                    if (messageData.retriesLeft > 0) {
                        // If still retries are left add it back and stop execution
                        this.pushMessageQueue.unshift(messageData);
                    }
                    break;
                }
            }
            if (this.pushMessageQueue.length !== 0 && this.retryTimeout === null) {
                this.retryTimeout = setTimeout(this.processWaitingPushMessages, 25);
            }
        },
        /**
         * Process a newly received message
         *
         * @param {Event} event The event data with the message data
         * @param {boolean} [isRetry] If it is a retry
         * @returns {boolean} If message could be processed
         */
        pushMessageReceived(event, isRetry) {
            const retryAttempts = 5;
            let receivedData;
            try {
                // @ts-ignore
                receivedData = JSON.parse(event.data);
            }
            catch (error) {
                return false;
            }
            if (receivedData.type === 'sendConsoleMessage') {
                const pushData = receivedData.data;
                console.log(pushData.source, ...pushData.messages); // eslint-disable-line no-console
                return true;
            }
            if (!['testWebhookReceived'].includes(receivedData.type) && isRetry !== true && this.pushMessageQueue.length) {
                // If there are already messages in the queue add the new one that all of them
                // get executed in order
                this.queuePushMessage(event, retryAttempts);
                return false;
            }
            if (receivedData.type === 'nodeExecuteAfter' || receivedData.type === 'nodeExecuteBefore') {
                if (this.$store.getters.isActionActive('workflowRunning') === false) {
                    // No workflow is running so ignore the messages
                    return false;
                }
                const pushData = receivedData.data;
                if (this.$store.getters.activeExecutionId !== pushData.executionId) {
                    // The data is not for the currently active execution or
                    // we do not have the execution id yet.
                    if (isRetry !== true) {
                        this.queuePushMessage(event, retryAttempts);
                    }
                    return false;
                }
            }
            if (receivedData.type === 'executionFinished') {
                // The workflow finished executing
                const pushData = receivedData.data;
                this.$store.commit('finishActiveExecution', pushData);
                if (this.$store.getters.isActionActive('workflowRunning') === false) {
                    // No workflow is running so ignore the messages
                    return false;
                }
                if (this.$store.getters.activeExecutionId !== pushData.executionId) {
                    // The workflow which did finish execution did either not get started
                    // by this session or we do not have the execution id yet.
                    if (isRetry !== true) {
                        this.queuePushMessage(event, retryAttempts);
                    }
                    return false;
                }
                const runDataExecuted = pushData.data;
                const runDataExecutedErrorMessage = this.$getExecutionError(runDataExecuted.data.resultData.error);
                // @ts-ignore
                const workflow = this.getWorkflow();
                if (runDataExecuted.waitTill !== undefined) {
                    const { activeExecutionId, workflowSettings, saveManualExecutions, } = this.$store.getters;
                    const isSavingExecutions = workflowSettings.saveManualExecutions === undefined ? saveManualExecutions : workflowSettings.saveManualExecutions;
                    let action;
                    if (!isSavingExecutions) {
                        action = '<a class="open-settings">Turn on saving manual executions</a> and run again to see what happened after this node.';
                    }
                    else {
                        action = `<a href="/execution/${activeExecutionId}" target="_blank">View the execution</a> to see what happened after this node.`;
                    }
                    // Workflow did start but had been put to wait
                    this.$titleSet(workflow.name, 'IDLE');
                    this.$showToast({
                        title: 'Workflow started waiting',
                        message: `${action} <a href="https://docs.n8n.io/nodes/n8n-nodes-base.wait/" target="_blank">More info</a>`,
                        type: 'success',
                        duration: 0,
                        onLinkClick: (e) => __awaiter(this, void 0, void 0, function* () {
                            if (e.classList.contains('open-settings')) {
                                if (this.$store.getters.isNewWorkflow) {
                                    yield this.saveAsNewWorkflow();
                                }
                                this.$store.dispatch('ui/openModal', constants_1.WORKFLOW_SETTINGS_MODAL_KEY);
                            }
                        }),
                    });
                }
                else if (runDataExecuted.finished !== true) {
                    this.$titleSet(workflow.name, 'ERROR');
                    this.$showMessage({
                        title: 'Problem executing workflow',
                        message: runDataExecutedErrorMessage,
                        type: 'error',
                        duration: 0,
                    });
                }
                else {
                    // Workflow did execute without a problem
                    this.$titleSet(workflow.name, 'IDLE');
                    const execution = this.$store.getters.getWorkflowExecution;
                    if (execution && execution.executedNode) {
                        const node = this.$store.getters.getNodeByName(execution.executedNode);
                        const nodeType = node && this.$store.getters.nodeType(node.type, node.typeVersion);
                        const nodeOutput = execution && execution.executedNode && execution.data && execution.data.resultData && execution.data.resultData.runData && execution.data.resultData.runData[execution.executedNode];
                        if (node && nodeType && !nodeOutput) {
                            this.$showMessage({
                                title: this.$locale.baseText('pushConnection.pollingNode.dataNotFound', {
                                    interpolate: {
                                        service: (0, helpers_1.getTriggerNodeServiceName)(nodeType),
                                    },
                                }),
                                message: this.$locale.baseText('pushConnection.pollingNode.dataNotFound.message', {
                                    interpolate: {
                                        service: (0, helpers_1.getTriggerNodeServiceName)(nodeType),
                                    },
                                }),
                                type: 'success',
                            });
                        }
                        else {
                            this.$showMessage({
                                title: this.$locale.baseText('pushConnection.nodeExecutedSuccessfully'),
                                type: 'success',
                            });
                        }
                    }
                    else {
                        this.$showMessage({
                            title: this.$locale.baseText('pushConnection.workflowExecutedSuccessfully'),
                            type: 'success',
                        });
                    }
                }
                // It does not push the runData as it got already pushed with each
                // node that did finish. For that reason copy in here the data
                // which we already have.
                runDataExecuted.data.resultData.runData = this.$store.getters.getWorkflowRunData;
                this.$store.commit('setExecutingNode', null);
                this.$store.commit('setWorkflowExecutionData', runDataExecuted);
                this.$store.commit('removeActiveAction', 'workflowRunning');
                // Set the node execution issues on all the nodes which produced an error so that
                // it can be displayed in the node-view
                this.updateNodesExecutionIssues();
                let itemsCount = 0;
                if (runDataExecuted.data.resultData.lastNodeExecuted && !runDataExecutedErrorMessage) {
                    itemsCount = runDataExecuted.data.resultData.runData[runDataExecuted.data.resultData.lastNodeExecuted][0].data.main[0].length;
                }
                this.$externalHooks().run('pushConnection.executionFinished', {
                    itemsCount,
                    nodeName: runDataExecuted.data.resultData.lastNodeExecuted,
                    errorMessage: runDataExecutedErrorMessage,
                    runDataExecutedStartData: runDataExecuted.data.startData,
                    resultDataError: runDataExecuted.data.resultData.error,
                });
            }
            else if (receivedData.type === 'executionStarted') {
                const pushData = receivedData.data;
                const executionData = {
                    id: pushData.executionId,
                    finished: false,
                    mode: pushData.mode,
                    startedAt: pushData.startedAt,
                    retryOf: pushData.retryOf,
                    workflowId: pushData.workflowId,
                    workflowName: pushData.workflowName,
                };
                this.$store.commit('addActiveExecution', executionData);
            }
            else if (receivedData.type === 'nodeExecuteAfter') {
                // A node finished to execute. Add its data
                const pushData = receivedData.data;
                this.$store.commit('addNodeExecutionData', pushData);
            }
            else if (receivedData.type === 'nodeExecuteBefore') {
                // A node started to be executed. Set it as executing.
                const pushData = receivedData.data;
                this.$store.commit('setExecutingNode', pushData.nodeName);
            }
            else if (receivedData.type === 'testWebhookDeleted') {
                // A test-webhook was deleted
                const pushData = receivedData.data;
                if (pushData.workflowId === this.$store.getters.workflowId) {
                    this.$store.commit('setExecutionWaitingForWebhook', false);
                    this.$store.commit('removeActiveAction', 'workflowRunning');
                }
            }
            else if (receivedData.type === 'testWebhookReceived') {
                // A test-webhook did get called
                const pushData = receivedData.data;
                if (pushData.workflowId === this.$store.getters.workflowId) {
                    this.$store.commit('setExecutionWaitingForWebhook', false);
                    this.$store.commit('setActiveExecutionId', pushData.executionId);
                }
                this.processWaitingPushMessages();
            }
            return true;
        },
    },
});

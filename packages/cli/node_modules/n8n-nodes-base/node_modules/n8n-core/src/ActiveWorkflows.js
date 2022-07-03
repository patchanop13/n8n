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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveWorkflows = void 0;
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const cron_1 = require("cron");
const n8n_workflow_1 = require("n8n-workflow");
class ActiveWorkflows {
    constructor() {
        this.workflowData = {};
    }
    /**
     * Returns if the workflow is active
     *
     * @param {string} id The id of the workflow to check
     * @returns {boolean}
     * @memberof ActiveWorkflows
     */
    isActive(id) {
        // eslint-disable-next-line no-prototype-builtins
        return this.workflowData.hasOwnProperty(id);
    }
    /**
     * Returns the ids of the currently active workflows
     *
     * @returns {string[]}
     * @memberof ActiveWorkflows
     */
    allActiveWorkflows() {
        return Object.keys(this.workflowData);
    }
    /**
     * Returns the Workflow data for the workflow with
     * the given id if it is currently active
     *
     * @param {string} id
     * @returns {(WorkflowData | undefined)}
     * @memberof ActiveWorkflows
     */
    get(id) {
        return this.workflowData[id];
    }
    /**
     * Makes a workflow active
     *
     * @param {string} id The id of the workflow to activate
     * @param {Workflow} workflow The workflow to activate
     * @param {IWorkflowExecuteAdditionalData} additionalData The additional data which is needed to run workflows
     * @returns {Promise<void>}
     * @memberof ActiveWorkflows
     */
    add(id, workflow, additionalData, mode, activation, getTriggerFunctions, getPollFunctions) {
        return __awaiter(this, void 0, void 0, function* () {
            this.workflowData[id] = {};
            const triggerNodes = workflow.getTriggerNodes();
            let triggerResponse;
            this.workflowData[id].triggerResponses = [];
            for (const triggerNode of triggerNodes) {
                try {
                    triggerResponse = yield workflow.runTrigger(triggerNode, getTriggerFunctions, additionalData, mode, activation);
                    if (triggerResponse !== undefined) {
                        // If a response was given save it
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        this.workflowData[id].triggerResponses.push(triggerResponse);
                    }
                }
                catch (error) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    throw new n8n_workflow_1.WorkflowActivationError('There was a problem activating the workflow', error, triggerNode);
                }
            }
            const pollNodes = workflow.getPollNodes();
            if (pollNodes.length) {
                this.workflowData[id].pollResponses = [];
                for (const pollNode of pollNodes) {
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        this.workflowData[id].pollResponses.push(yield this.activatePolling(pollNode, workflow, additionalData, getPollFunctions, mode, activation));
                    }
                    catch (error) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        throw new n8n_workflow_1.WorkflowActivationError('There was a problem activating the workflow', error, pollNode);
                    }
                }
            }
        });
    }
    /**
     * Activates polling for the given node
     *
     * @param {INode} node
     * @param {Workflow} workflow
     * @param {IWorkflowExecuteAdditionalData} additionalData
     * @param {IGetExecutePollFunctions} getPollFunctions
     * @returns {Promise<IPollResponse>}
     * @memberof ActiveWorkflows
     */
    activatePolling(node, workflow, additionalData, getPollFunctions, mode, activation) {
        return __awaiter(this, void 0, void 0, function* () {
            const pollFunctions = getPollFunctions(workflow, node, additionalData, mode, activation);
            const pollTimes = pollFunctions.getNodeParameter('pollTimes');
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
            if (pollTimes.item !== undefined) {
                for (const item of pollTimes.item) {
                    cronTime = [];
                    if (item.mode === 'custom') {
                        cronTimes.push(item.cronExpression.trim());
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
            const executeTrigger = () => __awaiter(this, void 0, void 0, function* () {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                n8n_workflow_1.LoggerProxy.debug(`Polling trigger initiated for workflow "${workflow.name}"`, {
                    workflowName: workflow.name,
                    workflowId: workflow.id,
                });
                const pollResponse = yield workflow.runPoll(node, pollFunctions);
                if (pollResponse !== null) {
                    // eslint-disable-next-line no-underscore-dangle
                    pollFunctions.__emit(pollResponse);
                }
            });
            // Execute the trigger directly to be able to know if it works
            yield executeTrigger();
            const timezone = pollFunctions.getTimezone();
            // Start the cron-jobs
            const cronJobs = [];
            // eslint-disable-next-line @typescript-eslint/no-shadow
            for (const cronTime of cronTimes) {
                const cronTimeParts = cronTime.split(' ');
                if (cronTimeParts.length > 0 && cronTimeParts[0].includes('*')) {
                    throw new Error('The polling interval is too short. It has to be at least a minute!');
                }
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
            return {
                closeFunction,
            };
        });
    }
    /**
     * Makes a workflow inactive
     *
     * @param {string} id The id of the workflow to deactivate
     * @returns {Promise<void>}
     * @memberof ActiveWorkflows
     */
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isActive(id)) {
                // Workflow is currently not registered
                throw new Error(`The workflow with the id "${id}" is currently not active and can so not be removed`);
            }
            const workflowData = this.workflowData[id];
            if (workflowData.triggerResponses) {
                for (const triggerResponse of workflowData.triggerResponses) {
                    if (triggerResponse.closeFunction) {
                        try {
                            yield triggerResponse.closeFunction();
                        }
                        catch (error) {
                            n8n_workflow_1.LoggerProxy.error(
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
                            `There was a problem deactivating trigger of workflow "${id}": "${error.message}"`, {
                                workflowId: id,
                            });
                        }
                    }
                }
            }
            if (workflowData.pollResponses) {
                for (const pollResponse of workflowData.pollResponses) {
                    if (pollResponse.closeFunction) {
                        try {
                            yield pollResponse.closeFunction();
                        }
                        catch (error) {
                            n8n_workflow_1.LoggerProxy.error(
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
                            `There was a problem deactivating polling trigger of workflow "${id}": "${error.message}"`, {
                                workflowId: id,
                            });
                        }
                    }
                }
            }
            delete this.workflowData[id];
        });
    }
}
exports.ActiveWorkflows = ActiveWorkflows;

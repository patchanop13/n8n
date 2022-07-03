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
exports.WaitingWebhooks = void 0;
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-param-reassign */
const n8n_workflow_1 = require("n8n-workflow");
const _1 = require(".");
const UserManagementHelper_1 = require("./UserManagement/UserManagementHelper");
class WaitingWebhooks {
    executeWebhook(httpMethod, fullPath, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            n8n_workflow_1.LoggerProxy.debug(`Received waiting-webhoook "${httpMethod}" for path "${fullPath}"`);
            // Reset request parameters
            req.params = {};
            // Remove trailing slash
            if (fullPath.endsWith('/')) {
                fullPath = fullPath.slice(0, -1);
            }
            const pathParts = fullPath.split('/');
            const executionId = pathParts.shift();
            const path = pathParts.join('/');
            const execution = yield _1.Db.collections.Execution.findOne(executionId);
            if (execution === undefined) {
                throw new _1.ResponseHelper.ResponseError(`The execution "${executionId} does not exist.`, 404, 404);
            }
            const fullExecutionData = _1.ResponseHelper.unflattenExecutionData(execution);
            if (fullExecutionData.finished || fullExecutionData.data.resultData.error) {
                throw new _1.ResponseHelper.ResponseError(`The execution "${executionId} has finished already.`, 409, 409);
            }
            return this.startExecution(httpMethod, path, fullExecutionData, req, res);
        });
    }
    startExecution(httpMethod, path, fullExecutionData, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const executionId = fullExecutionData.id;
            if (fullExecutionData.finished) {
                throw new Error('The execution did succeed and can so not be started again.');
            }
            const lastNodeExecuted = fullExecutionData.data.resultData.lastNodeExecuted;
            // Set the node as disabled so that the data does not get executed again as it would result
            // in starting the wait all over again
            fullExecutionData.data.executionData.nodeExecutionStack[0].node.disabled = true;
            // Remove waitTill information else the execution would stop
            fullExecutionData.data.waitTill = undefined;
            // Remove the data of the node execution again else it will display the node as executed twice
            fullExecutionData.data.resultData.runData[lastNodeExecuted].pop();
            const { workflowData } = fullExecutionData;
            const nodeTypes = (0, _1.NodeTypes)();
            const workflow = new n8n_workflow_1.Workflow({
                id: workflowData.id.toString(),
                name: workflowData.name,
                nodes: workflowData.nodes,
                connections: workflowData.connections,
                active: workflowData.active,
                nodeTypes,
                staticData: workflowData.staticData,
                settings: workflowData.settings,
            });
            let workflowOwner;
            try {
                workflowOwner = yield (0, UserManagementHelper_1.getWorkflowOwner)(workflowData.id.toString());
            }
            catch (error) {
                throw new _1.ResponseHelper.ResponseError('Could not find workflow', undefined, 404);
            }
            const additionalData = yield _1.WorkflowExecuteAdditionalData.getBase(workflowOwner.id);
            const webhookData = n8n_workflow_1.NodeHelpers.getNodeWebhooks(workflow, workflow.getNode(lastNodeExecuted), additionalData).filter((webhook) => {
                return (webhook.httpMethod === httpMethod &&
                    webhook.path === path &&
                    webhook.webhookDescription.restartWebhook === true);
            })[0];
            if (webhookData === undefined) {
                // If no data got found it means that the execution can not be started via a webhook.
                // Return 404 because we do not want to give any data if the execution exists or not.
                const errorMessage = `The execution "${executionId}" with webhook suffix path "${path}" is not known.`;
                throw new _1.ResponseHelper.ResponseError(errorMessage, 404, 404);
            }
            const workflowStartNode = workflow.getNode(lastNodeExecuted);
            if (workflowStartNode === null) {
                throw new _1.ResponseHelper.ResponseError('Could not find node to process webhook.', 404, 404);
            }
            const runExecutionData = fullExecutionData.data;
            return new Promise((resolve, reject) => {
                const executionMode = 'webhook';
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                _1.WebhookHelpers.executeWebhook(workflow, webhookData, workflowData, workflowStartNode, executionMode, undefined, runExecutionData, fullExecutionData.id, req, res, 
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
}
exports.WaitingWebhooks = WaitingWebhooks;

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebhookBaseUrl = exports.executeWebhook = exports.encodeWebhookResponse = exports.decodeWebhookResponse = exports.getWorkflowWebhooks = exports.WEBHOOK_METHODS = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const lodash_1 = require("lodash");
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
// eslint-disable-next-line import/no-cycle
const ActiveExecutions = __importStar(require("./ActiveExecutions"));
const UserManagementHelper_1 = require("./UserManagement/UserManagementHelper");
const activeExecutions = ActiveExecutions.getInstance();
exports.WEBHOOK_METHODS = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'];
/**
 * Returns all the webhooks which should be created for the give workflow
 *
 * @export
 * @param {string} workflowId
 * @param {Workflow} workflow
 * @returns {IWebhookData[]}
 */
function getWorkflowWebhooks(workflow, additionalData, destinationNode, ignoreRestartWehbooks = false) {
    // Check all the nodes in the workflow if they have webhooks
    const returnData = [];
    let parentNodes;
    if (destinationNode !== undefined) {
        parentNodes = workflow.getParentNodes(destinationNode);
        // Also add the destination node in case it itself is a webhook node
        parentNodes.push(destinationNode);
    }
    for (const node of Object.values(workflow.nodes)) {
        if (parentNodes !== undefined && !parentNodes.includes(node.name)) {
            // If parentNodes are given check only them if they have webhooks
            // and no other ones
            // eslint-disable-next-line no-continue
            continue;
        }
        returnData.push.apply(returnData, n8n_workflow_1.NodeHelpers.getNodeWebhooks(workflow, node, additionalData, ignoreRestartWehbooks));
    }
    return returnData;
}
exports.getWorkflowWebhooks = getWorkflowWebhooks;
function decodeWebhookResponse(response) {
    if (typeof response === 'object' &&
        typeof response.body === 'object' &&
        response.body['__@N8nEncodedBuffer@__']) {
        response.body = Buffer.from(response.body['__@N8nEncodedBuffer@__'], n8n_core_1.BINARY_ENCODING);
    }
    return response;
}
exports.decodeWebhookResponse = decodeWebhookResponse;
function encodeWebhookResponse(response) {
    if (typeof response === 'object' && Buffer.isBuffer(response.body)) {
        response.body = {
            '__@N8nEncodedBuffer@__': response.body.toString(n8n_core_1.BINARY_ENCODING),
        };
    }
    return response;
}
exports.encodeWebhookResponse = encodeWebhookResponse;
/**
 * Executes a webhook
 *
 * @export
 * @param {IWebhookData} webhookData
 * @param {IWorkflowDb} workflowData
 * @param {INode} workflowStartNode
 * @param {WorkflowExecuteMode} executionMode
 * @param {(string | undefined)} sessionId
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {((error: Error | null, data: IResponseCallbackData) => void)} responseCallback
 * @returns {(Promise<string | undefined>)}
 */
function executeWebhook(workflow, webhookData, workflowData, workflowStartNode, executionMode, sessionId, runExecutionData, executionId, req, res, responseCallback) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // Get the nodeType to know which responseMode is set
        const nodeType = workflow.nodeTypes.getByNameAndVersion(workflowStartNode.type, workflowStartNode.typeVersion);
        if (nodeType === undefined) {
            const errorMessage = `The type of the webhook node "${workflowStartNode.name}" is not known`;
            responseCallback(new Error(errorMessage), {});
            throw new _1.ResponseHelper.ResponseError(errorMessage, 500, 500);
        }
        const additionalKeys = {
            $executionId: executionId,
        };
        let user;
        if (((_a = workflowData.shared) === null || _a === void 0 ? void 0 : _a.length) &&
            workflowData.shared[0].user) {
            user = workflowData.shared[0].user;
        }
        else {
            try {
                user = yield (0, UserManagementHelper_1.getWorkflowOwner)(workflowData.id.toString());
            }
            catch (error) {
                throw new _1.ResponseHelper.ResponseError('Cannot find workflow', undefined, 404);
            }
        }
        // Prepare everything that is needed to run the workflow
        const additionalData = yield _1.WorkflowExecuteAdditionalData.getBase(user.id);
        // Get the responseMode
        const responseMode = workflow.expression.getSimpleParameterValue(workflowStartNode, webhookData.webhookDescription.responseMode, executionMode, additionalData.timezone, additionalKeys, undefined, 'onReceived');
        const responseCode = workflow.expression.getSimpleParameterValue(workflowStartNode, webhookData.webhookDescription.responseCode, executionMode, additionalData.timezone, additionalKeys, undefined, 200);
        const responseData = workflow.expression.getSimpleParameterValue(workflowStartNode, webhookData.webhookDescription.responseData, executionMode, additionalData.timezone, additionalKeys, undefined, 'firstEntryJson');
        if (!['onReceived', 'lastNode', 'responseNode'].includes(responseMode)) {
            // If the mode is not known we error. Is probably best like that instead of using
            // the default that people know as early as possible (probably already testing phase)
            // that something does not resolve properly.
            const errorMessage = `The response mode '${responseMode}' is not valid!`;
            responseCallback(new Error(errorMessage), {});
            throw new _1.ResponseHelper.ResponseError(errorMessage, 500, 500);
        }
        // Add the Response and Request so that this data can be accessed in the node
        additionalData.httpRequest = req;
        additionalData.httpResponse = res;
        let didSendResponse = false;
        let runExecutionDataMerge = {};
        try {
            // Run the webhook function to see what should be returned and if
            // the workflow should be executed or not
            let webhookResultData;
            try {
                webhookResultData = yield workflow.runWebhook(webhookData, workflowStartNode, additionalData, n8n_core_1.NodeExecuteFunctions, executionMode);
            }
            catch (err) {
                // Send error response to webhook caller
                const errorMessage = 'Workflow Webhook Error: Workflow could not be started!';
                responseCallback(new Error(errorMessage), {});
                didSendResponse = true;
                // Add error to execution data that it can be logged and send to Editor-UI
                runExecutionDataMerge = {
                    resultData: {
                        runData: {},
                        lastNodeExecuted: workflowStartNode.name,
                        error: Object.assign(Object.assign({}, err), { message: err.message, stack: err.stack }),
                    },
                };
                webhookResultData = {
                    noWebhookResponse: true,
                    // Add empty data that it at least tries to "execute" the webhook
                    // which then so gets the chance to throw the error.
                    workflowData: [[{ json: {} }]],
                };
            }
            // Save static data if it changed
            yield _1.WorkflowHelpers.saveStaticData(workflow);
            const additionalKeys = {
                $executionId: executionId,
            };
            if (webhookData.webhookDescription.responseHeaders !== undefined) {
                const responseHeaders = workflow.expression.getComplexParameterValue(workflowStartNode, webhookData.webhookDescription.responseHeaders, executionMode, additionalData.timezone, additionalKeys, undefined, undefined);
                if (responseHeaders !== undefined && responseHeaders.entries !== undefined) {
                    for (const item of responseHeaders.entries) {
                        res.setHeader(item.name, item.value);
                    }
                }
            }
            if (webhookResultData.noWebhookResponse === true && !didSendResponse) {
                // The response got already send
                responseCallback(null, {
                    noWebhookResponse: true,
                });
                didSendResponse = true;
            }
            if (webhookResultData.workflowData === undefined) {
                // Workflow should not run
                if (webhookResultData.webhookResponse !== undefined) {
                    // Data to respond with is given
                    if (!didSendResponse) {
                        responseCallback(null, {
                            data: webhookResultData.webhookResponse,
                            responseCode,
                        });
                        didSendResponse = true;
                    }
                }
                else {
                    // Send default response
                    // eslint-disable-next-line no-lonely-if
                    if (!didSendResponse) {
                        responseCallback(null, {
                            data: {
                                message: 'Webhook call received',
                            },
                            responseCode,
                        });
                        didSendResponse = true;
                    }
                }
                return;
            }
            // Now that we know that the workflow should run we can return the default response
            // directly if responseMode it set to "onReceived" and a respone should be sent
            if (responseMode === 'onReceived' && !didSendResponse) {
                // Return response directly and do not wait for the workflow to finish
                if (responseData === 'noData') {
                    // Return without data
                    responseCallback(null, {
                        responseCode,
                    });
                }
                else if (webhookResultData.webhookResponse !== undefined) {
                    // Data to respond with is given
                    responseCallback(null, {
                        data: webhookResultData.webhookResponse,
                        responseCode,
                    });
                }
                else {
                    responseCallback(null, {
                        data: {
                            message: 'Workflow was started',
                        },
                        responseCode,
                    });
                }
                didSendResponse = true;
            }
            // Initialize the data of the webhook node
            const nodeExecutionStack = [];
            nodeExecutionStack.push({
                node: workflowStartNode,
                data: {
                    main: webhookResultData.workflowData,
                },
                source: null,
            });
            runExecutionData =
                runExecutionData ||
                    {
                        startData: {},
                        resultData: {
                            runData: {},
                        },
                        executionData: {
                            contextData: {},
                            nodeExecutionStack,
                            waitingExecution: {},
                        },
                    };
            if (executionId !== undefined) {
                // Set the data the webhook node did return on the waiting node if executionId
                // already exists as it means that we are restarting an existing execution.
                runExecutionData.executionData.nodeExecutionStack[0].data.main =
                    webhookResultData.workflowData;
            }
            if (Object.keys(runExecutionDataMerge).length !== 0) {
                // If data to merge got defined add it to the execution data
                Object.assign(runExecutionData, runExecutionDataMerge);
            }
            const runData = {
                executionMode,
                executionData: runExecutionData,
                sessionId,
                workflowData,
                userId: user.id,
            };
            let responsePromise;
            if (responseMode === 'responseNode') {
                responsePromise = yield (0, n8n_workflow_1.createDeferredPromise)();
                responsePromise
                    .promise()
                    .then((response) => {
                    if (didSendResponse) {
                        return;
                    }
                    if (Buffer.isBuffer(response.body)) {
                        res.header(response.headers);
                        res.end(response.body);
                        responseCallback(null, {
                            noWebhookResponse: true,
                        });
                    }
                    else {
                        // TODO: This probably needs some more changes depending on the options on the
                        //       Webhook Response node
                        responseCallback(null, {
                            data: response.body,
                            headers: response.headers,
                            responseCode: response.statusCode,
                        });
                    }
                    didSendResponse = true;
                })
                    .catch((error) => __awaiter(this, void 0, void 0, function* () {
                    n8n_workflow_1.LoggerProxy.error(`Error with Webhook-Response for execution "${executionId}": "${error.message}"`, { executionId, workflowId: workflow.id });
                }));
            }
            // Start now to run the workflow
            const workflowRunner = new _1.WorkflowRunner();
            executionId = yield workflowRunner.run(runData, true, !didSendResponse, executionId, responsePromise);
            n8n_workflow_1.LoggerProxy.verbose(`Started execution of workflow "${workflow.name}" from webhook with execution ID ${executionId}`, { executionId });
            // Get a promise which resolves when the workflow did execute and send then response
            const executePromise = activeExecutions.getPostExecutePromise(executionId);
            executePromise
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                if (data === undefined) {
                    if (!didSendResponse) {
                        responseCallback(null, {
                            data: {
                                message: 'Workflow executed sucessfully but no data was returned',
                            },
                            responseCode,
                        });
                        didSendResponse = true;
                    }
                    return undefined;
                }
                const returnData = _1.WorkflowHelpers.getDataLastExecutedNodeData(data);
                if (data.data.resultData.error || (returnData === null || returnData === void 0 ? void 0 : returnData.error) !== undefined) {
                    if (!didSendResponse) {
                        responseCallback(null, {
                            data: {
                                message: 'Error in workflow',
                            },
                            responseCode: 500,
                        });
                    }
                    didSendResponse = true;
                    return data;
                }
                if (responseMode === 'responseNode') {
                    if (!didSendResponse) {
                        // Return an error if no Webhook-Response node did send any data
                        responseCallback(null, {
                            data: {
                                message: 'Workflow executed sucessfully',
                            },
                            responseCode,
                        });
                        didSendResponse = true;
                    }
                    return undefined;
                }
                if (returnData === undefined) {
                    if (!didSendResponse) {
                        responseCallback(null, {
                            data: {
                                message: 'Workflow executed sucessfully but the last node did not return any data',
                            },
                            responseCode,
                        });
                    }
                    didSendResponse = true;
                    return data;
                }
                const additionalKeys = {
                    $executionId: executionId,
                };
                if (!didSendResponse) {
                    let data;
                    if (responseData === 'firstEntryJson') {
                        // Return the JSON data of the first entry
                        if (returnData.data.main[0][0] === undefined) {
                            responseCallback(new Error('No item to return got found'), {});
                            didSendResponse = true;
                            return undefined;
                        }
                        data = returnData.data.main[0][0].json;
                        const responsePropertyName = workflow.expression.getSimpleParameterValue(workflowStartNode, webhookData.webhookDescription.responsePropertyName, executionMode, additionalData.timezone, additionalKeys, undefined, undefined);
                        if (responsePropertyName !== undefined) {
                            data = (0, lodash_1.get)(data, responsePropertyName);
                        }
                        const responseContentType = workflow.expression.getSimpleParameterValue(workflowStartNode, webhookData.webhookDescription.responseContentType, executionMode, additionalData.timezone, additionalKeys, undefined, undefined);
                        if (responseContentType !== undefined) {
                            // Send the webhook response manually to be able to set the content-type
                            res.setHeader('Content-Type', responseContentType);
                            // Returning an object, boolean, number, ... causes problems so make sure to stringify if needed
                            if (data !== null &&
                                data !== undefined &&
                                ['Buffer', 'String'].includes(data.constructor.name)) {
                                res.end(data);
                            }
                            else {
                                res.end(JSON.stringify(data));
                            }
                            responseCallback(null, {
                                noWebhookResponse: true,
                            });
                            didSendResponse = true;
                        }
                    }
                    else if (responseData === 'firstEntryBinary') {
                        // Return the binary data of the first entry
                        data = returnData.data.main[0][0];
                        if (data === undefined) {
                            responseCallback(new Error('No item was found to return'), {});
                            didSendResponse = true;
                            return undefined;
                        }
                        if (data.binary === undefined) {
                            responseCallback(new Error('No binary data was found to return'), {});
                            didSendResponse = true;
                            return undefined;
                        }
                        const responseBinaryPropertyName = workflow.expression.getSimpleParameterValue(workflowStartNode, webhookData.webhookDescription.responseBinaryPropertyName, executionMode, additionalData.timezone, additionalKeys, undefined, 'data');
                        if (responseBinaryPropertyName === undefined && !didSendResponse) {
                            responseCallback(new Error("No 'responseBinaryPropertyName' is set"), {});
                            didSendResponse = true;
                        }
                        const binaryData = data.binary[responseBinaryPropertyName];
                        if (binaryData === undefined && !didSendResponse) {
                            responseCallback(new Error(`The binary property '${responseBinaryPropertyName}' which should be returned does not exist`), {});
                            didSendResponse = true;
                        }
                        if (!didSendResponse) {
                            // Send the webhook response manually
                            res.setHeader('Content-Type', binaryData.mimeType);
                            const binaryDataBuffer = yield n8n_core_1.BinaryDataManager.getInstance().retrieveBinaryData(binaryData);
                            res.end(binaryDataBuffer);
                            responseCallback(null, {
                                noWebhookResponse: true,
                            });
                        }
                    }
                    else if (responseData === 'noData') {
                        // Return without data
                        data = undefined;
                    }
                    else {
                        // Return the JSON data of all the entries
                        data = [];
                        for (const entry of returnData.data.main[0]) {
                            data.push(entry.json);
                        }
                    }
                    if (!didSendResponse) {
                        responseCallback(null, {
                            data,
                            responseCode,
                        });
                    }
                }
                didSendResponse = true;
                return data;
            }))
                .catch((e) => {
                if (!didSendResponse) {
                    responseCallback(new Error('There was a problem executing the workflow'), {});
                }
                throw new _1.ResponseHelper.ResponseError(e.message, 500, 500);
            });
            // eslint-disable-next-line consistent-return
            return executionId;
        }
        catch (e) {
            if (!didSendResponse) {
                responseCallback(new Error('There was a problem executing the workflow'), {});
            }
            throw new _1.ResponseHelper.ResponseError(e.message, 500, 500);
        }
    });
}
exports.executeWebhook = executeWebhook;
/**
 * Returns the base URL of the webhooks
 *
 * @export
 * @returns
 */
function getWebhookBaseUrl() {
    let urlBaseWebhook = _1.GenericHelpers.getBaseUrl();
    // We renamed WEBHOOK_TUNNEL_URL to WEBHOOK_URL. This is here to maintain
    // backward compatibility. Will be deprecated and removed in the future.
    if (process.env.WEBHOOK_TUNNEL_URL !== undefined || process.env.WEBHOOK_URL !== undefined) {
        // @ts-ignore
        urlBaseWebhook = process.env.WEBHOOK_TUNNEL_URL || process.env.WEBHOOK_URL;
    }
    if (!urlBaseWebhook.endsWith('/')) {
        urlBaseWebhook += '/';
    }
    return urlBaseWebhook;
}
exports.getWebhookBaseUrl = getWebhookBaseUrl;

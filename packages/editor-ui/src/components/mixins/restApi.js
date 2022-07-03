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
exports.restApi = void 0;
const vue_1 = __importDefault(require("vue"));
const flatted_1 = require("flatted");
const helpers_1 = require("@/api/helpers");
/**
 * Unflattens the Execution data.
 *
 * @export
 * @param {IExecutionFlattedResponse} fullExecutionData The data to unflatten
 * @returns {IExecutionResponse}
 */
function unflattenExecutionData(fullExecutionData) {
    // Unflatten the data
    const returnData = Object.assign(Object.assign({}, fullExecutionData), { workflowData: fullExecutionData.workflowData, data: (0, flatted_1.parse)(fullExecutionData.data) });
    returnData.finished = returnData.finished ? returnData.finished : false;
    if (fullExecutionData.id) {
        returnData.id = fullExecutionData.id;
    }
    return returnData;
}
exports.restApi = vue_1.default.extend({
    methods: {
        restApi() {
            const self = this;
            return {
                makeRestApiRequest(method, endpoint, data) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return (0, helpers_1.makeRestApiRequest)(self.$store.getters.getRestApiContext, method, endpoint, data);
                    });
                },
                getActiveWorkflows: () => {
                    return self.restApi().makeRestApiRequest('GET', `/active`);
                },
                getActivationError: (id) => {
                    return self.restApi().makeRestApiRequest('GET', `/active/error/${id}`);
                },
                getCurrentExecutions: (filter) => {
                    let sendData = {};
                    if (filter) {
                        sendData = {
                            filter,
                        };
                    }
                    return self.restApi().makeRestApiRequest('GET', `/executions-current`, sendData);
                },
                stopCurrentExecution: (executionId) => {
                    return self.restApi().makeRestApiRequest('POST', `/executions-current/${executionId}/stop`);
                },
                getCredentialTranslation: (credentialType) => {
                    return self.restApi().makeRestApiRequest('GET', '/credential-translation', { credentialType });
                },
                getNodeTranslationHeaders: () => {
                    return self.restApi().makeRestApiRequest('GET', '/node-translation-headers');
                },
                // Returns all node-types
                getNodeTypes: (onlyLatest = false) => {
                    return self.restApi().makeRestApiRequest('GET', `/node-types`, { onlyLatest });
                },
                getNodesInformation: (nodeInfos) => {
                    return self.restApi().makeRestApiRequest('POST', `/node-types`, { nodeInfos });
                },
                // Returns all the parameter options from the server
                getNodeParameterOptions: (sendData) => {
                    return self.restApi().makeRestApiRequest('GET', '/node-parameter-options', sendData);
                },
                // Removes a test webhook
                removeTestWebhook: (workflowId) => {
                    return self.restApi().makeRestApiRequest('DELETE', `/test-webhook/${workflowId}`);
                },
                // Execute a workflow
                runWorkflow: (startRunData) => __awaiter(this, void 0, void 0, function* () {
                    return self.restApi().makeRestApiRequest('POST', `/workflows/run`, startRunData);
                }),
                // Creates a new workflow
                createNewWorkflow: (sendData) => {
                    return self.restApi().makeRestApiRequest('POST', `/workflows`, sendData);
                },
                // Updates an existing workflow
                updateWorkflow: (id, data) => {
                    return self.restApi().makeRestApiRequest('PATCH', `/workflows/${id}`, data);
                },
                // Deletes a workflow
                deleteWorkflow: (name) => {
                    return self.restApi().makeRestApiRequest('DELETE', `/workflows/${name}`);
                },
                // Returns the workflow with the given name
                getWorkflow: (id) => {
                    return self.restApi().makeRestApiRequest('GET', `/workflows/${id}`);
                },
                // Returns all saved workflows
                getWorkflows: (filter) => {
                    let sendData;
                    if (filter) {
                        sendData = {
                            filter,
                        };
                    }
                    return self.restApi().makeRestApiRequest('GET', `/workflows`, sendData);
                },
                // Returns a workflow from a given URL
                getWorkflowFromUrl: (url) => {
                    return self.restApi().makeRestApiRequest('GET', `/workflows/from-url`, { url });
                },
                // Returns the execution with the given name
                getExecution: (id) => __awaiter(this, void 0, void 0, function* () {
                    const response = yield self.restApi().makeRestApiRequest('GET', `/executions/${id}`);
                    return unflattenExecutionData(response);
                }),
                // Deletes executions
                deleteExecutions: (sendData) => {
                    return self.restApi().makeRestApiRequest('POST', `/executions/delete`, sendData);
                },
                // Returns the execution with the given name
                retryExecution: (id, loadWorkflow) => {
                    let sendData;
                    if (loadWorkflow === true) {
                        sendData = {
                            loadWorkflow: true,
                        };
                    }
                    return self.restApi().makeRestApiRequest('POST', `/executions/${id}/retry`, sendData);
                },
                // Returns all saved executions
                // TODO: For sure needs some kind of default filter like last day, with max 10 results, ...
                getPastExecutions: (filter, limit, lastId, firstId) => {
                    let sendData = {};
                    if (filter) {
                        sendData = {
                            filter,
                            firstId,
                            lastId,
                            limit,
                        };
                    }
                    return self.restApi().makeRestApiRequest('GET', `/executions`, sendData);
                },
                // Returns all the available timezones
                getTimezones: () => {
                    return self.restApi().makeRestApiRequest('GET', `/options/timezones`);
                },
                // Binary data
                getBinaryBufferString: (dataPath) => {
                    return self.restApi().makeRestApiRequest('GET', `/data/${dataPath}`);
                },
            };
        },
    },
});

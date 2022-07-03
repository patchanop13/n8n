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
exports.WorkflowExecuteAdditionalData = exports.NodeTypes = exports.getExecuteSingleFunctions = exports.getExecuteFunctions = exports.getNodeParameter = exports.CredentialsHelper = exports.Credentials = void 0;
const lodash_get_1 = __importDefault(require("lodash.get"));
const src_1 = require("../src");
class Credentials extends src_1.ICredentials {
    hasNodeAccess(nodeType) {
        return true;
    }
    setData(data, encryptionKey) {
        this.data = JSON.stringify(data);
    }
    setDataKey(key, data, encryptionKey) {
        let fullData;
        try {
            fullData = this.getData(encryptionKey);
        }
        catch (e) {
            fullData = {};
        }
        fullData[key] = data;
        return this.setData(fullData, encryptionKey);
    }
    getData(encryptionKey, nodeType) {
        if (this.data === undefined) {
            throw new Error('No data is set so nothing can be returned.');
        }
        return JSON.parse(this.data);
    }
    getDataKey(key, encryptionKey, nodeType) {
        const fullData = this.getData(encryptionKey, nodeType);
        if (fullData === null) {
            throw new Error(`No data was set.`);
        }
        // eslint-disable-next-line no-prototype-builtins
        if (!fullData.hasOwnProperty(key)) {
            throw new Error(`No data for key "${key}" exists.`);
        }
        return fullData[key];
    }
    getDataToSave() {
        if (this.data === undefined) {
            throw new Error(`No credentials were set to save.`);
        }
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            data: this.data,
            nodesAccess: this.nodesAccess,
        };
    }
}
exports.Credentials = Credentials;
class CredentialsHelper extends src_1.ICredentialsHelper {
    authenticate(credentials, typeName, requestParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return requestParams;
        });
    }
    getParentTypes(name) {
        return [];
    }
    getDecrypted(nodeCredentials, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    getCredentials(nodeCredentials, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Credentials({ id: null, name: '' }, '', [], '');
        });
    }
    updateCredentials(nodeCredentials, type, data) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.CredentialsHelper = CredentialsHelper;
function getNodeParameter(workflow, runExecutionData, runIndex, connectionInputData, node, parameterName, itemIndex, mode, timezone, additionalKeys, executeData, fallbackValue) {
    const nodeType = workflow.nodeTypes.getByNameAndVersion(node.type, node.typeVersion);
    if (nodeType === undefined) {
        throw new Error(`Node type "${node.type}" is not known so can not return paramter value!`);
    }
    const value = (0, lodash_get_1.default)(node.parameters, parameterName, fallbackValue);
    if (value === undefined) {
        throw new Error(`Could not get parameter "${parameterName}"!`);
    }
    let returnData;
    try {
        returnData = workflow.expression.getParameterValue(value, runExecutionData, runIndex, itemIndex, node.name, connectionInputData, mode, timezone, additionalKeys);
    }
    catch (e) {
        e.message += ` [Error in parameter: "${parameterName}"]`;
        throw e;
    }
    return returnData;
}
exports.getNodeParameter = getNodeParameter;
function getExecuteFunctions(workflow, runExecutionData, runIndex, connectionInputData, inputData, node, itemIndex, additionalData, executeData, mode) {
    return ((workflow, runExecutionData, connectionInputData, inputData, node) => {
        return {
            continueOnFail: () => {
                return false;
            },
            evaluateExpression: (expression, itemIndex) => {
                return expression;
            },
            executeWorkflow(workflowInfo, inputData) {
                return __awaiter(this, void 0, void 0, function* () {
                    return additionalData.executeWorkflow(workflowInfo, additionalData, inputData);
                });
            },
            getContext(type) {
                return src_1.NodeHelpers.getContext(runExecutionData, type, node);
            },
            getCredentials(type, itemIndex) {
                return __awaiter(this, void 0, void 0, function* () {
                    return {
                        apiKey: '12345',
                    };
                });
            },
            getExecutionId: () => {
                return additionalData.executionId;
            },
            getInputData: (inputIndex = 0, inputName = 'main') => {
                if (!inputData.hasOwnProperty(inputName)) {
                    // Return empty array because else it would throw error when nothing is connected to input
                    return [];
                }
                if (inputData[inputName].length < inputIndex) {
                    throw new Error(`Could not get input index "${inputIndex}" of input "${inputName}"!`);
                }
                if (inputData[inputName][inputIndex] === null) {
                    // return [];
                    throw new Error(`Value "${inputIndex}" of input "${inputName}" did not get set!`);
                }
                return inputData[inputName][inputIndex];
            },
            getNodeParameter: (parameterName, itemIndex, fallbackValue) => {
                return getNodeParameter(workflow, runExecutionData, runIndex, connectionInputData, node, parameterName, itemIndex, mode, additionalData.timezone, {}, fallbackValue);
            },
            getMode: () => {
                return mode;
            },
            getNode: () => {
                return JSON.parse(JSON.stringify(node));
            },
            getRestApiUrl: () => {
                return additionalData.restApiUrl;
            },
            getTimezone: () => {
                return additionalData.timezone;
            },
            getExecuteData: () => {
                return executeData;
            },
            getWorkflow: () => {
                return {
                    id: workflow.id,
                    name: workflow.name,
                    active: workflow.active,
                };
            },
            getWorkflowDataProxy: (itemIndex) => {
                const dataProxy = new src_1.WorkflowDataProxy(workflow, runExecutionData, runIndex, itemIndex, node.name, connectionInputData, {}, mode, additionalData.timezone, {}, executeData);
                return dataProxy.getDataProxy();
            },
            getWorkflowStaticData(type) {
                return workflow.getStaticData(type, node);
            },
            prepareOutputData: src_1.NodeHelpers.prepareOutputData,
            putExecutionToWait(waitTill) {
                return __awaiter(this, void 0, void 0, function* () {
                    runExecutionData.waitTill = waitTill;
                });
            },
            sendMessageToUI(...args) {
                if (mode !== 'manual') {
                    return;
                }
                try {
                    if (additionalData.sendMessageToUI) {
                        additionalData.sendMessageToUI(node.name, args);
                    }
                }
                catch (error) {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    console.error(`There was a problem sending messsage to UI: ${error.message}`);
                }
            },
            sendResponse(response) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    yield ((_a = additionalData.hooks) === null || _a === void 0 ? void 0 : _a.executeHookFunctions('sendResponse', [response]));
                });
            },
            helpers: {
                httpRequest(requestOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return {
                            body: {
                                headers: {},
                                statusCode: 200,
                                requestOptions,
                            },
                        };
                    });
                },
                requestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return {
                            body: {
                                headers: {},
                                statusCode: 200,
                                credentialsType,
                                requestOptions,
                                additionalCredentialOptions,
                            },
                        };
                    });
                },
                httpRequestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return {
                            body: {
                                headers: {},
                                statusCode: 200,
                                credentialsType,
                                requestOptions,
                                additionalCredentialOptions,
                            },
                        };
                    });
                },
            },
        };
    })(workflow, runExecutionData, connectionInputData, inputData, node);
}
exports.getExecuteFunctions = getExecuteFunctions;
function getExecuteSingleFunctions(workflow, runExecutionData, runIndex, connectionInputData, inputData, node, itemIndex, additionalData, executeData, mode) {
    return ((workflow, runExecutionData, connectionInputData, inputData, node, itemIndex) => {
        return {
            continueOnFail: () => {
                return false;
            },
            evaluateExpression: (expression, evaluateItemIndex) => {
                return expression;
            },
            getContext(type) {
                return src_1.NodeHelpers.getContext(runExecutionData, type, node);
            },
            getCredentials(type) {
                return __awaiter(this, void 0, void 0, function* () {
                    return {
                        apiKey: '12345',
                    };
                });
            },
            getInputData: (inputIndex = 0, inputName = 'main') => {
                if (!inputData.hasOwnProperty(inputName)) {
                    // Return empty array because else it would throw error when nothing is connected to input
                    return { json: {} };
                }
                if (inputData[inputName].length < inputIndex) {
                    throw new Error(`Could not get input index "${inputIndex}" of input "${inputName}"!`);
                }
                const allItems = inputData[inputName][inputIndex];
                if (allItems === null) {
                    // return [];
                    throw new Error(`Value "${inputIndex}" of input "${inputName}" did not get set!`);
                }
                if (allItems[itemIndex] === null) {
                    // return [];
                    throw new Error(`Value "${inputIndex}" of input "${inputName}" with itemIndex "${itemIndex}" did not get set!`);
                }
                return allItems[itemIndex];
            },
            getItemIndex: () => {
                return itemIndex;
            },
            getMode: () => {
                return mode;
            },
            getNode: () => {
                return JSON.parse(JSON.stringify(node));
            },
            getRestApiUrl: () => {
                return additionalData.restApiUrl;
            },
            getTimezone: () => {
                return additionalData.timezone;
            },
            getExecuteData: () => {
                return executeData;
            },
            getNodeParameter: (parameterName, fallbackValue) => {
                return getNodeParameter(workflow, runExecutionData, runIndex, connectionInputData, node, parameterName, itemIndex, mode, additionalData.timezone, {}, fallbackValue);
            },
            getWorkflow: () => {
                return {
                    id: workflow.id,
                    name: workflow.name,
                    active: workflow.active,
                };
            },
            getWorkflowDataProxy: () => {
                const dataProxy = new src_1.WorkflowDataProxy(workflow, runExecutionData, runIndex, itemIndex, node.name, connectionInputData, {}, mode, additionalData.timezone, {}, executeData);
                return dataProxy.getDataProxy();
            },
            getWorkflowStaticData(type) {
                return workflow.getStaticData(type, node);
            },
            helpers: {
                httpRequest(requestOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return {
                            body: {
                                headers: {},
                                statusCode: 200,
                                requestOptions,
                            },
                        };
                    });
                },
                requestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return {
                            body: {
                                headers: {},
                                statusCode: 200,
                                credentialsType,
                                requestOptions,
                                additionalCredentialOptions,
                            },
                        };
                    });
                },
                httpRequestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return {
                            body: {
                                headers: {},
                                statusCode: 200,
                                credentialsType,
                                requestOptions,
                                additionalCredentialOptions,
                            },
                        };
                    });
                },
            },
        };
    })(workflow, runExecutionData, connectionInputData, inputData, node, itemIndex);
}
exports.getExecuteSingleFunctions = getExecuteSingleFunctions;
class NodeTypesClass {
    constructor() {
        this.nodeTypes = {
            'test.set': {
                sourcePath: '',
                type: {
                    description: {
                        displayName: 'Set',
                        name: 'set',
                        group: ['input'],
                        version: 1,
                        description: 'Sets a value',
                        defaults: {
                            name: 'Set',
                            color: '#0000FF',
                        },
                        inputs: ['main'],
                        outputs: ['main'],
                        properties: [
                            {
                                displayName: 'Value1',
                                name: 'value1',
                                type: 'string',
                                default: 'default-value1',
                            },
                            {
                                displayName: 'Value2',
                                name: 'value2',
                                type: 'string',
                                default: 'default-value2',
                            },
                        ],
                    },
                },
            },
            'test.setMulti': {
                sourcePath: '',
                type: {
                    description: {
                        displayName: 'Set Multi',
                        name: 'setMulti',
                        group: ['input'],
                        version: 1,
                        description: 'Sets multiple values',
                        defaults: {
                            name: 'Set Multi',
                            color: '#0000FF',
                        },
                        inputs: ['main'],
                        outputs: ['main'],
                        properties: [
                            {
                                displayName: 'Values',
                                name: 'values',
                                type: 'fixedCollection',
                                typeOptions: {
                                    multipleValues: true,
                                },
                                default: {},
                                options: [
                                    {
                                        name: 'string',
                                        displayName: 'String',
                                        values: [
                                            {
                                                displayName: 'Name',
                                                name: 'name',
                                                type: 'string',
                                                default: 'propertyName',
                                                placeholder: 'Name of the property to write data to.',
                                            },
                                            {
                                                displayName: 'Value',
                                                name: 'value',
                                                type: 'string',
                                                default: '',
                                                placeholder: 'The string value to write in the property.',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
            'test.switch': {
                sourcePath: '',
                type: {
                    description: {
                        displayName: 'Set',
                        name: 'set',
                        group: ['input'],
                        version: 1,
                        description: 'Switches',
                        defaults: {
                            name: 'Switch',
                            color: '#0000FF',
                        },
                        inputs: ['main'],
                        outputs: ['main', 'main', 'main', 'main'],
                        outputNames: ['0', '1', '2', '3'],
                        properties: [
                            {
                                displayName: 'Value1',
                                name: 'value1',
                                type: 'string',
                                default: 'default-value1',
                            },
                            {
                                displayName: 'Value2',
                                name: 'value2',
                                type: 'string',
                                default: 'default-value2',
                            },
                        ],
                    },
                },
            },
        };
    }
    init(nodeTypes) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getAll() {
        return Object.values(this.nodeTypes).map((data) => src_1.NodeHelpers.getVersionedNodeType(data.type));
    }
    getByName(nodeType) {
        return this.getByNameAndVersion(nodeType);
    }
    getByNameAndVersion(nodeType, version) {
        return src_1.NodeHelpers.getVersionedNodeType(this.nodeTypes[nodeType].type, version);
    }
}
let nodeTypesInstance;
function NodeTypes() {
    if (nodeTypesInstance === undefined) {
        nodeTypesInstance = new NodeTypesClass();
    }
    return nodeTypesInstance;
}
exports.NodeTypes = NodeTypes;
function WorkflowExecuteAdditionalData() {
    const workflowData = {
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
        nodes: [],
        connections: {},
    };
    return {
        credentialsHelper: new CredentialsHelper(''),
        hooks: new src_1.WorkflowHooks({}, 'trigger', '1', workflowData),
        executeWorkflow: (workflowInfo) => __awaiter(this, void 0, void 0, function* () { }),
        sendMessageToUI: (message) => { },
        restApiUrl: '',
        encryptionKey: 'test',
        timezone: 'America/New_York',
        webhookBaseUrl: 'webhook',
        webhookWaitingBaseUrl: 'webhook-waiting',
        webhookTestBaseUrl: 'webhook-test',
        userId: '123',
    };
}
exports.WorkflowExecuteAdditionalData = WorkflowExecuteAdditionalData;

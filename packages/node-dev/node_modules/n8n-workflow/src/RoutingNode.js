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
exports.RoutingNode = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const lodash_get_1 = __importDefault(require("lodash.get"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const lodash_set_1 = __importDefault(require("lodash.set"));
const _1 = require(".");
class RoutingNode {
    constructor(workflow, node, connectionInputData, runExecutionData, additionalData, mode) {
        this.additionalData = additionalData;
        this.connectionInputData = connectionInputData;
        this.runExecutionData = runExecutionData;
        this.mode = mode;
        this.node = node;
        this.workflow = workflow;
    }
    runNode(inputData, runIndex, nodeType, executeData, nodeExecuteFunctions, credentialsDecrypted) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const items = inputData.main[0];
            const returnData = [];
            let responseData;
            let credentialType;
            if ((_a = nodeType.description.credentials) === null || _a === void 0 ? void 0 : _a.length) {
                credentialType = nodeType.description.credentials[0].name;
            }
            const executeFunctions = nodeExecuteFunctions.getExecuteFunctions(this.workflow, this.runExecutionData, runIndex, this.connectionInputData, inputData, this.node, this.additionalData, executeData, this.mode);
            let credentials;
            if (credentialsDecrypted) {
                credentials = credentialsDecrypted.data;
            }
            else if (credentialType) {
                credentials = (yield executeFunctions.getCredentials(credentialType)) || {};
            }
            // TODO: Think about how batching could be handled for REST APIs which support it
            for (let i = 0; i < items.length; i++) {
                try {
                    const thisArgs = nodeExecuteFunctions.getExecuteSingleFunctions(this.workflow, this.runExecutionData, runIndex, this.connectionInputData, inputData, this.node, i, this.additionalData, executeData, this.mode);
                    const requestData = {
                        options: {
                            qs: {},
                            body: {},
                        },
                        preSend: [],
                        postReceive: [],
                        requestOperations: {},
                    };
                    if (nodeType.description.requestOperations) {
                        requestData.requestOperations = Object.assign({}, nodeType.description.requestOperations);
                    }
                    if (nodeType.description.requestDefaults) {
                        for (const key of Object.keys(nodeType.description.requestDefaults)) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            let value = nodeType.description.requestDefaults[key];
                            // If the value is an expression resolve it
                            value = this.getParameterValue(value, i, runIndex, executeData, { $credentials: credentials }, true);
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            requestData.options[key] = value;
                        }
                    }
                    for (const property of nodeType.description.properties) {
                        let value = (0, lodash_get_1.default)(this.node.parameters, property.name, []);
                        // If the value is an expression resolve it
                        value = this.getParameterValue(value, i, runIndex, executeData, { $credentials: credentials }, true);
                        const tempOptions = this.getRequestOptionsFromParameters(thisArgs, property, i, runIndex, '', { $credentials: credentials, $value: value });
                        this.mergeOptions(requestData, tempOptions);
                    }
                    // TODO: Change to handle some requests in parallel (should be configurable)
                    responseData = yield this.makeRoutingRequest(requestData, thisArgs, i, runIndex, credentialType, requestData.requestOperations, credentialsDecrypted);
                    if (requestData.maxResults) {
                        // Remove not needed items in case APIs return to many
                        responseData.splice(requestData.maxResults);
                    }
                    returnData.push(...responseData);
                }
                catch (error) {
                    if ((0, lodash_get_1.default)(this.node, 'continueOnFail', false)) {
                        returnData.push({ json: {}, error: error.message });
                        continue;
                    }
                    throw new _1.NodeApiError(this.node, error, { runIndex, itemIndex: i });
                }
            }
            return [returnData];
        });
    }
    mergeOptions(destinationOptions, sourceOptions) {
        var _a;
        if (sourceOptions) {
            destinationOptions.paginate = (_a = destinationOptions.paginate) !== null && _a !== void 0 ? _a : sourceOptions.paginate;
            destinationOptions.maxResults = sourceOptions.maxResults
                ? sourceOptions.maxResults
                : destinationOptions.maxResults;
            (0, lodash_merge_1.default)(destinationOptions.options, sourceOptions.options);
            destinationOptions.preSend.push(...sourceOptions.preSend);
            destinationOptions.postReceive.push(...sourceOptions.postReceive);
            if (sourceOptions.requestOperations) {
                destinationOptions.requestOperations = Object.assign(destinationOptions.requestOperations, sourceOptions.requestOperations);
            }
        }
    }
    runPostReceiveAction(executeSingleFunctions, action, inputData, responseData, parameterValue, itemIndex, runIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof action === 'function') {
                return action.call(executeSingleFunctions, inputData, responseData);
            }
            if (action.type === 'rootProperty') {
                try {
                    return inputData.flatMap((item) => {
                        // let itemContent = item.json[action.properties.property];
                        let itemContent = (0, lodash_get_1.default)(item.json, action.properties.property);
                        if (!Array.isArray(itemContent)) {
                            itemContent = [itemContent];
                        }
                        return itemContent.map((json) => {
                            return {
                                json,
                            };
                        });
                    });
                }
                catch (e) {
                    throw new _1.NodeOperationError(this.node, `The rootProperty "${action.properties.property}" could not be found on item.`, { runIndex, itemIndex });
                }
            }
            if (action.type === 'set') {
                const { value } = action.properties;
                // If the value is an expression resolve it
                return [
                    {
                        json: this.getParameterValue(value, itemIndex, runIndex, executeSingleFunctions.getExecuteData(), { $response: responseData, $value: parameterValue }, false),
                    },
                ];
            }
            if (action.type === 'sort') {
                // Sort the returned options
                const sortKey = action.properties.key;
                inputData.sort((a, b) => {
                    var _a, _b;
                    const aSortValue = a.json[sortKey]
                        ? (_a = a.json[sortKey]) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase()
                        : '';
                    const bSortValue = b.json[sortKey]
                        ? (_b = b.json[sortKey]) === null || _b === void 0 ? void 0 : _b.toString().toLowerCase()
                        : '';
                    if (aSortValue < bSortValue) {
                        return -1;
                    }
                    if (aSortValue > bSortValue) {
                        return 1;
                    }
                    return 0;
                });
                return inputData;
            }
            if (action.type === 'setKeyValue') {
                const returnData = [];
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                inputData.forEach((item) => {
                    const returnItem = {};
                    for (const key of Object.keys(action.properties)) {
                        let propertyValue = action.properties[key];
                        // If the value is an expression resolve it
                        propertyValue = this.getParameterValue(propertyValue, itemIndex, runIndex, executeSingleFunctions.getExecuteData(), {
                            $response: responseData,
                            $responseItem: item.json,
                            $value: parameterValue,
                        }, true);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        returnItem[key] = propertyValue;
                    }
                    returnData.push({ json: returnItem });
                });
                return returnData;
            }
            if (action.type === 'binaryData') {
                responseData.body = Buffer.from(responseData.body);
                let { destinationProperty } = action.properties;
                destinationProperty = this.getParameterValue(destinationProperty, itemIndex, runIndex, executeSingleFunctions.getExecuteData(), { $response: responseData, $value: parameterValue }, false);
                const binaryData = yield executeSingleFunctions.helpers.prepareBinaryData(responseData.body);
                return inputData.map((item) => {
                    if (typeof item.json === 'string') {
                        // By default is probably the binary data as string set, in this case remove it
                        item.json = {};
                    }
                    item.binary = {
                        [destinationProperty]: binaryData,
                    };
                    return item;
                });
            }
            return [];
        });
    }
    rawRoutingRequest(executeSingleFunctions, requestData, itemIndex, runIndex, credentialType, credentialsDecrypted) {
        return __awaiter(this, void 0, void 0, function* () {
            let responseData;
            requestData.options.returnFullResponse = true;
            if (credentialType) {
                responseData = (yield executeSingleFunctions.helpers.httpRequestWithAuthentication.call(executeSingleFunctions, credentialType, requestData.options, { credentialsDecrypted }));
            }
            else {
                responseData = (yield executeSingleFunctions.helpers.httpRequest(requestData.options));
            }
            let returnData = [
                {
                    json: responseData.body,
                },
            ];
            if (requestData.postReceive.length) {
                // If postReceive functionality got defined execute all of them
                for (const postReceiveMethod of requestData.postReceive) {
                    for (const action of postReceiveMethod.actions) {
                        returnData = yield this.runPostReceiveAction(executeSingleFunctions, action, returnData, responseData, postReceiveMethod.data.parameterValue, itemIndex, runIndex);
                    }
                }
            }
            else {
                // No postReceive functionality got defined so simply add data as it is
                // eslint-disable-next-line no-lonely-if
                if (Array.isArray(responseData.body)) {
                    returnData = responseData.body.map((json) => {
                        return {
                            json,
                        };
                    });
                }
                else {
                    returnData[0].json = responseData.body;
                }
            }
            return returnData;
        });
    }
    makeRoutingRequest(requestData, executeSingleFunctions, itemIndex, runIndex, credentialType, requestOperations, credentialsDecrypted) {
        return __awaiter(this, void 0, void 0, function* () {
            let responseData;
            for (const preSendMethod of requestData.preSend) {
                requestData.options = yield preSendMethod.call(executeSingleFunctions, requestData.options);
            }
            const executePaginationFunctions = Object.assign(Object.assign({}, executeSingleFunctions), { makeRoutingRequest: (requestOptions) => __awaiter(this, void 0, void 0, function* () {
                    return this.rawRoutingRequest(executeSingleFunctions, requestOptions, itemIndex, runIndex, credentialType, credentialsDecrypted);
                }) });
            if (requestData.paginate && (requestOperations === null || requestOperations === void 0 ? void 0 : requestOperations.pagination)) {
                // Has pagination
                if (typeof requestOperations.pagination === 'function') {
                    // Pagination via function
                    responseData = yield requestOperations.pagination.call(executePaginationFunctions, requestData);
                }
                else {
                    // Pagination via JSON properties
                    const { properties } = requestOperations.pagination;
                    responseData = [];
                    if (!requestData.options.qs) {
                        requestData.options.qs = {};
                    }
                    // Different predefined pagination types
                    if (requestOperations.pagination.type === 'offset') {
                        const optionsType = properties.type === 'body' ? 'body' : 'qs';
                        if (properties.type === 'body' && !requestData.options.body) {
                            requestData.options.body = {};
                        }
                        requestData.options[optionsType][properties.limitParameter] =
                            properties.pageSize;
                        requestData.options[optionsType][properties.offsetParameter] = 0;
                        let tempResponseData;
                        do {
                            if (requestData === null || requestData === void 0 ? void 0 : requestData.maxResults) {
                                // Only request as many results as needed
                                const resultsMissing = (requestData === null || requestData === void 0 ? void 0 : requestData.maxResults) - responseData.length;
                                if (resultsMissing < 1) {
                                    break;
                                }
                                requestData.options[optionsType][properties.limitParameter] =
                                    Math.min(properties.pageSize, resultsMissing);
                            }
                            tempResponseData = yield this.rawRoutingRequest(executeSingleFunctions, requestData, itemIndex, runIndex, credentialType, credentialsDecrypted);
                            requestData.options[optionsType][properties.offsetParameter] =
                                requestData.options[optionsType][properties.offsetParameter] + properties.pageSize;
                            if (properties.rootProperty) {
                                const tempResponseValue = (0, lodash_get_1.default)(tempResponseData[0].json, properties.rootProperty);
                                if (tempResponseValue === undefined) {
                                    throw new _1.NodeOperationError(this.node, `The rootProperty "${properties.rootProperty}" could not be found on item.`, { runIndex, itemIndex });
                                }
                                tempResponseData = tempResponseValue.map((item) => {
                                    return {
                                        json: item,
                                    };
                                });
                            }
                            responseData.push(...tempResponseData);
                        } while (tempResponseData.length && tempResponseData.length === properties.pageSize);
                    }
                }
            }
            else {
                // No pagination
                responseData = yield this.rawRoutingRequest(executeSingleFunctions, requestData, itemIndex, runIndex, credentialType, credentialsDecrypted);
            }
            return responseData;
        });
    }
    getParameterValue(parameterValue, itemIndex, runIndex, executeData, additionalKeys, returnObjectAsString = false) {
        var _a;
        if (typeof parameterValue === 'object' ||
            (typeof parameterValue === 'string' && parameterValue.charAt(0) === '=')) {
            return this.workflow.expression.getParameterValue(parameterValue, (_a = this.runExecutionData) !== null && _a !== void 0 ? _a : null, runIndex, itemIndex, this.node.name, this.connectionInputData, this.mode, this.additionalData.timezone, additionalKeys !== null && additionalKeys !== void 0 ? additionalKeys : {}, executeData, returnObjectAsString);
        }
        return parameterValue;
    }
    getRequestOptionsFromParameters(executeSingleFunctions, nodeProperties, itemIndex, runIndex, path, additionalKeys) {
        var _a;
        const returnData = {
            options: {
                qs: {},
                body: {},
            },
            preSend: [],
            postReceive: [],
            requestOperations: {},
        };
        let basePath = path ? `${path}.` : '';
        if (!_1.NodeHelpers.displayParameter(this.node.parameters, nodeProperties, this.node, this.node.parameters)) {
            return undefined;
        }
        if (nodeProperties.routing) {
            let parameterValue;
            if (basePath + nodeProperties.name && 'type' in nodeProperties) {
                parameterValue = executeSingleFunctions.getNodeParameter(basePath + nodeProperties.name);
            }
            if (nodeProperties.routing.operations) {
                returnData.requestOperations = Object.assign({}, nodeProperties.routing.operations);
            }
            if (nodeProperties.routing.request) {
                for (const key of Object.keys(nodeProperties.routing.request)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let propertyValue = nodeProperties.routing.request[key];
                    // If the value is an expression resolve it
                    propertyValue = this.getParameterValue(propertyValue, itemIndex, runIndex, executeSingleFunctions.getExecuteData(), Object.assign(Object.assign({}, additionalKeys), { $value: parameterValue }), true);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    returnData.options[key] = propertyValue;
                }
            }
            if (nodeProperties.routing.send) {
                let propertyName = nodeProperties.routing.send.property;
                if (propertyName !== undefined) {
                    // If the propertyName is an expression resolve it
                    propertyName = this.getParameterValue(propertyName, itemIndex, runIndex, executeSingleFunctions.getExecuteData(), additionalKeys, true);
                    let value = parameterValue;
                    if (nodeProperties.routing.send.value) {
                        const valueString = nodeProperties.routing.send.value;
                        // Special value got set
                        // If the valueString is an expression resolve it
                        value = this.getParameterValue(valueString, itemIndex, runIndex, executeSingleFunctions.getExecuteData(), Object.assign(Object.assign({}, additionalKeys), { $value: value }), true);
                    }
                    if (nodeProperties.routing.send.type === 'body') {
                        // Send in "body"
                        // eslint-disable-next-line no-lonely-if
                        if (nodeProperties.routing.send.propertyInDotNotation === false) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            returnData.options.body[propertyName] = value;
                        }
                        else {
                            (0, lodash_set_1.default)(returnData.options.body, propertyName, value);
                        }
                    }
                    else {
                        // Send in "query"
                        // eslint-disable-next-line no-lonely-if
                        if (nodeProperties.routing.send.propertyInDotNotation === false) {
                            returnData.options.qs[propertyName] = value;
                        }
                        else {
                            (0, lodash_set_1.default)(returnData.options.qs, propertyName, value);
                        }
                    }
                }
                if (nodeProperties.routing.send.paginate !== undefined) {
                    let paginateValue = nodeProperties.routing.send.paginate;
                    if (typeof paginateValue === 'string' && paginateValue.charAt(0) === '=') {
                        // If the propertyName is an expression resolve it
                        paginateValue = this.getParameterValue(paginateValue, itemIndex, runIndex, executeSingleFunctions.getExecuteData(), Object.assign(Object.assign({}, additionalKeys), { $value: parameterValue }), true);
                    }
                    returnData.paginate = !!paginateValue;
                }
                if (nodeProperties.routing.send.preSend) {
                    returnData.preSend.push(...nodeProperties.routing.send.preSend);
                }
            }
            if (nodeProperties.routing.output) {
                if (nodeProperties.routing.output.maxResults !== undefined) {
                    let maxResultsValue = nodeProperties.routing.output.maxResults;
                    if (typeof maxResultsValue === 'string' && maxResultsValue.charAt(0) === '=') {
                        // If the propertyName is an expression resolve it
                        maxResultsValue = this.getParameterValue(maxResultsValue, itemIndex, runIndex, executeSingleFunctions.getExecuteData(), Object.assign(Object.assign({}, additionalKeys), { $value: parameterValue }), true);
                    }
                    returnData.maxResults = maxResultsValue;
                }
                if (nodeProperties.routing.output.postReceive) {
                    returnData.postReceive.push({
                        data: {
                            parameterValue,
                        },
                        actions: nodeProperties.routing.output.postReceive,
                    });
                }
            }
        }
        // Check if there are any child properties
        if (!Object.prototype.hasOwnProperty.call(nodeProperties, 'options')) {
            // There are none so nothing else to check
            return returnData;
        }
        // Everything after this point can only be of type INodeProperties
        nodeProperties = nodeProperties;
        // Check the child parameters
        let value;
        if (nodeProperties.type === 'options') {
            const optionValue = _1.NodeHelpers.getParameterValueByPath(this.node.parameters, nodeProperties.name, basePath.slice(0, -1));
            // Find the selected option
            const selectedOption = nodeProperties.options.filter((option) => option.value === optionValue);
            if (selectedOption.length) {
                // Check only if option is set and if of type INodeProperties
                const tempOptions = this.getRequestOptionsFromParameters(executeSingleFunctions, selectedOption[0], itemIndex, runIndex, `${basePath}${nodeProperties.name}`, { $value: optionValue });
                this.mergeOptions(returnData, tempOptions);
            }
        }
        else if (nodeProperties.type === 'collection') {
            value = _1.NodeHelpers.getParameterValueByPath(this.node.parameters, nodeProperties.name, basePath.slice(0, -1));
            for (const propertyOption of nodeProperties.options) {
                if (Object.keys(value).includes(propertyOption.name) &&
                    propertyOption.type !== undefined) {
                    // Check only if option is set and if of type INodeProperties
                    const tempOptions = this.getRequestOptionsFromParameters(executeSingleFunctions, propertyOption, itemIndex, runIndex, `${basePath}${nodeProperties.name}`);
                    this.mergeOptions(returnData, tempOptions);
                }
            }
        }
        else if (nodeProperties.type === 'fixedCollection') {
            basePath = `${basePath}${nodeProperties.name}.`;
            for (const propertyOptions of nodeProperties.options) {
                // Check if the option got set and if not skip it
                value = _1.NodeHelpers.getParameterValueByPath(this.node.parameters, propertyOptions.name, basePath.slice(0, -1));
                if (value === undefined) {
                    continue;
                }
                // Make sure that it is always an array to be able to use the same code for multi and single
                if (!Array.isArray(value)) {
                    value = [value];
                }
                // Resolve expressions
                value = this.getParameterValue(value, itemIndex, runIndex, executeSingleFunctions.getExecuteData(), Object.assign({}, additionalKeys), false);
                const loopBasePath = `${basePath}${propertyOptions.name}`;
                for (let i = 0; i < value.length; i++) {
                    for (const option of propertyOptions.values) {
                        const tempOptions = this.getRequestOptionsFromParameters(executeSingleFunctions, option, itemIndex, runIndex, ((_a = nodeProperties.typeOptions) === null || _a === void 0 ? void 0 : _a.multipleValues) ? `${loopBasePath}[${i}]` : loopBasePath, Object.assign(Object.assign({}, (additionalKeys || {})), { $index: i, $parent: value[i] }));
                        this.mergeOptions(returnData, tempOptions);
                    }
                }
            }
        }
        return returnData;
    }
}
exports.RoutingNode = RoutingNode;

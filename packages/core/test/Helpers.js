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
exports.WorkflowExecuteAdditionalData = exports.NodeTypes = exports.CredentialsHelper = void 0;
const lodash_1 = require("lodash");
const n8n_workflow_1 = require("n8n-workflow");
const src_1 = require("../src");
class CredentialsHelper extends n8n_workflow_1.ICredentialsHelper {
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
            return new src_1.Credentials({ id: null, name: '' }, '', [], '');
        });
    }
    updateCredentials(nodeCredentials, type, data) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.CredentialsHelper = CredentialsHelper;
class NodeTypesClass {
    constructor() {
        this.nodeTypes = {
            'n8n-nodes-base.if': {
                sourcePath: '',
                type: {
                    description: {
                        displayName: 'If',
                        name: 'if',
                        group: ['transform'],
                        version: 1,
                        description: 'Splits a stream depending on defined compare operations.',
                        defaults: {
                            name: 'IF',
                            color: '#408000',
                        },
                        inputs: ['main'],
                        outputs: ['main', 'main'],
                        properties: [
                            {
                                displayName: 'Conditions',
                                name: 'conditions',
                                placeholder: 'Add Condition',
                                type: 'fixedCollection',
                                typeOptions: {
                                    multipleValues: true,
                                },
                                description: 'The type of values to compare.',
                                default: {},
                                options: [
                                    {
                                        name: 'boolean',
                                        displayName: 'Boolean',
                                        values: [
                                            {
                                                displayName: 'Value 1',
                                                name: 'value1',
                                                type: 'boolean',
                                                default: false,
                                                description: 'The value to compare with the second one.',
                                            },
                                            {
                                                displayName: 'Operation',
                                                name: 'operation',
                                                type: 'options',
                                                options: [
                                                    {
                                                        name: 'Equal',
                                                        value: 'equal',
                                                    },
                                                    {
                                                        name: 'Not Equal',
                                                        value: 'notEqual',
                                                    },
                                                ],
                                                default: 'equal',
                                                description: 'Operation to decide where the the data should be mapped to.',
                                            },
                                            {
                                                displayName: 'Value 2',
                                                name: 'value2',
                                                type: 'boolean',
                                                default: false,
                                                description: 'The value to compare with the first one.',
                                            },
                                        ],
                                    },
                                    {
                                        name: 'number',
                                        displayName: 'Number',
                                        values: [
                                            {
                                                displayName: 'Value 1',
                                                name: 'value1',
                                                type: 'number',
                                                default: 0,
                                                description: 'The value to compare with the second one.',
                                            },
                                            {
                                                displayName: 'Operation',
                                                name: 'operation',
                                                type: 'options',
                                                options: [
                                                    {
                                                        name: 'Smaller',
                                                        value: 'smaller',
                                                    },
                                                    {
                                                        name: 'Smaller Equal',
                                                        value: 'smallerEqual',
                                                    },
                                                    {
                                                        name: 'Equal',
                                                        value: 'equal',
                                                    },
                                                    {
                                                        name: 'Not Equal',
                                                        value: 'notEqual',
                                                    },
                                                    {
                                                        name: 'Larger',
                                                        value: 'larger',
                                                    },
                                                    {
                                                        name: 'Larger Equal',
                                                        value: 'largerEqual',
                                                    },
                                                    {
                                                        name: 'Is Empty',
                                                        value: 'isEmpty',
                                                    },
                                                ],
                                                default: 'smaller',
                                                description: 'Operation to decide where the the data should be mapped to.',
                                            },
                                            {
                                                displayName: 'Value 2',
                                                name: 'value2',
                                                type: 'number',
                                                displayOptions: {
                                                    hide: {
                                                        operation: ['isEmpty'],
                                                    },
                                                },
                                                default: 0,
                                                description: 'The value to compare with the first one.',
                                            },
                                        ],
                                    },
                                    {
                                        name: 'string',
                                        displayName: 'String',
                                        values: [
                                            {
                                                displayName: 'Value 1',
                                                name: 'value1',
                                                type: 'string',
                                                default: '',
                                                description: 'The value to compare with the second one.',
                                            },
                                            {
                                                displayName: 'Operation',
                                                name: 'operation',
                                                type: 'options',
                                                options: [
                                                    {
                                                        name: 'Contains',
                                                        value: 'contains',
                                                    },
                                                    {
                                                        name: 'Ends With',
                                                        value: 'endsWith',
                                                    },
                                                    {
                                                        name: 'Equal',
                                                        value: 'equal',
                                                    },
                                                    {
                                                        name: 'Not Contains',
                                                        value: 'notContains',
                                                    },
                                                    {
                                                        name: 'Not Equal',
                                                        value: 'notEqual',
                                                    },
                                                    {
                                                        name: 'Regex',
                                                        value: 'regex',
                                                    },
                                                    {
                                                        name: 'Starts With',
                                                        value: 'startsWith',
                                                    },
                                                    {
                                                        name: 'Is Empty',
                                                        value: 'isEmpty',
                                                    },
                                                ],
                                                default: 'equal',
                                                description: 'Operation to decide where the the data should be mapped to.',
                                            },
                                            {
                                                displayName: 'Value 2',
                                                name: 'value2',
                                                type: 'string',
                                                displayOptions: {
                                                    hide: {
                                                        operation: ['isEmpty', 'regex'],
                                                    },
                                                },
                                                default: '',
                                                description: 'The value to compare with the first one.',
                                            },
                                            {
                                                displayName: 'Regex',
                                                name: 'value2',
                                                type: 'string',
                                                displayOptions: {
                                                    show: {
                                                        operation: ['regex'],
                                                    },
                                                },
                                                default: '',
                                                placeholder: '/text/i',
                                                description: 'The regex which has to match.',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                displayName: 'Combine',
                                name: 'combineOperation',
                                type: 'options',
                                options: [
                                    {
                                        name: 'ALL',
                                        description: 'Only if all conditions are meet it goes into "true" branch.',
                                        value: 'all',
                                    },
                                    {
                                        name: 'ANY',
                                        description: 'If any of the conditions is meet it goes into "true" branch.',
                                        value: 'any',
                                    },
                                ],
                                default: 'all',
                                description: 'If multiple rules got set this settings decides if it is true as soon as ANY condition matches or only if ALL get meet.',
                            },
                        ],
                    },
                    execute() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const returnDataTrue = [];
                            const returnDataFalse = [];
                            const items = this.getInputData();
                            let item;
                            let combineOperation;
                            // The compare operations
                            const compareOperationFunctions = {
                                contains: (value1, value2) => (value1 || '').toString().includes((value2 || '').toString()),
                                notContains: (value1, value2) => !(value1 || '').toString().includes((value2 || '').toString()),
                                endsWith: (value1, value2) => value1.endsWith(value2),
                                equal: (value1, value2) => value1 === value2,
                                notEqual: (value1, value2) => value1 !== value2,
                                larger: (value1, value2) => (value1 || 0) > (value2 || 0),
                                largerEqual: (value1, value2) => (value1 || 0) >= (value2 || 0),
                                smaller: (value1, value2) => (value1 || 0) < (value2 || 0),
                                smallerEqual: (value1, value2) => (value1 || 0) <= (value2 || 0),
                                startsWith: (value1, value2) => value1.startsWith(value2),
                                isEmpty: (value1) => [undefined, null, ''].includes(value1),
                                regex: (value1, value2) => {
                                    const regexMatch = (value2 || '')
                                        .toString()
                                        .match(new RegExp('^/(.*?)/([gimusy]*)$'));
                                    let regex;
                                    if (!regexMatch) {
                                        regex = new RegExp((value2 || '').toString());
                                    }
                                    else if (regexMatch.length === 1) {
                                        regex = new RegExp(regexMatch[1]);
                                    }
                                    else {
                                        regex = new RegExp(regexMatch[1], regexMatch[2]);
                                    }
                                    return !!(value1 || '').toString().match(regex);
                                },
                            };
                            // The different dataTypes to check the values in
                            const dataTypes = ['boolean', 'number', 'string'];
                            // Itterate over all items to check which ones should be output as via output "true" and
                            // which ones via output "false"
                            let dataType;
                            let compareOperationResult;
                            itemLoop: for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                                item = items[itemIndex];
                                let compareData;
                                combineOperation = this.getNodeParameter('combineOperation', itemIndex);
                                // Check all the values of the different dataTypes
                                for (dataType of dataTypes) {
                                    // Check all the values of the current dataType
                                    for (compareData of this.getNodeParameter(`conditions.${dataType}`, itemIndex, [])) {
                                        // Check if the values passes
                                        compareOperationResult = compareOperationFunctions[compareData.operation](compareData.value1, compareData.value2);
                                        if (compareOperationResult === true && combineOperation === 'any') {
                                            // If it passes and the operation is "any" we do not have to check any
                                            // other ones as it should pass anyway. So go on with the next item.
                                            returnDataTrue.push(item);
                                            continue itemLoop;
                                        }
                                        else if (compareOperationResult === false && combineOperation === 'all') {
                                            // If it fails and the operation is "all" we do not have to check any
                                            // other ones as it should be not pass anyway. So go on with the next item.
                                            returnDataFalse.push(item);
                                            continue itemLoop;
                                        }
                                    }
                                }
                                if (combineOperation === 'all') {
                                    // If the operation is "all" it means the item did match all conditions
                                    // so it passes.
                                    returnDataTrue.push(item);
                                }
                                else {
                                    // If the operation is "any" it means the the item did not match any condition.
                                    returnDataFalse.push(item);
                                }
                            }
                            return [returnDataTrue, returnDataFalse];
                        });
                    },
                },
            },
            'n8n-nodes-base.merge': {
                sourcePath: '',
                type: {
                    description: {
                        displayName: 'Merge',
                        name: 'merge',
                        icon: 'fa:clone',
                        group: ['transform'],
                        version: 1,
                        description: 'Merges data of multiple streams once data of both is available',
                        defaults: {
                            name: 'Merge',
                            color: '#00cc22',
                        },
                        inputs: ['main', 'main'],
                        outputs: ['main'],
                        properties: [
                            {
                                displayName: 'Mode',
                                name: 'mode',
                                type: 'options',
                                options: [
                                    {
                                        name: 'Append',
                                        value: 'append',
                                        description: 'Combines data of both inputs. The output will contain items of input 1 and input 2.',
                                    },
                                    {
                                        name: 'Pass-through',
                                        value: 'passThrough',
                                        description: 'Passes through data of one input. The output will conain only items of the defined input.',
                                    },
                                    {
                                        name: 'Wait',
                                        value: 'wait',
                                        description: 'Waits till data of both inputs is available and will then output a single empty item.',
                                    },
                                ],
                                default: 'append',
                                description: 'How data should be merged. If it should simply<br />be appended or merged depending on a property.',
                            },
                            {
                                displayName: 'Output Data',
                                name: 'output',
                                type: 'options',
                                displayOptions: {
                                    show: {
                                        mode: ['passThrough'],
                                    },
                                },
                                options: [
                                    {
                                        name: 'Input 1',
                                        value: 'input1',
                                    },
                                    {
                                        name: 'Input 2',
                                        value: 'input2',
                                    },
                                ],
                                default: 'input1',
                                description: 'Defines of which input the data should be used as output of node.',
                            },
                        ],
                    },
                    execute() {
                        return __awaiter(this, void 0, void 0, function* () {
                            // const itemsInput2 = this.getInputData(1);
                            const returnData = [];
                            const mode = this.getNodeParameter('mode', 0);
                            if (mode === 'append') {
                                // Simply appends the data
                                for (let i = 0; i < 2; i++) {
                                    returnData.push.apply(returnData, this.getInputData(i));
                                }
                            }
                            else if (mode === 'passThrough') {
                                const output = this.getNodeParameter('output', 0);
                                if (output === 'input1') {
                                    returnData.push.apply(returnData, this.getInputData(0));
                                }
                                else {
                                    returnData.push.apply(returnData, this.getInputData(1));
                                }
                            }
                            else if (mode === 'wait') {
                                returnData.push({ json: {} });
                            }
                            return [returnData];
                        });
                    },
                },
            },
            'n8n-nodes-base.noOp': {
                sourcePath: '',
                type: {
                    description: {
                        displayName: 'No Operation, do nothing',
                        name: 'noOp',
                        icon: 'fa:arrow-right',
                        group: ['organization'],
                        version: 1,
                        description: 'No Operation',
                        defaults: {
                            name: 'NoOp',
                            color: '#b0b0b0',
                        },
                        inputs: ['main'],
                        outputs: ['main'],
                        properties: [],
                    },
                    execute() {
                        const items = this.getInputData();
                        return this.prepareOutputData(items);
                    },
                },
            },
            'n8n-nodes-base.versionTest': {
                sourcePath: '',
                type: {
                    description: {
                        displayName: 'Version Test',
                        name: 'versionTest',
                        group: ['input'],
                        version: 1,
                        description: 'Tests if versioning works',
                        defaults: {
                            name: 'Version Test',
                            color: '#0000FF',
                        },
                        inputs: ['main'],
                        outputs: ['main'],
                        properties: [
                            {
                                displayName: 'Display V1',
                                name: 'versionTest',
                                type: 'number',
                                displayOptions: {
                                    show: {
                                        '@version': [1],
                                    },
                                },
                                default: 1,
                            },
                            {
                                displayName: 'Display V2',
                                name: 'versionTest',
                                type: 'number',
                                displayOptions: {
                                    show: {
                                        '@version': [2],
                                    },
                                },
                                default: 2,
                            },
                        ],
                    },
                    execute() {
                        const items = this.getInputData();
                        const returnData = [];
                        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                            const newItem = {
                                json: {
                                    versionFromParameter: this.getNodeParameter('versionTest', itemIndex),
                                    versionFromNode: this.getNode().typeVersion,
                                },
                            };
                            returnData.push(newItem);
                        }
                        return this.prepareOutputData(returnData);
                    },
                },
            },
            'n8n-nodes-base.set': {
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
                                displayName: 'Keep Only Set',
                                name: 'keepOnlySet',
                                type: 'boolean',
                                default: false,
                                description: 'If only the values set on this node should be<br />kept and all others removed.',
                            },
                            {
                                displayName: 'Values to Set',
                                name: 'values',
                                placeholder: 'Add Value',
                                type: 'fixedCollection',
                                typeOptions: {
                                    multipleValues: true,
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
                                                description: 'Name of the property to write data to.<br />Supports dot-notation.<br />Example: "data.person[0].name"',
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
                                                description: 'Name of the property to write data to.<br />Supports dot-notation.<br />Example: "data.person[0].name"',
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
                                                description: 'Name of the property to write data to.<br />Supports dot-notation.<br />Example: "data.person[0].name"',
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
                                        description: `<p>By default, dot-notation is used in property names. This means that "a.b" will set the property "b" underneath "a" so { "a": { "b": value} }.</p><p>If that is not intended this can be deactivated, it will then set { "a.b": value } instead.</p>`,
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
        };
    }
    init(nodeTypes) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getAll() {
        return Object.values(this.nodeTypes).map((data) => n8n_workflow_1.NodeHelpers.getVersionedNodeType(data.type));
    }
    getByName(nodeType) {
        return this.getByNameAndVersion(nodeType);
    }
    getByNameAndVersion(nodeType, version) {
        return n8n_workflow_1.NodeHelpers.getVersionedNodeType(this.nodeTypes[nodeType].type, version);
    }
}
let nodeTypesInstance;
function NodeTypes() {
    if (nodeTypesInstance === undefined) {
        nodeTypesInstance = new NodeTypesClass();
        nodeTypesInstance.init({});
    }
    return nodeTypesInstance;
}
exports.NodeTypes = NodeTypes;
function WorkflowExecuteAdditionalData(waitPromise, nodeExecutionOrder) {
    const hookFunctions = {
        nodeExecuteAfter: [
            (nodeName, data) => __awaiter(this, void 0, void 0, function* () {
                nodeExecutionOrder.push(nodeName);
            }),
        ],
        workflowExecuteAfter: [
            (fullRunData) => __awaiter(this, void 0, void 0, function* () {
                waitPromise.resolve(fullRunData);
            }),
        ],
    };
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
        hooks: new n8n_workflow_1.WorkflowHooks(hookFunctions, 'trigger', '1', workflowData),
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

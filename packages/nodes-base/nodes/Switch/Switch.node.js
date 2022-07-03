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
exports.Switch = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Switch {
    constructor() {
        this.description = {
            displayName: 'Switch',
            name: 'switch',
            icon: 'fa:map-signs',
            group: ['transform'],
            version: 1,
            description: 'Route items depending on defined expression or rules',
            defaults: {
                name: 'Switch',
                color: '#506000',
            },
            inputs: ['main'],
            // eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
            outputs: ['main', 'main', 'main', 'main'],
            outputNames: ['0', '1', '2', '3'],
            properties: [
                {
                    displayName: 'Mode',
                    name: 'mode',
                    type: 'options',
                    options: [
                        {
                            name: 'Expression',
                            value: 'expression',
                            description: 'Expression decides how to route data',
                        },
                        {
                            name: 'Rules',
                            value: 'rules',
                            description: 'Rules decide how to route data',
                        },
                    ],
                    default: 'rules',
                    description: 'How data should be routed',
                },
                // ----------------------------------
                //         mode:expression
                // ----------------------------------
                {
                    displayName: 'Output',
                    name: 'output',
                    type: 'number',
                    typeOptions: {
                        minValue: 0,
                        maxValue: 3,
                    },
                    displayOptions: {
                        show: {
                            mode: [
                                'expression',
                            ],
                        },
                    },
                    default: 0,
                    description: 'The index of output to which to send data to',
                },
                // ----------------------------------
                //         mode:rules
                // ----------------------------------
                {
                    displayName: 'Data Type',
                    name: 'dataType',
                    type: 'options',
                    displayOptions: {
                        show: {
                            mode: [
                                'rules',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Boolean',
                            value: 'boolean',
                        },
                        {
                            name: 'Date & Time',
                            value: 'dateTime',
                        },
                        {
                            name: 'Number',
                            value: 'number',
                        },
                        {
                            name: 'String',
                            value: 'string',
                        },
                    ],
                    default: 'number',
                    description: 'The type of data to route on',
                },
                // ----------------------------------
                //         dataType:boolean
                // ----------------------------------
                {
                    displayName: 'Value 1',
                    name: 'value1',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            dataType: [
                                'boolean',
                            ],
                            mode: [
                                'rules',
                            ],
                        },
                    },
                    default: false,
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                    description: 'The value to compare with the first one',
                },
                {
                    displayName: 'Routing Rules',
                    name: 'rules',
                    placeholder: 'Add Routing Rule',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    displayOptions: {
                        show: {
                            dataType: [
                                'boolean',
                            ],
                            mode: [
                                'rules',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            name: 'rules',
                            displayName: 'Boolean',
                            values: [
                                // eslint-disable-next-line n8n-nodes-base/node-param-operation-without-no-data-expression
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
                                    description: 'Operation to decide where the the data should be mapped to',
                                },
                                {
                                    displayName: 'Value 2',
                                    name: 'value2',
                                    type: 'boolean',
                                    default: false,
                                    // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                                    description: 'The value to compare with the first one',
                                },
                                {
                                    displayName: 'Output',
                                    name: 'output',
                                    type: 'number',
                                    typeOptions: {
                                        minValue: 0,
                                        maxValue: 3,
                                    },
                                    default: 0,
                                    description: 'The index of output to which to send data to if rule matches',
                                },
                            ],
                        },
                    ],
                },
                // ----------------------------------
                //         dataType:dateTime
                // ----------------------------------
                {
                    displayName: 'Value 1',
                    name: 'value1',
                    type: 'dateTime',
                    displayOptions: {
                        show: {
                            dataType: [
                                'dateTime',
                            ],
                            mode: [
                                'rules',
                            ],
                        },
                    },
                    default: '',
                    description: 'The value to compare with the second one',
                },
                {
                    displayName: 'Routing Rules',
                    name: 'rules',
                    placeholder: 'Add Routing Rule',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    displayOptions: {
                        show: {
                            dataType: [
                                'dateTime',
                            ],
                            mode: [
                                'rules',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            name: 'rules',
                            displayName: 'Dates',
                            values: [
                                // eslint-disable-next-line n8n-nodes-base/node-param-operation-without-no-data-expression
                                {
                                    displayName: 'Operation',
                                    name: 'operation',
                                    type: 'options',
                                    options: [
                                        {
                                            name: 'Occurred After',
                                            value: 'after',
                                        },
                                        {
                                            name: 'Occurred Before',
                                            value: 'before',
                                        },
                                    ],
                                    default: 'after',
                                    description: 'Operation to decide where the the data should be mapped to',
                                },
                                {
                                    displayName: 'Value 2',
                                    name: 'value2',
                                    type: 'dateTime',
                                    default: 0,
                                    description: 'The value to compare with the first one',
                                },
                                {
                                    displayName: 'Output',
                                    name: 'output',
                                    type: 'number',
                                    typeOptions: {
                                        minValue: 0,
                                        maxValue: 3,
                                    },
                                    default: 0,
                                    description: 'The index of output to which to send data to if rule matches',
                                },
                            ],
                        },
                    ],
                },
                // ----------------------------------
                //         dataType:number
                // ----------------------------------
                {
                    displayName: 'Value 1',
                    name: 'value1',
                    type: 'number',
                    displayOptions: {
                        show: {
                            dataType: [
                                'number',
                            ],
                            mode: [
                                'rules',
                            ],
                        },
                    },
                    default: 0,
                    description: 'The value to compare with the second one',
                },
                {
                    displayName: 'Routing Rules',
                    name: 'rules',
                    placeholder: 'Add Routing Rule',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    displayOptions: {
                        show: {
                            dataType: [
                                'number',
                            ],
                            mode: [
                                'rules',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            name: 'rules',
                            displayName: 'Numbers',
                            values: [
                                // eslint-disable-next-line n8n-nodes-base/node-param-operation-without-no-data-expression
                                {
                                    displayName: 'Operation',
                                    name: 'operation',
                                    type: 'options',
                                    // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
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
                                    ],
                                    default: 'smaller',
                                    description: 'Operation to decide where the the data should be mapped to',
                                },
                                {
                                    displayName: 'Value 2',
                                    name: 'value2',
                                    type: 'number',
                                    default: 0,
                                    description: 'The value to compare with the first one',
                                },
                                {
                                    displayName: 'Output',
                                    name: 'output',
                                    type: 'number',
                                    typeOptions: {
                                        minValue: 0,
                                        maxValue: 3,
                                    },
                                    default: 0,
                                    description: 'The index of output to which to send data to if rule matches',
                                },
                            ],
                        },
                    ],
                },
                // ----------------------------------
                //         dataType:string
                // ----------------------------------
                {
                    displayName: 'Value 1',
                    name: 'value1',
                    type: 'string',
                    displayOptions: {
                        show: {
                            dataType: [
                                'string',
                            ],
                            mode: [
                                'rules',
                            ],
                        },
                    },
                    default: '',
                    description: 'The value to compare with the second one',
                },
                {
                    displayName: 'Routing Rules',
                    name: 'rules',
                    placeholder: 'Add Routing Rule',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    displayOptions: {
                        show: {
                            dataType: [
                                'string',
                            ],
                            mode: [
                                'rules',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            name: 'rules',
                            displayName: 'Strings',
                            values: [
                                // eslint-disable-next-line n8n-nodes-base/node-param-operation-without-no-data-expression
                                {
                                    displayName: 'Operation',
                                    name: 'operation',
                                    type: 'options',
                                    // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
                                    options: [
                                        {
                                            name: 'Contains',
                                            value: 'contains',
                                        },
                                        {
                                            name: 'Not Contains',
                                            value: 'notContains',
                                        },
                                        {
                                            name: 'Ends With',
                                            value: 'endsWith',
                                        },
                                        {
                                            name: 'Not Ends With',
                                            value: 'notEndsWith',
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
                                            name: 'Regex Match',
                                            value: 'regex',
                                        },
                                        {
                                            name: 'Regex Not Match',
                                            value: 'notRegex',
                                        },
                                        {
                                            name: 'Starts With',
                                            value: 'startsWith',
                                        },
                                        {
                                            name: 'Not Starts With',
                                            value: 'notStartsWith',
                                        },
                                    ],
                                    default: 'equal',
                                    description: 'Operation to decide where the the data should be mapped to',
                                },
                                {
                                    displayName: 'Value 2',
                                    name: 'value2',
                                    type: 'string',
                                    displayOptions: {
                                        hide: {
                                            operation: [
                                                'regex',
                                                'notRegex',
                                            ],
                                        },
                                    },
                                    default: '',
                                    description: 'The value to compare with the first one',
                                },
                                {
                                    displayName: 'Regex',
                                    name: 'value2',
                                    type: 'string',
                                    displayOptions: {
                                        show: {
                                            operation: [
                                                'regex',
                                                'notRegex',
                                            ],
                                        },
                                    },
                                    default: '',
                                    placeholder: '/text/i',
                                    description: 'The regex which has to match',
                                },
                                {
                                    displayName: 'Output',
                                    name: 'output',
                                    type: 'number',
                                    typeOptions: {
                                        minValue: 0,
                                        maxValue: 3,
                                    },
                                    default: 0,
                                    description: 'The index of output to which to send data to if rule matches',
                                },
                            ],
                        },
                    ],
                },
                // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
                {
                    displayName: 'Fallback Output',
                    name: 'fallbackOutput',
                    type: 'options',
                    displayOptions: {
                        show: {
                            mode: [
                                'rules',
                            ],
                        },
                    },
                    // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
                    options: [
                        {
                            name: 'None',
                            value: -1,
                        },
                        {
                            name: '0',
                            value: 0,
                        },
                        {
                            name: '1',
                            value: 1,
                        },
                        {
                            name: '2',
                            value: 2,
                        },
                        {
                            name: '3',
                            value: 3,
                        },
                    ],
                    default: -1,
                    description: 'The output to which to route all items which do not match any of the rules',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const returnData = [
                [],
                [],
                [],
                [],
            ];
            const items = this.getInputData();
            let compareOperationResult;
            let item;
            let mode;
            let outputIndex;
            let ruleData;
            let value1, value2;
            // The compare operations
            const compareOperationFunctions = {
                after: (value1, value2) => (value1 || 0) > (value2 || 0),
                before: (value1, value2) => (value1 || 0) < (value2 || 0),
                contains: (value1, value2) => (value1 || '').toString().includes((value2 || '').toString()),
                notContains: (value1, value2) => !(value1 || '').toString().includes((value2 || '').toString()),
                endsWith: (value1, value2) => value1.endsWith(value2),
                notEndsWith: (value1, value2) => !value1.endsWith(value2),
                equal: (value1, value2) => value1 === value2,
                notEqual: (value1, value2) => value1 !== value2,
                larger: (value1, value2) => (value1 || 0) > (value2 || 0),
                largerEqual: (value1, value2) => (value1 || 0) >= (value2 || 0),
                smaller: (value1, value2) => (value1 || 0) < (value2 || 0),
                smallerEqual: (value1, value2) => (value1 || 0) <= (value2 || 0),
                startsWith: (value1, value2) => value1.startsWith(value2),
                notStartsWith: (value1, value2) => !value1.startsWith(value2),
                regex: (value1, value2) => {
                    const regexMatch = (value2 || '').toString().match(new RegExp('^/(.*?)/([gimusy]*)$'));
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
                notRegex: (value1, value2) => {
                    const regexMatch = (value2 || '').toString().match(new RegExp('^/(.*?)/([gimusy]*)$'));
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
                    return !(value1 || '').toString().match(regex);
                },
            };
            // Converts the input data of a dateTime into a number for easy compare
            const convertDateTime = (value) => {
                let returnValue = undefined;
                if (typeof value === 'string') {
                    returnValue = new Date(value).getTime();
                }
                else if (typeof value === 'number') {
                    returnValue = value;
                }
                if (value instanceof Date) {
                    returnValue = value.getTime();
                }
                if (returnValue === undefined || isNaN(returnValue)) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The value "${value}" is not a valid DateTime.`);
                }
                return returnValue;
            };
            const checkIndexRange = (index) => {
                if (index < 0 || index >= returnData.length) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The ouput ${index} is not allowed. It has to be between 0 and ${returnData.length - 1}!`);
                }
            };
            // Itterate over all items to check to which output they should be routed to
            itemLoop: for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                try {
                    item = items[itemIndex];
                    mode = this.getNodeParameter('mode', itemIndex);
                    if (mode === 'expression') {
                        // One expression decides how to route item
                        outputIndex = this.getNodeParameter('output', itemIndex);
                        checkIndexRange(outputIndex);
                        returnData[outputIndex].push(item);
                    }
                    else if (mode === 'rules') {
                        // Rules decide how to route item
                        const dataType = this.getNodeParameter('dataType', 0);
                        value1 = this.getNodeParameter('value1', itemIndex);
                        if (dataType === 'dateTime') {
                            value1 = convertDateTime(value1);
                        }
                        for (ruleData of this.getNodeParameter('rules.rules', itemIndex, [])) {
                            // Check if the values passes
                            value2 = ruleData.value2;
                            if (dataType === 'dateTime') {
                                value2 = convertDateTime(value2);
                            }
                            compareOperationResult = compareOperationFunctions[ruleData.operation](value1, value2);
                            if (compareOperationResult === true) {
                                // If rule matches add it to the correct output and continue with next item
                                checkIndexRange(ruleData.output);
                                returnData[ruleData.output].push(item);
                                continue itemLoop;
                            }
                        }
                        // Check if a fallback output got defined and route accordingly
                        outputIndex = this.getNodeParameter('fallbackOutput', itemIndex);
                        if (outputIndex !== -1) {
                            checkIndexRange(outputIndex);
                            returnData[outputIndex].push(item);
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData[0].push({ json: { error: error.message } });
                        continue;
                    }
                    throw error;
                }
            }
            return returnData;
        });
    }
}
exports.Switch = Switch;

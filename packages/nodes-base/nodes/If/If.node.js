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
exports.If = void 0;
const moment_1 = __importDefault(require("moment"));
const n8n_workflow_1 = require("n8n-workflow");
class If {
    constructor() {
        this.description = {
            displayName: 'IF',
            name: 'if',
            icon: 'fa:map-signs',
            group: ['transform'],
            version: 1,
            description: 'Splits a stream based on comparisons',
            defaults: {
                name: 'IF',
                color: '#408000',
            },
            inputs: ['main'],
            // eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
            outputs: ['main', 'main'],
            outputNames: ['true', 'false'],
            properties: [
                {
                    displayName: 'Conditions',
                    name: 'conditions',
                    placeholder: 'Add Condition',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                        sortable: true,
                    },
                    description: 'The type of values to compare',
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
                                    // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                                    description: 'The value to compare with the second one',
                                },
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
                            ],
                        },
                        {
                            name: 'dateTime',
                            displayName: 'Date & Time',
                            values: [
                                {
                                    displayName: 'Value 1',
                                    name: 'value1',
                                    type: 'dateTime',
                                    default: '',
                                    description: 'The value to compare with the second one',
                                },
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
                                    default: '',
                                    description: 'The value to compare with the first one',
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
                                    description: 'The value to compare with the second one',
                                },
                                {
                                    displayName: 'Operation',
                                    name: 'operation',
                                    type: 'options',
                                    noDataExpression: true,
                                    // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
                                    options: [
                                        {
                                            name: 'Smaller',
                                            value: 'smaller',
                                        },
                                        {
                                            name: 'Smaller or Equal',
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
                                            name: 'Larger or Equal',
                                            value: 'largerEqual',
                                        },
                                        {
                                            name: 'Is Empty',
                                            value: 'isEmpty',
                                        },
                                        {
                                            name: 'Is Not Empty',
                                            value: 'isNotEmpty',
                                        },
                                    ],
                                    default: 'smaller',
                                    description: 'Operation to decide where the the data should be mapped to',
                                },
                                {
                                    displayName: 'Value 2',
                                    name: 'value2',
                                    type: 'number',
                                    displayOptions: {
                                        hide: {
                                            operation: [
                                                'isEmpty',
                                                'isNotEmpty',
                                            ],
                                        },
                                    },
                                    default: 0,
                                    description: 'The value to compare with the first one',
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
                                    description: 'The value to compare with the second one',
                                },
                                {
                                    displayName: 'Operation',
                                    name: 'operation',
                                    type: 'options',
                                    noDataExpression: true,
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
                                        {
                                            name: 'Is Empty',
                                            value: 'isEmpty',
                                        },
                                        {
                                            name: 'Is Not Empty',
                                            value: 'isNotEmpty',
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
                                                'isEmpty',
                                                'isNotEmpty',
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
                            description: 'Only if all conditions are meet it goes into "true" branch',
                            value: 'all',
                        },
                        {
                            name: 'ANY',
                            description: 'If any of the conditions is meet it goes into "true" branch',
                            value: 'any',
                        },
                    ],
                    default: 'all',
                    description: 'If multiple rules got set this settings decides if it is true as soon as ANY condition matches or only if ALL get meet',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const returnDataTrue = [];
            const returnDataFalse = [];
            const items = this.getInputData();
            let item;
            let combineOperation;
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
                isEmpty: (value1) => (([undefined, null, ''].includes(value1)) || ((typeof value1 === 'object' && value1 !== null) ? (Object.entries(value1).length === 0) : false)),
                isNotEmpty: (value1) => !(([undefined, null, ''].includes(value1)) || ((typeof value1 === 'object' && value1 !== null) ? (Object.entries(value1).length === 0) : false)),
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
                if (moment_1.default.isMoment(value)) {
                    returnValue = value.unix();
                }
                if (value instanceof Date) {
                    returnValue = value.getTime();
                }
                if (returnValue === undefined || isNaN(returnValue)) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The value "${value}" is not a valid DateTime.`);
                }
                return returnValue;
            };
            // The different dataTypes to check the values in
            const dataTypes = [
                'boolean',
                'dateTime',
                'number',
                'string',
            ];
            // Itterate over all items to check which ones should be output as via output "true" and
            // which ones via output "false"
            let dataType;
            let compareOperationResult;
            let value1, value2;
            itemLoop: for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                item = items[itemIndex];
                let compareData;
                combineOperation = this.getNodeParameter('combineOperation', itemIndex);
                // Check all the values of the different dataTypes
                for (dataType of dataTypes) {
                    // Check all the values of the current dataType
                    for (compareData of this.getNodeParameter(`conditions.${dataType}`, itemIndex, [])) {
                        // Check if the values passes
                        value1 = compareData.value1;
                        value2 = compareData.value2;
                        if (dataType === 'dateTime') {
                            value1 = convertDateTime(value1);
                            value2 = convertDateTime(value2);
                        }
                        compareOperationResult = compareOperationFunctions[compareData.operation](value1, value2);
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
    }
}
exports.If = If;

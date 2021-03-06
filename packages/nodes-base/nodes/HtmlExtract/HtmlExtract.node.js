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
exports.HtmlExtract = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const n8n_workflow_1 = require("n8n-workflow");
// The extraction functions
const extractFunctions = {
    attribute: ($, valueData) => $.attr(valueData.attribute),
    html: ($, valueData) => $.html() || undefined,
    text: ($, valueData) => $.text(),
    value: ($, valueData) => $.val(),
};
/**
 * Simple helper function which applies options
 */
function getValue($, valueData, options) {
    const value = extractFunctions[valueData.returnValue]($, valueData);
    if (options.trimValues === false || value === undefined) {
        return value;
    }
    return value.trim();
}
class HtmlExtract {
    constructor() {
        this.description = {
            displayName: 'HTML Extract',
            name: 'htmlExtract',
            icon: 'fa:cut',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["sourceData"] + ": " + $parameter["dataPropertyName"]}}',
            description: 'Extracts data from HTML',
            defaults: {
                name: 'HTML Extract',
                color: '#333377',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Source Data',
                    name: 'sourceData',
                    type: 'options',
                    options: [
                        {
                            name: 'Binary',
                            value: 'binary',
                        },
                        {
                            name: 'JSON',
                            value: 'json',
                        },
                    ],
                    default: 'json',
                    description: 'If HTML should be read from binary or JSON data',
                },
                {
                    displayName: 'Binary Property',
                    name: 'dataPropertyName',
                    type: 'string',
                    displayOptions: {
                        show: {
                            sourceData: [
                                'binary',
                            ],
                        },
                    },
                    default: 'data',
                    required: true,
                    description: 'Name of the binary property in which the HTML to extract the data from can be found',
                },
                {
                    displayName: 'JSON Property',
                    name: 'dataPropertyName',
                    type: 'string',
                    displayOptions: {
                        show: {
                            sourceData: [
                                'json',
                            ],
                        },
                    },
                    default: 'data',
                    required: true,
                    description: 'Name of the JSON property in which the HTML to extract the data from can be found. The property can either contain a string or an array of strings.',
                },
                {
                    displayName: 'Extraction Values',
                    name: 'extractionValues',
                    placeholder: 'Add Value',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    default: {},
                    options: [
                        {
                            name: 'values',
                            displayName: 'Values',
                            values: [
                                {
                                    displayName: 'Key',
                                    name: 'key',
                                    type: 'string',
                                    default: '',
                                    description: 'The key under which the extracted value should be saved',
                                },
                                {
                                    displayName: 'CSS Selector',
                                    name: 'cssSelector',
                                    type: 'string',
                                    default: '',
                                    placeholder: '.price',
                                    description: 'The CSS selector to use',
                                },
                                {
                                    displayName: 'Return Value',
                                    name: 'returnValue',
                                    type: 'options',
                                    options: [
                                        {
                                            name: 'Attribute',
                                            value: 'attribute',
                                            description: 'Get an attribute value like "class" from an element',
                                        },
                                        {
                                            name: 'HTML',
                                            value: 'html',
                                            description: 'Get the HTML the element contains',
                                        },
                                        {
                                            name: 'Text',
                                            value: 'text',
                                            description: 'Get only the text content of the element',
                                        },
                                        {
                                            name: 'Value',
                                            value: 'value',
                                            description: 'Get value of an input, select or textarea',
                                        },
                                    ],
                                    default: 'text',
                                    description: 'What kind of data should be returned',
                                },
                                {
                                    displayName: 'Attribute',
                                    name: 'attribute',
                                    type: 'string',
                                    displayOptions: {
                                        show: {
                                            returnValue: [
                                                'attribute',
                                            ],
                                        },
                                    },
                                    default: '',
                                    placeholder: 'class',
                                    description: 'The name of the attribute to return the value off',
                                },
                                {
                                    displayName: 'Return Array',
                                    name: 'returnArray',
                                    type: 'boolean',
                                    default: false,
                                    description: 'Whether to return the values as an array so if multiple ones get found they also get returned separately. If not set all will be returned as a single string.',
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
                            displayName: 'Trim Values',
                            name: 'trimValues',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to remove automatically all spaces and newlines from the beginning and end of the values',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let item;
            for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                try {
                    const dataPropertyName = this.getNodeParameter('dataPropertyName', itemIndex);
                    const extractionValues = this.getNodeParameter('extractionValues', itemIndex);
                    const options = this.getNodeParameter('options', itemIndex, {});
                    const sourceData = this.getNodeParameter('sourceData', itemIndex);
                    item = items[itemIndex];
                    let htmlArray = [];
                    if (sourceData === 'json') {
                        if (item.json[dataPropertyName] === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No property named "${dataPropertyName}" exists!`);
                        }
                        htmlArray = item.json[dataPropertyName];
                    }
                    else {
                        if (item.binary === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No item does not contain binary data!`);
                        }
                        if (item.binary[dataPropertyName] === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No property named "${dataPropertyName}" exists!`);
                        }
                        const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(itemIndex, dataPropertyName);
                        htmlArray = binaryDataBuffer.toString('utf-8');
                    }
                    // Convert it always to array that it works with a string or an array of strings
                    if (!Array.isArray(htmlArray)) {
                        htmlArray = [htmlArray];
                    }
                    for (const html of htmlArray) {
                        const $ = cheerio_1.default.load(html);
                        const newItem = {
                            json: {},
                            pairedItem: {
                                item: itemIndex,
                            },
                        };
                        // Itterate over all the defined values which should be extracted
                        let htmlElement;
                        for (const valueData of extractionValues.values) {
                            htmlElement = $(valueData.cssSelector);
                            if (valueData.returnArray === true) {
                                // An array should be returned so itterate over one
                                // value at a time
                                newItem.json[valueData.key] = [];
                                htmlElement.each((i, el) => {
                                    newItem.json[valueData.key].push(getValue($(el), valueData, options));
                                });
                            }
                            else {
                                // One single value should be returned
                                newItem.json[valueData.key] = getValue(htmlElement, valueData, options);
                            }
                        }
                        returnData.push(newItem);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({
                            json: {
                                error: error.message,
                            },
                            pairedItem: {
                                item: itemIndex,
                            },
                        });
                        continue;
                    }
                    throw error;
                }
            }
            return this.prepareOutputData(returnData);
        });
    }
}
exports.HtmlExtract = HtmlExtract;

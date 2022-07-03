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
exports.FunctionItem = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const { NodeVM } = require('vm2');
class FunctionItem {
    constructor() {
        this.description = {
            displayName: 'Function Item',
            name: 'functionItem',
            icon: 'fa:code',
            group: ['transform'],
            version: 1,
            description: 'Run custom function code which gets executed once per item',
            defaults: {
                name: 'FunctionItem',
                color: '#ddbb33',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'JavaScript Code',
                    name: 'functionCode',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                        codeAutocomplete: 'functionItem',
                        editor: 'code',
                        rows: 10,
                    },
                    type: 'string',
                    default: `// Code here will run once per input item.
// More info and help: https://docs.n8n.io/nodes/n8n-nodes-base.functionItem
// Tip: You can use luxon for dates and $jmespath for querying JSON structures

// Add a new field called 'myNewField' to the JSON of the item
item.myNewField = 1;

// You can write logs to the browser console
console.log('Done!');

return item;`,
                    description: 'The JavaScript code to execute for each item',
                    noDataExpression: true,
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let item;
            const cleanupData = (inputData) => {
                Object.keys(inputData).map(key => {
                    if (inputData[key] !== null && typeof inputData[key] === 'object') {
                        if (inputData[key].constructor.name === 'Object') {
                            // Is regular node.js object so check its data
                            inputData[key] = cleanupData(inputData[key]);
                        }
                        else {
                            // Is some special object like a Date so stringify
                            inputData[key] = JSON.parse(JSON.stringify(inputData[key]));
                        }
                    }
                });
                return inputData;
            };
            for (let itemIndex = 0; itemIndex < length; itemIndex++) {
                try {
                    item = items[itemIndex];
                    // Copy the items as they may get changed in the functions
                    item = JSON.parse(JSON.stringify(item));
                    // Define the global objects for the custom function
                    const sandbox = {
                        getBinaryData: () => {
                            return item.binary;
                        },
                        getNodeParameter: this.getNodeParameter,
                        getWorkflowStaticData: this.getWorkflowStaticData,
                        helpers: this.helpers,
                        item: item.json,
                        setBinaryData: (data) => {
                            item.binary = data;
                        },
                    };
                    // Make it possible to access data via $node, $parameter, ...
                    const dataProxy = this.getWorkflowDataProxy(itemIndex);
                    Object.assign(sandbox, dataProxy);
                    const mode = this.getMode();
                    const options = {
                        console: (mode === 'manual') ? 'redirect' : 'inherit',
                        sandbox,
                        require: {
                            external: false,
                            builtin: [],
                        },
                    };
                    if (process.env.NODE_FUNCTION_ALLOW_BUILTIN) {
                        options.require.builtin = process.env.NODE_FUNCTION_ALLOW_BUILTIN.split(',');
                    }
                    if (process.env.NODE_FUNCTION_ALLOW_EXTERNAL) {
                        options.require.external = { modules: process.env.NODE_FUNCTION_ALLOW_EXTERNAL.split(',') };
                    }
                    const vm = new NodeVM(options);
                    if (mode === 'manual') {
                        vm.on('console.log', this.sendMessageToUI);
                    }
                    // Get the code to execute
                    const functionCode = this.getNodeParameter('functionCode', itemIndex);
                    let jsonData;
                    try {
                        // Execute the function code
                        jsonData = yield vm.run(`module.exports = async function() {${functionCode}\n}()`, __dirname);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ json: { error: error.message } });
                            continue;
                        }
                        else {
                            // Try to find the line number which contains the error and attach to error message
                            const stackLines = error.stack.split('\n');
                            if (stackLines.length > 0) {
                                stackLines.shift();
                                const lineParts = stackLines.find((line) => line.includes('FunctionItem')).split(':');
                                if (lineParts.length > 2) {
                                    const lineNumber = lineParts.splice(-2, 1);
                                    if (!isNaN(lineNumber)) {
                                        error.message = `${error.message} [Line ${lineNumber} | Item Index: ${itemIndex}]`;
                                        return Promise.reject(error);
                                    }
                                }
                            }
                            error.message = `${error.message} [Item Index: ${itemIndex}]`;
                            return Promise.reject(error);
                        }
                    }
                    // Do very basic validation of the data
                    if (jsonData === undefined) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned. Always an object has to be returned!');
                    }
                    const returnItem = {
                        json: cleanupData(jsonData),
                        pairedItem: {
                            item: itemIndex,
                        },
                    };
                    if (item.binary) {
                        returnItem.binary = item.binary;
                    }
                    returnData.push(returnItem);
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
exports.FunctionItem = FunctionItem;

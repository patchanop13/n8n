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
exports.WriteBinaryFile = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const promises_1 = require("fs/promises");
class WriteBinaryFile {
    constructor() {
        this.description = {
            displayName: 'Write Binary File',
            name: 'writeBinaryFile',
            icon: 'fa:file-export',
            group: ['output'],
            version: 1,
            description: 'Writes a binary file to disk',
            defaults: {
                name: 'Write Binary File',
                color: '#CC2233',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'File Name',
                    name: 'fileName',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: '/data/example.jpg',
                    description: 'Path to which the file should be written',
                },
                {
                    displayName: 'Property Name',
                    name: 'dataPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    description: 'Name of the binary property which contains the data for the file to be written',
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
            for (let itemIndex = 0; itemIndex < length; itemIndex++) {
                try {
                    const dataPropertyName = this.getNodeParameter('dataPropertyName', itemIndex);
                    const fileName = this.getNodeParameter('fileName', itemIndex);
                    item = items[itemIndex];
                    if (item.binary === undefined) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data set. So file can not be written!');
                    }
                    if (item.binary[dataPropertyName] === undefined) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The binary property "${dataPropertyName}" does not exist. So no file can be written!`);
                    }
                    const newItem = {
                        json: {},
                        pairedItem: {
                            item: itemIndex,
                        },
                    };
                    Object.assign(newItem.json, item.json);
                    const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(itemIndex, dataPropertyName);
                    // Write the file to disk
                    yield (0, promises_1.writeFile)(fileName, binaryDataBuffer, 'binary');
                    if (item.binary !== undefined) {
                        // Create a shallow copy of the binary data so that the old
                        // data references which do not get changed still stay behind
                        // but the incoming data does not get changed.
                        newItem.binary = {};
                        Object.assign(newItem.binary, item.binary);
                    }
                    // Add the file name to data
                    newItem.json.fileName = fileName;
                    returnData.push(newItem);
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
exports.WriteBinaryFile = WriteBinaryFile;

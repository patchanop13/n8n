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
exports.ReadBinaryFile = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const promises_1 = require("fs/promises");
class ReadBinaryFile {
    constructor() {
        this.description = {
            displayName: 'Read Binary File',
            name: 'readBinaryFile',
            icon: 'fa:file-import',
            group: ['input'],
            version: 1,
            description: 'Reads a binary file from disk',
            defaults: {
                name: 'Read Binary File',
                color: '#449922',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'File Path',
                    name: 'filePath',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: '/data/example.jpg',
                    description: 'Path of the file to read',
                },
                {
                    displayName: 'Property Name',
                    name: 'dataPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    description: 'Name of the binary property to which to write the data of the read file',
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
                    item = items[itemIndex];
                    const dataPropertyName = this.getNodeParameter('dataPropertyName', itemIndex);
                    const filePath = this.getNodeParameter('filePath', itemIndex);
                    let data;
                    try {
                        data = (yield (0, promises_1.readFile)(filePath));
                    }
                    catch (error) {
                        if (error.code === 'ENOENT') {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The file "${filePath}" could not be found.`);
                        }
                        throw error;
                    }
                    const newItem = {
                        json: item.json,
                        binary: {},
                        pairedItem: {
                            item: itemIndex,
                        },
                    };
                    if (item.binary !== undefined) {
                        // Create a shallow copy of the binary data so that the old
                        // data references which do not get changed still stay behind
                        // but the incoming data does not get changed.
                        Object.assign(newItem.binary, item.binary);
                    }
                    newItem.binary[dataPropertyName] = yield this.helpers.prepareBinaryData(data, filePath);
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
exports.ReadBinaryFile = ReadBinaryFile;

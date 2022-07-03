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
exports.ReadPDF = void 0;
const pdf = require('pdf-parse');
class ReadPDF {
    constructor() {
        this.description = {
            displayName: 'Read PDF',
            name: 'readPDF',
            icon: 'fa:file-pdf',
            group: ['input'],
            version: 1,
            description: 'Reads a PDF and extracts its content',
            defaults: {
                name: 'Read PDF',
                color: '#003355',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Binary Property',
                    name: 'binaryPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    description: 'Name of the binary property from which to read the PDF file',
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
                    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex);
                    if (item.binary === undefined) {
                        item.binary = {};
                    }
                    const binaryData = yield this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
                    returnData.push({
                        binary: item.binary,
                        json: yield pdf(binaryData),
                    });
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
exports.ReadPDF = ReadPDF;

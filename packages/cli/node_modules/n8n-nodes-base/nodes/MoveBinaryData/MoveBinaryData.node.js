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
exports.MoveBinaryData = void 0;
const lodash_1 = require("lodash");
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const iconv_lite_1 = __importDefault(require("iconv-lite"));
iconv_lite_1.default.encodingExists('utf8');
// Create options for bomAware and encoding
const bomAware = [];
const encodeDecodeOptions = [];
const encodings = iconv_lite_1.default.encodings; // tslint:disable-line:no-any
Object.keys(encodings).forEach(encoding => {
    if (!(encoding.startsWith('_') || typeof encodings[encoding] === 'string')) { // only encodings without direct alias or internals
        if (encodings[encoding].bomAware) {
            bomAware.push(encoding);
        }
        encodeDecodeOptions.push({ name: encoding, value: encoding });
    }
});
encodeDecodeOptions.sort((a, b) => {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
});
class MoveBinaryData {
    constructor() {
        this.description = {
            displayName: 'Move Binary Data',
            name: 'moveBinaryData',
            icon: 'fa:exchange-alt',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["mode"]==="binaryToJson" ? "Binary to JSON" : "JSON to Binary"}}',
            description: 'Move data between binary and JSON properties',
            defaults: {
                name: 'Move Binary Data',
                color: '#7722CC',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Mode',
                    name: 'mode',
                    type: 'options',
                    options: [
                        {
                            name: 'Binary to JSON',
                            value: 'binaryToJson',
                            description: 'Move data from Binary to JSON',
                        },
                        {
                            name: 'JSON to Binary',
                            value: 'jsonToBinary',
                            description: 'Move data from JSON to Binary',
                        },
                    ],
                    default: 'binaryToJson',
                    description: 'From and to where data should be moved',
                },
                // ----------------------------------
                //         binaryToJson
                // ----------------------------------
                {
                    displayName: 'Set All Data',
                    name: 'setAllData',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            mode: [
                                'binaryToJson',
                            ],
                        },
                    },
                    default: true,
                    description: 'Whether all JSON data should be replaced with the data retrieved from binary key. Else the data will be written to a single key.',
                },
                {
                    displayName: 'Source Key',
                    name: 'sourceKey',
                    type: 'string',
                    displayOptions: {
                        show: {
                            mode: [
                                'binaryToJson',
                            ],
                        },
                    },
                    default: 'data',
                    required: true,
                    placeholder: 'data',
                    description: 'The name of the binary key to get data from. It is also possible to define deep keys by using dot-notation like for example: "level1.level2.currentKey".',
                },
                {
                    displayName: 'Destination Key',
                    name: 'destinationKey',
                    type: 'string',
                    displayOptions: {
                        show: {
                            mode: [
                                'binaryToJson',
                            ],
                            setAllData: [
                                false,
                            ],
                        },
                    },
                    default: 'data',
                    required: true,
                    placeholder: '',
                    description: 'The name the JSON key to copy data to. It is also possible to define deep keys by using dot-notation like for example: "level1.level2.newKey".',
                },
                // ----------------------------------
                //         jsonToBinary
                // ----------------------------------
                {
                    displayName: 'Convert All Data',
                    name: 'convertAllData',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            mode: [
                                'jsonToBinary',
                            ],
                        },
                    },
                    default: true,
                    description: 'Whether all JSON data should be converted to binary. Else only the data of one key will be converted.',
                },
                {
                    displayName: 'Source Key',
                    name: 'sourceKey',
                    type: 'string',
                    displayOptions: {
                        show: {
                            convertAllData: [
                                false,
                            ],
                            mode: [
                                'jsonToBinary',
                            ],
                        },
                    },
                    default: 'data',
                    required: true,
                    placeholder: 'data',
                    description: 'The name of the JSON key to get data from. It is also possible to define deep keys by using dot-notation like for example: "level1.level2.currentKey".',
                },
                {
                    displayName: 'Destination Key',
                    name: 'destinationKey',
                    type: 'string',
                    displayOptions: {
                        show: {
                            mode: [
                                'jsonToBinary',
                            ],
                        },
                    },
                    default: 'data',
                    required: true,
                    placeholder: 'data',
                    description: 'The name the binary key to copy data to. It is also possible to define deep keys by using dot-notation like for example: "level1.level2.newKey".',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Data Is Base64',
                            name: 'dataIsBase64',
                            type: 'boolean',
                            displayOptions: {
                                hide: {
                                    'useRawData': [
                                        true,
                                    ],
                                },
                                show: {
                                    '/mode': [
                                        'jsonToBinary',
                                    ],
                                    '/convertAllData': [
                                        false,
                                    ],
                                },
                            },
                            default: false,
                            description: 'Whether to keep the binary data as base64 string',
                        },
                        {
                            displayName: 'Encoding',
                            name: 'encoding',
                            type: 'options',
                            options: encodeDecodeOptions,
                            displayOptions: {
                                show: {
                                    '/mode': [
                                        'binaryToJson',
                                        'jsonToBinary',
                                    ],
                                },
                            },
                            default: 'utf8',
                            description: 'Set the encoding of the data stream',
                        },
                        {
                            displayName: 'Strip BOM',
                            name: 'stripBOM',
                            displayOptions: {
                                show: {
                                    '/mode': [
                                        'binaryToJson',
                                    ],
                                    encoding: bomAware,
                                },
                            },
                            type: 'boolean',
                            default: true,
                        },
                        {
                            displayName: 'Add BOM',
                            name: 'addBOM',
                            displayOptions: {
                                show: {
                                    '/mode': [
                                        'jsonToBinary',
                                    ],
                                    encoding: bomAware,
                                },
                            },
                            type: 'boolean',
                            default: false,
                        },
                        {
                            displayName: 'File Name',
                            name: 'fileName',
                            type: 'string',
                            displayOptions: {
                                show: {
                                    '/mode': [
                                        'jsonToBinary',
                                    ],
                                },
                            },
                            default: '',
                            placeholder: 'example.json',
                            description: 'The file name to set',
                        },
                        {
                            displayName: 'JSON Parse',
                            name: 'jsonParse',
                            type: 'boolean',
                            displayOptions: {
                                hide: {
                                    'keepAsBase64': [
                                        true,
                                    ],
                                },
                                show: {
                                    '/mode': [
                                        'binaryToJson',
                                    ],
                                    '/setAllData': [
                                        false,
                                    ],
                                },
                            },
                            default: false,
                            description: 'Whether to run JSON parse on the data to get proper object data',
                        },
                        {
                            displayName: 'Keep Source',
                            name: 'keepSource',
                            type: 'boolean',
                            default: false,
                            description: 'Whether the source key should be kept. By default it will be deleted.',
                        },
                        {
                            displayName: 'Keep As Base64',
                            name: 'keepAsBase64',
                            type: 'boolean',
                            displayOptions: {
                                hide: {
                                    'jsonParse': [
                                        true,
                                    ],
                                },
                                show: {
                                    '/mode': [
                                        'binaryToJson',
                                    ],
                                    '/setAllData': [
                                        false,
                                    ],
                                },
                            },
                            default: false,
                            description: 'Whether to keep the binary data as base64 string',
                        },
                        {
                            displayName: 'Mime Type',
                            name: 'mimeType',
                            type: 'string',
                            displayOptions: {
                                show: {
                                    '/mode': [
                                        'jsonToBinary',
                                    ],
                                },
                            },
                            default: 'application/json',
                            placeholder: 'application/json',
                            description: 'The mime-type to set. By default will the mime-type for JSON be set.',
                        },
                        {
                            displayName: 'Use Raw Data',
                            name: 'useRawData',
                            type: 'boolean',
                            displayOptions: {
                                hide: {
                                    'dataIsBase64': [
                                        true,
                                    ],
                                },
                                show: {
                                    '/mode': [
                                        'jsonToBinary',
                                    ],
                                },
                            },
                            default: false,
                            description: 'Whether to use data as is and do not JSON.stringify it',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const mode = this.getNodeParameter('mode', 0);
            const returnData = [];
            let item;
            let newItem;
            let options;
            for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                item = items[itemIndex];
                options = this.getNodeParameter('options', itemIndex, {});
                // Copy the whole JSON data as data on any level can be renamed
                newItem = {
                    json: {},
                    pairedItem: {
                        item: itemIndex,
                    },
                };
                if (mode === 'binaryToJson') {
                    const setAllData = this.getNodeParameter('setAllData', itemIndex);
                    const sourceKey = this.getNodeParameter('sourceKey', itemIndex);
                    const value = (0, lodash_1.get)(item.binary, sourceKey);
                    if (value === undefined) {
                        // No data found so skip
                        continue;
                    }
                    const encoding = options.encoding || 'utf8';
                    const buffer = yield this.helpers.getBinaryDataBuffer(itemIndex, sourceKey);
                    let convertedValue;
                    if (setAllData === true) {
                        // Set the full data
                        convertedValue = iconv_lite_1.default.decode(buffer, encoding, { stripBOM: options.stripBOM });
                        newItem.json = JSON.parse(convertedValue);
                    }
                    else {
                        // Does get added to existing data so copy it first
                        newItem.json = JSON.parse(JSON.stringify(item.json));
                        if (options.keepAsBase64 !== true) {
                            convertedValue = iconv_lite_1.default.decode(buffer, encoding, { stripBOM: options.stripBOM });
                        }
                        else {
                            convertedValue = Buffer.from(buffer).toString(n8n_core_1.BINARY_ENCODING);
                        }
                        if (options.jsonParse) {
                            convertedValue = JSON.parse(convertedValue);
                        }
                        const destinationKey = this.getNodeParameter('destinationKey', itemIndex, '');
                        (0, lodash_1.set)(newItem.json, destinationKey, convertedValue);
                    }
                    if (options.keepSource === true) {
                        // Binary data does not get touched so simply reference it
                        newItem.binary = item.binary;
                    }
                    else {
                        // Binary data will change so copy it
                        newItem.binary = JSON.parse(JSON.stringify(item.binary));
                        (0, lodash_1.unset)(newItem.binary, sourceKey);
                    }
                }
                else if (mode === 'jsonToBinary') {
                    const convertAllData = this.getNodeParameter('convertAllData', itemIndex);
                    const destinationKey = this.getNodeParameter('destinationKey', itemIndex);
                    const encoding = options.encoding || 'utf8';
                    let value = item.json;
                    if (convertAllData === false) {
                        const sourceKey = this.getNodeParameter('sourceKey', itemIndex);
                        value = (0, lodash_1.get)(item.json, sourceKey);
                    }
                    if (value === undefined) {
                        // No data found so skip
                        continue;
                    }
                    if (item.binary !== undefined) {
                        // Item already has binary data so copy it
                        newItem.binary = JSON.parse(JSON.stringify(item.binary));
                    }
                    else {
                        // Item does not have binary data yet so initialize empty
                        newItem.binary = {};
                    }
                    if (options.dataIsBase64 !== true) {
                        if (options.useRawData !== true) {
                            value = JSON.stringify(value);
                        }
                        value = iconv_lite_1.default.encode(value, encoding, { addBOM: options.addBOM }).toString(n8n_core_1.BINARY_ENCODING);
                    }
                    const convertedValue = {
                        data: value,
                        mimeType: options.mimeType || 'application/json',
                    };
                    if (options.fileName) {
                        convertedValue.fileName = options.fileName;
                    }
                    (0, lodash_1.set)(newItem.binary, destinationKey, convertedValue);
                    if (options.keepSource === true) {
                        // JSON data does not get touched so simply reference it
                        newItem.json = item.json;
                    }
                    else {
                        // JSON data will change so copy it
                        if (convertAllData === true) {
                            // Data should not be kept and all data got converted. So simply set new as empty
                            newItem.json = {};
                        }
                        else {
                            // Data should not be kept and only one key has to get removed. So copy all
                            // data and then remove the not needed one
                            newItem.json = JSON.parse(JSON.stringify(item.json));
                            const sourceKey = this.getNodeParameter('sourceKey', itemIndex);
                            (0, lodash_1.unset)(newItem.json, sourceKey);
                        }
                    }
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${mode}" is not known!`);
                }
                returnData.push(newItem);
            }
            return [returnData];
        });
    }
}
exports.MoveBinaryData = MoveBinaryData;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Compression = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const fflate = __importStar(require("fflate"));
const util_1 = require("util");
const gunzip = (0, util_1.promisify)(fflate.gunzip);
const gzip = (0, util_1.promisify)(fflate.gzip);
const unzip = (0, util_1.promisify)(fflate.unzip);
const zip = (0, util_1.promisify)(fflate.zip);
const mime = __importStar(require("mime-types"));
const ALREADY_COMPRESSED = [
    '7z',
    'aifc',
    'bz2',
    'doc',
    'docx',
    'gif',
    'gz',
    'heic',
    'heif',
    'jpg',
    'jpeg',
    'mov',
    'mp3',
    'mp4',
    'pdf',
    'png',
    'ppt',
    'pptx',
    'rar',
    'webm',
    'webp',
    'xls',
    'xlsx',
    'zip',
];
class Compression {
    constructor() {
        this.description = {
            displayName: 'Compression',
            name: 'compression',
            icon: 'fa:file-archive',
            group: ['transform'],
            subtitle: '={{$parameter["operation"]}}',
            version: 1,
            description: 'Compress and uncompress files',
            defaults: {
                name: 'Compression',
                color: '#408000',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Compress',
                            value: 'compress',
                        },
                        {
                            name: 'Decompress',
                            value: 'decompress',
                        },
                    ],
                    default: 'decompress',
                },
                {
                    displayName: 'Binary Property',
                    name: 'binaryPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'compress',
                                'decompress',
                            ],
                        },
                    },
                    placeholder: '',
                    description: 'Name of the binary property which contains the data for the file(s) to be compress/decompress. Multiple can be used separated by a comma (,).',
                },
                {
                    displayName: 'Output Format',
                    name: 'outputFormat',
                    type: 'options',
                    default: '',
                    options: [
                        {
                            name: 'Gzip',
                            value: 'gzip',
                        },
                        {
                            name: 'Zip',
                            value: 'zip',
                        },
                    ],
                    displayOptions: {
                        show: {
                            operation: [
                                'compress',
                            ],
                        },
                    },
                    description: 'Format of the output file',
                },
                {
                    displayName: 'File Name',
                    name: 'fileName',
                    type: 'string',
                    default: '',
                    placeholder: 'data.zip',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'compress',
                            ],
                            outputFormat: [
                                'zip',
                            ],
                        },
                    },
                    description: 'Name of the file to be compressed',
                },
                {
                    displayName: 'Binary Property Output',
                    name: 'binaryPropertyOutput',
                    type: 'string',
                    default: 'data',
                    displayOptions: {
                        show: {
                            outputFormat: [
                                'zip',
                            ],
                            operation: [
                                'compress',
                            ],
                        },
                    },
                    placeholder: '',
                    description: 'Name of the binary property to which to write the data of the compressed files',
                },
                {
                    displayName: 'Output Prefix',
                    name: 'outputPrefix',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'compress',
                            ],
                            outputFormat: [
                                'gzip',
                            ],
                        },
                    },
                    description: 'Prefix use for all gzip compresed files',
                },
                {
                    displayName: 'Output Prefix',
                    name: 'outputPrefix',
                    type: 'string',
                    default: 'file_',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'decompress',
                            ],
                        },
                    },
                    description: 'Prefix use for all decompressed files',
                },
            ],
        };
    }
    execute() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const length = items.length;
            const returnData = [];
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (operation === 'decompress') {
                        const binaryPropertyNames = this.getNodeParameter('binaryPropertyName', 0).split(',').map(key => key.trim());
                        const outputPrefix = this.getNodeParameter('outputPrefix', 0);
                        const binaryObject = {};
                        let zipIndex = 0;
                        for (const [index, binaryPropertyName] of binaryPropertyNames.entries()) {
                            if (items[i].binary === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                            }
                            //@ts-ignore
                            if (items[i].binary[binaryPropertyName] === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                            }
                            const binaryData = items[i].binary[binaryPropertyName];
                            const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                            if (binaryData.fileExtension === 'zip') {
                                const files = yield unzip(binaryDataBuffer);
                                for (const key of Object.keys(files)) {
                                    // when files are compresed using MACOSX for some reason they are duplicated under __MACOSX
                                    if (key.includes('__MACOSX')) {
                                        continue;
                                    }
                                    const data = yield this.helpers.prepareBinaryData(Buffer.from(files[key].buffer), key);
                                    binaryObject[`${outputPrefix}${zipIndex++}`] = data;
                                }
                            }
                            else if (binaryData.fileExtension === 'gz') {
                                const file = yield gunzip(binaryDataBuffer);
                                const fileName = (_a = binaryData.fileName) === null || _a === void 0 ? void 0 : _a.split('.')[0];
                                const propertyName = `${outputPrefix}${index}`;
                                binaryObject[propertyName] = yield this.helpers.prepareBinaryData(Buffer.from(file.buffer), fileName);
                                const fileExtension = mime.extension(binaryObject[propertyName].mimeType);
                                binaryObject[propertyName].fileName = `${fileName}.${fileExtension}`;
                                binaryObject[propertyName].fileExtension = fileExtension;
                            }
                        }
                        returnData.push({
                            json: items[i].json,
                            binary: binaryObject,
                            pairedItem: {
                                item: i,
                            },
                        });
                    }
                    if (operation === 'compress') {
                        const binaryPropertyNames = this.getNodeParameter('binaryPropertyName', 0).split(',').map(key => key.trim());
                        const outputFormat = this.getNodeParameter('outputFormat', 0);
                        const zipData = {};
                        const binaryObject = {};
                        for (const [index, binaryPropertyName] of binaryPropertyNames.entries()) {
                            if (items[i].binary === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                            }
                            //@ts-ignore
                            if (items[i].binary[binaryPropertyName] === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                            }
                            const binaryData = items[i].binary[binaryPropertyName];
                            const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                            if (outputFormat === 'zip') {
                                zipData[binaryData.fileName] = [
                                    binaryDataBuffer, {
                                        level: ALREADY_COMPRESSED.includes(binaryData.fileExtension) ? 0 : 6,
                                    },
                                ];
                            }
                            else if (outputFormat === 'gzip') {
                                const outputPrefix = this.getNodeParameter('outputPrefix', 0);
                                const data = yield gzip(binaryDataBuffer);
                                const fileName = (_b = binaryData.fileName) === null || _b === void 0 ? void 0 : _b.split('.')[0];
                                binaryObject[`${outputPrefix}${index}`] = yield this.helpers.prepareBinaryData(Buffer.from(data), `${fileName}.gzip`);
                            }
                        }
                        if (outputFormat === 'zip') {
                            const fileName = this.getNodeParameter('fileName', 0);
                            const binaryPropertyOutput = this.getNodeParameter('binaryPropertyOutput', 0);
                            const buffer = yield zip(zipData);
                            const data = yield this.helpers.prepareBinaryData(Buffer.from(buffer), fileName);
                            returnData.push({
                                json: items[i].json,
                                binary: {
                                    [binaryPropertyOutput]: data,
                                },
                                pairedItem: {
                                    item: i,
                                },
                            });
                        }
                        if (outputFormat === 'gzip') {
                            returnData.push({
                                json: items[i].json,
                                binary: binaryObject,
                                pairedItem: {
                                    item: i,
                                },
                            });
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({
                            json: {
                                error: error.message,
                            },
                            pairedItem: {
                                item: i,
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
exports.Compression = Compression;

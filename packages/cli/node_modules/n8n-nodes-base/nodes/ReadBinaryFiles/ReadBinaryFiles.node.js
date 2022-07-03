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
exports.ReadBinaryFiles = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
const promises_1 = require("fs/promises");
class ReadBinaryFiles {
    constructor() {
        this.description = {
            displayName: 'Read Binary Files',
            name: 'readBinaryFiles',
            icon: 'fa:file-import',
            group: ['input'],
            version: 1,
            description: 'Reads binary files from disk',
            defaults: {
                name: 'Read Binary Files',
                color: '#44AA44',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'File Selector',
                    name: 'fileSelector',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: '*.jpg',
                    description: 'Pattern for files to read',
                },
                {
                    displayName: 'Property Name',
                    name: 'dataPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    description: 'Name of the binary property to which to write the data of the read files',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileSelector = this.getNodeParameter('fileSelector', 0);
            const dataPropertyName = this.getNodeParameter('dataPropertyName', 0);
            const files = yield (0, fast_glob_1.default)(fileSelector);
            const items = [];
            let item;
            let data;
            for (const filePath of files) {
                data = (yield (0, promises_1.readFile)(filePath));
                item = {
                    binary: {
                        [dataPropertyName]: yield this.helpers.prepareBinaryData(data, filePath),
                    },
                    json: {},
                    pairedItem: {
                        item: 0,
                    },
                };
                items.push(item);
            }
            return this.prepareOutputData(items);
        });
    }
}
exports.ReadBinaryFiles = ReadBinaryFiles;

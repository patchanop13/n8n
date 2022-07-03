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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ftp = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const path_1 = require("path");
const promise_ftp_1 = __importDefault(require("promise-ftp"));
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
class Ftp {
    constructor() {
        this.description = {
            displayName: 'FTP',
            name: 'ftp',
            icon: 'fa:server',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["protocol"] + ": " + $parameter["operation"]}}',
            description: 'Transfers files via FTP or SFTP',
            defaults: {
                name: 'FTP',
                color: '#303050',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    // nodelinter-ignore-next-line
                    name: 'ftp',
                    required: true,
                    displayOptions: {
                        show: {
                            protocol: [
                                'ftp',
                            ],
                        },
                    },
                },
                {
                    // nodelinter-ignore-next-line
                    name: 'sftp',
                    required: true,
                    displayOptions: {
                        show: {
                            protocol: [
                                'sftp',
                            ],
                        },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Protocol',
                    name: 'protocol',
                    type: 'options',
                    options: [
                        {
                            name: 'FTP',
                            value: 'ftp',
                        },
                        {
                            name: 'SFTP',
                            value: 'sftp',
                        },
                    ],
                    default: 'ftp',
                    description: 'File transfer protocol',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete a file/folder',
                        },
                        {
                            name: 'Download',
                            value: 'download',
                            description: 'Download a file',
                        },
                        {
                            name: 'List',
                            value: 'list',
                            description: 'List folder content',
                        },
                        {
                            name: 'Rename',
                            value: 'rename',
                            description: 'Rename/move oldPath to newPath',
                        },
                        {
                            name: 'Upload',
                            value: 'upload',
                            description: 'Upload a file',
                        },
                    ],
                    default: 'download',
                    noDataExpression: true,
                },
                // ----------------------------------
                //         delete
                // ----------------------------------
                {
                    displayName: 'Path',
                    displayOptions: {
                        show: {
                            operation: [
                                'delete',
                            ],
                        },
                    },
                    name: 'path',
                    type: 'string',
                    default: '',
                    description: 'The file path of the file to delete. Has to contain the full path.',
                    required: true,
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    displayOptions: {
                        show: {
                            operation: [
                                'delete',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Folder',
                            name: 'folder',
                            type: 'boolean',
                            default: false,
                            description: 'Whether folders can be deleted',
                        },
                        {
                            displayName: 'Recursive',
                            displayOptions: {
                                show: {
                                    folder: [
                                        true,
                                    ],
                                },
                            },
                            name: 'recursive',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to remove all files and directories in target directory',
                        },
                    ],
                },
                // ----------------------------------
                //         download
                // ----------------------------------
                {
                    displayName: 'Path',
                    displayOptions: {
                        show: {
                            operation: [
                                'download',
                            ],
                        },
                    },
                    name: 'path',
                    type: 'string',
                    default: '',
                    placeholder: '/documents/invoice.txt',
                    description: 'The file path of the file to download. Has to contain the full path.',
                    required: true,
                },
                {
                    displayName: 'Binary Property',
                    displayOptions: {
                        show: {
                            operation: [
                                'download',
                            ],
                        },
                    },
                    name: 'binaryPropertyName',
                    type: 'string',
                    default: 'data',
                    description: 'Object property name which holds binary data',
                    required: true,
                },
                // ----------------------------------
                //         rename
                // ----------------------------------
                {
                    displayName: 'Old Path',
                    displayOptions: {
                        show: {
                            operation: [
                                'rename',
                            ],
                        },
                    },
                    name: 'oldPath',
                    type: 'string',
                    default: '',
                    required: true,
                },
                {
                    displayName: 'New Path',
                    displayOptions: {
                        show: {
                            operation: [
                                'rename',
                            ],
                        },
                    },
                    name: 'newPath',
                    type: 'string',
                    default: '',
                    required: true,
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            operation: [
                                'rename',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Create Directories',
                            name: 'createDirectories',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to recursively create destination directory when renaming an existing file or folder',
                        },
                    ],
                },
                // ----------------------------------
                //         upload
                // ----------------------------------
                {
                    displayName: 'Path',
                    displayOptions: {
                        show: {
                            operation: [
                                'upload',
                            ],
                        },
                    },
                    name: 'path',
                    type: 'string',
                    default: '',
                    description: 'The file path of the file to upload. Has to contain the full path.',
                    required: true,
                },
                {
                    displayName: 'Binary Data',
                    displayOptions: {
                        show: {
                            operation: [
                                'upload',
                            ],
                        },
                    },
                    name: 'binaryData',
                    type: 'boolean',
                    default: true,
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                    description: 'The text content of the file to upload',
                },
                {
                    displayName: 'Binary Property',
                    displayOptions: {
                        show: {
                            operation: [
                                'upload',
                            ],
                            binaryData: [
                                true,
                            ],
                        },
                    },
                    name: 'binaryPropertyName',
                    type: 'string',
                    default: 'data',
                    description: 'Object property name which holds binary data',
                    required: true,
                },
                {
                    displayName: 'File Content',
                    displayOptions: {
                        show: {
                            operation: [
                                'upload',
                            ],
                            binaryData: [
                                false,
                            ],
                        },
                    },
                    name: 'fileContent',
                    type: 'string',
                    default: '',
                    description: 'The text content of the file to upload',
                },
                // ----------------------------------
                //         list
                // ----------------------------------
                {
                    displayName: 'Path',
                    displayOptions: {
                        show: {
                            operation: [
                                'list',
                            ],
                        },
                    },
                    name: 'path',
                    type: 'string',
                    default: '/',
                    description: 'Path of directory to list contents of',
                    required: true,
                },
                {
                    displayName: 'Recursive',
                    displayOptions: {
                        show: {
                            operation: [
                                'list',
                            ],
                        },
                    },
                    name: 'recursive',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to return object representing all directories / objects recursively found within SFTP server',
                    required: true,
                },
            ],
        };
    }
    execute() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            // const returnData: IDataObject[] = [];
            const returnItems = [];
            const qs = {};
            let responseData;
            const operation = this.getNodeParameter('operation', 0);
            let credentials = undefined;
            const protocol = this.getNodeParameter('protocol', 0);
            if (protocol === 'sftp') {
                credentials = yield this.getCredentials('sftp');
            }
            else {
                credentials = yield this.getCredentials('ftp');
            }
            try {
                let ftp;
                let sftp;
                if (protocol === 'sftp') {
                    sftp = new ssh2_sftp_client_1.default();
                    yield sftp.connect({
                        host: credentials.host,
                        port: credentials.port,
                        username: credentials.username,
                        password: credentials.password,
                        privateKey: credentials.privateKey,
                        passphrase: credentials.passphrase,
                    });
                }
                else {
                    ftp = new promise_ftp_1.default();
                    yield ftp.connect({
                        host: credentials.host,
                        port: credentials.port,
                        user: credentials.username,
                        password: credentials.password,
                    });
                }
                for (let i = 0; i < items.length; i++) {
                    const newItem = {
                        json: items[i].json,
                        binary: {},
                    };
                    if (items[i].binary !== undefined) {
                        // Create a shallow copy of the binary data so that the old
                        // data references which do not get changed still stay behind
                        // but the incoming data does not get changed.
                        Object.assign(newItem.binary, items[i].binary);
                    }
                    items[i] = newItem;
                    if (protocol === 'sftp') {
                        if (operation === 'list') {
                            const path = this.getNodeParameter('path', i);
                            const recursive = this.getNodeParameter('recursive', i);
                            if (recursive) {
                                responseData = yield callRecursiveList(path, sftp, normalizeSFtpItem);
                                returnItems.push.apply(returnItems, this.helpers.returnJsonArray(responseData));
                            }
                            else {
                                responseData = yield sftp.list(path);
                                responseData.forEach(item => normalizeSFtpItem(item, path));
                                returnItems.push.apply(returnItems, this.helpers.returnJsonArray(responseData));
                            }
                        }
                        if (operation === 'delete') {
                            const path = this.getNodeParameter('path', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.folder === true) {
                                responseData = yield sftp.rmdir(path, !!options.recursive);
                            }
                            else {
                                responseData = yield sftp.delete(path);
                            }
                            returnItems.push({ json: { success: true } });
                        }
                        if (operation === 'rename') {
                            const oldPath = this.getNodeParameter('oldPath', i);
                            const { createDirectories = false } = this.getNodeParameter('options', i);
                            const newPath = this.getNodeParameter('newPath', i);
                            if (createDirectories) {
                                yield recursivelyCreateSftpDirs(sftp, newPath);
                            }
                            responseData = yield sftp.rename(oldPath, newPath);
                            returnItems.push({ json: { success: true } });
                        }
                        if (operation === 'download') {
                            const path = this.getNodeParameter('path', i);
                            responseData = yield sftp.get(path);
                            const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i);
                            const filePathDownload = this.getNodeParameter('path', i);
                            items[i].binary[dataPropertyNameDownload] = yield this.helpers.prepareBinaryData(responseData, filePathDownload);
                            returnItems.push(items[i]);
                        }
                        if (operation === 'upload') {
                            const remotePath = this.getNodeParameter('path', i);
                            yield recursivelyCreateSftpDirs(sftp, remotePath);
                            if (this.getNodeParameter('binaryData', i) === true) {
                                // Is binary file to upload
                                const item = items[i];
                                if (item.binary === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                }
                                const propertyNameUpload = this.getNodeParameter('binaryPropertyName', i);
                                if (item.binary[propertyNameUpload] === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${propertyNameUpload}" does not exists on item!`);
                                }
                                const buffer = yield this.helpers.getBinaryDataBuffer(i, propertyNameUpload);
                                yield sftp.put(buffer, remotePath);
                            }
                            else {
                                // Is text file
                                const buffer = Buffer.from(this.getNodeParameter('fileContent', i), 'utf8');
                                yield sftp.put(buffer, remotePath);
                            }
                            returnItems.push(items[i]);
                        }
                    }
                    if (protocol === 'ftp') {
                        if (operation === 'list') {
                            const path = this.getNodeParameter('path', i);
                            const recursive = this.getNodeParameter('recursive', i);
                            if (recursive) {
                                responseData = yield callRecursiveList(path, ftp, normalizeFtpItem);
                                returnItems.push.apply(returnItems, this.helpers.returnJsonArray(responseData));
                            }
                            else {
                                responseData = yield ftp.list(path);
                                responseData.forEach(item => normalizeFtpItem(item, path));
                                returnItems.push.apply(returnItems, this.helpers.returnJsonArray(responseData));
                            }
                        }
                        if (operation === 'delete') {
                            const path = this.getNodeParameter('path', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.folder === true) {
                                responseData = yield ftp.rmdir(path, !!options.recursive);
                            }
                            else {
                                responseData = yield ftp.delete(path);
                            }
                            returnItems.push({ json: { success: true } });
                        }
                        if (operation === 'download') {
                            const path = this.getNodeParameter('path', i);
                            responseData = yield ftp.get(path);
                            // Convert readable stream to buffer so that can be displayed properly
                            const chunks = [];
                            try {
                                for (var responseData_1 = (e_1 = void 0, __asyncValues(responseData)), responseData_1_1; responseData_1_1 = yield responseData_1.next(), !responseData_1_1.done;) {
                                    const chunk = responseData_1_1.value;
                                    chunks.push(chunk);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (responseData_1_1 && !responseData_1_1.done && (_a = responseData_1.return)) yield _a.call(responseData_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            // @ts-ignore
                            responseData = Buffer.concat(chunks);
                            const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i);
                            const filePathDownload = this.getNodeParameter('path', i);
                            items[i].binary[dataPropertyNameDownload] = yield this.helpers.prepareBinaryData(responseData, filePathDownload);
                            returnItems.push(items[i]);
                        }
                        if (operation === 'rename') {
                            const oldPath = this.getNodeParameter('oldPath', i);
                            const newPath = this.getNodeParameter('newPath', i);
                            responseData = yield ftp.rename(oldPath, newPath);
                            returnItems.push({ json: { success: true } });
                        }
                        if (operation === 'upload') {
                            const remotePath = this.getNodeParameter('path', i);
                            const fileName = (0, path_1.basename)(remotePath);
                            const dirPath = remotePath.replace(fileName, '');
                            if (this.getNodeParameter('binaryData', i) === true) {
                                // Is binary file to upload
                                const item = items[i];
                                if (item.binary === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                }
                                const propertyNameUpload = this.getNodeParameter('binaryPropertyName', i);
                                if (item.binary[propertyNameUpload] === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${propertyNameUpload}" does not exists on item!`);
                                }
                                const buffer = yield this.helpers.getBinaryDataBuffer(i, propertyNameUpload);
                                try {
                                    yield ftp.put(buffer, remotePath);
                                }
                                catch (error) {
                                    if (error.code === 553) {
                                        // Create directory
                                        yield ftp.mkdir(dirPath, true);
                                        yield ftp.put(buffer, remotePath);
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                                    }
                                }
                            }
                            else {
                                // Is text file
                                const buffer = Buffer.from(this.getNodeParameter('fileContent', i), 'utf8');
                                try {
                                    yield ftp.put(buffer, remotePath);
                                }
                                catch (error) {
                                    if (error.code === 553) {
                                        // Create directory
                                        yield ftp.mkdir(dirPath, true);
                                        yield ftp.put(buffer, remotePath);
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                                    }
                                }
                            }
                            returnItems.push(items[i]);
                        }
                    }
                }
                if (protocol === 'sftp') {
                    yield sftp.end();
                }
                else {
                    yield ftp.end();
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    return this.prepareOutputData([{ json: { error: error.message } }]);
                }
                throw error;
            }
            return [returnItems];
        });
    }
}
exports.Ftp = Ftp;
function normalizeFtpItem(input, path, recursive = false) {
    const item = input;
    item.modifyTime = input.date;
    item.path = (!recursive) ? `${path}${path.endsWith('/') ? '' : '/'}${item.name}` : path;
    //@ts-ignore
    item.date = undefined;
}
function normalizeSFtpItem(input, path, recursive = false) {
    const item = input;
    item.accessTime = new Date(input.accessTime);
    item.modifyTime = new Date(input.modifyTime);
    item.path = (!recursive) ? `${path}${path.endsWith('/') ? '' : '/'}${item.name}` : path;
}
function callRecursiveList(path, client, normalizeFunction) {
    return __awaiter(this, void 0, void 0, function* () {
        const pathArray = [path];
        let currentPath = path;
        const directoryItems = [];
        let index = 0;
        do {
            // tslint:disable-next-line: array-type
            const returnData = yield client.list(pathArray[index]);
            // @ts-ignore
            returnData.map((item) => {
                if (pathArray[index].endsWith('/')) {
                    currentPath = `${pathArray[index]}${item.name}`;
                }
                else {
                    currentPath = `${pathArray[index]}/${item.name}`;
                }
                // Is directory
                if (item.type === 'd') {
                    pathArray.push(currentPath);
                }
                normalizeFunction(item, currentPath, true);
                directoryItems.push(item);
            });
            index++;
        } while (index <= pathArray.length - 1);
        return directoryItems;
    });
}
function recursivelyCreateSftpDirs(sftp, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirPath = (0, path_1.dirname)(path);
        const dirExists = yield sftp.exists(dirPath);
        if (!dirExists) {
            yield sftp.mkdir(dirPath, true);
        }
    });
}

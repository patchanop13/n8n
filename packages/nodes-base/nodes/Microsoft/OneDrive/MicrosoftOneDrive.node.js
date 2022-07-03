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
exports.MicrosoftOneDrive = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const FileDescription_1 = require("./FileDescription");
const FolderDescription_1 = require("./FolderDescription");
class MicrosoftOneDrive {
    constructor() {
        this.description = {
            displayName: 'Microsoft OneDrive',
            name: 'microsoftOneDrive',
            icon: 'file:oneDrive.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Microsoft OneDrive API',
            defaults: {
                name: 'Microsoft OneDrive',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'microsoftOneDriveOAuth2Api',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'File',
                            value: 'file',
                        },
                        {
                            name: 'Folder',
                            value: 'folder',
                        },
                    ],
                    default: 'file',
                },
                ...FileDescription_1.fileOperations,
                ...FileDescription_1.fileFields,
                ...FolderDescription_1.folderOperations,
                ...FolderDescription_1.folderFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'file') {
                        //https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_copy?view=odsp-graph-online
                        if (operation === 'copy') {
                            const fileId = this.getNodeParameter('fileId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const parentReference = this.getNodeParameter('parentReference', i);
                            const body = {};
                            if (parentReference) {
                                body.parentReference = Object.assign({}, parentReference);
                            }
                            if (additionalFields.name) {
                                body.name = additionalFields.name;
                            }
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', `/drive/items/${fileId}/copy`, body, {}, undefined, {}, { json: true, resolveWithFullResponse: true });
                            responseData = { location: responseData.headers.location };
                            returnData.push(responseData);
                        }
                        //https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_delete?view=odsp-graph-online
                        if (operation === 'delete') {
                            const fileId = this.getNodeParameter('fileId', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'DELETE', `/drive/items/${fileId}`);
                            responseData = { success: true };
                            returnData.push(responseData);
                        }
                        //https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_list_children?view=odsp-graph-online
                        if (operation === 'download') {
                            const fileId = this.getNodeParameter('fileId', i);
                            const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/drive/items/${fileId}`);
                            const fileName = responseData.name;
                            if (responseData.file === undefined) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, { message: 'The ID you provided does not belong to a file.' });
                            }
                            let mimeType;
                            if (responseData.file.mimeType) {
                                mimeType = responseData.file.mimeType;
                            }
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/drive/items/${fileId}/content`, {}, {}, undefined, {}, { encoding: null, resolveWithFullResponse: true });
                            const newItem = {
                                json: items[i].json,
                                binary: {},
                            };
                            if (mimeType === undefined && responseData.headers['content-type']) {
                                mimeType = responseData.headers['content-type'];
                            }
                            if (items[i].binary !== undefined) {
                                // Create a shallow copy of the binary data so that the old
                                // data references which do not get changed still stay behind
                                // but the incoming data does not get changed.
                                Object.assign(newItem.binary, items[i].binary);
                            }
                            items[i] = newItem;
                            const data = Buffer.from(responseData.body);
                            items[i].binary[dataPropertyNameDownload] = yield this.helpers.prepareBinaryData(data, fileName, mimeType);
                        }
                        //https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_get?view=odsp-graph-online
                        if (operation === 'get') {
                            const fileId = this.getNodeParameter('fileId', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/drive/items/${fileId}`);
                            returnData.push(responseData);
                        }
                        //https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_search?view=odsp-graph-online
                        if (operation === 'search') {
                            const query = this.getNodeParameter('query', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/drive/root/search(q='${query}')`);
                            responseData = responseData.filter((item) => item.file);
                            returnData.push.apply(returnData, responseData);
                        }
                        //https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_createlink?view=odsp-graph-online
                        if (operation === 'share') {
                            const fileId = this.getNodeParameter('fileId', i);
                            const type = this.getNodeParameter('type', i);
                            const scope = this.getNodeParameter('scope', i);
                            const body = {
                                type,
                                scope,
                            };
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', `/drive/items/${fileId}/createLink`, body);
                            returnData.push(responseData);
                        }
                        //https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_put_content?view=odsp-graph-online#example-upload-a-new-file
                        if (operation === 'upload') {
                            const parentId = this.getNodeParameter('parentId', i);
                            const isBinaryData = this.getNodeParameter('binaryData', i);
                            const fileName = this.getNodeParameter('fileName', i);
                            if (isBinaryData) {
                                const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0);
                                if (items[i].binary === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                }
                                //@ts-ignore
                                if (items[i].binary[binaryPropertyName] === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                                }
                                const binaryData = items[i].binary[binaryPropertyName];
                                const body = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                                let encodedFilename;
                                if (fileName !== '') {
                                    encodedFilename = encodeURIComponent(fileName);
                                }
                                if (binaryData.fileName !== undefined) {
                                    encodedFilename = encodeURIComponent(binaryData.fileName);
                                }
                                responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'PUT', `/drive/items/${parentId}:/${encodedFilename}:/content`, body, {}, undefined, { 'Content-Type': binaryData.mimeType, 'Content-length': body.length }, {});
                                returnData.push(JSON.parse(responseData));
                            }
                            else {
                                const body = this.getNodeParameter('fileContent', i);
                                if (fileName === '') {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'File name must be set!');
                                }
                                const encodedFilename = encodeURIComponent(fileName);
                                responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'PUT', `/drive/items/${parentId}:/${encodedFilename}:/content`, body, {}, undefined, { 'Content-Type': 'text/plain' });
                                returnData.push(responseData);
                            }
                        }
                    }
                    if (resource === 'folder') {
                        //https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_post_children?view=odsp-graph-online
                        if (operation === 'create') {
                            const names = this.getNodeParameter('name', i).split('/').filter(s => s.trim() !== '');
                            const options = this.getNodeParameter('options', i);
                            let parentFolderId = options.parentFolderId ? options.parentFolderId : null;
                            for (const name of names) {
                                const body = {
                                    name,
                                    folder: {},
                                };
                                let endpoint = '/drive/root/children';
                                if (parentFolderId) {
                                    endpoint = `/drive/items/${parentFolderId}/children`;
                                }
                                responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', endpoint, body);
                                if (!responseData.id) {
                                    break;
                                }
                                parentFolderId = responseData.id;
                            }
                            returnData.push(responseData);
                        }
                        //https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_delete?view=odsp-graph-online
                        if (operation === 'delete') {
                            const folderId = this.getNodeParameter('folderId', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'DELETE', `/drive/items/${folderId}`);
                            responseData = { success: true };
                            returnData.push(responseData);
                        }
                        //https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_list_children?view=odsp-graph-online
                        if (operation === 'getChildren') {
                            const folderId = this.getNodeParameter('folderId', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/drive/items/${folderId}/children`);
                            returnData.push.apply(returnData, responseData);
                        }
                        //https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_search?view=odsp-graph-online
                        if (operation === 'search') {
                            const query = this.getNodeParameter('query', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/drive/root/search(q='${query}')`);
                            responseData = responseData.filter((item) => item.folder);
                            returnData.push.apply(returnData, responseData);
                        }
                        //https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_createlink?view=odsp-graph-online
                        if (operation === 'share') {
                            const folderId = this.getNodeParameter('folderId', i);
                            const type = this.getNodeParameter('type', i);
                            const scope = this.getNodeParameter('scope', i);
                            const body = {
                                type,
                                scope,
                            };
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', `/drive/items/${folderId}/createLink`, body);
                            returnData.push(responseData);
                        }
                    }
                    if (resource === 'file' || resource === 'folder') {
                        if (operation === 'rename') {
                            const itemId = this.getNodeParameter('itemId', i);
                            const newName = this.getNodeParameter('newName', i);
                            const body = { name: newName };
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'PATCH', `/drive/items/${itemId}`, body);
                            returnData.push(responseData);
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        if (resource === 'file' && operation === 'download') {
                            items[i].json = { error: error.message };
                        }
                        else {
                            returnData.push({ error: error.message });
                        }
                        continue;
                    }
                    throw error;
                }
            }
            if (resource === 'file' && operation === 'download') {
                // For file downloads the files get attached to the existing items
                return this.prepareOutputData(items);
            }
            else {
                return [this.helpers.returnJsonArray(returnData)];
            }
        });
    }
}
exports.MicrosoftOneDrive = MicrosoftOneDrive;

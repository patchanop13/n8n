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
exports.Box = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const FileDescription_1 = require("./FileDescription");
const FolderDescription_1 = require("./FolderDescription");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const change_case_1 = require("change-case");
class Box {
    constructor() {
        this.description = {
            displayName: 'Box',
            name: 'box',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:box.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Box API',
            defaults: {
                name: 'Box',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'boxOAuth2Api',
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
            const timezone = this.getTimezone();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'file') {
                        // https://developer.box.com/reference/post-files-id-copy
                        if (operation === 'copy') {
                            const fileId = this.getNodeParameter('fileId', i);
                            const parentId = this.getNodeParameter('parentId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {};
                            if (additionalFields.name) {
                                body.name = additionalFields.name;
                            }
                            if (parentId) {
                                body.parent = { id: parentId };
                            }
                            else {
                                body.parent = { id: 0 };
                            }
                            if (additionalFields.fields) {
                                qs.fields = additionalFields.fields;
                            }
                            if (additionalFields.version) {
                                body.version = additionalFields.version;
                            }
                            responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'POST', `/files/${fileId}/copy`, body, qs);
                            returnData.push(responseData);
                        }
                        // https://developer.box.com/reference/delete-files-id
                        if (operation === 'delete') {
                            const fileId = this.getNodeParameter('fileId', i);
                            responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'DELETE', `/files/${fileId}`);
                            responseData = { success: true };
                            returnData.push(responseData);
                        }
                        // https://developer.box.com/reference/get-files-id-content
                        if (operation === 'download') {
                            const fileId = this.getNodeParameter('fileId', i);
                            const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i);
                            responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'GET', `/files/${fileId}`);
                            const fileName = responseData.name;
                            let mimeType;
                            responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'GET', `/files/${fileId}/content`, {}, {}, undefined, { encoding: null, resolveWithFullResponse: true });
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
                        // https://developer.box.com/reference/get-files-id
                        if (operation === 'get') {
                            const fileId = this.getNodeParameter('fileId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.fields) {
                                qs.fields = additionalFields.fields;
                            }
                            responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'GET', `/files/${fileId}`, {}, qs);
                            returnData.push(responseData);
                        }
                        // https://developer.box.com/reference/get-search/
                        if (operation === 'search') {
                            const query = this.getNodeParameter('query', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const timezone = this.getTimezone();
                            qs.type = 'file';
                            qs.query = query;
                            Object.assign(qs, additionalFields);
                            if (qs.content_types) {
                                qs.content_types = qs.content_types.split(',');
                            }
                            if (additionalFields.createdRangeUi) {
                                const createdRangeValues = additionalFields.createdRangeUi.createdRangeValuesUi;
                                if (createdRangeValues) {
                                    qs.created_at_range = `${moment_timezone_1.default.tz(createdRangeValues.from, timezone).format()},${moment_timezone_1.default.tz(createdRangeValues.to, timezone).format()}`;
                                }
                                delete qs.createdRangeUi;
                            }
                            if (additionalFields.updatedRangeUi) {
                                const updateRangeValues = additionalFields.updatedRangeUi.updatedRangeValuesUi;
                                if (updateRangeValues) {
                                    qs.updated_at_range = `${moment_timezone_1.default.tz(updateRangeValues.from, timezone).format()},${moment_timezone_1.default.tz(updateRangeValues.to, timezone).format()}`;
                                }
                                delete qs.updatedRangeUi;
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.boxApiRequestAllItems.call(this, 'entries', 'GET', `/search`, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'GET', `/search`, {}, qs);
                                responseData = responseData.entries;
                            }
                            returnData.push.apply(returnData, responseData);
                        }
                        // https://developer.box.com/reference/post-collaborations/
                        if (operation === 'share') {
                            const fileId = this.getNodeParameter('fileId', i);
                            const role = this.getNodeParameter('role', i);
                            const accessibleBy = this.getNodeParameter('accessibleBy', i);
                            const options = this.getNodeParameter('options', i);
                            // tslint:disable-next-line: no-any
                            const body = Object.assign({ accessible_by: {}, item: {
                                    id: fileId,
                                    type: 'file',
                                }, role: (role === 'coOwner') ? 'co-owner' : (0, change_case_1.noCase)(role) }, options);
                            if (body.fields) {
                                qs.fields = body.fields;
                                delete body.fields;
                            }
                            if (body.expires_at) {
                                body.expires_at = moment_timezone_1.default.tz(body.expires_at, timezone).format();
                            }
                            if (body.notify) {
                                qs.notify = body.notify;
                                delete body.notify;
                            }
                            if (accessibleBy === 'user') {
                                const useEmail = this.getNodeParameter('useEmail', i);
                                if (useEmail) {
                                    body.accessible_by['login'] = this.getNodeParameter('email', i);
                                }
                                else {
                                    body.accessible_by['id'] = this.getNodeParameter('userId', i);
                                }
                            }
                            else {
                                body.accessible_by['id'] = this.getNodeParameter('groupId', i);
                            }
                            responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'POST', `/collaborations`, body, qs);
                            returnData.push(responseData);
                        }
                        // https://developer.box.com/reference/post-files-content
                        if (operation === 'upload') {
                            const parentId = this.getNodeParameter('parentId', i);
                            const isBinaryData = this.getNodeParameter('binaryData', i);
                            const fileName = this.getNodeParameter('fileName', i);
                            const attributes = {};
                            if (parentId !== '') {
                                attributes['parent'] = { id: parentId };
                            }
                            else {
                                // if not parent defined save it on the root directory
                                attributes['parent'] = { id: 0 };
                            }
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
                                const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                                const body = {};
                                attributes['name'] = fileName || binaryData.fileName;
                                body['attributes'] = JSON.stringify(attributes);
                                body['file'] = {
                                    value: binaryDataBuffer,
                                    options: {
                                        filename: binaryData.fileName,
                                        contentType: binaryData.mimeType,
                                    },
                                };
                                responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'POST', '', {}, {}, 'https://upload.box.com/api/2.0/files/content', { formData: body });
                                returnData.push.apply(returnData, responseData.entries);
                            }
                            else {
                                const content = this.getNodeParameter('fileContent', i);
                                if (fileName === '') {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'File name must be set!');
                                }
                                attributes['name'] = fileName;
                                const body = {};
                                body['attributes'] = JSON.stringify(attributes);
                                body['file'] = {
                                    value: Buffer.from(content),
                                    options: {
                                        filename: fileName,
                                        contentType: 'text/plain',
                                    },
                                };
                                responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'POST', '', {}, {}, 'https://upload.box.com/api/2.0/files/content', { formData: body });
                                returnData.push.apply(returnData, responseData.entries);
                            }
                        }
                    }
                    if (resource === 'folder') {
                        // https://developer.box.com/reference/post-folders
                        if (operation === 'create') {
                            const name = this.getNodeParameter('name', i);
                            const parentId = this.getNodeParameter('parentId', i);
                            const options = this.getNodeParameter('options', i);
                            const body = {
                                name,
                            };
                            if (parentId) {
                                body.parent = { id: parentId };
                            }
                            else {
                                body.parent = { id: 0 };
                            }
                            if (options.access) {
                                body.folder_upload_email = {
                                    access: options.access,
                                };
                            }
                            if (options.fields) {
                                qs.fields = options.fields;
                            }
                            responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'POST', '/folders', body, qs);
                            returnData.push(responseData);
                        }
                        // https://developer.box.com/reference/delete-folders-id
                        if (operation === 'delete') {
                            const folderId = this.getNodeParameter('folderId', i);
                            const recursive = this.getNodeParameter('recursive', i);
                            qs.recursive = recursive;
                            responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'DELETE', `/folders/${folderId}`, qs);
                            responseData = { success: true };
                            returnData.push(responseData);
                        }
                        // https://developer.box.com/reference/get-folders-id/
                        if (operation === 'get') {
                            const folderId = this.getNodeParameter('folderId', i);
                            responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'GET', `/folders/${folderId}`, qs);
                            returnData.push(responseData);
                        }
                        // https://developer.box.com/reference/get-search/
                        if (operation === 'search') {
                            const query = this.getNodeParameter('query', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const timezone = this.getTimezone();
                            qs.type = 'folder';
                            qs.query = query;
                            Object.assign(qs, additionalFields);
                            if (qs.content_types) {
                                qs.content_types = qs.content_types.split(',');
                            }
                            if (additionalFields.createdRangeUi) {
                                const createdRangeValues = additionalFields.createdRangeUi.createdRangeValuesUi;
                                if (createdRangeValues) {
                                    qs.created_at_range = `${moment_timezone_1.default.tz(createdRangeValues.from, timezone).format()},${moment_timezone_1.default.tz(createdRangeValues.to, timezone).format()}`;
                                }
                                delete qs.createdRangeUi;
                            }
                            if (additionalFields.updatedRangeUi) {
                                const updateRangeValues = additionalFields.updatedRangeUi.updatedRangeValuesUi;
                                if (updateRangeValues) {
                                    qs.updated_at_range = `${moment_timezone_1.default.tz(updateRangeValues.from, timezone).format()},${moment_timezone_1.default.tz(updateRangeValues.to, timezone).format()}`;
                                }
                                delete qs.updatedRangeUi;
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.boxApiRequestAllItems.call(this, 'entries', 'GET', `/search`, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'GET', `/search`, {}, qs);
                                responseData = responseData.entries;
                            }
                            returnData.push.apply(returnData, responseData);
                        }
                        // https://developer.box.com/reference/post-collaborations/
                        if (operation === 'share') {
                            const folderId = this.getNodeParameter('folderId', i);
                            const role = this.getNodeParameter('role', i);
                            const accessibleBy = this.getNodeParameter('accessibleBy', i);
                            const options = this.getNodeParameter('options', i);
                            // tslint:disable-next-line: no-any
                            const body = Object.assign({ accessible_by: {}, item: {
                                    id: folderId,
                                    type: 'folder',
                                }, role: (role === 'coOwner') ? 'co-owner' : (0, change_case_1.noCase)(role) }, options);
                            if (body.fields) {
                                qs.fields = body.fields;
                                delete body.fields;
                            }
                            if (body.expires_at) {
                                body.expires_at = moment_timezone_1.default.tz(body.expires_at, timezone).format();
                            }
                            if (body.notify) {
                                qs.notify = body.notify;
                                delete body.notify;
                            }
                            if (accessibleBy === 'user') {
                                const useEmail = this.getNodeParameter('useEmail', i);
                                if (useEmail) {
                                    body.accessible_by['login'] = this.getNodeParameter('email', i);
                                }
                                else {
                                    body.accessible_by['id'] = this.getNodeParameter('userId', i);
                                }
                            }
                            else {
                                body.accessible_by['id'] = this.getNodeParameter('groupId', i);
                            }
                            responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'POST', `/collaborations`, body, qs);
                            returnData.push(responseData);
                        }
                        //https://developer.box.com/guides/folders/single/move/
                        if (operation === 'update') {
                            const folderId = this.getNodeParameter('folderId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (updateFields.fields) {
                                qs.fields = updateFields.fields;
                                delete updateFields.fields;
                            }
                            const body = Object.assign({}, updateFields);
                            if (body.parentId) {
                                body.parent = {
                                    id: body.parentId,
                                };
                                delete body.parentId;
                            }
                            if (body.tags) {
                                body.tags = body.tags.split(',');
                            }
                            responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'PUT', `/folders/${folderId}`, body, qs);
                            returnData.push(responseData);
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
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
exports.Box = Box;

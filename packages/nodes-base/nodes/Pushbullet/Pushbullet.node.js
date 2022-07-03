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
exports.Pushbullet = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class Pushbullet {
    constructor() {
        this.description = {
            displayName: 'Pushbullet',
            name: 'pushbullet',
            icon: 'file:pushbullet.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Pushbullet API',
            defaults: {
                name: 'Pushbullet',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'pushbulletOAuth2Api',
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
                            name: 'Push',
                            value: 'push',
                        },
                    ],
                    default: 'push',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a push',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete a push',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all pushes',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update a push',
                        },
                    ],
                    default: 'create',
                },
                {
                    displayName: 'Type',
                    name: 'type',
                    type: 'options',
                    options: [
                        {
                            name: 'File',
                            value: 'file',
                        },
                        {
                            name: 'Link',
                            value: 'link',
                        },
                        {
                            name: 'Note',
                            value: 'note',
                        },
                    ],
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    default: 'note',
                },
                {
                    displayName: 'Title',
                    name: 'title',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                            operation: [
                                'create',
                            ],
                            type: [
                                'note',
                                'link',
                            ],
                        },
                    },
                    default: '',
                    description: 'Title of the push',
                },
                {
                    displayName: 'Body',
                    name: 'body',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                            operation: [
                                'create',
                            ],
                            type: [
                                'note',
                                'link',
                                'file',
                            ],
                        },
                    },
                    default: '',
                    description: 'Body of the push',
                },
                {
                    displayName: 'URL',
                    name: 'url',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                            operation: [
                                'create',
                            ],
                            type: [
                                'link',
                            ],
                        },
                    },
                    default: '',
                    description: 'URL of the push',
                },
                {
                    displayName: 'Binary Property',
                    name: 'binaryPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                            operation: [
                                'create',
                            ],
                            type: [
                                'file',
                            ],
                        },
                    },
                    placeholder: '',
                    description: 'Name of the binary property which contains the data for the file to be created',
                },
                {
                    displayName: 'Target',
                    name: 'target',
                    type: 'options',
                    options: [
                        {
                            name: 'Channel Tag',
                            value: 'channel_tag',
                            description: 'Send the push to all subscribers to your channel that has this tag',
                        },
                        {
                            name: 'Default',
                            value: 'default',
                            description: 'Broadcast it to all of the user\'s devices',
                        },
                        {
                            name: 'Device ID',
                            value: 'device_iden',
                            description: 'Send the push to a specific device',
                        },
                        {
                            name: 'Email',
                            value: 'email',
                            description: 'Send the push to this email address',
                        },
                    ],
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    default: 'default',
                    description: 'Define the medium that will be used to send the push',
                },
                {
                    displayName: 'Value',
                    name: 'value',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                        hide: {
                            target: [
                                'default',
                                'device_iden',
                            ],
                        },
                    },
                    default: '',
                    description: 'The value to be set depending on the target selected. For example, if the target selected is email then this field would take the email address of the person you are trying to send the push to.',
                },
                {
                    displayName: 'Value Name or ID',
                    name: 'value',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getDevices',
                    },
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                            operation: [
                                'create',
                            ],
                            target: [
                                'device_iden',
                            ],
                        },
                    },
                    default: '',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                },
                {
                    displayName: 'Push ID',
                    name: 'pushId',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                            operation: [
                                'delete',
                            ],
                        },
                    },
                    default: '',
                },
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'push',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether to return all results or only up to a given limit',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'push',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                        maxValue: 500,
                    },
                    default: 100,
                    description: 'Max number of results to return',
                },
                {
                    displayName: 'Filters',
                    name: 'filters',
                    type: 'collection',
                    placeholder: 'Add Filter',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                            operation: [
                                'getAll',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Active',
                            name: 'active',
                            type: 'boolean',
                            default: false,
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                            description: 'Don\'t return deleted pushes',
                        },
                        {
                            displayName: 'Modified After',
                            name: 'modified_after',
                            type: 'dateTime',
                            default: '',
                            description: 'Request pushes modified after this timestamp',
                        },
                    ],
                },
                {
                    displayName: 'Push ID',
                    name: 'pushId',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                            operation: [
                                'update',
                            ],
                        },
                    },
                    default: '',
                },
                {
                    displayName: 'Dismissed',
                    name: 'dismissed',
                    type: 'boolean',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'push',
                            ],
                            operation: [
                                'update',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether to mark a push as having been dismissed by the user, will cause any notifications for the push to be hidden if possible',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getDevices() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { devices } = yield GenericFunctions_1.pushbulletApiRequest.call(this, 'GET', '/devices');
                        for (const device of devices) {
                            returnData.push({
                                name: device.nickname,
                                value: device.iden,
                            });
                        }
                        return returnData;
                    });
                },
            },
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
                    if (resource === 'push') {
                        if (operation === 'create') {
                            const type = this.getNodeParameter('type', i);
                            const message = this.getNodeParameter('body', i);
                            const target = this.getNodeParameter('target', i);
                            const body = {
                                type,
                                body: message,
                            };
                            if (target !== 'default') {
                                const value = this.getNodeParameter('value', i);
                                body[target] = value;
                            }
                            if (['note', 'link'].includes(type)) {
                                body.title = this.getNodeParameter('title', i);
                                if (type === 'link') {
                                    body.url = this.getNodeParameter('url', i);
                                }
                            }
                            if (type === 'file') {
                                const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0);
                                if (items[i].binary === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                }
                                //@ts-ignore
                                if (items[i].binary[binaryPropertyName] === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                                }
                                const binaryData = items[i].binary[binaryPropertyName];
                                const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                                //create upload url
                                const { upload_url: uploadUrl, file_name, file_type, file_url, } = yield GenericFunctions_1.pushbulletApiRequest.call(this, 'POST', `/upload-request`, {
                                    file_name: binaryData.fileName,
                                    file_type: binaryData.mimeType,
                                });
                                //upload the file
                                yield GenericFunctions_1.pushbulletApiRequest.call(this, 'POST', '', {}, {}, uploadUrl, {
                                    formData: {
                                        file: {
                                            value: dataBuffer,
                                            options: {
                                                filename: binaryData.fileName,
                                            },
                                        },
                                    },
                                    json: false,
                                });
                                body.file_name = file_name;
                                body.file_type = file_type;
                                body.file_url = file_url;
                            }
                            responseData = yield GenericFunctions_1.pushbulletApiRequest.call(this, 'POST', `/pushes`, body);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const filters = this.getNodeParameter('filters', i);
                            Object.assign(qs, filters);
                            if (qs.modified_after) {
                                qs.modified_after = (0, moment_timezone_1.default)(qs.modified_after).unix();
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.pushbulletApiRequestAllItems.call(this, 'pushes', 'GET', '/pushes', {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.pushbulletApiRequest.call(this, 'GET', '/pushes', {}, qs);
                                responseData = responseData.pushes;
                            }
                        }
                        if (operation === 'delete') {
                            const pushId = this.getNodeParameter('pushId', i);
                            responseData = yield GenericFunctions_1.pushbulletApiRequest.call(this, 'DELETE', `/pushes/${pushId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'update') {
                            const pushId = this.getNodeParameter('pushId', i);
                            const dismissed = this.getNodeParameter('dismissed', i);
                            responseData = yield GenericFunctions_1.pushbulletApiRequest.call(this, 'POST', `/pushes/${pushId}`, {
                                dismissed,
                            });
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else if (responseData !== undefined) {
                        returnData.push(responseData);
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
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Pushbullet = Pushbullet;

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
exports.Gotify = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class Gotify {
    constructor() {
        this.description = {
            displayName: 'Gotify',
            name: 'gotify',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:gotify.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Gotify API',
            defaults: {
                name: 'Gotify',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'gotifyApi',
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
                            name: 'Message',
                            value: 'message',
                        },
                    ],
                    default: 'message',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'message',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                        },
                    ],
                    default: 'create',
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'message',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    default: '',
                    description: 'The message. Markdown (excluding html) is allowed.',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    displayOptions: {
                        show: {
                            resource: [
                                'message',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Priority',
                            name: 'priority',
                            type: 'number',
                            default: 1,
                            description: 'The priority of the message',
                        },
                        {
                            displayName: 'Title',
                            name: 'title',
                            type: 'string',
                            default: '',
                            description: 'The title of the message',
                        },
                    ],
                },
                {
                    displayName: 'Message ID',
                    name: 'messageId',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'message',
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
                            resource: [
                                'message',
                            ],
                            operation: [
                                'getAll',
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
                    typeOptions: {
                        minValue: 1,
                    },
                    description: 'Max number of results to return',
                    default: 20,
                    displayOptions: {
                        show: {
                            resource: [
                                'message',
                            ],
                            operation: [
                                'getAll',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                },
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
                    if (resource === 'message') {
                        if (operation === 'create') {
                            const message = this.getNodeParameter('message', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                message,
                            };
                            Object.assign(body, additionalFields);
                            responseData = yield GenericFunctions_1.gotifyApiRequest.call(this, 'POST', `/message`, body);
                        }
                        if (operation === 'delete') {
                            const messageId = this.getNodeParameter('messageId', i);
                            responseData = yield GenericFunctions_1.gotifyApiRequest.call(this, 'DELETE', `/message/${messageId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.gotifyApiRequestAllItems.call(this, 'messages', 'GET', '/message', {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.gotifyApiRequest.call(this, 'GET', `/message`, {}, qs);
                                responseData = responseData.messages;
                            }
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
exports.Gotify = Gotify;

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
exports.Twake = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class Twake {
    constructor() {
        this.description = {
            displayName: 'Twake',
            name: 'twake',
            group: ['transform'],
            version: 1,
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:twake.png',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Twake API',
            defaults: {
                name: 'Twake',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'twakeCloudApi',
                    required: true,
                    // displayOptions: {
                    // 	show: {
                    // 		twakeVersion: [
                    // 			'cloud',
                    // 		],
                    // 	},
                    // },
                },
                // {
                // 	name: 'twakeServerApi',
                // 	required: true,
                // 	displayOptions: {
                // 		show: {
                // 			twakeVersion: [
                // 				'server',
                // 			],
                // 		},
                // 	},
                // },
            ],
            properties: [
                // {
                // 	displayName: 'Twake Version',
                // 	name: 'twakeVersion',
                // 	type: 'options',
                // 	options: [
                // 		{
                // 			name: 'Cloud',
                // 			value: 'cloud',
                // 		},
                // 		{
                // 			name: 'Server (Self Hosted)',
                // 			value: 'server',
                // 		},
                // 	],
                // 	default: 'cloud',
                // },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Message',
                            value: 'message',
                            description: 'Send data to the message app',
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
                            name: 'Send',
                            value: 'send',
                            description: 'Send a message',
                        },
                    ],
                    default: 'send',
                },
                {
                    displayName: 'Channel Name or ID',
                    name: 'channelId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getChannels',
                    },
                    displayOptions: {
                        show: {
                            operation: [
                                'send',
                            ],
                        },
                    },
                    default: '',
                    description: 'Channel\'s ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Content',
                    name: 'content',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'send',
                            ],
                        },
                    },
                    default: '',
                    description: 'Message content',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    displayOptions: {
                        show: {
                            operation: [
                                'send',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Sender Icon',
                            name: 'senderIcon',
                            type: 'string',
                            default: '',
                            description: 'URL of the image/icon',
                        },
                        {
                            displayName: 'Sender Name',
                            name: 'senderName',
                            type: 'string',
                            default: '',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getChannels() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.twakeApiRequest.call(this, 'POST', '/channel', {});
                        if (responseData === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
                        }
                        const returnData = [];
                        for (const channel of responseData) {
                            returnData.push({
                                name: channel.name,
                                value: channel.id,
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
                if (resource === 'message') {
                    if (operation === 'send') {
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const message = {
                            channel_id: this.getNodeParameter('channelId', i),
                            content: {
                                formatted: this.getNodeParameter('content', i),
                            },
                            hidden_data: {
                                allow_delete: 'everyone',
                            },
                        };
                        if (additionalFields.senderName) {
                            //@ts-ignore
                            message.hidden_data.custom_title = additionalFields.senderName;
                        }
                        if (additionalFields.senderIcon) {
                            //@ts-ignore
                            message.hidden_data.custom_icon = additionalFields.senderIcon;
                        }
                        const body = {
                            object: message,
                        };
                        const endpoint = '/actions/message/save';
                        responseData = yield GenericFunctions_1.twakeApiRequest.call(this, 'POST', endpoint, body);
                        responseData = responseData.object;
                    }
                }
            }
            if (Array.isArray(responseData)) {
                returnData.push.apply(returnData, responseData);
            }
            else if (responseData !== undefined) {
                returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Twake = Twake;

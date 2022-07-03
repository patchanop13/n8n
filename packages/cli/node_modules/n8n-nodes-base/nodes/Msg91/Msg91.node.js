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
exports.Msg91 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class Msg91 {
    constructor() {
        this.description = {
            displayName: 'MSG91',
            name: 'msg91',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:msg91.png',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Sends transactional SMS via MSG91',
            defaults: {
                name: 'Msg91',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'msg91Api',
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
                            name: 'SMS',
                            value: 'sms',
                        },
                    ],
                    default: 'sms',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'sms',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Send',
                            value: 'send',
                            description: 'Send SMS',
                        },
                    ],
                    default: 'send',
                },
                {
                    displayName: 'Sender ID',
                    name: 'from',
                    type: 'string',
                    default: '',
                    placeholder: '4155238886',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'send',
                            ],
                            resource: [
                                'sms',
                            ],
                        },
                    },
                    description: 'The number from which to send the message',
                },
                {
                    displayName: 'To',
                    name: 'to',
                    type: 'string',
                    default: '',
                    placeholder: '+14155238886',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'send',
                            ],
                            resource: [
                                'sms',
                            ],
                        },
                    },
                    description: 'The number, with coutry code, to which to send the message',
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'send',
                            ],
                            resource: [
                                'sms',
                            ],
                        },
                    },
                    description: 'The message to send',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let operation;
            let resource;
            // For Post
            let body;
            // For Query string
            let qs;
            let requestMethod;
            let endpoint;
            for (let i = 0; i < items.length; i++) {
                endpoint = '';
                body = {};
                qs = {};
                resource = this.getNodeParameter('resource', i);
                operation = this.getNodeParameter('operation', i);
                if (resource === 'sms') {
                    if (operation === 'send') {
                        // ----------------------------------
                        //         sms:send
                        // ----------------------------------
                        requestMethod = 'GET';
                        endpoint = '/sendhttp.php';
                        qs.route = 4;
                        qs.country = 0;
                        qs.sender = this.getNodeParameter('from', i);
                        qs.mobiles = this.getNodeParameter('to', i);
                        qs.message = this.getNodeParameter('message', i);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                    }
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                }
                const responseData = yield GenericFunctions_1.msg91ApiRequest.call(this, requestMethod, endpoint, body, qs);
                returnData.push({ requestId: responseData });
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Msg91 = Msg91;

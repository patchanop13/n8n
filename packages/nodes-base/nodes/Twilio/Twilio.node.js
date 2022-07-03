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
exports.Twilio = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class Twilio {
    constructor() {
        this.description = {
            displayName: 'Twilio',
            name: 'twilio',
            icon: 'file:twilio.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Send SMS and WhatsApp messages or make phone calls',
            defaults: {
                name: 'Twilio',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'twilioApi',
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
                            name: 'Call',
                            value: 'call',
                        },
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
                            description: 'Send SMS/MMS/WhatsApp message',
                        },
                    ],
                    default: 'send',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'call',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Make',
                            value: 'make',
                        },
                    ],
                    default: 'make',
                },
                // ----------------------------------
                //         sms / call
                // ----------------------------------
                // ----------------------------------
                //         sms:send / call:make
                // ----------------------------------
                {
                    displayName: 'From',
                    name: 'from',
                    type: 'string',
                    default: '',
                    placeholder: '+14155238886',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'send',
                                'make',
                            ],
                            resource: [
                                'sms',
                                'call',
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
                                'make',
                            ],
                            resource: [
                                'sms',
                                'call',
                            ],
                        },
                    },
                    description: 'The number to which to send the message',
                },
                {
                    displayName: 'To Whatsapp',
                    name: 'toWhatsapp',
                    type: 'boolean',
                    default: false,
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
                    description: 'Whether the message should be sent to WhatsApp',
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
                {
                    displayName: 'Use TwiML',
                    name: 'twiml',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            operation: [
                                'make',
                            ],
                            resource: [
                                'call',
                            ],
                        },
                    },
                    description: 'Whether to use the <a href="https://www.twilio.com/docs/voice/twiml">Twilio Markup Language</a> in the message',
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
                                'make',
                            ],
                            resource: [
                                'call',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    options: [
                        {
                            displayName: 'Status Callback',
                            name: 'statusCallback',
                            type: 'string',
                            default: '',
                            description: 'Status Callbacks allow you to receive events related to the REST resources managed by Twilio: Rooms, Recordings and Compositions',
                        },
                    ],
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
                try {
                    requestMethod = 'GET';
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
                            requestMethod = 'POST';
                            endpoint = '/Messages.json';
                            body.From = this.getNodeParameter('from', i);
                            body.To = this.getNodeParameter('to', i);
                            body.Body = this.getNodeParameter('message', i);
                            body.StatusCallback = this.getNodeParameter('options.statusCallback', i, '');
                            const toWhatsapp = this.getNodeParameter('toWhatsapp', i);
                            if (toWhatsapp === true) {
                                body.From = `whatsapp:${body.From}`;
                                body.To = `whatsapp:${body.To}`;
                            }
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'call') {
                        if (operation === 'make') {
                            // ----------------------------------
                            //         call:make
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = '/Calls.json';
                            const message = this.getNodeParameter('message', i);
                            const useTwiml = this.getNodeParameter('twiml', i);
                            body.From = this.getNodeParameter('from', i);
                            body.To = this.getNodeParameter('to', i);
                            if (useTwiml) {
                                body.Twiml = message;
                            }
                            else {
                                body.Twiml = `<Response><Say>${(0, GenericFunctions_1.escapeXml)(message)}</Say></Response>`;
                            }
                            body.StatusCallback = this.getNodeParameter('options.statusCallback', i, '');
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                    }
                    const responseData = yield GenericFunctions_1.twilioApiRequest.call(this, requestMethod, endpoint, body, qs);
                    returnData.push(responseData);
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
exports.Twilio = Twilio;

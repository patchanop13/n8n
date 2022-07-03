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
exports.Plivo = void 0;
const SmsDescription_1 = require("./SmsDescription");
const MmsDescription_1 = require("./MmsDescription");
const CallDescription_1 = require("./CallDescription");
const GenericFunctions_1 = require("./GenericFunctions");
class Plivo {
    constructor() {
        this.description = {
            displayName: 'Plivo',
            name: 'plivo',
            icon: 'file:plivo.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Send SMS/MMS messages or make phone calls',
            defaults: {
                name: 'Plivo',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'plivoApi',
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
                            // eslint-disable-next-line n8n-nodes-base/node-param-resource-with-plural-option
                            name: 'MMS',
                            value: 'mms',
                        },
                        {
                            name: 'SMS',
                            value: 'sms',
                        },
                    ],
                    default: 'sms',
                    required: true,
                },
                ...SmsDescription_1.smsOperations,
                ...SmsDescription_1.smsFields,
                ...MmsDescription_1.mmsOperations,
                ...MmsDescription_1.mmsFields,
                ...CallDescription_1.callOperations,
                ...CallDescription_1.callFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                let responseData;
                if (resource === 'sms') {
                    // *********************************************************************
                    //                                sms
                    // *********************************************************************
                    if (operation === 'send') {
                        // ----------------------------------
                        //          sms: send
                        // ----------------------------------
                        const body = {
                            src: this.getNodeParameter('from', i),
                            dst: this.getNodeParameter('to', i),
                            text: this.getNodeParameter('message', i),
                        };
                        responseData = yield GenericFunctions_1.plivoApiRequest.call(this, 'POST', '/Message', body);
                    }
                }
                else if (resource === 'call') {
                    // *********************************************************************
                    //                                call
                    // *********************************************************************
                    if (operation === 'make') {
                        // ----------------------------------
                        //            call: make
                        // ----------------------------------
                        // https://www.plivo.com/docs/voice/api/call#make-a-call
                        const body = {
                            from: this.getNodeParameter('from', i),
                            to: this.getNodeParameter('to', i),
                            answer_url: this.getNodeParameter('answer_url', i),
                            answer_method: this.getNodeParameter('answer_method', i),
                        };
                        responseData = yield GenericFunctions_1.plivoApiRequest.call(this, 'POST', '/Call', body);
                    }
                }
                else if (resource === 'mms') {
                    // *********************************************************************
                    //                                mms
                    // *********************************************************************
                    if (operation === 'send') {
                        // ----------------------------------
                        //            mss: send
                        // ----------------------------------
                        // https://www.plivo.com/docs/sms/api/message#send-a-message
                        const body = {
                            src: this.getNodeParameter('from', i),
                            dst: this.getNodeParameter('to', i),
                            text: this.getNodeParameter('message', i),
                            type: 'mms',
                            media_urls: this.getNodeParameter('media_urls', i),
                        };
                        responseData = yield GenericFunctions_1.plivoApiRequest.call(this, 'POST', '/Message', body);
                    }
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Plivo = Plivo;

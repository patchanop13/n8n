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
exports.UProc = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const GroupDescription_1 = require("./GroupDescription");
const ToolDescription_1 = require("./ToolDescription");
class UProc {
    constructor() {
        this.description = {
            displayName: 'uProc',
            name: 'uproc',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:uproc.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["tool"]}}',
            description: 'Consume uProc API',
            defaults: {
                name: 'uProc',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'uprocApi',
                    required: true,
                },
            ],
            properties: [
                ...GroupDescription_1.groupOptions,
                ...ToolDescription_1.toolOperations,
                ...ToolDescription_1.toolParameters,
                {
                    displayName: 'Additional Options',
                    name: 'additionalOptions',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    displayOptions: {
                        show: {
                            group: [
                                'audio',
                                'communication',
                                'company',
                                'finance',
                                'geographic',
                                'image',
                                'internet',
                                'personal',
                                'product',
                                'security',
                                'text',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Data Webhook',
                            name: 'dataWebhook',
                            type: 'string',
                            description: 'URL to send tool response when tool has resolved your request',
                            default: '',
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
            const length = items.length;
            let responseData;
            const group = this.getNodeParameter('group', 0);
            const tool = this.getNodeParameter('tool', 0);
            const additionalOptions = this.getNodeParameter('additionalOptions', 0);
            const dataWebhook = additionalOptions.dataWebhook;
            const fields = ToolDescription_1.toolParameters.filter((field) => {
                return field && field.displayOptions && field.displayOptions.show && field.displayOptions.show.group && field.displayOptions.show.tool &&
                    field.displayOptions.show.group.indexOf(group) !== -1 && field.displayOptions.show.tool.indexOf(tool) !== -1;
            }).map((field) => {
                return field.name;
            });
            const requestPromises = [];
            for (let i = 0; i < length; i++) {
                try {
                    const toolKey = tool.replace(/([A-Z]+)/g, '-$1').toLowerCase();
                    const body = {
                        processor: toolKey,
                        params: {},
                    };
                    fields.forEach((field) => {
                        if (field && field.length) {
                            const data = this.getNodeParameter(field, i);
                            body.params[field] = data + '';
                        }
                    });
                    if (dataWebhook && dataWebhook.length) {
                        body.callback = {};
                    }
                    if (dataWebhook && dataWebhook.length) {
                        body.callback.data = dataWebhook;
                    }
                    //Change to multiple requests
                    responseData = yield GenericFunctions_1.uprocApiRequest.call(this, 'POST', body);
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
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
exports.UProc = UProc;

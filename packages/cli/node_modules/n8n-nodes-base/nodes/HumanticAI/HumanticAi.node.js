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
exports.HumanticAi = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const ProfileDescription_1 = require("./ProfileDescription");
class HumanticAi {
    constructor() {
        this.description = {
            displayName: 'Humantic AI',
            name: 'humanticAi',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:humanticai.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Humantic AI API',
            defaults: {
                name: 'Humantic AI',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'humanticAiApi',
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
                            name: 'Profile',
                            value: 'profile',
                        },
                    ],
                    default: 'profile',
                },
                // PROFILE
                ...ProfileDescription_1.profileOperations,
                ...ProfileDescription_1.profileFields,
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
                if (resource === 'profile') {
                    if (operation === 'create') {
                        const userId = this.getNodeParameter('userId', i);
                        const sendResume = this.getNodeParameter('sendResume', i);
                        qs.userid = userId;
                        if (sendResume) {
                            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                            if (items[i].binary === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                            }
                            const item = items[i].binary;
                            const binaryData = item[binaryPropertyName];
                            const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                            if (binaryData === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                            }
                            responseData = yield GenericFunctions_1.humanticAiApiRequest.call(this, 'POST', `/user-profile/create`, {}, qs, {
                                formData: {
                                    resume: {
                                        value: binaryDataBuffer,
                                        options: {
                                            filename: binaryData.fileName,
                                        },
                                    },
                                },
                            });
                        }
                        else {
                            responseData = yield GenericFunctions_1.humanticAiApiRequest.call(this, 'GET', `/user-profile/create`, {}, qs);
                        }
                        if (responseData.data !== undefined) {
                            responseData = responseData.data;
                        }
                        else {
                            delete responseData.usage_stats;
                        }
                    }
                    if (operation === 'get') {
                        const userId = this.getNodeParameter('userId', i);
                        const options = this.getNodeParameter('options', i);
                        qs.userid = userId;
                        if (options.persona) {
                            qs.persona = options.persona.join(',');
                        }
                        responseData = yield GenericFunctions_1.humanticAiApiRequest.call(this, 'GET', `/user-profile`, {}, qs);
                        responseData = responseData.results;
                    }
                    if (operation === 'update') {
                        const userId = this.getNodeParameter('userId', i);
                        const sendResume = this.getNodeParameter('sendResume', i);
                        qs.userid = userId;
                        if (sendResume) {
                            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                            if (items[i].binary === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                            }
                            const item = items[i].binary;
                            const binaryData = item[binaryPropertyName];
                            const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                            if (binaryData === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                            }
                            responseData = yield GenericFunctions_1.humanticAiApiRequest.call(this, 'POST', `/user-profile/create`, {}, qs, {
                                formData: {
                                    resume: {
                                        value: binaryDataBuffer,
                                        options: {
                                            filename: binaryData.fileName,
                                        },
                                    },
                                },
                            });
                            responseData = responseData.data;
                        }
                        else {
                            const text = this.getNodeParameter('text', i);
                            const body = {
                                text,
                            };
                            qs.userid = userId;
                            responseData = yield GenericFunctions_1.humanticAiApiRequest.call(this, 'POST', `/user-profile/create`, body, qs);
                            responseData = responseData.data;
                        }
                    }
                }
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else {
                    returnData.push(responseData);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.HumanticAi = HumanticAi;

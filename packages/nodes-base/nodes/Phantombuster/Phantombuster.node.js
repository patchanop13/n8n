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
exports.Phantombuster = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const AgentDescription_1 = require("./AgentDescription");
// import {
// 	sentenceCase,
// } from 'change-case';
class Phantombuster {
    constructor() {
        this.description = {
            displayName: 'Phantombuster',
            name: 'phantombuster',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:phantombuster.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Phantombuster API',
            defaults: {
                name: 'Phantombuster',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'phantombusterApi',
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
                            name: 'Agent',
                            value: 'agent',
                        },
                    ],
                    default: 'agent',
                },
                ...AgentDescription_1.agentOperations,
                ...AgentDescription_1.agentFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getAgents() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const responseData = yield GenericFunctions_1.phantombusterApiRequest.call(this, 'GET', '/agents/fetch-all');
                        for (const item of responseData) {
                            returnData.push({
                                name: item.name,
                                value: item.id,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the arguments to display them to user so that he can
                // select them easily
                // async getArguments(
                // 	this: ILoadOptionsFunctions,
                // ): Promise<INodePropertyOptions[]> {
                // 	const returnData: INodePropertyOptions[] = [];
                // 	const agentId = this.getCurrentNodeParameter('agentId') as string;
                // 	const { argument } = await phantombusterApiRequest.call(
                // 		this,
                // 		'GET',
                // 		'/agents/fetch',
                // 		{},
                // 		{ id: agentId },
                // 	);
                // 	for (const key of Object.keys(JSON.parse(argument))) {
                // 		returnData.push({
                // 			name: sentenceCase(key),
                // 			value: key,
                // 		});
                // 	}
                // 	return returnData;
                // },
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
                    if (resource === 'agent') {
                        //https://hub.phantombuster.com/reference#post_agents-delete-1
                        if (operation === 'delete') {
                            const agentId = this.getNodeParameter('agentId', i);
                            responseData = yield GenericFunctions_1.phantombusterApiRequest.call(this, 'POST', '/agents/delete', { id: agentId });
                            responseData = { success: true };
                        }
                        //https://hub.phantombuster.com/reference#get_agents-fetch-1
                        if (operation === 'get') {
                            const agentId = this.getNodeParameter('agentId', i);
                            responseData = yield GenericFunctions_1.phantombusterApiRequest.call(this, 'GET', '/agents/fetch', {}, { id: agentId });
                        }
                        //https://hub.phantombuster.com/reference#get_agents-fetch-output-1
                        if (operation === 'getOutput') {
                            const agentId = this.getNodeParameter('agentId', i);
                            const resolveData = this.getNodeParameter('resolveData', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                            qs.id = agentId;
                            responseData = yield GenericFunctions_1.phantombusterApiRequest.call(this, 'GET', '/agents/fetch-output', {}, qs);
                            if (resolveData === true) {
                                const { resultObject } = yield GenericFunctions_1.phantombusterApiRequest.call(this, 'GET', '/containers/fetch-result-object', {}, { id: responseData.containerId });
                                if (resultObject === null) {
                                    responseData = {};
                                }
                                else {
                                    responseData = JSON.parse(resultObject);
                                }
                            }
                        }
                        //https://api.phantombuster.com/api/v2/agents/fetch-all
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = yield GenericFunctions_1.phantombusterApiRequest.call(this, 'GET', '/agents/fetch-all');
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', 0);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        //https://hub.phantombuster.com/reference#post_agents-launch-1
                        if (operation === 'launch') {
                            const agentId = this.getNodeParameter('agentId', i);
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            const resolveData = this.getNodeParameter('resolveData', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                id: agentId,
                            };
                            if (jsonParameters) {
                                if (additionalFields.argumentsJson) {
                                    body.arguments = (0, GenericFunctions_1.validateJSON)(this, additionalFields.argumentsJson, 'Arguments');
                                    delete additionalFields.argumentsJson;
                                }
                                if (additionalFields.bonusArgumentJson) {
                                    body.bonusArgument = (0, GenericFunctions_1.validateJSON)(this, additionalFields.bonusArgumentJson, 'Bonus Argument');
                                    delete additionalFields.bonusArgumentJson;
                                }
                            }
                            else {
                                const argumentParameters = (additionalFields.argumentsUi || {}).argumentValues || [];
                                body.arguments = argumentParameters.reduce((object, currentValue) => {
                                    object[currentValue.key] = currentValue.value;
                                    return object;
                                }, {});
                                delete additionalFields.argumentsUi;
                                const bonusParameters = (additionalFields.bonusArgumentUi || {}).bonusArgumentValue || [];
                                body.bonusArgument = bonusParameters.reduce((object, currentValue) => {
                                    object[currentValue.key] = currentValue.value;
                                    return object;
                                }, {});
                                delete additionalFields.bonusArgumentUi;
                            }
                            Object.assign(body, additionalFields);
                            responseData = yield GenericFunctions_1.phantombusterApiRequest.call(this, 'POST', '/agents/launch', body);
                            if (resolveData === true) {
                                responseData = yield GenericFunctions_1.phantombusterApiRequest.call(this, 'GET', '/containers/fetch', {}, { id: responseData.containerId });
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
exports.Phantombuster = Phantombuster;

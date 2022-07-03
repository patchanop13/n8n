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
exports.CircleCi = void 0;
const PipelineDescription_1 = require("./PipelineDescription");
const GenericFunctions_1 = require("./GenericFunctions");
class CircleCi {
    constructor() {
        this.description = {
            displayName: 'CircleCI',
            name: 'circleCi',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:circleCi.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume CircleCI API',
            defaults: {
                name: 'CircleCI',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'circleCiApi',
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
                            name: 'Pipeline',
                            value: 'pipeline',
                        },
                    ],
                    default: 'pipeline',
                },
                ...PipelineDescription_1.pipelineOperations,
                ...PipelineDescription_1.pipelineFields,
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
                    if (resource === 'pipeline') {
                        if (operation === 'get') {
                            const vcs = this.getNodeParameter('vcs', i);
                            let slug = this.getNodeParameter('projectSlug', i);
                            const pipelineNumber = this.getNodeParameter('pipelineNumber', i);
                            slug = slug.replace(new RegExp(/\//g), '%2F');
                            const endpoint = `/project/${vcs}/${slug}/pipeline/${pipelineNumber}`;
                            responseData = yield GenericFunctions_1.circleciApiRequest.call(this, 'GET', endpoint, {}, qs);
                        }
                        if (operation === 'getAll') {
                            const vcs = this.getNodeParameter('vcs', i);
                            const filters = this.getNodeParameter('filters', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            let slug = this.getNodeParameter('projectSlug', i);
                            slug = slug.replace(new RegExp(/\//g), '%2F');
                            if (filters.branch) {
                                qs.branch = filters.branch;
                            }
                            const endpoint = `/project/${vcs}/${slug}/pipeline`;
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.circleciApiRequestAllItems.call(this, 'items', 'GET', endpoint, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.circleciApiRequest.call(this, 'GET', endpoint, {}, qs);
                                responseData = responseData.items;
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                        if (operation === 'trigger') {
                            const vcs = this.getNodeParameter('vcs', i);
                            let slug = this.getNodeParameter('projectSlug', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            slug = slug.replace(new RegExp(/\//g), '%2F');
                            const endpoint = `/project/${vcs}/${slug}/pipeline`;
                            const body = {};
                            if (additionalFields.branch) {
                                body.branch = additionalFields.branch;
                            }
                            if (additionalFields.tag) {
                                body.tag = additionalFields.tag;
                            }
                            responseData = yield GenericFunctions_1.circleciApiRequest.call(this, 'POST', endpoint, body, qs);
                        }
                    }
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
exports.CircleCi = CircleCi;

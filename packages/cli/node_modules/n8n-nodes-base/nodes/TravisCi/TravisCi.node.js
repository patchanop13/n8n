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
exports.TravisCi = void 0;
const BuildDescription_1 = require("./BuildDescription");
const GenericFunctions_1 = require("./GenericFunctions");
class TravisCi {
    constructor() {
        this.description = {
            displayName: 'TravisCI',
            name: 'travisCi',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:travisci.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume TravisCI API',
            defaults: {
                name: 'TravisCI',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'travisCiApi',
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
                            name: 'Build',
                            value: 'build',
                        },
                    ],
                    default: 'build',
                },
                ...BuildDescription_1.buildOperations,
                ...BuildDescription_1.buildFields,
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
                    if (resource === 'build') {
                        //https://developer.travis-ci.com/resource/build#find
                        if (operation === 'get') {
                            const buildId = this.getNodeParameter('buildId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.include) {
                                qs.include = additionalFields.include;
                            }
                            responseData = yield GenericFunctions_1.travisciApiRequest.call(this, 'GET', `/build/${buildId}`, {}, qs);
                        }
                        //https://developer.travis-ci.com/resource/builds#for_current_user
                        if (operation === 'getAll') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (additionalFields.sortBy) {
                                qs.sort_by = additionalFields.sortBy;
                            }
                            if (additionalFields.sortBy && additionalFields.order) {
                                qs.sort_by = `${additionalFields.sortBy}:${additionalFields.order}`;
                            }
                            if (additionalFields.include) {
                                qs.include = additionalFields.include;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.travisciApiRequestAllItems.call(this, 'builds', 'GET', '/builds', {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.travisciApiRequest.call(this, 'GET', '/builds', {}, qs);
                                responseData = responseData.builds;
                            }
                        }
                        //https://developer.travis-ci.com/resource/build#cancel
                        if (operation === 'cancel') {
                            const buildId = this.getNodeParameter('buildId', i);
                            responseData = yield GenericFunctions_1.travisciApiRequest.call(this, 'POST', `/build/${buildId}/cancel`, {}, qs);
                        }
                        //https://developer.travis-ci.com/resource/build#restart
                        if (operation === 'restart') {
                            const buildId = this.getNodeParameter('buildId', i);
                            responseData = yield GenericFunctions_1.travisciApiRequest.call(this, 'POST', `/build/${buildId}/restart`, {}, qs);
                        }
                        //https://developer.travis-ci.com/resource/requests#create
                        if (operation === 'trigger') {
                            let slug = this.getNodeParameter('slug', i);
                            const branch = this.getNodeParameter('branch', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            slug = slug.replace(new RegExp(/\//g), '%2F');
                            const request = {
                                branch,
                            };
                            if (additionalFields.message) {
                                request.message = additionalFields.message;
                            }
                            if (additionalFields.mergeMode) {
                                request.merge_mode = additionalFields.mergeMode;
                            }
                            responseData = yield GenericFunctions_1.travisciApiRequest.call(this, 'POST', `/repo/${slug}/requests`, JSON.stringify({ request }));
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
exports.TravisCi = TravisCi;

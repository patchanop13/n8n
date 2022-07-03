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
exports.Netlify = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const DeployDescription_1 = require("./DeployDescription");
const SiteDescription_1 = require("./SiteDescription");
class Netlify {
    constructor() {
        this.description = {
            displayName: 'Netlify',
            name: 'netlify',
            icon: 'file:netlify.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Netlify API',
            defaults: {
                name: 'Netlify',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'netlifyApi',
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
                            name: 'Deploy',
                            value: 'deploy',
                        },
                        {
                            name: 'Site',
                            value: 'site',
                        },
                    ],
                    default: 'deploy',
                    required: true,
                },
                ...DeployDescription_1.deployOperations,
                ...DeployDescription_1.deployFields,
                ...SiteDescription_1.siteOperations,
                ...SiteDescription_1.siteFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getSites() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const sites = yield GenericFunctions_1.netlifyApiRequest.call(this, 'GET', '/sites');
                        for (const site of sites) {
                            returnData.push({
                                name: site.name,
                                value: site.site_id,
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
            const length = items.length;
            let responseData;
            const returnData = [];
            const qs = {};
            const body = {};
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'deploy') {
                        if (operation === 'cancel') {
                            const deployId = this.getNodeParameter('deployId', i);
                            responseData = yield GenericFunctions_1.netlifyApiRequest.call(this, 'POST', `/deploys/${deployId}/cancel`, body, qs);
                        }
                        if (operation === 'create') {
                            const siteId = this.getNodeParameter('siteId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            if (body.title) {
                                qs.title = body.title;
                                delete body.title;
                            }
                            responseData = yield GenericFunctions_1.netlifyApiRequest.call(this, 'POST', `/sites/${siteId}/deploys`, body, qs);
                        }
                        if (operation === 'get') {
                            const siteId = this.getNodeParameter('siteId', i);
                            const deployId = this.getNodeParameter('deployId', i);
                            responseData = yield GenericFunctions_1.netlifyApiRequest.call(this, 'GET', `/sites/${siteId}/deploys/${deployId}`, body, qs);
                        }
                        if (operation === 'getAll') {
                            const siteId = this.getNodeParameter('siteId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.netlifyRequestAllItems.call(this, 'GET', `/sites/${siteId}/deploys`);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.netlifyApiRequest.call(this, 'GET', `/sites/${siteId}/deploys`, {}, { per_page: limit });
                            }
                        }
                    }
                    if (resource === 'site') {
                        if (operation === 'delete') {
                            const siteId = this.getNodeParameter('siteId', i);
                            responseData = yield GenericFunctions_1.netlifyApiRequest.call(this, 'DELETE', `/sites/${siteId}`);
                        }
                        if (operation === 'get') {
                            const siteId = this.getNodeParameter('siteId', i);
                            responseData = yield GenericFunctions_1.netlifyApiRequest.call(this, 'GET', `/sites/${siteId}`);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.netlifyRequestAllItems.call(this, 'GET', `/sites`, {}, { filter: 'all' });
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.netlifyApiRequest.call(this, 'GET', `/sites`, {}, { filter: 'all', per_page: limit });
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
exports.Netlify = Netlify;

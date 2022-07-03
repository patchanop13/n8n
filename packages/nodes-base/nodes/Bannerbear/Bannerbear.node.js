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
exports.Bannerbear = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const ImageDescription_1 = require("./ImageDescription");
const TemplateDescription_1 = require("./TemplateDescription");
class Bannerbear {
    constructor() {
        this.description = {
            displayName: 'Bannerbear',
            name: 'bannerbear',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:bannerbear.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Bannerbear API',
            defaults: {
                name: 'Bannerbear',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'bannerbearApi',
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
                            name: 'Image',
                            value: 'image',
                        },
                        {
                            name: 'Template',
                            value: 'template',
                        },
                    ],
                    default: 'image',
                },
                // IMAGE
                ...ImageDescription_1.imageOperations,
                ...ImageDescription_1.imageFields,
                // TEMPLATE
                ...TemplateDescription_1.templateOperations,
                ...TemplateDescription_1.templateFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available templates to display them to user so that he can
                // select them easily
                getTemplates() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const templates = yield GenericFunctions_1.bannerbearApiRequest.call(this, 'GET', '/templates');
                        for (const template of templates) {
                            const templateName = template.name;
                            const templateId = template.uid;
                            returnData.push({
                                name: templateName,
                                value: templateId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available modifications to display them to user so that he can
                // select them easily
                getModificationNames() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const templateId = this.getCurrentNodeParameter('templateId');
                        const returnData = [];
                        const { available_modifications } = yield GenericFunctions_1.bannerbearApiRequest.call(this, 'GET', `/templates/${templateId}`);
                        for (const modification of available_modifications) {
                            const modificationName = modification.name;
                            const modificationId = modification.name;
                            returnData.push({
                                name: modificationName,
                                value: modificationId,
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
            let responseData;
            const qs = {};
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                if (resource === 'image') {
                    //https://developers.bannerbear.com/#create-an-image
                    if (operation === 'create') {
                        const templateId = this.getNodeParameter('templateId', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const modifications = this.getNodeParameter('modificationsUi', i).modificationsValues;
                        const body = {
                            template: templateId,
                        };
                        if (additionalFields.webhookUrl) {
                            body.webhook_url = additionalFields.webhookUrl;
                        }
                        if (additionalFields.metadata) {
                            body.metadata = additionalFields.metadata;
                        }
                        if (modifications) {
                            body.modifications = (0, GenericFunctions_1.keysToSnakeCase)(modifications);
                            // delete all fields set to empty
                            for (const modification of body.modifications) {
                                for (const key of Object.keys(modification)) {
                                    if (modification[key] === '') {
                                        delete modification[key];
                                    }
                                }
                            }
                        }
                        responseData = yield GenericFunctions_1.bannerbearApiRequest.call(this, 'POST', '/images', body);
                        if (additionalFields.waitForImage && responseData.status !== 'completed') {
                            let maxTries = additionalFields.waitForImageMaxTries || 3;
                            const promise = (uid) => {
                                let data = {};
                                return new Promise((resolve, reject) => {
                                    const timeout = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                                        data = yield GenericFunctions_1.bannerbearApiRequest.call(this, 'GET', `/images/${uid}`);
                                        if (data.status === 'completed') {
                                            clearInterval(timeout);
                                            resolve(data);
                                        }
                                        if (--maxTries === 0) {
                                            clearInterval(timeout);
                                            reject(new Error('Image did not finish processing after multiple tries.'));
                                        }
                                    }), 2000);
                                });
                            };
                            responseData = yield promise(responseData.uid);
                        }
                    }
                    //https://developers.bannerbear.com/#get-a-specific-image
                    if (operation === 'get') {
                        const imageId = this.getNodeParameter('imageId', i);
                        responseData = yield GenericFunctions_1.bannerbearApiRequest.call(this, 'GET', `/images/${imageId}`);
                    }
                }
                if (resource === 'template') {
                    //https://developers.bannerbear.com/#get-a-specific-template
                    if (operation === 'get') {
                        const templateId = this.getNodeParameter('templateId', i);
                        responseData = yield GenericFunctions_1.bannerbearApiRequest.call(this, 'GET', `/templates/${templateId}`);
                    }
                    //https://developers.bannerbear.com/#list-templates
                    if (operation === 'getAll') {
                        responseData = yield GenericFunctions_1.bannerbearApiRequest.call(this, 'GET', '/templates');
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
exports.Bannerbear = Bannerbear;

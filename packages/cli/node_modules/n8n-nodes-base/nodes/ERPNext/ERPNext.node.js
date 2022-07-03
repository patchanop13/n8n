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
exports.ERPNext = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const DocumentDescription_1 = require("./DocumentDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const utils_1 = require("./utils");
class ERPNext {
    constructor() {
        this.description = {
            displayName: 'ERPNext',
            name: 'erpNext',
            icon: 'file:erpnext.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Consume ERPNext API',
            defaults: {
                name: 'ERPNext',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'erpNextApi',
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
                            name: 'Document',
                            value: 'document',
                        },
                    ],
                    default: 'document',
                },
                ...DocumentDescription_1.documentOperations,
                ...DocumentDescription_1.documentFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getDocTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const data = yield GenericFunctions_1.erpNextApiRequestAllItems.call(this, 'data', 'GET', '/api/resource/DocType', {});
                        const docTypes = data.map(({ name }) => {
                            return { name, value: encodeURI(name) };
                        });
                        return (0, utils_1.processNames)(docTypes);
                    });
                },
                getDocFilters() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const docType = this.getCurrentNodeParameter('docType');
                        const { data } = yield GenericFunctions_1.erpNextApiRequest.call(this, 'GET', `/api/resource/DocType/${docType}`, {});
                        const docFields = data.fields.map(({ label, fieldname }) => {
                            return ({ name: label, value: fieldname });
                        });
                        docFields.unshift({ name: '*', value: '*' });
                        return (0, utils_1.processNames)(docFields);
                    });
                },
                getDocFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const docType = this.getCurrentNodeParameter('docType');
                        const { data } = yield GenericFunctions_1.erpNextApiRequest.call(this, 'GET', `/api/resource/DocType/${docType}`, {});
                        const docFields = data.fields.map(({ label, fieldname }) => {
                            return ({ name: label, value: fieldname });
                        });
                        return (0, utils_1.processNames)(docFields);
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let responseData;
            const body = {};
            const qs = {};
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                // https://app.swaggerhub.com/apis-docs/alyf.de/ERPNext/11#/Resources/post_api_resource_Webhook
                // https://frappeframework.com/docs/user/en/guides/integration/rest_api/manipulating_documents
                if (resource === 'document') {
                    // *********************************************************************
                    //                             document
                    // *********************************************************************
                    if (operation === 'get') {
                        // ----------------------------------
                        //          document: get
                        // ----------------------------------
                        // https://app.swaggerhub.com/apis-docs/alyf.de/ERPNext/11#/General/get_api_resource__DocType___DocumentName_
                        const docType = this.getNodeParameter('docType', i);
                        const documentName = this.getNodeParameter('documentName', i);
                        responseData = yield GenericFunctions_1.erpNextApiRequest.call(this, 'GET', `/api/resource/${docType}/${documentName}`);
                        responseData = responseData.data;
                    }
                    if (operation === 'getAll') {
                        // ----------------------------------
                        //         document: getAll
                        // ----------------------------------
                        // https://app.swaggerhub.com/apis-docs/alyf.de/ERPNext/11#/General/get_api_resource__DocType_
                        const docType = this.getNodeParameter('docType', i);
                        const endpoint = `/api/resource/${docType}`;
                        const { fields, filters, } = this.getNodeParameter('options', i);
                        // fields=["test", "example", "hi"]
                        if (fields) {
                            if (fields.includes('*')) {
                                qs.fields = JSON.stringify(['*']);
                            }
                            else {
                                qs.fields = JSON.stringify(fields);
                            }
                        }
                        // filters=[["Person","first_name","=","Jane"]]
                        // TODO: filters not working
                        if (filters) {
                            qs.filters = JSON.stringify(filters.customProperty.map((filter) => {
                                return [
                                    docType,
                                    filter.field,
                                    (0, utils_1.toSQL)(filter.operator),
                                    filter.value,
                                ];
                            }));
                        }
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i);
                            qs.limit_page_length = limit;
                            qs.limit_start = 0;
                            responseData = yield GenericFunctions_1.erpNextApiRequest.call(this, 'GET', endpoint, {}, qs);
                            responseData = responseData.data;
                        }
                        else {
                            responseData = yield GenericFunctions_1.erpNextApiRequestAllItems.call(this, 'data', 'GET', endpoint, {}, qs);
                        }
                    }
                    else if (operation === 'create') {
                        // ----------------------------------
                        //         document: create
                        // ----------------------------------
                        // https://app.swaggerhub.com/apis-docs/alyf.de/ERPNext/11#/General/post_api_resource__DocType_
                        const properties = this.getNodeParameter('properties', i);
                        if (!properties.customProperty.length) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter at least one property for the document to create.');
                        }
                        properties.customProperty.forEach(property => {
                            body[property.field] = property.value;
                        });
                        const docType = this.getNodeParameter('docType', i);
                        responseData = yield GenericFunctions_1.erpNextApiRequest.call(this, 'POST', `/api/resource/${docType}`, body);
                        responseData = responseData.data;
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------
                        //         document: delete
                        // ----------------------------------
                        // https://app.swaggerhub.com/apis-docs/alyf.de/ERPNext/11#/General/delete_api_resource__DocType___DocumentName_
                        const docType = this.getNodeParameter('docType', i);
                        const documentName = this.getNodeParameter('documentName', i);
                        responseData = yield GenericFunctions_1.erpNextApiRequest.call(this, 'DELETE', `/api/resource/${docType}/${documentName}`);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------
                        //         document: update
                        // ----------------------------------
                        // https://app.swaggerhub.com/apis-docs/alyf.de/ERPNext/11#/General/put_api_resource__DocType___DocumentName_
                        const properties = this.getNodeParameter('properties', i);
                        if (!properties.customProperty.length) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter at least one property for the document to update.');
                        }
                        properties.customProperty.forEach(property => {
                            body[property.field] = property.value;
                        });
                        const docType = this.getNodeParameter('docType', i);
                        const documentName = this.getNodeParameter('documentName', i);
                        responseData = yield GenericFunctions_1.erpNextApiRequest.call(this, 'PUT', `/api/resource/${docType}/${documentName}`, body);
                        responseData = responseData.data;
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
exports.ERPNext = ERPNext;

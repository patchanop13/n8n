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
exports.Bubble = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const ObjectDescription_1 = require("./ObjectDescription");
class Bubble {
    constructor() {
        this.description = {
            displayName: 'Bubble',
            name: 'bubble',
            icon: 'file:bubble.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Bubble Data API',
            defaults: {
                name: 'Bubble',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'bubbleApi',
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
                            name: 'Object',
                            value: 'object',
                        },
                    ],
                    default: 'object',
                },
                ...ObjectDescription_1.objectOperations,
                ...ObjectDescription_1.objectFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            const qs = {};
            const returnData = [];
            for (let i = 0; i < items.length; i++) {
                if (resource === 'object') {
                    // *********************************************************************
                    //                             object
                    // *********************************************************************
                    // https://bubble.io/reference#API
                    if (operation === 'create') {
                        // ----------------------------------
                        //         object: create
                        // ----------------------------------
                        const typeNameInput = this.getNodeParameter('typeName', i);
                        const typeName = typeNameInput.replace(/\s/g, '').toLowerCase();
                        const { property } = this.getNodeParameter('properties', i);
                        const body = {};
                        property.forEach(data => body[data.key] = data.value);
                        responseData = yield GenericFunctions_1.bubbleApiRequest.call(this, 'POST', `/obj/${typeName}`, body, {});
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------
                        //         object: delete
                        // ----------------------------------
                        const typeNameInput = this.getNodeParameter('typeName', i);
                        const typeName = typeNameInput.replace(/\s/g, '').toLowerCase();
                        const objectId = this.getNodeParameter('objectId', i);
                        const endpoint = `/obj/${typeName}/${objectId}`;
                        responseData = yield GenericFunctions_1.bubbleApiRequest.call(this, 'DELETE', endpoint, {}, {});
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------
                        //         object: get
                        // ----------------------------------
                        const typeNameInput = this.getNodeParameter('typeName', i);
                        const typeName = typeNameInput.replace(/\s/g, '').toLowerCase();
                        const objectId = this.getNodeParameter('objectId', i);
                        const endpoint = `/obj/${typeName}/${objectId}`;
                        responseData = yield GenericFunctions_1.bubbleApiRequest.call(this, 'GET', endpoint, {}, {});
                        responseData = responseData.response;
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------
                        //         object: getAll
                        // ----------------------------------
                        const returnAll = this.getNodeParameter('returnAll', 0);
                        const typeNameInput = this.getNodeParameter('typeName', i);
                        const typeName = typeNameInput.replace(/\s/g, '').toLowerCase();
                        const endpoint = `/obj/${typeName}`;
                        const jsonParameters = this.getNodeParameter('jsonParameters', 0);
                        const options = this.getNodeParameter('options', i);
                        if (jsonParameters === false) {
                            if (options.filters) {
                                const { filter } = options.filters;
                                qs.constraints = JSON.stringify(filter);
                            }
                        }
                        else {
                            const filter = options.filtersJson;
                            const data = (0, GenericFunctions_1.validateJSON)(filter);
                            if (data === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Filters must be a valid JSON');
                            }
                            qs.constraints = JSON.stringify(data);
                        }
                        if (options.sort) {
                            const { sortValue } = options.sort;
                            Object.assign(qs, sortValue);
                        }
                        if (returnAll === true) {
                            responseData = yield GenericFunctions_1.bubbleApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', 0);
                            responseData = yield GenericFunctions_1.bubbleApiRequest.call(this, 'GET', endpoint, {}, qs);
                            responseData = responseData.response.results;
                        }
                    }
                    else if (operation === 'update') {
                        // ----------------------------------
                        //         object: update
                        // ----------------------------------
                        const typeNameInput = this.getNodeParameter('typeName', i);
                        const typeName = typeNameInput.replace(/\s/g, '').toLowerCase();
                        const objectId = this.getNodeParameter('objectId', i);
                        const endpoint = `/obj/${typeName}/${objectId}`;
                        const { property } = this.getNodeParameter('properties', i);
                        const body = {};
                        property.forEach(data => body[data.key] = data.value);
                        responseData = yield GenericFunctions_1.bubbleApiRequest.call(this, 'PATCH', endpoint, body, {});
                        responseData = { sucess: true };
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
exports.Bubble = Bubble;

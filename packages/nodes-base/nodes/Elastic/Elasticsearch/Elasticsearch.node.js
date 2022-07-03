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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elasticsearch = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
const lodash_1 = require("lodash");
class Elasticsearch {
    constructor() {
        this.description = {
            displayName: 'Elasticsearch',
            name: 'elasticsearch',
            icon: 'file:elasticsearch.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Elasticsearch API',
            defaults: {
                name: 'Elasticsearch',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'elasticsearchApi',
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
                        {
                            name: 'Index',
                            value: 'index',
                        },
                    ],
                    default: 'document',
                },
                ...descriptions_1.documentOperations,
                ...descriptions_1.documentFields,
                ...descriptions_1.indexOperations,
                ...descriptions_1.indexFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            for (let i = 0; i < items.length; i++) {
                if (resource === 'document') {
                    // **********************************************************************
                    //                                document
                    // **********************************************************************
                    // https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html
                    if (operation === 'delete') {
                        // ----------------------------------------
                        //             document: delete
                        // ----------------------------------------
                        // https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-delete.html
                        const indexId = this.getNodeParameter('indexId', i);
                        const documentId = this.getNodeParameter('documentId', i);
                        const endpoint = `/${indexId}/_doc/${documentId}`;
                        responseData = yield GenericFunctions_1.elasticsearchApiRequest.call(this, 'DELETE', endpoint);
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //              document: get
                        // ----------------------------------------
                        // https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-get.html
                        const indexId = this.getNodeParameter('indexId', i);
                        const documentId = this.getNodeParameter('documentId', i);
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        if (Object.keys(options).length) {
                            Object.assign(qs, options);
                            qs._source = true;
                        }
                        const endpoint = `/${indexId}/_doc/${documentId}`;
                        responseData = yield GenericFunctions_1.elasticsearchApiRequest.call(this, 'GET', endpoint, {}, qs);
                        const simple = this.getNodeParameter('simple', i);
                        if (simple) {
                            responseData = Object.assign({ _id: responseData._id }, responseData._source);
                        }
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //            document: getAll
                        // ----------------------------------------
                        // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html
                        const indexId = this.getNodeParameter('indexId', i);
                        const body = {};
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        if (Object.keys(options).length) {
                            const { query } = options, rest = __rest(options, ["query"]);
                            if (query)
                                Object.assign(body, JSON.parse(query));
                            Object.assign(qs, rest);
                            qs._source = true;
                        }
                        const returnAll = this.getNodeParameter('returnAll', 0);
                        if (!returnAll) {
                            qs.size = this.getNodeParameter('limit', 0);
                        }
                        responseData = yield GenericFunctions_1.elasticsearchApiRequest.call(this, 'GET', `/${indexId}/_search`, body, qs);
                        responseData = responseData.hits.hits;
                        const simple = this.getNodeParameter('simple', 0);
                        if (simple) {
                            responseData = responseData.map((item) => {
                                return Object.assign({ _id: item._id }, item._source);
                            });
                        }
                    }
                    else if (operation === 'create') {
                        // ----------------------------------------
                        //             document: create
                        // ----------------------------------------
                        // https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-index_.html
                        const body = {};
                        const dataToSend = this.getNodeParameter('dataToSend', 0);
                        if (dataToSend === 'defineBelow') {
                            const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                            fields.forEach(({ fieldId, fieldValue }) => body[fieldId] = fieldValue);
                        }
                        else {
                            const inputData = items[i].json;
                            const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                            const inputsToIgnore = rawInputsToIgnore.split(',').map(c => c.trim());
                            for (const key of Object.keys(inputData)) {
                                if (inputsToIgnore.includes(key))
                                    continue;
                                body[key] = inputData[key];
                            }
                        }
                        const qs = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(qs, (0, lodash_1.omit)(additionalFields, ['documentId']));
                        }
                        const indexId = this.getNodeParameter('indexId', i);
                        const { documentId } = additionalFields;
                        if (documentId) {
                            const endpoint = `/${indexId}/_doc/${documentId}`;
                            responseData = yield GenericFunctions_1.elasticsearchApiRequest.call(this, 'PUT', endpoint, body);
                        }
                        else {
                            const endpoint = `/${indexId}/_doc`;
                            responseData = yield GenericFunctions_1.elasticsearchApiRequest.call(this, 'POST', endpoint, body);
                        }
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //             document: update
                        // ----------------------------------------
                        // https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update.html
                        const body = { doc: {} };
                        const dataToSend = this.getNodeParameter('dataToSend', 0);
                        if (dataToSend === 'defineBelow') {
                            const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                            fields.forEach(({ fieldId, fieldValue }) => body.doc[fieldId] = fieldValue);
                        }
                        else {
                            const inputData = items[i].json;
                            const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                            const inputsToIgnore = rawInputsToIgnore.split(',').map(c => c.trim());
                            for (const key of Object.keys(inputData)) {
                                if (inputsToIgnore.includes(key))
                                    continue;
                                body.doc[key] = inputData[key];
                            }
                        }
                        const indexId = this.getNodeParameter('indexId', i);
                        const documentId = this.getNodeParameter('documentId', i);
                        const endpoint = `/${indexId}/_update/${documentId}`;
                        responseData = yield GenericFunctions_1.elasticsearchApiRequest.call(this, 'POST', endpoint, body);
                    }
                }
                else if (resource === 'index') {
                    // **********************************************************************
                    //                                 index
                    // **********************************************************************
                    // https://www.elastic.co/guide/en/elasticsearch/reference/current/indices.html
                    if (operation === 'create') {
                        // ----------------------------------------
                        //              index: create
                        // ----------------------------------------
                        // https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-create-index.html
                        const indexId = this.getNodeParameter('indexId', i);
                        const body = {};
                        const qs = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            const { aliases, mappings, settings } = additionalFields, rest = __rest(additionalFields, ["aliases", "mappings", "settings"]);
                            Object.assign(body, aliases, mappings, settings);
                            Object.assign(qs, rest);
                        }
                        responseData = yield GenericFunctions_1.elasticsearchApiRequest.call(this, 'PUT', `/${indexId}`);
                        responseData = Object.assign({ id: indexId }, responseData);
                        delete responseData.index;
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //              index: delete
                        // ----------------------------------------
                        // https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-delete-index.html
                        const indexId = this.getNodeParameter('indexId', i);
                        responseData = yield GenericFunctions_1.elasticsearchApiRequest.call(this, 'DELETE', `/${indexId}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //              index: get
                        // ----------------------------------------
                        // https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-get-index.html
                        const indexId = this.getNodeParameter('indexId', i);
                        const qs = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(qs, additionalFields);
                        }
                        responseData = yield GenericFunctions_1.elasticsearchApiRequest.call(this, 'GET', `/${indexId}`, {}, qs);
                        responseData = Object.assign({ id: indexId }, responseData[indexId]);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //              index: getAll
                        // ----------------------------------------
                        // https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-aliases.html
                        responseData = yield GenericFunctions_1.elasticsearchApiRequest.call(this, 'GET', '/_aliases');
                        responseData = Object.keys(responseData).map(i => ({ indexId: i }));
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i);
                            responseData = responseData.slice(0, limit);
                        }
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
exports.Elasticsearch = Elasticsearch;

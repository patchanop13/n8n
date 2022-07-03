"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Cortex = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const AnalyzerDescriptions_1 = require("./AnalyzerDescriptions");
const n8n_workflow_1 = require("n8n-workflow");
const ResponderDescription_1 = require("./ResponderDescription");
const JobDescription_1 = require("./JobDescription");
const lodash_1 = require("lodash");
const crypto_1 = require("crypto");
const changeCase = __importStar(require("change-case"));
class Cortex {
    constructor() {
        this.description = {
            displayName: 'Cortex',
            name: 'cortex',
            icon: 'file:cortex.svg',
            group: ['transform'],
            subtitle: '={{$parameter["operation"]+ ": " + $parameter["resource"]}}',
            version: 1,
            description: 'Apply the Cortex analyzer/responder on the given entity',
            defaults: {
                name: 'Cortex',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'cortexApi',
                    required: true,
                },
            ],
            properties: [
                // Node properties which the user gets displayed and
                // can change on the node.
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Analyzer',
                            value: 'analyzer',
                        },
                        {
                            name: 'Job',
                            value: 'job',
                        },
                        {
                            name: 'Responder',
                            value: 'responder',
                        },
                    ],
                    default: 'analyzer',
                    description: 'Choose a resource',
                    required: true,
                },
                ...AnalyzerDescriptions_1.analyzersOperations,
                ...AnalyzerDescriptions_1.analyzerFields,
                ...ResponderDescription_1.respondersOperations,
                ...ResponderDescription_1.responderFields,
                ...JobDescription_1.jobOperations,
                ...JobDescription_1.jobFields,
            ],
        };
        this.methods = {
            loadOptions: {
                loadActiveAnalyzers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        // request the enabled analyzers from instance
                        const requestResult = yield GenericFunctions_1.cortexApiRequest.call(this, 'POST', `/analyzer/_search?range=all`);
                        const returnData = [];
                        for (const analyzer of requestResult) {
                            returnData.push({
                                name: analyzer.name,
                                value: `${analyzer.id}::${analyzer.name}`,
                                description: analyzer.description,
                            });
                        }
                        return returnData;
                    });
                },
                loadActiveResponders() {
                    return __awaiter(this, void 0, void 0, function* () {
                        // request the enabled responders from instance
                        const requestResult = yield GenericFunctions_1.cortexApiRequest.call(this, 'GET', `/responder`);
                        const returnData = [];
                        for (const responder of requestResult) {
                            returnData.push({
                                name: responder.name,
                                value: `${responder.id}::${responder.name}`,
                                description: responder.description,
                            });
                        }
                        return returnData;
                    });
                },
                loadObservableOptions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const selectedAnalyzerId = this.getNodeParameter('analyzer').split('::')[0];
                        // request the analyzers from instance
                        const requestResult = yield GenericFunctions_1.cortexApiRequest.call(this, 'GET', `/analyzer/${selectedAnalyzerId}`);
                        // parse supported observable types  into options
                        const returnData = [];
                        for (const dataType of requestResult.dataTypeList) {
                            returnData.push({
                                name: (0, lodash_1.upperFirst)(dataType),
                                value: dataType,
                            });
                        }
                        return returnData;
                    });
                },
                loadDataTypeOptions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const selectedResponderId = this.getNodeParameter('responder').split('::')[0];
                        // request the responder from instance
                        const requestResult = yield GenericFunctions_1.cortexApiRequest.call(this, 'GET', `/responder/${selectedResponderId}`);
                        // parse the accepted dataType into options
                        const returnData = [];
                        for (const dataType of requestResult.dataTypeList) {
                            returnData.push({
                                value: dataType.split(':')[1],
                                name: changeCase.capitalCase(dataType.split(':')[1]),
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
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'analyzer') {
                        //https://github.com/TheHive-Project/CortexDocs/blob/master/api/api-guide.md#run
                        if (operation === 'execute') {
                            let force = false;
                            const analyzer = this.getNodeParameter('analyzer', i);
                            const observableType = this.getNodeParameter('observableType', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const tlp = this.getNodeParameter('tlp', i);
                            const body = {
                                dataType: observableType,
                                tlp,
                            };
                            if (additionalFields.force === true) {
                                force = true;
                            }
                            if (observableType === 'file') {
                                const item = items[i];
                                if (item.binary === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                }
                                const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                                if (item.binary[binaryPropertyName] === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                                }
                                const fileBufferData = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                                const options = {
                                    formData: {
                                        data: {
                                            value: fileBufferData,
                                            options: {
                                                contentType: item.binary[binaryPropertyName].mimeType,
                                                filename: item.binary[binaryPropertyName].fileName,
                                            },
                                        },
                                        _json: JSON.stringify({
                                            dataType: observableType,
                                            tlp,
                                        }),
                                    },
                                };
                                responseData = (yield GenericFunctions_1.cortexApiRequest.call(this, 'POST', `/analyzer/${analyzer.split('::')[0]}/run`, {}, { force }, '', options));
                                continue;
                            }
                            else {
                                const observableValue = this.getNodeParameter('observableValue', i);
                                body.data = observableValue;
                                responseData = (yield GenericFunctions_1.cortexApiRequest.call(this, 'POST', `/analyzer/${analyzer.split('::')[0]}/run`, body, { force }));
                            }
                            if (additionalFields.timeout) {
                                responseData = yield GenericFunctions_1.cortexApiRequest.call(this, 'GET', `/job/${responseData.id}/waitreport`, {}, { atMost: `${additionalFields.timeout}second` });
                            }
                        }
                    }
                    if (resource === 'job') {
                        //https://github.com/TheHive-Project/CortexDocs/blob/master/api/api-guide.md#get-details-1
                        if (operation === 'get') {
                            const jobId = this.getNodeParameter('jobId', i);
                            responseData = yield GenericFunctions_1.cortexApiRequest.call(this, 'GET', `/job/${jobId}`);
                        }
                        //https://github.com/TheHive-Project/CortexDocs/blob/master/api/api-guide.md#get-details-and-report
                        if (operation === 'report') {
                            const jobId = this.getNodeParameter('jobId', i);
                            responseData = yield GenericFunctions_1.cortexApiRequest.call(this, 'GET', `/job/${jobId}/report`);
                        }
                    }
                    if (resource === 'responder') {
                        if (operation === 'execute') {
                            const responderId = this.getNodeParameter('responder', i).split('::')[0];
                            const entityType = this.getNodeParameter('entityType', i);
                            const isJSON = this.getNodeParameter('jsonObject', i);
                            let body;
                            if (isJSON) {
                                const entityJson = JSON.parse(this.getNodeParameter('objectData', i));
                                body = {
                                    responderId,
                                    label: (0, GenericFunctions_1.getEntityLabel)(entityJson),
                                    dataType: `thehive:${entityType}`,
                                    data: entityJson,
                                    tlp: entityJson.tlp || 2,
                                    pap: entityJson.pap || 2,
                                    message: entityJson.message || '',
                                    parameters: [],
                                };
                            }
                            else {
                                const values = this.getNodeParameter('parameters', i).values;
                                body = {
                                    responderId,
                                    dataType: `thehive:${entityType}`,
                                    data: Object.assign({ _type: entityType }, (0, GenericFunctions_1.prepareParameters)(values)),
                                };
                                if (entityType === 'alert') {
                                    // deal with alert artifacts
                                    const artifacts = body.data.artifacts;
                                    if (artifacts) {
                                        const artifactValues = artifacts.artifactValues;
                                        if (artifactValues) {
                                            const artifactData = [];
                                            for (const artifactvalue of artifactValues) {
                                                const element = {};
                                                element.message = artifactvalue.message;
                                                element.tags = (0, GenericFunctions_1.splitTags)(artifactvalue.tags);
                                                element.dataType = artifactvalue.dataType;
                                                element.data = artifactvalue.data;
                                                if (artifactvalue.dataType === 'file') {
                                                    const item = items[i];
                                                    if (item.binary === undefined) {
                                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                                    }
                                                    const binaryPropertyName = artifactvalue.binaryProperty;
                                                    if (item.binary[binaryPropertyName] === undefined) {
                                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property '${binaryPropertyName}' does not exists on item!`);
                                                    }
                                                    const binaryData = item.binary[binaryPropertyName];
                                                    element.data = `${binaryData.fileName};${binaryData.mimeType};${binaryData.data}`;
                                                }
                                                artifactData.push(element);
                                            }
                                            body.data.artifacts = artifactData;
                                        }
                                    }
                                }
                                if (entityType === 'case_artifact') {
                                    // deal with file observable
                                    if (body.data.dataType === 'file') {
                                        const item = items[i];
                                        if (item.binary === undefined) {
                                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                        }
                                        const binaryPropertyName = body.data.binaryPropertyName;
                                        if (item.binary[binaryPropertyName] === undefined) {
                                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                                        }
                                        const fileBufferData = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                                        const sha256 = (0, crypto_1.createHash)('sha256').update(fileBufferData).digest('hex');
                                        body.data.attachment = {
                                            name: item.binary[binaryPropertyName].fileName,
                                            hashes: [
                                                sha256,
                                                (0, crypto_1.createHash)('sha1').update(fileBufferData).digest('hex'),
                                                (0, crypto_1.createHash)('md5').update(fileBufferData).digest('hex'),
                                            ],
                                            size: fileBufferData.byteLength,
                                            contentType: item.binary[binaryPropertyName].mimeType,
                                            id: sha256,
                                        };
                                        delete body.data.binaryPropertyName;
                                    }
                                }
                                // add the job label after getting all entity attributes
                                body = Object.assign({ label: (0, GenericFunctions_1.getEntityLabel)(body.data) }, body);
                            }
                            responseData = (yield GenericFunctions_1.cortexApiRequest.call(this, 'POST', `/responder/${responderId}/run`, body));
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
exports.Cortex = Cortex;

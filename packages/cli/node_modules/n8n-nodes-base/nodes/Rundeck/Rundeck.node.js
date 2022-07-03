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
exports.Rundeck = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const RundeckApi_1 = require("./RundeckApi");
class Rundeck {
    constructor() {
        this.description = {
            displayName: 'Rundeck',
            name: 'rundeck',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:rundeck.png',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Manage Rundeck API',
            defaults: {
                name: 'Rundeck',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'rundeckApi',
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
                            name: 'Job',
                            value: 'job',
                        },
                    ],
                    default: 'job',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Execute',
                            value: 'execute',
                            description: 'Execute a job',
                        },
                        {
                            name: 'Get Metadata',
                            value: 'getMetadata',
                            description: 'Get metadata of a job',
                        },
                    ],
                    default: 'execute',
                },
                // ----------------------------------
                //         job:execute
                // ----------------------------------
                {
                    displayName: 'Job ID',
                    name: 'jobid',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'execute',
                            ],
                            resource: [
                                'job',
                            ],
                        },
                    },
                    default: '',
                    placeholder: 'Rundeck Job ID',
                    required: true,
                    description: 'The job ID to execute',
                },
                {
                    displayName: 'Arguments',
                    name: 'arguments',
                    placeholder: 'Add Argument',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    displayOptions: {
                        show: {
                            operation: [
                                'execute',
                            ],
                            resource: [
                                'job',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            name: 'arguments',
                            displayName: 'Arguments',
                            values: [
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'string',
                                    default: '',
                                },
                            ],
                        },
                    ],
                },
                // ----------------------------------
                //         job:getMetadata
                // ----------------------------------
                {
                    displayName: 'Job ID',
                    name: 'jobid',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'getMetadata',
                            ],
                            resource: [
                                'job',
                            ],
                        },
                    },
                    default: '',
                    placeholder: 'Rundeck Job ID',
                    required: true,
                    description: 'The job ID to get metadata off',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            // Input data
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            const operation = this.getNodeParameter('operation', 0);
            const resource = this.getNodeParameter('resource', 0);
            const rundeckApi = new RundeckApi_1.RundeckApi(this);
            yield rundeckApi.init();
            for (let i = 0; i < length; i++) {
                if (resource === 'job') {
                    if (operation === 'execute') {
                        // ----------------------------------
                        //         job: execute
                        // ----------------------------------
                        const jobid = this.getNodeParameter('jobid', i);
                        const rundeckArguments = this.getNodeParameter('arguments', i).arguments;
                        const response = yield rundeckApi.executeJob(jobid, rundeckArguments);
                        returnData.push(response);
                    }
                    else if (operation === 'getMetadata') {
                        // ----------------------------------
                        //         job: getMetadata
                        // ----------------------------------
                        const jobid = this.getNodeParameter('jobid', i);
                        const response = yield rundeckApi.getJobMetadata(jobid);
                        returnData.push(response);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
                    }
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not supported!`);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Rundeck = Rundeck;

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
exports.ExecuteWorkflow = void 0;
const promises_1 = require("fs/promises");
const n8n_workflow_1 = require("n8n-workflow");
class ExecuteWorkflow {
    constructor() {
        this.description = {
            displayName: 'Execute Workflow',
            name: 'executeWorkflow',
            icon: 'fa:network-wired',
            group: ['transform'],
            version: 1,
            subtitle: '={{"Workflow: " + $parameter["workflowId"]}}',
            description: 'Execute another workflow',
            defaults: {
                name: 'Execute Workflow',
                color: '#ff6d5a',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Source',
                    name: 'source',
                    type: 'options',
                    options: [
                        {
                            name: 'Database',
                            value: 'database',
                            description: 'Load the workflow from the database by ID',
                        },
                        {
                            name: 'Local File',
                            value: 'localFile',
                            description: 'Load the workflow from a locally saved file',
                        },
                        {
                            name: 'Parameter',
                            value: 'parameter',
                            description: 'Load the workflow from a parameter',
                        },
                        {
                            name: 'URL',
                            value: 'url',
                            description: 'Load the workflow from an URL',
                        },
                    ],
                    default: 'database',
                    description: 'Where to get the workflow to execute from',
                },
                // ----------------------------------
                //         source:database
                // ----------------------------------
                {
                    displayName: 'Workflow ID',
                    name: 'workflowId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            source: [
                                'database',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The workflow to execute',
                },
                // ----------------------------------
                //         source:localFile
                // ----------------------------------
                {
                    displayName: 'Workflow Path',
                    name: 'workflowPath',
                    type: 'string',
                    displayOptions: {
                        show: {
                            source: [
                                'localFile',
                            ],
                        },
                    },
                    default: '',
                    placeholder: '/data/workflow.json',
                    required: true,
                    description: 'The path to local JSON workflow file to execute',
                },
                // ----------------------------------
                //         source:parameter
                // ----------------------------------
                {
                    displayName: 'Workflow JSON',
                    name: 'workflowJson',
                    type: 'string',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                        editor: 'json',
                        rows: 10,
                    },
                    displayOptions: {
                        show: {
                            source: [
                                'parameter',
                            ],
                        },
                    },
                    default: '\n\n\n',
                    required: true,
                    description: 'The workflow JSON code to execute',
                },
                // ----------------------------------
                //         source:url
                // ----------------------------------
                {
                    displayName: 'Workflow URL',
                    name: 'workflowUrl',
                    type: 'string',
                    displayOptions: {
                        show: {
                            source: [
                                'url',
                            ],
                        },
                    },
                    default: '',
                    placeholder: 'https://example.com/workflow.json',
                    required: true,
                    description: 'The URL from which to load the workflow from',
                },
                {
                    displayName: 'Any data you pass into this node will be output by the start node of the workflow to be executed. <a href="https://docs.n8n.io/nodes/n8n-nodes-base.executeworkflow/" target="_blank">More info</a>',
                    name: 'executeWorkflowNotice',
                    type: 'notice',
                    default: '',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const source = this.getNodeParameter('source', 0);
            const workflowInfo = {};
            try {
                if (source === 'database') {
                    // Read workflow from database
                    workflowInfo.id = this.getNodeParameter('workflowId', 0);
                }
                else if (source === 'localFile') {
                    // Read workflow from filesystem
                    const workflowPath = this.getNodeParameter('workflowPath', 0);
                    let workflowJson;
                    try {
                        workflowJson = (yield (0, promises_1.readFile)(workflowPath, { encoding: 'utf8' }));
                    }
                    catch (error) {
                        if (error.code === 'ENOENT') {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The file "${workflowPath}" could not be found.`);
                        }
                        throw error;
                    }
                    workflowInfo.code = JSON.parse(workflowJson);
                }
                else if (source === 'parameter') {
                    // Read workflow from parameter
                    const workflowJson = this.getNodeParameter('workflowJson', 0);
                    workflowInfo.code = JSON.parse(workflowJson);
                }
                else if (source === 'url') {
                    // Read workflow from url
                    const workflowUrl = this.getNodeParameter('workflowUrl', 0);
                    const requestOptions = {
                        headers: {
                            'accept': 'application/json,text/*;q=0.99',
                        },
                        method: 'GET',
                        uri: workflowUrl,
                        json: true,
                        gzip: true,
                    };
                    const response = yield this.helpers.request(requestOptions);
                    workflowInfo.code = response;
                }
                const receivedData = yield this.executeWorkflow(workflowInfo, items);
                return receivedData;
            }
            catch (error) {
                if (this.continueOnFail()) {
                    return this.prepareOutputData([{ json: { error: error.message } }]);
                }
                throw error;
            }
        });
    }
}
exports.ExecuteWorkflow = ExecuteWorkflow;

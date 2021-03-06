"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopAndError = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const errorObjectPlaceholder = `{
	"code": "404",
	"description": "The resource could not be fetched"
}`;
class StopAndError {
    constructor() {
        this.description = {
            displayName: 'Stop and Error',
            name: 'stopAndError',
            icon: 'fa:exclamation-triangle',
            group: ['input'],
            version: 1,
            description: 'Throw an error in the workflow',
            defaults: {
                name: 'Stop And Error',
                color: '#ff0000',
            },
            inputs: ['main'],
            // eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
            outputs: [],
            properties: [
                {
                    displayName: 'Error Type',
                    name: 'errorType',
                    type: 'options',
                    options: [
                        {
                            name: 'Error Message',
                            value: 'errorMessage',
                        },
                        {
                            name: 'Error Object',
                            value: 'errorObject',
                        },
                    ],
                    default: 'errorMessage',
                    description: 'Type of error to throw',
                },
                {
                    displayName: 'Error Message',
                    name: 'errorMessage',
                    type: 'string',
                    placeholder: 'An error occurred!',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            errorType: [
                                'errorMessage',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Error Object',
                    name: 'errorObject',
                    type: 'json',
                    description: 'Object containing error properties',
                    default: '',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    placeholder: errorObjectPlaceholder,
                    required: true,
                    displayOptions: {
                        show: {
                            errorType: [
                                'errorObject',
                            ],
                        },
                    },
                },
            ],
        };
    }
    execute() {
        const errorType = this.getNodeParameter('errorType', 0);
        const { id: workflowId, name: workflowName } = this.getWorkflow();
        let toThrow;
        if (errorType === 'errorMessage') {
            toThrow = this.getNodeParameter('errorMessage', 0);
        }
        else {
            const json = this.getNodeParameter('errorObject', 0);
            const errorObject = JSON.parse(json);
            toThrow = Object.assign({ name: 'User-thrown error', message: `Workflow ID ${workflowId} "${workflowName}" has failed` }, errorObject);
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), toThrow);
    }
}
exports.StopAndError = StopAndError;

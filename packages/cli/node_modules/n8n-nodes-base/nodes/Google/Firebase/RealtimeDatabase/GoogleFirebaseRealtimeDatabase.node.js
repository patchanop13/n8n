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
exports.GoogleFirebaseRealtimeDatabase = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class GoogleFirebaseRealtimeDatabase {
    constructor() {
        this.description = {
            displayName: 'Google Cloud Realtime Database',
            name: 'googleFirebaseRealtimeDatabase',
            icon: 'file:googleFirebaseRealtimeDatabase.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Interact with Google Firebase - Realtime Database API',
            defaults: {
                name: 'Google Cloud Realtime Database',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'googleFirebaseRealtimeDatabaseOAuth2Api',
                },
            ],
            properties: [
                {
                    displayName: 'Project Name or ID',
                    name: 'projectId',
                    type: 'options',
                    default: '',
                    typeOptions: {
                        loadOptionsMethod: 'getProjects',
                    },
                    description: 'As displayed in firebase console URL. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                    required: true,
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Write data to a database',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete data from a database',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get a record from a database',
                        },
                        {
                            name: 'Push',
                            value: 'push',
                            description: 'Append to a list of data',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update item on a database',
                        },
                    ],
                    default: 'create',
                    required: true,
                },
                {
                    displayName: 'Object Path',
                    name: 'path',
                    type: 'string',
                    default: '',
                    placeholder: 'e.g. /app/users',
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-json
                    description: 'Object path on database. Do not append .json.',
                    required: true,
                    displayOptions: {
                        hide: {
                            'operation': ['get'],
                        },
                    },
                },
                {
                    displayName: 'Object Path',
                    name: 'path',
                    type: 'string',
                    default: '',
                    placeholder: 'e.g. /app/users',
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-json
                    description: 'Object path on database. Do not append .json.',
                    hint: 'Leave blank to get a whole database object',
                    displayOptions: {
                        show: {
                            'operation': ['get'],
                        },
                    },
                },
                {
                    displayName: 'Columns / Attributes',
                    name: 'attributes',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                                'push',
                                'update',
                            ],
                        },
                    },
                    description: 'Attributes to save',
                    required: true,
                    placeholder: 'age, name, city',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getProjects() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const projects = yield GenericFunctions_1.googleApiRequestAllItems.call(this, '', 'GET', 'results', {}, {}, {}, 'https://firebase.googleapis.com/v1beta1/projects');
                        const returnData = projects
                            // select only realtime database projects
                            .filter((project) => project.resources.realtimeDatabaseInstance)
                            .map((project) => ({
                            name: project.projectId,
                            value: project.resources.realtimeDatabaseInstance,
                        }));
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
            const operation = this.getNodeParameter('operation', 0);
            //https://firebase.google.com/docs/reference/rest/database
            if (['push', 'create', 'update'].includes(operation) && items.length === 1 && Object.keys(items[0].json).length === 0) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The ${operation} operation needs input data`);
            }
            for (let i = 0; i < length; i++) {
                try {
                    const projectId = this.getNodeParameter('projectId', i);
                    let method = 'GET', attributes = '';
                    const document = {};
                    if (operation === 'create') {
                        method = 'PUT';
                        attributes = this.getNodeParameter('attributes', i);
                    }
                    else if (operation === 'delete') {
                        method = 'DELETE';
                    }
                    else if (operation === 'get') {
                        method = 'GET';
                    }
                    else if (operation === 'push') {
                        method = 'POST';
                        attributes = this.getNodeParameter('attributes', i);
                    }
                    else if (operation === 'update') {
                        method = 'PATCH';
                        attributes = this.getNodeParameter('attributes', i);
                    }
                    if (attributes) {
                        const attributeList = attributes.split(',').map(el => el.trim());
                        attributeList.map((attribute) => {
                            if (items[i].json.hasOwnProperty(attribute)) {
                                document[attribute] = items[i].json[attribute];
                            }
                        });
                    }
                    responseData = yield GenericFunctions_1.googleApiRequest.call(this, projectId, method, this.getNodeParameter('path', i), document);
                    if (responseData === null) {
                        if (operation === 'get') {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, { message: `Requested entity was not found.` });
                        }
                        else if (method === 'DELETE') {
                            responseData = { success: true };
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else if (typeof responseData === 'string' || typeof responseData === 'number') {
                    returnData.push({ [this.getNodeParameter('path', i)]: responseData });
                }
                else {
                    returnData.push(responseData);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.GoogleFirebaseRealtimeDatabase = GoogleFirebaseRealtimeDatabase;

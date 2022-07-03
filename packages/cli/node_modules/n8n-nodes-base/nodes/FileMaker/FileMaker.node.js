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
exports.FileMaker = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class FileMaker {
    constructor() {
        this.description = {
            displayName: 'FileMaker',
            name: 'filemaker',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:filemaker.png',
            group: ['input'],
            version: 1,
            description: 'Retrieve data from the FileMaker data API',
            defaults: {
                name: 'FileMaker',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'fileMaker',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Action',
                    name: 'action',
                    type: 'options',
                    default: 'record',
                    options: [
                        /*{
                            name: 'Login',
                            value: 'login',
                        },
                        {
                            name: 'Logout',
                            value: 'logout',
                        },*/
                        {
                            name: 'Create Record',
                            value: 'create',
                        },
                        {
                            name: 'Delete Record',
                            value: 'delete',
                        },
                        {
                            name: 'Duplicate Record',
                            value: 'duplicate',
                        },
                        {
                            name: 'Edit Record',
                            value: 'edit',
                        },
                        {
                            name: 'Find Records',
                            value: 'find',
                        },
                        {
                            name: 'Get Records',
                            value: 'records',
                        },
                        {
                            name: 'Get Records By ID',
                            value: 'record',
                        },
                        {
                            name: 'Perform Script',
                            value: 'performscript',
                        },
                    ],
                },
                // ----------------------------------
                //         shared
                // ----------------------------------
                {
                    displayName: 'Layout Name or ID',
                    name: 'layout',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getLayouts',
                    },
                    options: [],
                    default: '',
                    required: true,
                    displayOptions: {},
                    placeholder: 'Layout Name',
                    description: 'FileMaker Layout Name. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Record ID',
                    name: 'recid',
                    type: 'number',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            action: [
                                'record',
                                'edit',
                                'delete',
                                'duplicate',
                            ],
                        },
                    },
                    placeholder: 'Record ID',
                    description: 'Internal Record ID returned by get (recordid)',
                },
                {
                    displayName: 'Offset',
                    name: 'offset',
                    placeholder: '0',
                    description: 'The record number of the first record in the range of records',
                    type: 'number',
                    default: 1,
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                                'records',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    placeholder: '100',
                    description: 'Max number of results to return',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                    },
                    default: 100,
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                                'records',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Get Portals',
                    name: 'getPortals',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to get portal data as well',
                    displayOptions: {
                        show: {
                            action: [
                                'record',
                                'records',
                                'find',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Portals Name or ID',
                    name: 'portals',
                    type: 'options',
                    typeOptions: {
                        multipleValues: true,
                        multipleValueButtonText: 'Add portal',
                        loadOptionsMethod: 'getPortals',
                    },
                    options: [],
                    default: [],
                    displayOptions: {
                        show: {
                            action: [
                                'record',
                                'records',
                                'find',
                            ],
                            getPortals: [
                                true,
                            ],
                        },
                    },
                    placeholder: 'Portals',
                    description: 'The portal result set to return. Use the portal object name or portal table name. If this parameter is omitted, the API will return all portal objects and records in the layout. For best performance, pass the portal object name or portal table name. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                // ----------------------------------
                //         find/records
                // ----------------------------------
                {
                    displayName: 'Response Layout Name or ID',
                    name: 'responseLayout',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'getResponseLayouts',
                    },
                    options: [],
                    default: '',
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Queries',
                    name: 'queries',
                    placeholder: 'Add query',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            name: 'query',
                            displayName: 'Query',
                            values: [
                                {
                                    displayName: 'Fields',
                                    name: 'fields',
                                    placeholder: 'Add field',
                                    type: 'fixedCollection',
                                    default: {},
                                    typeOptions: {
                                        multipleValues: true,
                                    },
                                    options: [{
                                            name: 'field',
                                            displayName: 'Field',
                                            values: [
                                                {
                                                    displayName: 'Field Name or ID',
                                                    name: 'name',
                                                    type: 'options',
                                                    default: '',
                                                    typeOptions: {
                                                        loadOptionsMethod: 'getFields',
                                                    },
                                                    options: [],
                                                    description: 'Search Field. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                                                },
                                                {
                                                    displayName: 'Value',
                                                    name: 'value',
                                                    type: 'string',
                                                    default: '',
                                                    description: 'Value to search',
                                                },
                                            ],
                                        },
                                    ],
                                    description: 'Field Name',
                                },
                                {
                                    displayName: 'Omit',
                                    name: 'omit',
                                    type: 'boolean',
                                    default: false,
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Sort Data?',
                    name: 'setSort',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to sort data',
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                                'record',
                                'records',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Sort',
                    name: 'sortParametersUi',
                    placeholder: 'Add Sort Rules',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    displayOptions: {
                        show: {
                            setSort: [
                                true,
                            ],
                            action: [
                                'find',
                                'records',
                            ],
                        },
                    },
                    description: 'Sort rules',
                    default: {},
                    options: [
                        {
                            name: 'rules',
                            displayName: 'Rules',
                            values: [
                                {
                                    displayName: 'Field Name or ID',
                                    name: 'name',
                                    type: 'options',
                                    default: '',
                                    typeOptions: {
                                        loadOptionsMethod: 'getFields',
                                    },
                                    options: [],
                                    description: 'Field Name. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                                },
                                {
                                    displayName: 'Order',
                                    name: 'value',
                                    type: 'options',
                                    default: 'ascend',
                                    options: [
                                        {
                                            name: 'Ascend',
                                            value: 'ascend',
                                        },
                                        {
                                            name: 'Descend',
                                            value: 'descend',
                                        },
                                    ],
                                    description: 'Sort order',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Before Find Script',
                    name: 'setScriptBefore',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to define a script to be run before the action specified by the API call and after the subsequent sort',
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                                'record',
                                'records',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Script Name or ID',
                    name: 'scriptBefore',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getScripts',
                    },
                    options: [],
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                                'record',
                                'records',
                            ],
                            setScriptBefore: [
                                true,
                            ],
                        },
                    },
                    placeholder: 'Script Name',
                    description: 'The name of the FileMaker script to be run after the action specified by the API call and after the subsequent sort. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Script Parameter',
                    name: 'scriptBeforeParam',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                                'record',
                                'records',
                            ],
                            setScriptBefore: [
                                true,
                            ],
                        },
                    },
                    placeholder: 'Script Parameters',
                    description: 'A parameter for the FileMaker script',
                },
                {
                    displayName: 'Before Sort Script',
                    name: 'setScriptSort',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to define a script to be run after the action specified by the API call but before the subsequent sort',
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                                'record',
                                'records',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Script Name or ID',
                    name: 'scriptSort',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getScripts',
                    },
                    options: [],
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                                'record',
                                'records',
                            ],
                            setScriptSort: [
                                true,
                            ],
                        },
                    },
                    placeholder: 'Script Name',
                    description: 'The name of the FileMaker script to be run after the action specified by the API call but before the subsequent sort. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Script Parameter',
                    name: 'scriptSortParam',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                                'record',
                                'records',
                            ],
                            setScriptSort: [
                                true,
                            ],
                        },
                    },
                    placeholder: 'Script Parameters',
                    description: 'A parameter for the FileMaker script',
                },
                {
                    displayName: 'After Sort Script',
                    name: 'setScriptAfter',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to define a script to be run after the action specified by the API call but before the subsequent sort',
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                                'record',
                                'records',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Script Name or ID',
                    name: 'scriptAfter',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getScripts',
                    },
                    options: [],
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                                'record',
                                'records',
                            ],
                            setScriptAfter: [
                                true,
                            ],
                        },
                    },
                    placeholder: 'Script Name',
                    description: 'The name of the FileMaker script to be run after the action specified by the API call and after the subsequent sort. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Script Parameter',
                    name: 'scriptAfterParam',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            action: [
                                'find',
                                'record',
                                'records',
                            ],
                            setScriptAfter: [
                                true,
                            ],
                        },
                    },
                    placeholder: 'Script Parameters',
                    description: 'A parameter for the FileMaker script',
                },
                // ----------------------------------
                //         create/edit
                // ----------------------------------
                /*{
                    displayName: 'fieldData',
                    name: 'fieldData',
                    placeholder: '{"field1": "value", "field2": "value", ...}',
                    description: 'Additional fields to add.',
                    type: 'string',
                    default: '{}',
                    displayOptions: {
                        show: {
                            action: [
                                'create',
                                'edit',
                            ],
                        },
                    }
                },*/
                {
                    displayName: 'Mod ID',
                    name: 'modId',
                    description: 'The last modification ID. When you use modId, a record is edited only when the modId matches.',
                    type: 'number',
                    default: '',
                    displayOptions: {
                        show: {
                            action: [
                                'edit',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Fields',
                    name: 'fieldsParametersUi',
                    placeholder: 'Add field',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    displayOptions: {
                        show: {
                            action: [
                                'create',
                                'edit',
                            ],
                        },
                    },
                    description: 'Fields to define',
                    default: {},
                    options: [
                        {
                            name: 'fields',
                            displayName: 'Fields',
                            values: [
                                {
                                    displayName: 'Field Name or ID',
                                    name: 'name',
                                    type: 'options',
                                    default: '',
                                    typeOptions: {
                                        loadOptionsMethod: 'getFields',
                                    },
                                    options: [],
                                    description: 'Field Name. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
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
                //         performscript
                // ----------------------------------
                {
                    displayName: 'Script Name or ID',
                    name: 'script',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getScripts',
                    },
                    options: [],
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            action: [
                                'performscript',
                            ],
                        },
                    },
                    placeholder: 'Script Name',
                    description: 'The name of the FileMaker script to be run. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Script Parameter',
                    name: 'scriptParam',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            action: [
                                'performscript',
                            ],
                        },
                    },
                    placeholder: 'Script Parameters',
                    description: 'A parameter for the FileMaker script',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available topics to display them to user so that he can
                // select them easily
                getLayouts() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let returnData;
                        try {
                            returnData = yield GenericFunctions_1.layoutsApiRequest.call(this);
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `FileMaker Error: ${error}`);
                        }
                        return returnData;
                    });
                },
                getResponseLayouts() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        returnData.push({
                            name: 'Use main layout',
                            value: '',
                        });
                        let layouts;
                        try {
                            layouts = yield GenericFunctions_1.layoutsApiRequest.call(this);
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `FileMaker Error: ${error}`);
                        }
                        for (const layout of layouts) {
                            returnData.push({
                                name: layout.name,
                                value: layout.name,
                            });
                        }
                        return returnData;
                    });
                },
                getFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        let fields;
                        try {
                            fields = yield GenericFunctions_1.getFields.call(this);
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `FileMaker Error: ${error}`);
                        }
                        for (const field of fields) {
                            returnData.push({
                                name: field.name,
                                value: field.name,
                            });
                        }
                        return returnData;
                    });
                },
                getScripts() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        let scripts;
                        try {
                            scripts = yield GenericFunctions_1.getScripts.call(this);
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `FileMaker Error: ${error}`);
                        }
                        for (const script of scripts) {
                            if (!script.isFolder) {
                                returnData.push({
                                    name: script.name,
                                    value: script.name,
                                });
                            }
                        }
                        return returnData;
                    });
                },
                getPortals() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        let portals;
                        try {
                            portals = yield GenericFunctions_1.getPortals.call(this);
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `FileMaker Error: ${error}`);
                        }
                        Object.keys(portals).forEach((portal) => {
                            returnData.push({
                                name: portal,
                                value: portal,
                            });
                        });
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
            const credentials = yield this.getCredentials('fileMaker');
            let token;
            try {
                token = yield GenericFunctions_1.getToken.call(this);
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Login fail: ${error}`);
            }
            let requestOptions;
            const host = credentials.host;
            const database = credentials.db;
            const url = `https://${host}/fmi/data/v1`;
            const action = this.getNodeParameter('action', 0);
            try {
                for (let i = 0; i < items.length; i++) {
                    // Reset all values
                    requestOptions = {
                        uri: '',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        method: 'GET',
                        json: true,
                    };
                    const layout = this.getNodeParameter('layout', i);
                    if (action === 'record') {
                        const recid = this.getNodeParameter('recid', i);
                        requestOptions.uri = url + `/databases/${database}/layouts/${layout}/records/${recid}`;
                        requestOptions.qs = Object.assign({ 'portal': JSON.stringify(GenericFunctions_1.parsePortals.call(this, i)) }, GenericFunctions_1.parseScripts.call(this, i));
                    }
                    else if (action === 'records') {
                        requestOptions.uri = url + `/databases/${database}/layouts/${layout}/records`;
                        requestOptions.qs = Object.assign({ '_offset': this.getNodeParameter('offset', i), '_limit': this.getNodeParameter('limit', i), 'portal': JSON.stringify(GenericFunctions_1.parsePortals.call(this, i)) }, GenericFunctions_1.parseScripts.call(this, i));
                        const sort = GenericFunctions_1.parseSort.call(this, i);
                        if (sort) {
                            requestOptions.body.sort = sort;
                        }
                    }
                    else if (action === 'find') {
                        requestOptions.uri = url + `/databases/${database}/layouts/${layout}/_find`;
                        requestOptions.method = 'POST';
                        requestOptions.body = Object.assign({ 'query': GenericFunctions_1.parseQuery.call(this, i), 'offset': this.getNodeParameter('offset', i), 'limit': this.getNodeParameter('limit', i), 'layout.response': this.getNodeParameter('responseLayout', i) }, GenericFunctions_1.parseScripts.call(this, i));
                        const sort = GenericFunctions_1.parseSort.call(this, i);
                        if (sort) {
                            requestOptions.body.sort = sort;
                        }
                    }
                    else if (action === 'create') {
                        requestOptions.uri = url + `/databases/${database}/layouts/${layout}/records`;
                        requestOptions.method = 'POST';
                        requestOptions.headers['Content-Type'] = 'application/json';
                        //TODO: handle portalData
                        requestOptions.body = Object.assign({ fieldData: Object.assign({}, GenericFunctions_1.parseFields.call(this, i)), portalData: {} }, GenericFunctions_1.parseScripts.call(this, i));
                    }
                    else if (action === 'edit') {
                        const recid = this.getNodeParameter('recid', i);
                        requestOptions.uri = url + `/databases/${database}/layouts/${layout}/records/${recid}`;
                        requestOptions.method = 'PATCH';
                        requestOptions.headers['Content-Type'] = 'application/json';
                        //TODO: handle portalData
                        requestOptions.body = Object.assign({ fieldData: Object.assign({}, GenericFunctions_1.parseFields.call(this, i)), portalData: {} }, GenericFunctions_1.parseScripts.call(this, i));
                    }
                    else if (action === 'performscript') {
                        const scriptName = this.getNodeParameter('script', i);
                        requestOptions.uri = url + `/databases/${database}/layouts/${layout}/script/${scriptName}`;
                        requestOptions.qs = {
                            'script.param': this.getNodeParameter('scriptParam', i),
                        };
                    }
                    else if (action === 'duplicate') {
                        const recid = this.getNodeParameter('recid', i);
                        requestOptions.uri = url + `/databases/${database}/layouts/${layout}/records/${recid}`;
                        requestOptions.method = 'POST';
                        requestOptions.headers['Content-Type'] = 'application/json';
                        requestOptions.qs = Object.assign({}, GenericFunctions_1.parseScripts.call(this, i));
                    }
                    else if (action === 'delete') {
                        const recid = this.getNodeParameter('recid', i);
                        requestOptions.uri = url + `/databases/${database}/layouts/${layout}/records/${recid}`;
                        requestOptions.method = 'DELETE';
                        requestOptions.qs = Object.assign({}, GenericFunctions_1.parseScripts.call(this, i));
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The action "${action}" is not implemented yet!`);
                    }
                    // Now that the options are all set make the actual http request
                    let response;
                    try {
                        response = yield this.helpers.request(requestOptions);
                    }
                    catch (error) {
                        response = error.response.body;
                    }
                    if (typeof response === 'string') {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Response body is not valid JSON. Change "Response Format" to "String"');
                    }
                    returnData.push({ json: response });
                }
            }
            catch (error) {
                yield GenericFunctions_1.logout.call(this, token);
                if (error.node) {
                    throw error;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The action "${error.message}" is not implemented yet!`);
            }
            return this.prepareOutputData(returnData);
        });
    }
}
exports.FileMaker = FileMaker;

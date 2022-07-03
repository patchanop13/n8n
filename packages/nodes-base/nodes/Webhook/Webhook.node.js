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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhook = void 0;
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const basic_auth_1 = __importDefault(require("basic-auth"));
const fs_1 = __importDefault(require("fs"));
const formidable_1 = __importDefault(require("formidable"));
const isbot_1 = __importDefault(require("isbot"));
function authorizationError(resp, realm, responseCode, message) {
    if (message === undefined) {
        message = 'Authorization problem!';
        if (responseCode === 401) {
            message = 'Authorization is required!';
        }
        else if (responseCode === 403) {
            message = 'Authorization data is wrong!';
        }
    }
    resp.writeHead(responseCode, { 'WWW-Authenticate': `Basic realm="${realm}"` });
    resp.end(message);
    return {
        noWebhookResponse: true,
    };
}
class Webhook {
    constructor() {
        this.description = {
            displayName: 'Webhook',
            icon: 'file:webhook.svg',
            name: 'webhook',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when a webhook is called',
            eventTriggerDescription: 'Waiting for you to call the Test URL',
            activationMessage: 'You can now make calls to your production webhook URL.',
            defaults: {
                name: 'Webhook',
            },
            triggerPanel: {
                header: '',
                executionsHelp: {
                    inactive: 'Webhooks have two modes: test and production. <br /> <br /> <b>Use test mode while you build your workflow</b>. Click the \'listen\' button, then make a request to the test URL. The executions will show up in the editor.<br /> <br /> <b>Use production mode to run your workflow automatically</b>. <a data-key=\"activate\">Activate</a> the workflow, then make requests to the production URL. These executions will show up in the executions list, but not in the editor.',
                    active: 'Webhooks have two modes: test and production. <br /> <br /> <b>Use test mode while you build your workflow</b>. Click the \'listen\' button, then make a request to the test URL. The executions will show up in the editor.<br /> <br /> <b>Use production mode to run your workflow automatically</b>. Since the workflow is activated, you can make requests to the production URL. These executions will show up in the <a data-key=\"executions\">executions list</a>, but not in the editor.',
                },
                activationHint: 'Once you’ve finished building your workflow, run it without having to click this button by using the production webhook URL.',
            },
            // eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'httpBasicAuth',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'basicAuth',
                            ],
                        },
                    },
                },
                {
                    name: 'httpHeaderAuth',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'headerAuth',
                            ],
                        },
                    },
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: '={{$parameter["httpMethod"]}}',
                    isFullPath: true,
                    responseCode: '={{$parameter["responseCode"]}}',
                    responseMode: '={{$parameter["responseMode"]}}',
                    responseData: '={{$parameter["responseData"] || ($parameter.options.noResponseBody ? "noData" : undefined) }}',
                    responseBinaryPropertyName: '={{$parameter["responseBinaryPropertyName"]}}',
                    responseContentType: '={{$parameter["options"]["responseContentType"]}}',
                    responsePropertyName: '={{$parameter["options"]["responsePropertyName"]}}',
                    responseHeaders: '={{$parameter["options"]["responseHeaders"]}}',
                    path: '={{$parameter["path"]}}',
                },
            ],
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Basic Auth',
                            value: 'basicAuth',
                        },
                        {
                            name: 'Header Auth',
                            value: 'headerAuth',
                        },
                        {
                            name: 'None',
                            value: 'none',
                        },
                    ],
                    default: 'none',
                    description: 'The way to authenticate',
                },
                {
                    displayName: 'HTTP Method',
                    name: 'httpMethod',
                    type: 'options',
                    options: [
                        {
                            name: 'DELETE',
                            value: 'DELETE',
                        },
                        {
                            name: 'GET',
                            value: 'GET',
                        },
                        {
                            name: 'HEAD',
                            value: 'HEAD',
                        },
                        {
                            name: 'PATCH',
                            value: 'PATCH',
                        },
                        {
                            name: 'POST',
                            value: 'POST',
                        },
                        {
                            name: 'PUT',
                            value: 'PUT',
                        },
                    ],
                    default: 'GET',
                    description: 'The HTTP method to listen to',
                },
                {
                    displayName: 'Path',
                    name: 'path',
                    type: 'string',
                    default: '',
                    placeholder: 'webhook',
                    required: true,
                    description: 'The path to listen to',
                },
                {
                    displayName: 'Respond',
                    name: 'responseMode',
                    type: 'options',
                    options: [
                        {
                            name: 'Immediately',
                            value: 'onReceived',
                            description: 'As soon as this node executes',
                        },
                        {
                            name: 'When Last Node Finishes',
                            value: 'lastNode',
                            description: 'Returns data of the last-executed node',
                        },
                        {
                            name: 'Using \'Respond to Webhook\' Node',
                            value: 'responseNode',
                            description: 'Response defined in that node',
                        },
                    ],
                    default: 'onReceived',
                    description: 'When and how to respond to the webhook',
                },
                {
                    displayName: 'Insert a \'Respond to Webhook\' node to control when and how you respond. <a href="https://docs.n8n.io/nodes/n8n-nodes-base.respondToWebhook" target="_blank">More details</a>',
                    name: 'webhookNotice',
                    type: 'notice',
                    displayOptions: {
                        show: {
                            responseMode: [
                                'responseNode',
                            ],
                        },
                    },
                    default: '',
                },
                {
                    displayName: 'Response Code',
                    name: 'responseCode',
                    type: 'number',
                    displayOptions: {
                        hide: {
                            responseMode: [
                                'responseNode',
                            ],
                        },
                    },
                    typeOptions: {
                        minValue: 100,
                        maxValue: 599,
                    },
                    default: 200,
                    description: 'The HTTP Response code to return',
                },
                {
                    displayName: 'Response Data',
                    name: 'responseData',
                    type: 'options',
                    displayOptions: {
                        show: {
                            responseMode: [
                                'lastNode',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'All Entries',
                            value: 'allEntries',
                            description: 'Returns all the entries of the last node. Always returns an array.',
                        },
                        {
                            name: 'First Entry JSON',
                            value: 'firstEntryJson',
                            description: 'Returns the JSON data of the first entry of the last node. Always returns a JSON object.',
                        },
                        {
                            name: 'First Entry Binary',
                            value: 'firstEntryBinary',
                            description: 'Returns the binary data of the first entry of the last node. Always returns a binary file.',
                        },
                        {
                            name: 'No Response Body',
                            value: 'noData',
                            description: 'Returns without a body',
                        },
                    ],
                    default: 'firstEntryJson',
                    description: 'What data should be returned. If it should return all items as an array or only the first item as object.',
                },
                {
                    displayName: 'Property Name',
                    name: 'responseBinaryPropertyName',
                    type: 'string',
                    required: true,
                    default: 'data',
                    displayOptions: {
                        show: {
                            responseData: [
                                'firstEntryBinary',
                            ],
                        },
                    },
                    description: 'Name of the binary property to return',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Binary Data',
                            name: 'binaryData',
                            type: 'boolean',
                            displayOptions: {
                                show: {
                                    '/httpMethod': [
                                        'PATCH',
                                        'PUT',
                                        'POST',
                                    ],
                                },
                            },
                            default: false,
                            description: 'Whether the webhook will receive binary data',
                        },
                        {
                            displayName: 'Binary Property',
                            name: 'binaryPropertyName',
                            type: 'string',
                            default: 'data',
                            required: true,
                            displayOptions: {
                                show: {
                                    binaryData: [
                                        true,
                                    ],
                                },
                            },
                            description: 'Name of the binary property to write the data of the received file to. If the data gets received via "Form-Data Multipart" it will be the prefix and a number starting with 0 will be attached to it.',
                        },
                        {
                            displayName: 'Ignore Bots',
                            name: 'ignoreBots',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to ignore requests from bots like link previewers and web crawlers',
                        },
                        {
                            displayName: 'No Response Body',
                            name: 'noResponseBody',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to send any body in the response',
                            displayOptions: {
                                hide: {
                                    'rawBody': [
                                        true,
                                    ],
                                },
                                show: {
                                    '/responseMode': [
                                        'onReceived',
                                    ],
                                },
                            },
                        },
                        {
                            displayName: 'Raw Body',
                            name: 'rawBody',
                            type: 'boolean',
                            displayOptions: {
                                hide: {
                                    binaryData: [
                                        true,
                                    ],
                                    'noResponseBody': [
                                        true,
                                    ],
                                },
                            },
                            default: false,
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                            description: 'Raw body (binary)',
                        },
                        {
                            displayName: 'Response Data',
                            name: 'responseData',
                            type: 'string',
                            displayOptions: {
                                show: {
                                    '/responseMode': [
                                        'onReceived',
                                    ],
                                },
                                hide: {
                                    'noResponseBody': [
                                        true,
                                    ],
                                },
                            },
                            default: '',
                            placeholder: 'success',
                            description: 'Custom response data to send',
                        },
                        {
                            displayName: 'Response Content-Type',
                            name: 'responseContentType',
                            type: 'string',
                            displayOptions: {
                                show: {
                                    '/responseData': [
                                        'firstEntryJson',
                                    ],
                                    '/responseMode': [
                                        'lastNode',
                                    ],
                                },
                            },
                            default: '',
                            placeholder: 'application/xml',
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-json
                            description: 'Set a custom content-type to return if another one as the "application/json" should be returned',
                        },
                        {
                            displayName: 'Response Headers',
                            name: 'responseHeaders',
                            placeholder: 'Add Response Header',
                            description: 'Add headers to the webhook response',
                            type: 'fixedCollection',
                            typeOptions: {
                                multipleValues: true,
                            },
                            default: {},
                            options: [
                                {
                                    name: 'entries',
                                    displayName: 'Entries',
                                    values: [
                                        {
                                            displayName: 'Name',
                                            name: 'name',
                                            type: 'string',
                                            default: '',
                                            description: 'Name of the header',
                                        },
                                        {
                                            displayName: 'Value',
                                            name: 'value',
                                            type: 'string',
                                            default: '',
                                            description: 'Value of the header',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            displayName: 'Property Name',
                            name: 'responsePropertyName',
                            type: 'string',
                            displayOptions: {
                                show: {
                                    '/responseData': [
                                        'firstEntryJson',
                                    ],
                                    '/responseMode': [
                                        'lastNode',
                                    ],
                                },
                            },
                            default: 'data',
                            description: 'Name of the property to return the data of instead of the whole JSON',
                        },
                    ],
                },
            ],
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const authentication = this.getNodeParameter('authentication');
            const options = this.getNodeParameter('options', {});
            const req = this.getRequestObject();
            const resp = this.getResponseObject();
            const headers = this.getHeaderData();
            const realm = 'Webhook';
            const ignoreBots = options.ignoreBots;
            if (ignoreBots && (0, isbot_1.default)(headers['user-agent'])) {
                return authorizationError(resp, realm, 403);
            }
            if (authentication === 'basicAuth') {
                // Basic authorization is needed to call webhook
                let httpBasicAuth;
                try {
                    httpBasicAuth = yield this.getCredentials('httpBasicAuth');
                }
                catch (error) {
                    // Do nothing
                }
                if (httpBasicAuth === undefined || !httpBasicAuth.user || !httpBasicAuth.password) {
                    // Data is not defined on node so can not authenticate
                    return authorizationError(resp, realm, 500, 'No authentication data defined on node!');
                }
                const basicAuthData = (0, basic_auth_1.default)(req);
                if (basicAuthData === undefined) {
                    // Authorization data is missing
                    return authorizationError(resp, realm, 401);
                }
                if (basicAuthData.name !== httpBasicAuth.user || basicAuthData.pass !== httpBasicAuth.password) {
                    // Provided authentication data is wrong
                    return authorizationError(resp, realm, 403);
                }
            }
            else if (authentication === 'headerAuth') {
                // Special header with value is needed to call webhook
                let httpHeaderAuth;
                try {
                    httpHeaderAuth = yield this.getCredentials('httpHeaderAuth');
                }
                catch (error) {
                    // Do nothing
                }
                if (httpHeaderAuth === undefined || !httpHeaderAuth.name || !httpHeaderAuth.value) {
                    // Data is not defined on node so can not authenticate
                    return authorizationError(resp, realm, 500, 'No authentication data defined on node!');
                }
                const headerName = httpHeaderAuth.name.toLowerCase();
                const headerValue = httpHeaderAuth.value;
                if (!headers.hasOwnProperty(headerName) || headers[headerName] !== headerValue) {
                    // Provided authentication data is wrong
                    return authorizationError(resp, realm, 403);
                }
            }
            // @ts-ignore
            const mimeType = headers['content-type'] || 'application/json';
            if (mimeType.includes('multipart/form-data')) {
                // @ts-ignore
                const form = new formidable_1.default.IncomingForm({ multiples: true });
                return new Promise((resolve, reject) => {
                    form.parse(req, (err, data, files) => __awaiter(this, void 0, void 0, function* () {
                        const returnItem = {
                            binary: {},
                            json: {
                                headers,
                                params: this.getParamsData(),
                                query: this.getQueryData(),
                                body: data,
                            },
                        };
                        let count = 0;
                        for (const xfile of Object.keys(files)) {
                            const processFiles = [];
                            let multiFile = false;
                            if (Array.isArray(files[xfile])) {
                                processFiles.push(...files[xfile]);
                                multiFile = true;
                            }
                            else {
                                processFiles.push(files[xfile]);
                            }
                            let fileCount = 0;
                            for (const file of processFiles) {
                                let binaryPropertyName = xfile;
                                if (binaryPropertyName.endsWith('[]')) {
                                    binaryPropertyName = binaryPropertyName.slice(0, -2);
                                }
                                if (multiFile === true) {
                                    binaryPropertyName += fileCount++;
                                }
                                if (options.binaryPropertyName) {
                                    binaryPropertyName = `${options.binaryPropertyName}${count}`;
                                }
                                const fileJson = file.toJSON();
                                const fileContent = yield fs_1.default.promises.readFile(file.path);
                                returnItem.binary[binaryPropertyName] = yield this.helpers.prepareBinaryData(Buffer.from(fileContent), fileJson.name, fileJson.type);
                                count += 1;
                            }
                        }
                        resolve({
                            workflowData: [
                                [
                                    returnItem,
                                ],
                            ],
                        });
                    }));
                });
            }
            if (options.binaryData === true) {
                return new Promise((resolve, reject) => {
                    const binaryPropertyName = options.binaryPropertyName || 'data';
                    const data = [];
                    req.on('data', (chunk) => {
                        data.push(chunk);
                    });
                    req.on('end', () => __awaiter(this, void 0, void 0, function* () {
                        const returnItem = {
                            binary: {},
                            json: {
                                headers,
                                params: this.getParamsData(),
                                query: this.getQueryData(),
                                body: this.getBodyData(),
                            },
                        };
                        returnItem.binary[binaryPropertyName] = yield this.helpers.prepareBinaryData(Buffer.concat(data));
                        return resolve({
                            workflowData: [
                                [
                                    returnItem,
                                ],
                            ],
                        });
                    }));
                    req.on('error', (error) => {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
                    });
                });
            }
            const response = {
                json: {
                    headers,
                    params: this.getParamsData(),
                    query: this.getQueryData(),
                    body: this.getBodyData(),
                },
            };
            if (options.rawBody) {
                response.binary = {
                    data: {
                        // @ts-ignore
                        data: req.rawBody.toString(n8n_core_1.BINARY_ENCODING),
                        mimeType,
                    },
                };
            }
            let webhookResponse;
            if (options.responseData) {
                webhookResponse = options.responseData;
            }
            return {
                webhookResponse,
                workflowData: [
                    [
                        response,
                    ],
                ],
            };
        });
    }
}
exports.Webhook = Webhook;
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
exports.GraphQL = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class GraphQL {
    constructor() {
        this.description = {
            displayName: 'GraphQL',
            name: 'graphql',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:graphql.png',
            group: ['input'],
            version: 1,
            description: 'Makes a GraphQL request and returns the received data',
            defaults: {
                name: 'GraphQL',
            },
            inputs: ['main'],
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
                    name: 'httpDigestAuth',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'digestAuth',
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
                {
                    name: 'httpQueryAuth',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'queryAuth',
                            ],
                        },
                    },
                },
                {
                    name: 'oAuth1Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth1',
                            ],
                        },
                    },
                },
                {
                    name: 'oAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
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
                            name: 'Digest Auth',
                            value: 'digestAuth',
                        },
                        {
                            name: 'Header Auth',
                            value: 'headerAuth',
                        },
                        {
                            name: 'None',
                            value: 'none',
                        },
                        {
                            name: 'OAuth1',
                            value: 'oAuth1',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                        {
                            name: 'Query Auth',
                            value: 'queryAuth',
                        },
                    ],
                    default: 'none',
                    description: 'The way to authenticate',
                },
                {
                    displayName: 'HTTP Request Method',
                    name: 'requestMethod',
                    type: 'options',
                    options: [
                        {
                            name: 'GET',
                            value: 'GET',
                        },
                        {
                            name: 'POST',
                            value: 'POST',
                        },
                    ],
                    default: 'POST',
                    description: 'The underlying HTTP request method to use',
                },
                {
                    displayName: 'Endpoint',
                    name: 'endpoint',
                    type: 'string',
                    default: '',
                    placeholder: 'http://example.com/graphql',
                    description: 'The GraphQL endpoint',
                    required: true,
                },
                {
                    displayName: 'Ignore SSL Issues',
                    name: 'allowUnauthorizedCerts',
                    type: 'boolean',
                    default: false,
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-ignore-ssl-issues
                    description: 'Whether to download the response even if SSL certificate validation is not possible',
                },
                {
                    displayName: 'Request Format',
                    name: 'requestFormat',
                    type: 'options',
                    required: true,
                    options: [
                        {
                            name: 'GraphQL (Raw)',
                            value: 'graphql',
                        },
                        {
                            name: 'JSON',
                            value: 'json',
                        },
                    ],
                    displayOptions: {
                        show: {
                            requestMethod: [
                                'POST',
                            ],
                        },
                    },
                    default: 'graphql',
                    description: 'The format for the query payload',
                },
                {
                    displayName: 'Query',
                    name: 'query',
                    type: 'json',
                    default: '',
                    description: 'GraphQL query',
                    required: true,
                },
                {
                    displayName: 'Variables',
                    name: 'variables',
                    type: 'json',
                    default: '',
                    description: 'Query variables',
                    displayOptions: {
                        show: {
                            requestFormat: [
                                'json',
                            ],
                            requestMethod: [
                                'POST',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Operation Name',
                    name: 'operationName',
                    type: 'string',
                    default: '',
                    description: 'Name of operation to execute',
                    displayOptions: {
                        show: {
                            requestFormat: [
                                'json',
                            ],
                            requestMethod: [
                                'POST',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Response Format',
                    name: 'responseFormat',
                    type: 'options',
                    options: [
                        {
                            name: 'JSON',
                            value: 'json',
                        },
                        {
                            name: 'String',
                            value: 'string',
                        },
                    ],
                    default: 'json',
                    description: 'The format in which the data gets returned from the URL',
                },
                {
                    displayName: 'Response Data Property Name',
                    name: 'dataPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: {
                        show: {
                            responseFormat: [
                                'string',
                            ],
                        },
                    },
                    description: 'Name of the property to which to write the response data',
                },
                // Header Parameters
                {
                    displayName: 'Headers',
                    name: 'headerParametersUi',
                    placeholder: 'Add Header',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    description: 'The headers to send',
                    default: {},
                    options: [
                        {
                            name: 'parameter',
                            displayName: 'Header',
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
                                    description: 'Value to set for the header',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            let httpBasicAuth;
            let httpDigestAuth;
            let httpHeaderAuth;
            let httpQueryAuth;
            let oAuth1Api;
            let oAuth2Api;
            try {
                httpBasicAuth = yield this.getCredentials('httpBasicAuth');
            }
            catch (error) {
                // Do nothing
            }
            try {
                httpDigestAuth = yield this.getCredentials('httpDigestAuth');
            }
            catch (error) {
                // Do nothing
            }
            try {
                httpHeaderAuth = yield this.getCredentials('httpHeaderAuth');
            }
            catch (error) {
                // Do nothing
            }
            try {
                httpQueryAuth = yield this.getCredentials('httpQueryAuth');
            }
            catch (error) {
                // Do nothing
            }
            try {
                oAuth1Api = yield this.getCredentials('oAuth1Api');
            }
            catch (error) {
                // Do nothing
            }
            try {
                oAuth2Api = yield this.getCredentials('oAuth2Api');
            }
            catch (error) {
                // Do nothing
            }
            let requestOptions;
            const returnItems = [];
            for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                try {
                    const requestMethod = this.getNodeParameter('requestMethod', itemIndex, 'POST');
                    const endpoint = this.getNodeParameter('endpoint', itemIndex, '');
                    const requestFormat = this.getNodeParameter('requestFormat', itemIndex, 'graphql');
                    const responseFormat = this.getNodeParameter('responseFormat', 0);
                    const { parameter } = this
                        .getNodeParameter('headerParametersUi', itemIndex, {});
                    const headerParameters = (parameter || []).reduce((result, item) => (Object.assign(Object.assign({}, result), { [item.name]: item.value })), {});
                    requestOptions = {
                        headers: Object.assign({ 'content-type': `application/${requestFormat}` }, headerParameters),
                        method: requestMethod,
                        uri: endpoint,
                        simple: false,
                        rejectUnauthorized: !this.getNodeParameter('allowUnauthorizedCerts', itemIndex, false),
                    };
                    // Add credentials if any are set
                    if (httpBasicAuth !== undefined) {
                        requestOptions.auth = {
                            user: httpBasicAuth.user,
                            pass: httpBasicAuth.password,
                        };
                    }
                    if (httpHeaderAuth !== undefined) {
                        requestOptions.headers[httpHeaderAuth.name] = httpHeaderAuth.value;
                    }
                    if (httpQueryAuth !== undefined) {
                        if (!requestOptions.qs) {
                            requestOptions.qs = {};
                        }
                        requestOptions.qs[httpQueryAuth.name] = httpQueryAuth.value;
                    }
                    if (httpDigestAuth !== undefined) {
                        requestOptions.auth = {
                            user: httpDigestAuth.user,
                            pass: httpDigestAuth.password,
                            sendImmediately: false,
                        };
                    }
                    const gqlQuery = this.getNodeParameter('query', itemIndex, '');
                    if (requestMethod === 'GET') {
                        if (!requestOptions.qs) {
                            requestOptions.qs = {};
                        }
                        requestOptions.qs.query = gqlQuery;
                    }
                    else {
                        if (requestFormat === 'json') {
                            requestOptions.body = {
                                query: gqlQuery,
                                variables: this.getNodeParameter('variables', itemIndex, {}),
                                operationName: this.getNodeParameter('operationName', itemIndex),
                            };
                            if (typeof requestOptions.body.variables === 'string') {
                                try {
                                    requestOptions.body.variables = JSON.parse(requestOptions.body.variables || '{}');
                                }
                                catch (error) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Using variables failed:\n' + requestOptions.body.variables + '\n\nWith error message:\n' + error);
                                }
                            }
                            if (requestOptions.body.operationName === '') {
                                requestOptions.body.operationName = null;
                            }
                            requestOptions.json = true;
                        }
                        else {
                            requestOptions.body = gqlQuery;
                        }
                    }
                    let response;
                    // Now that the options are all set make the actual http request
                    if (oAuth1Api !== undefined) {
                        response = yield this.helpers.requestOAuth1.call(this, 'oAuth1Api', requestOptions);
                    }
                    else if (oAuth2Api !== undefined) {
                        response = yield this.helpers.requestOAuth2.call(this, 'oAuth2Api', requestOptions, { tokenType: 'Bearer' });
                    }
                    else {
                        response = yield this.helpers.request(requestOptions);
                    }
                    if (responseFormat === 'string') {
                        const dataPropertyName = this.getNodeParameter('dataPropertyName', 0);
                        returnItems.push({
                            json: {
                                [dataPropertyName]: response,
                            },
                        });
                    }
                    else {
                        if (typeof response === 'string') {
                            try {
                                response = JSON.parse(response);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Response body is not valid JSON. Change "Response Format" to "String"');
                            }
                        }
                        if (response.errors) {
                            const message = ((_a = response.errors) === null || _a === void 0 ? void 0 : _a.map((error) => error.message).join(', ')) || 'Unexpected error';
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), response.errors, { message });
                        }
                        returnItems.push({ json: response });
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnItems.push({ json: { error: error.message } });
                        continue;
                    }
                    throw error;
                }
            }
            return this.prepareOutputData(returnItems);
        });
    }
}
exports.GraphQL = GraphQL;

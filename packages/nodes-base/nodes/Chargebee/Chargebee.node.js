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
exports.Chargebee = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Chargebee {
    constructor() {
        this.description = {
            displayName: 'Chargebee',
            name: 'chargebee',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:chargebee.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Retrieve data from Chargebee API',
            defaults: {
                name: 'Chargebee',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'chargebeeApi',
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
                            name: 'Customer',
                            value: 'customer',
                        },
                        {
                            name: 'Invoice',
                            value: 'invoice',
                        },
                        {
                            name: 'Subscription',
                            value: 'subscription',
                        },
                    ],
                    default: 'invoice',
                },
                // ----------------------------------
                //         customer
                // ----------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'customer',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a customer',
                        },
                    ],
                    default: 'create',
                },
                // ----------------------------------
                //         customer:create
                // ----------------------------------
                {
                    displayName: 'Properties',
                    name: 'properties',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                            resource: [
                                'customer',
                            ],
                        },
                    },
                    default: {},
                    description: 'Properties to set on the new user',
                    placeholder: 'Add Property',
                    options: [
                        {
                            displayName: 'User ID',
                            name: 'id',
                            type: 'string',
                            default: '',
                            description: 'ID for the new customer. If not given, this will be auto-generated.',
                        },
                        {
                            displayName: 'First Name',
                            name: 'first_name',
                            type: 'string',
                            default: '',
                            description: 'The first name of the customer',
                        },
                        {
                            displayName: 'Last Name',
                            name: 'last_name',
                            type: 'string',
                            default: '',
                            description: 'The last name of the customer',
                        },
                        {
                            displayName: 'Email',
                            name: 'email',
                            type: 'string',
                            placeholder: 'name@email.com',
                            default: '',
                            description: 'The email address of the customer',
                        },
                        {
                            displayName: 'Phone',
                            name: 'phone',
                            type: 'string',
                            default: '',
                            description: 'The phone number of the customer',
                        },
                        {
                            displayName: 'Company',
                            name: 'company',
                            type: 'string',
                            default: '',
                            description: 'The company of the customer',
                        },
                        {
                            displayName: 'Custom Properties',
                            name: 'customProperties',
                            placeholder: 'Add Custom Property',
                            description: 'Adds a custom property to set also values which have not been predefined',
                            type: 'fixedCollection',
                            typeOptions: {
                                multipleValues: true,
                            },
                            default: {},
                            options: [
                                {
                                    name: 'property',
                                    displayName: 'Property',
                                    values: [
                                        {
                                            displayName: 'Property Name',
                                            name: 'name',
                                            type: 'string',
                                            default: '',
                                            description: 'Name of the property to set',
                                        },
                                        {
                                            displayName: 'Property Value',
                                            name: 'value',
                                            type: 'string',
                                            default: '',
                                            description: 'Value of the property to set',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                // ----------------------------------
                //         invoice
                // ----------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    default: 'list',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'invoice',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'List',
                            value: 'list',
                            description: 'Return the invoices',
                        },
                        {
                            name: 'PDF Invoice URL',
                            value: 'pdfUrl',
                            description: 'Get URL for the invoice PDF',
                        },
                    ],
                },
                // ----------------------------------
                //         invoice:list
                // ----------------------------------
                {
                    displayName: 'Max Results',
                    name: 'maxResults',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                        maxValue: 100,
                    },
                    default: 10,
                    displayOptions: {
                        show: {
                            operation: [
                                'list',
                            ],
                            resource: [
                                'invoice',
                            ],
                        },
                    },
                    description: 'Max. amount of results to return(< 100).',
                },
                {
                    displayName: 'Filters',
                    name: 'filters',
                    placeholder: 'Add Filter',
                    description: 'Filter for invoices',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    default: {},
                    displayOptions: {
                        show: {
                            operation: [
                                'list',
                            ],
                            resource: [
                                'invoice',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'date',
                            displayName: 'Invoice Date',
                            values: [
                                {
                                    displayName: 'Operation',
                                    name: 'operation',
                                    type: 'options',
                                    noDataExpression: true,
                                    options: [
                                        {
                                            name: 'Is',
                                            value: 'is',
                                        },
                                        {
                                            name: 'Is Not',
                                            value: 'is_not',
                                        },
                                        {
                                            name: 'After',
                                            value: 'after',
                                        },
                                        {
                                            name: 'Before',
                                            value: 'before',
                                        },
                                    ],
                                    default: 'after',
                                    description: 'Operation to decide where the the data should be mapped to',
                                },
                                {
                                    displayName: 'Date',
                                    name: 'value',
                                    type: 'dateTime',
                                    default: '',
                                    description: 'Query date',
                                },
                            ],
                        },
                        {
                            name: 'total',
                            displayName: 'Invoice Amount',
                            values: [
                                {
                                    displayName: 'Operation',
                                    name: 'operation',
                                    type: 'options',
                                    noDataExpression: true,
                                    options: [
                                        {
                                            name: 'Greater Equal Than',
                                            value: 'gte',
                                        },
                                        {
                                            name: 'Greater Than',
                                            value: 'gt',
                                        },
                                        {
                                            name: 'Is',
                                            value: 'is',
                                        },
                                        {
                                            name: 'Is Not',
                                            value: 'is_not',
                                        },
                                        {
                                            name: 'Less Equal Than',
                                            value: 'lte',
                                        },
                                        {
                                            name: 'Less Than',
                                            value: 'lt',
                                        },
                                    ],
                                    default: 'gt',
                                    description: 'Operation to decide where the the data should be mapped to',
                                },
                                {
                                    displayName: 'Amount',
                                    name: 'value',
                                    type: 'number',
                                    typeOptions: {
                                        numberPrecision: 2,
                                    },
                                    default: 0,
                                    description: 'Query amount',
                                },
                            ],
                        },
                    ],
                },
                // ----------------------------------
                //         invoice:pdfUrl
                // ----------------------------------
                {
                    displayName: 'Invoice ID',
                    name: 'invoiceId',
                    description: 'The ID of the invoice to get',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'pdfUrl',
                            ],
                            resource: [
                                'invoice',
                            ],
                        },
                    },
                },
                // ----------------------------------
                //         subscription
                // ----------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'subscription',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Cancel',
                            value: 'cancel',
                            description: 'Cancel a subscription',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete a subscription',
                        },
                    ],
                    default: 'delete',
                },
                // ----------------------------------
                //         subscription:cancel
                // ----------------------------------
                {
                    displayName: 'Subscription ID',
                    name: 'subscriptionId',
                    description: 'The ID of the subscription to cancel',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'cancel',
                            ],
                            resource: [
                                'subscription',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Schedule End of Term',
                    name: 'endOfTerm',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            operation: [
                                'cancel',
                            ],
                            resource: [
                                'subscription',
                            ],
                        },
                    },
                    description: 'Whether it will not cancel it directly in will instead schedule the cancelation for the end of the term',
                },
                // ----------------------------------
                //         subscription:delete
                // ----------------------------------
                {
                    displayName: 'Subscription ID',
                    name: 'subscriptionId',
                    description: 'The ID of the subscription to delete',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'delete',
                            ],
                            resource: [
                                'subscription',
                            ],
                        },
                    },
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let item;
            const credentials = yield this.getCredentials('chargebeeApi');
            const baseUrl = `https://${credentials.accountName}.chargebee.com/api/v2`;
            // For Post
            let body;
            // For Query string
            let qs;
            for (let i = 0; i < items.length; i++) {
                try {
                    item = items[i];
                    const resource = this.getNodeParameter('resource', i);
                    const operation = this.getNodeParameter('operation', i);
                    let requestMethod = 'GET';
                    let endpoint = '';
                    body = {};
                    qs = {};
                    if (resource === 'customer') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            const properties = this.getNodeParameter('properties', i, {});
                            for (const key of Object.keys(properties)) {
                                if (key === 'customProperties' && properties.customProperties.property !== undefined) {
                                    for (const customProperty of properties.customProperties.property) {
                                        qs[customProperty.name] = customProperty.value;
                                    }
                                }
                                else {
                                    qs[key] = properties[key];
                                }
                            }
                            endpoint = `customers`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'invoice') {
                        if (operation === 'list') {
                            // ----------------------------------
                            //         list
                            // ----------------------------------
                            endpoint = 'invoices';
                            // TODO: Make also sorting configurable
                            qs['sort_by[desc]'] = 'date';
                            qs.limit = this.getNodeParameter('maxResults', i, {});
                            const setFilters = this.getNodeParameter('filters', i, {});
                            let filter;
                            let value;
                            for (const filterProperty of Object.keys(setFilters)) {
                                for (filter of setFilters[filterProperty]) {
                                    value = filter.value;
                                    if (filterProperty === 'date') {
                                        value = Math.floor(new Date(value).getTime() / 1000);
                                    }
                                    qs[`${filterProperty}[${filter.operation}]`] = value;
                                }
                            }
                        }
                        else if (operation === 'pdfUrl') {
                            // ----------------------------------
                            //         pdfUrl
                            // ----------------------------------
                            requestMethod = 'POST';
                            const invoiceId = this.getNodeParameter('invoiceId', i);
                            endpoint = `invoices/${invoiceId.trim()}/pdf`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'subscription') {
                        if (operation === 'cancel') {
                            // ----------------------------------
                            //         cancel
                            // ----------------------------------
                            requestMethod = 'POST';
                            const subscriptionId = this.getNodeParameter('subscriptionId', i, '');
                            body.end_of_term = this.getNodeParameter('endOfTerm', i, false);
                            endpoint = `subscriptions/${subscriptionId.trim()}/cancel`;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'POST';
                            const subscriptionId = this.getNodeParameter('subscriptionId', i, '');
                            endpoint = `subscriptions/${subscriptionId.trim()}/delete`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                    }
                    const options = {
                        method: requestMethod,
                        body,
                        qs,
                        uri: `${baseUrl}/${endpoint}`,
                        auth: {
                            user: credentials.apiKey,
                            pass: '',
                        },
                        json: true,
                    };
                    let responseData;
                    try {
                        responseData = yield this.helpers.request(options);
                    }
                    catch (error) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                    }
                    if (resource === 'invoice' && operation === 'list') {
                        responseData.list.forEach((data) => {
                            returnData.push(data.invoice);
                        });
                    }
                    else if (resource === 'invoice' && operation === 'pdfUrl') {
                        const data = {};
                        Object.assign(data, items[i].json);
                        data.pdfUrl = responseData.download.download_url;
                        returnData.push(data);
                    }
                    else {
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
exports.Chargebee = Chargebee;

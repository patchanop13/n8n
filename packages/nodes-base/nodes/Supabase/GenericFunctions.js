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
exports.validateCredentials = exports.buildGetQuery = exports.buildOrQuery = exports.buildQuery = exports.getFilters = exports.supabaseApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function supabaseApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('supabaseApi');
        const options = {
            headers: {
                apikey: credentials.serviceRole,
                Authorization: 'Bearer ' + credentials.serviceRole,
                Prefer: 'return=representation',
            },
            method,
            qs,
            body,
            uri: uri || `${credentials.host}/rest/v1${resource}`,
            json: true,
        };
        try {
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            //@ts-ignore
            return yield ((_a = this.helpers) === null || _a === void 0 ? void 0 : _a.request(options));
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.supabaseApiRequest = supabaseApiRequest;
const mapOperations = {
    'create': 'created',
    'update': 'updated',
    'getAll': 'retrieved',
    'delete': 'deleted',
};
function getFilters(resources, operations, { includeNoneOption = true, filterTypeDisplayName = 'Filter', filterFixedCollectionDisplayName = 'Filters', filterStringDisplayName = 'Filters (String)', mustMatchOptions = [
    {
        name: 'Any Filter',
        value: 'anyFilter',
    },
    {
        name: 'All Filters',
        value: 'allFilters',
    },
], }) {
    return [
        {
            displayName: filterTypeDisplayName,
            name: 'filterType',
            type: 'options',
            options: [
                ...(includeNoneOption ? [{ name: 'None', value: 'none' }] : []),
                {
                    name: 'Build Manually',
                    value: 'manual',
                },
                {
                    name: 'String',
                    value: 'string',
                },
            ],
            displayOptions: {
                show: {
                    resource: resources,
                    operation: operations,
                },
            },
            default: 'manual',
        },
        {
            displayName: 'Must Match',
            name: 'matchType',
            type: 'options',
            options: mustMatchOptions,
            displayOptions: {
                show: {
                    resource: resources,
                    operation: operations,
                    filterType: [
                        'manual',
                    ],
                },
            },
            default: 'anyFilter',
        },
        {
            displayName: filterFixedCollectionDisplayName,
            name: 'filters',
            type: 'fixedCollection',
            typeOptions: {
                multipleValues: true,
            },
            displayOptions: {
                show: {
                    resource: resources,
                    operation: operations,
                    filterType: [
                        'manual',
                    ],
                },
            },
            default: {},
            placeholder: 'Add Condition',
            options: [
                {
                    displayName: 'Conditions',
                    name: 'conditions',
                    values: [
                        {
                            displayName: 'Field Name or ID',
                            name: 'keyName',
                            type: 'options',
                            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                            typeOptions: {
                                loadOptionsDependsOn: [
                                    'tableId',
                                ],
                                loadOptionsMethod: 'getTableColumns',
                            },
                            default: '',
                        },
                        {
                            displayName: 'Condition',
                            name: 'condition',
                            type: 'options',
                            options: [
                                {
                                    name: 'Equals',
                                    value: 'eq',
                                },
                                {
                                    name: 'Full-Text',
                                    value: 'fullText',
                                },
                                {
                                    name: 'Greater Than',
                                    value: 'gt',
                                },
                                {
                                    name: 'Greater Than or Equal',
                                    value: 'gte',
                                },
                                {
                                    name: 'ILIKE operator',
                                    value: 'ilike',
                                    description: 'Use * in place of %',
                                },
                                {
                                    name: 'Is',
                                    value: 'is',
                                    description: 'Checking for exact equality (null,true,false,unknown)',
                                },
                                {
                                    name: 'Less Than',
                                    value: 'lt',
                                },
                                {
                                    name: 'Less Than or Equal',
                                    value: 'lte',
                                },
                                {
                                    name: 'LIKE operator',
                                    value: 'like',
                                    description: 'Use * in place of %',
                                },
                                {
                                    name: 'Not Equals',
                                    value: 'neq',
                                },
                            ],
                            default: '',
                        },
                        {
                            displayName: 'Search Function',
                            name: 'searchFunction',
                            type: 'options',
                            displayOptions: {
                                show: {
                                    condition: [
                                        'fullText',
                                    ],
                                },
                            },
                            options: [
                                {
                                    name: 'to_tsquery',
                                    value: 'fts',
                                },
                                {
                                    name: 'plainto_tsquery',
                                    value: 'plfts',
                                },
                                {
                                    name: 'phraseto_tsquery',
                                    value: 'phfts',
                                },
                                {
                                    name: 'websearch_to_tsquery',
                                    value: 'wfts',
                                },
                            ],
                            default: '',
                        },
                        {
                            displayName: 'Field Value',
                            name: 'keyValue',
                            type: 'string',
                            default: '',
                        },
                    ],
                },
            ],
            description: `Filter to decide which rows get ${mapOperations[operations[0]]}`,
        },
        {
            displayName: 'See <a href="https://postgrest.org/en/v9.0/api.html#horizontal-filtering-rows" target="_blank">PostgREST guide</a> to creating filters',
            name: 'jsonNotice',
            type: 'notice',
            displayOptions: {
                show: {
                    resource: resources,
                    operation: operations,
                    filterType: [
                        'string',
                    ],
                },
            },
            default: '',
        },
        {
            displayName: 'Filters (String)',
            name: 'filterString',
            type: 'string',
            typeOptions: {
                alwaysOpenEditWindow: true,
            },
            displayOptions: {
                show: {
                    resource: resources,
                    operation: operations,
                    filterType: [
                        'string',
                    ],
                },
            },
            default: '',
            placeholder: 'name=eq.jhon',
        },
    ];
}
exports.getFilters = getFilters;
const buildQuery = (obj, value) => {
    if (value.condition === 'fullText') {
        return Object.assign(obj, { [`${value.keyName}`]: `${value.searchFunction}.${value.keyValue}` });
    }
    return Object.assign(obj, { [`${value.keyName}`]: `${value.condition}.${value.keyValue}` });
};
exports.buildQuery = buildQuery;
const buildOrQuery = (key) => {
    if (key.condition === 'fullText') {
        return `${key.keyName}.${key.searchFunction}.${key.keyValue}`;
    }
    return `${key.keyName}.${key.condition}.${key.keyValue}`;
};
exports.buildOrQuery = buildOrQuery;
const buildGetQuery = (obj, value) => {
    return Object.assign(obj, { [`${value.keyName}`]: `eq.${value.keyValue}` });
};
exports.buildGetQuery = buildGetQuery;
function validateCredentials(decryptedCredentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = decryptedCredentials;
        const { serviceRole } = credentials;
        const options = {
            headers: {
                apikey: serviceRole,
                Authorization: 'Bearer ' + serviceRole,
            },
            method: 'GET',
            uri: `${credentials.host}/rest/v1/`,
            json: true,
        };
        return this.helpers.request(options);
    });
}
exports.validateCredentials = validateCredentials;

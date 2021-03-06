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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Splunk = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
class Splunk {
    constructor() {
        this.description = {
            displayName: 'Splunk',
            name: 'splunk',
            icon: 'file:splunk.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Splunk Enterprise API',
            defaults: {
                name: 'Splunk',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'splunkApi',
                    required: true,
                    testedBy: 'splunkApiTest',
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
                            name: 'Fired Alert',
                            value: 'firedAlert',
                        },
                        {
                            name: 'Search Configuration',
                            value: 'searchConfiguration',
                        },
                        {
                            name: 'Search Job',
                            value: 'searchJob',
                        },
                        {
                            name: 'Search Result',
                            value: 'searchResult',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'searchJob',
                },
                ...descriptions_1.firedAlertOperations,
                ...descriptions_1.searchConfigurationOperations,
                ...descriptions_1.searchConfigurationFields,
                ...descriptions_1.searchJobOperations,
                ...descriptions_1.searchJobFields,
                ...descriptions_1.searchResultOperations,
                ...descriptions_1.searchResultFields,
                ...descriptions_1.userOperations,
                ...descriptions_1.userFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getRoles() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const endpoint = '/services/authorization/roles';
                        const responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint);
                        const { entry: entries } = responseData.feed;
                        return Array.isArray(entries)
                            ? entries.map(entry => ({ name: entry.title, value: entry.title }))
                            : [{ name: entries.title, value: entries.title }];
                    });
                },
            },
            credentialTest: {
                splunkApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { authToken, baseUrl, allowUnauthorizedCerts, } = credential.data;
                        const endpoint = '/services/alerts/fired_alerts';
                        const options = {
                            headers: {
                                'Authorization': `Bearer ${authToken}`,
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            method: 'GET',
                            form: {},
                            qs: {},
                            uri: `${baseUrl}${endpoint}`,
                            json: true,
                            rejectUnauthorized: !allowUnauthorizedCerts,
                        };
                        try {
                            yield this.helpers.request(options);
                            return {
                                status: 'OK',
                                message: 'Authentication successful',
                            };
                        }
                        catch (error) {
                            return {
                                status: 'Error',
                                message: error.message,
                            };
                        }
                    });
                },
            },
        };
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'firedAlert') {
                        // **********************************************************************
                        //                               firedAlert
                        // **********************************************************************
                        if (operation === 'getReport') {
                            // ----------------------------------------
                            //            firedAlert: getReport
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTsearch#alerts.2Ffired_alerts
                            const endpoint = '/services/alerts/fired_alerts';
                            responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint).then(GenericFunctions_1.formatFeed);
                        }
                    }
                    else if (resource === 'searchConfiguration') {
                        // **********************************************************************
                        //                          searchConfiguration
                        // **********************************************************************
                        if (operation === 'delete') {
                            // ----------------------------------------
                            //       searchConfiguration: delete
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#saved.2Fsearches.2F.7Bname.7D
                            const partialEndpoint = '/services/saved/searches/';
                            const searchConfigurationId = GenericFunctions_1.getId.call(this, i, 'searchConfigurationId', '/search/saved/searches/'); // id endpoint differs from operation endpoint
                            const endpoint = `${partialEndpoint}/${searchConfigurationId}`;
                            responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //         searchConfiguration: get
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#saved.2Fsearches.2F.7Bname.7D
                            const partialEndpoint = '/services/saved/searches/';
                            const searchConfigurationId = GenericFunctions_1.getId.call(this, i, 'searchConfigurationId', '/search/saved/searches/'); // id endpoint differs from operation endpoint
                            const endpoint = `${partialEndpoint}/${searchConfigurationId}`;
                            responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint).then(GenericFunctions_1.formatFeed);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //       searchConfiguration: getAll
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#saved.2Fsearches
                            const qs = {};
                            const options = this.getNodeParameter('options', i);
                            (0, GenericFunctions_1.populate)(options, qs);
                            GenericFunctions_1.setCount.call(this, qs);
                            const endpoint = '/services/saved/searches';
                            responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint, {}, qs).then(GenericFunctions_1.formatFeed);
                        }
                    }
                    else if (resource === 'searchJob') {
                        // **********************************************************************
                        //                               searchJob
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //            searchJob: create
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#search.2Fjobs
                            const body = {
                                search: this.getNodeParameter('search', i),
                            };
                            const _b = this.getNodeParameter('additionalFields', i), { earliest_time, latest_time, index_earliest, index_latest } = _b, rest = __rest(_b, ["earliest_time", "latest_time", "index_earliest", "index_latest"]);
                            (0, GenericFunctions_1.populate)(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, earliest_time && { earliest_time: (0, GenericFunctions_1.toUnixEpoch)(earliest_time) }), latest_time && { latest_time: (0, GenericFunctions_1.toUnixEpoch)(latest_time) }), index_earliest && { index_earliest: (0, GenericFunctions_1.toUnixEpoch)(index_earliest) }), index_latest && { index_latest: (0, GenericFunctions_1.toUnixEpoch)(index_latest) }), rest), body);
                            const endpoint = '/services/search/jobs';
                            responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'POST', endpoint, body);
                            const getEndpoint = `/services/search/jobs/${responseData.response.sid}`;
                            responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'GET', getEndpoint).then(GenericFunctions_1.formatSearch);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //            searchJob: delete
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#search.2Fjobs.2F.7Bsearch_id.7D
                            const partialEndpoint = '/services/search/jobs/';
                            const searchJobId = GenericFunctions_1.getId.call(this, i, 'searchJobId', partialEndpoint);
                            const endpoint = `${partialEndpoint}/${searchJobId}`;
                            responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //              searchJob: get
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#search.2Fjobs.2F.7Bsearch_id.7D
                            const partialEndpoint = '/services/search/jobs/';
                            const searchJobId = GenericFunctions_1.getId.call(this, i, 'searchJobId', partialEndpoint);
                            const endpoint = `${partialEndpoint}/${searchJobId}`;
                            responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint).then(GenericFunctions_1.formatSearch);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            searchJob: getAll
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#search.2Fjobs
                            const qs = {};
                            const options = this.getNodeParameter('options', i);
                            (0, GenericFunctions_1.populate)(options, qs);
                            GenericFunctions_1.setCount.call(this, qs);
                            const endpoint = '/services/search/jobs';
                            responseData = (yield GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint, {}, qs));
                            responseData = (0, GenericFunctions_1.formatFeed)(responseData);
                        }
                    }
                    else if (resource === 'searchResult') {
                        // **********************************************************************
                        //                              searchResult
                        // **********************************************************************
                        if (operation === 'getAll') {
                            // ----------------------------------------
                            //           searchResult: getAll
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTsearch#search.2Fjobs.2F.7Bsearch_id.7D.2Fresults
                            const searchJobId = this.getNodeParameter('searchJobId', i);
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            const options = this.getNodeParameter('options', i);
                            const keyValuePair = (_a = filters === null || filters === void 0 ? void 0 : filters.keyValueMatch) === null || _a === void 0 ? void 0 : _a.keyValuePair;
                            if ((keyValuePair === null || keyValuePair === void 0 ? void 0 : keyValuePair.key) && (keyValuePair === null || keyValuePair === void 0 ? void 0 : keyValuePair.value)) {
                                qs.search = `search ${keyValuePair.key}=${keyValuePair.value}`;
                            }
                            (0, GenericFunctions_1.populate)(options, qs);
                            GenericFunctions_1.setCount.call(this, qs);
                            const endpoint = `/services/search/jobs/${searchJobId}/results`;
                            responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint, {}, qs).then(GenericFunctions_1.formatResults);
                        }
                    }
                    else if (resource === 'user') {
                        // **********************************************************************
                        //                                  user
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //               user: create
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers
                            const roles = this.getNodeParameter('roles', i);
                            const body = {
                                name: this.getNodeParameter('name', i),
                                roles,
                                password: this.getNodeParameter('password', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            (0, GenericFunctions_1.populate)(additionalFields, body);
                            const endpoint = '/services/authentication/users';
                            responseData = (yield GenericFunctions_1.splunkApiRequest.call(this, 'POST', endpoint, body));
                            responseData = (0, GenericFunctions_1.formatFeed)(responseData);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //               user: delete
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers.2F.7Bname.7D
                            const partialEndpoint = '/services/authentication/users';
                            const userId = GenericFunctions_1.getId.call(this, i, 'userId', partialEndpoint);
                            const endpoint = `${partialEndpoint}/${userId}`;
                            yield GenericFunctions_1.splunkApiRequest.call(this, 'DELETE', endpoint);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                user: get
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers.2F.7Bname.7D
                            const partialEndpoint = '/services/authentication/users/';
                            const userId = GenericFunctions_1.getId.call(this, i, 'userId', '/services/authentication/users/');
                            const endpoint = `${partialEndpoint}/${userId}`;
                            responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint).then(GenericFunctions_1.formatFeed);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //               user: getAll
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers
                            const qs = {};
                            GenericFunctions_1.setCount.call(this, qs);
                            const endpoint = '/services/authentication/users';
                            responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint, {}, qs).then(GenericFunctions_1.formatFeed);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //               user: update
                            // ----------------------------------------
                            // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers.2F.7Bname.7D
                            const body = {};
                            const _c = this.getNodeParameter('updateFields', i), { roles } = _c, rest = __rest(_c, ["roles"]);
                            (0, GenericFunctions_1.populate)(Object.assign(Object.assign({}, roles && { roles }), rest), body);
                            const partialEndpoint = '/services/authentication/users/';
                            const userId = GenericFunctions_1.getId.call(this, i, 'userId', partialEndpoint);
                            const endpoint = `${partialEndpoint}/${userId}`;
                            responseData = yield GenericFunctions_1.splunkApiRequest.call(this, 'POST', endpoint, body).then(GenericFunctions_1.formatFeed);
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.cause.error });
                        continue;
                    }
                    throw error;
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Splunk = Splunk;

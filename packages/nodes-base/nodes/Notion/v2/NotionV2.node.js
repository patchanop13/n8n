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
exports.NotionV2 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../GenericFunctions");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const VersionDescription_1 = require("./VersionDescription");
class NotionV2 {
    constructor(baseDescription) {
        this.methods = {
            loadOptions: {
                getDatabases() {
                    var _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const body = {
                            page_size: 100,
                            filter: { property: 'object', value: 'database' },
                        };
                        const databases = yield GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', `/search`, body);
                        for (const database of databases) {
                            returnData.push({
                                name: ((_a = database.title[0]) === null || _a === void 0 ? void 0 : _a.plain_text) || database.id,
                                value: database.id,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
                                return -1;
                            }
                            if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                getDatabaseProperties() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const databaseId = this.getCurrentNodeParameter('databaseId');
                        const { properties } = yield GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
                        for (const key of Object.keys(properties)) {
                            //remove parameters that cannot be set from the API.
                            if (!['created_time', 'last_edited_time', 'created_by', 'last_edited_by', 'formula', 'rollup'].includes(properties[key].type)) {
                                returnData.push({
                                    name: `${key}`,
                                    value: `${key}|${properties[key].type}`,
                                });
                            }
                        }
                        returnData.sort((a, b) => {
                            if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
                                return -1;
                            }
                            if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                getFilterProperties() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const databaseId = this.getCurrentNodeParameter('databaseId');
                        const { properties } = yield GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
                        for (const key of Object.keys(properties)) {
                            returnData.push({
                                name: `${key}`,
                                value: `${key}|${properties[key].type}`,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
                                return -1;
                            }
                            if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                getBlockTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return (0, GenericFunctions_1.getBlockTypes)();
                    });
                },
                getPropertySelectValues() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const [name, type] = this.getCurrentNodeParameter('&key').split('|');
                        const databaseId = this.getCurrentNodeParameter('databaseId');
                        const resource = this.getCurrentNodeParameter('resource');
                        const operation = this.getCurrentNodeParameter('operation');
                        const { properties } = yield GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
                        if (resource === 'databasePage') {
                            if (['multi_select', 'select'].includes(type) && operation === 'getAll') {
                                return (properties[name][type].options)
                                    .map((option) => ({ name: option.name, value: option.name }));
                            }
                            else if (['multi_select', 'select'].includes(type) && ['create', 'update'].includes(operation)) {
                                return (properties[name][type].options)
                                    .map((option) => ({ name: option.name, value: option.name }));
                            }
                        }
                        return (properties[name][type].options).map((option) => ({ name: option.name, value: option.id }));
                    });
                },
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const users = yield GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'GET', '/users');
                        for (const user of users) {
                            if (user.type === 'person') {
                                returnData.push({
                                    name: user.name,
                                    value: user.id,
                                });
                            }
                        }
                        return returnData;
                    });
                },
                getDatabaseIdFromPage() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const pageId = (0, GenericFunctions_1.extractPageId)(this.getCurrentNodeParameter('pageId'));
                        const { parent: { database_id: databaseId } } = yield GenericFunctions_1.notionApiRequest.call(this, 'GET', `/pages/${pageId}`);
                        const { properties } = yield GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
                        for (const key of Object.keys(properties)) {
                            //remove parameters that cannot be set from the API.
                            if (!['created_time', 'last_edited_time', 'created_by', 'last_edited_by', 'formula', 'rollup'].includes(properties[key].type)) {
                                returnData.push({
                                    name: `${key}`,
                                    value: `${key}|${properties[key].type}`,
                                });
                            }
                        }
                        returnData.sort((a, b) => {
                            if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
                                return -1;
                            }
                            if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                getDatabaseOptionsFromPage() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const pageId = (0, GenericFunctions_1.extractPageId)(this.getCurrentNodeParameter('pageId'));
                        const [name, type] = this.getCurrentNodeParameter('&key').split('|');
                        const { parent: { database_id: databaseId } } = yield GenericFunctions_1.notionApiRequest.call(this, 'GET', `/pages/${pageId}`);
                        const { properties } = yield GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
                        return (properties[name][type].options).map((option) => ({ name: option.name, value: option.name }));
                    });
                },
                // Get all the timezones to display them to user so that he can
                // select them easily
                getTimezones() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        for (const timezone of moment_timezone_1.default.tz.names()) {
                            const timezoneName = timezone;
                            const timezoneId = timezone;
                            returnData.push({
                                name: timezoneName,
                                value: timezoneId,
                            });
                        }
                        returnData.unshift({
                            name: 'Default',
                            value: 'default',
                            description: 'Timezone set in n8n',
                        });
                        return returnData;
                    });
                },
            },
            credentialTest: {
                notionApiCredentialTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield GenericFunctions_1.validateCredentials.call(this, credential.data);
                        }
                        catch (error) {
                            return {
                                status: 'Error',
                                message: 'The security token included in the request is invalid',
                            };
                        }
                        return {
                            status: 'OK',
                            message: 'Connection successful!',
                        };
                    });
                },
            },
        };
        this.description = Object.assign(Object.assign({}, baseDescription), VersionDescription_1.versionDescription);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let responseData;
            const qs = {};
            const timezone = this.getTimezone();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let download = false;
            if (resource === 'block') {
                if (operation === 'append') {
                    for (let i = 0; i < length; i++) {
                        const blockId = (0, GenericFunctions_1.extractPageId)(this.getNodeParameter('blockId', i));
                        const body = {
                            children: (0, GenericFunctions_1.formatBlocks)(this.getNodeParameter('blockUi.blockValues', i, [])),
                        };
                        const block = yield GenericFunctions_1.notionApiRequest.call(this, 'PATCH', `/blocks/${blockId}/children`, body);
                        returnData.push(block);
                    }
                }
                if (operation === 'getAll') {
                    for (let i = 0; i < length; i++) {
                        const blockId = (0, GenericFunctions_1.extractPageId)(this.getNodeParameter('blockId', i));
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'GET', `/blocks/${blockId}/children`, {});
                        }
                        else {
                            qs.page_size = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.notionApiRequest.call(this, 'GET', `/blocks/${blockId}/children`, {}, qs);
                            responseData = responseData.results;
                        }
                        responseData = responseData.map((_data) => (Object.assign({ object: _data.object, parent_id: blockId }, _data)));
                        returnData.push.apply(returnData, responseData);
                    }
                }
            }
            if (resource === 'database') {
                if (operation === 'get') {
                    const simple = this.getNodeParameter('simple', 0);
                    for (let i = 0; i < length; i++) {
                        const databaseId = (0, GenericFunctions_1.extractDatabaseId)(this.getNodeParameter('databaseId', i));
                        responseData = yield GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download)[0];
                        }
                        returnData.push(responseData);
                    }
                }
                if (operation === 'getAll') {
                    const simple = this.getNodeParameter('simple', 0);
                    for (let i = 0; i < length; i++) {
                        const body = {
                            filter: { property: 'object', value: 'database' },
                        };
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', `/search`, body);
                        }
                        else {
                            body['page_size'] = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.notionApiRequest.call(this, 'POST', `/search`, body);
                            responseData = responseData.results;
                        }
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
                if (operation === 'search') {
                    for (let i = 0; i < length; i++) {
                        const text = this.getNodeParameter('text', i);
                        const options = this.getNodeParameter('options', i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const simple = this.getNodeParameter('simple', i);
                        const body = {
                            filter: {
                                property: 'object',
                                value: 'database',
                            },
                        };
                        if (text) {
                            body['query'] = text;
                        }
                        if (options.sort) {
                            const sort = (options.sort || {}).sortValue || {};
                            body['sort'] = sort;
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', '/search', body);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', '/search', body);
                            responseData = responseData.splice(0, qs.limit);
                        }
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
            }
            if (resource === 'databasePage') {
                if (operation === 'create') {
                    const databaseId = this.getNodeParameter('databaseId', 0);
                    const { properties } = yield GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
                    let titleKey = '';
                    for (const key of Object.keys(properties)) {
                        if (properties[key].type === 'title') {
                            titleKey = key;
                        }
                    }
                    for (let i = 0; i < length; i++) {
                        const title = this.getNodeParameter('title', i);
                        const simple = this.getNodeParameter('simple', i);
                        // tslint:disable-next-line: no-any
                        const body = {
                            parent: {},
                            properties: {},
                        };
                        if (title !== '') {
                            body.properties[titleKey] = {
                                title: [
                                    {
                                        text: {
                                            content: title,
                                        },
                                    },
                                ],
                            };
                        }
                        body.parent['database_id'] = this.getNodeParameter('databaseId', i);
                        const properties = this.getNodeParameter('propertiesUi.propertyValues', i, []);
                        if (properties.length !== 0) {
                            body.properties = Object.assign(body.properties, (0, GenericFunctions_1.mapProperties)(properties, timezone, 2));
                        }
                        body.children = (0, GenericFunctions_1.formatBlocks)(this.getNodeParameter('blockUi.blockValues', i, []));
                        responseData = yield GenericFunctions_1.notionApiRequest.call(this, 'POST', '/pages', body);
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData);
                        }
                        returnData.push.apply(returnData, Array.isArray(responseData) ? responseData : [responseData]);
                    }
                }
                if (operation === 'get') {
                    for (let i = 0; i < length; i++) {
                        const pageId = (0, GenericFunctions_1.extractPageId)(this.getNodeParameter('pageId', i));
                        const simple = this.getNodeParameter('simple', i);
                        responseData = yield GenericFunctions_1.notionApiRequest.call(this, 'GET', `/pages/${pageId}`);
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        returnData.push.apply(returnData, Array.isArray(responseData) ? responseData : [responseData]);
                    }
                }
                if (operation === 'getAll') {
                    for (let i = 0; i < length; i++) {
                        download = this.getNodeParameter('options.downloadFiles', 0, false);
                        const simple = this.getNodeParameter('simple', 0);
                        const databaseId = this.getNodeParameter('databaseId', i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const filterType = this.getNodeParameter('filterType', 0);
                        const conditions = this.getNodeParameter('filters.conditions', i, []);
                        const sort = this.getNodeParameter('options.sort.sortValue', i, []);
                        const body = {
                            filter: {},
                        };
                        if (filterType === 'manual') {
                            const matchType = this.getNodeParameter('matchType', 0);
                            if (matchType === 'anyFilter') {
                                Object.assign(body.filter, { or: conditions.map((data) => (0, GenericFunctions_1.mapFilters)([data], timezone)) });
                            }
                            else if (matchType === 'allFilters') {
                                Object.assign(body.filter, { and: conditions.map((data) => (0, GenericFunctions_1.mapFilters)([data], timezone)) });
                            }
                        }
                        else if (filterType === 'json') {
                            const filterJson = this.getNodeParameter('filterJson', i);
                            if ((0, GenericFunctions_1.validateJSON)(filterJson) !== undefined) {
                                body.filter = JSON.parse(filterJson);
                            }
                            else {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'Filters (JSON) must be a valid json' });
                            }
                        }
                        if (!Object.keys(body.filter).length) {
                            delete body.filter;
                        }
                        if (sort) {
                            //@ts-expect-error
                            body['sorts'] = (0, GenericFunctions_1.mapSorting)(sort);
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', `/databases/${databaseId}/query`, body, {});
                        }
                        else {
                            body.page_size = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.notionApiRequest.call(this, 'POST', `/databases/${databaseId}/query`, body, qs);
                            responseData = responseData.results;
                        }
                        if (download === true) {
                            responseData = yield GenericFunctions_1.downloadFiles.call(this, responseData);
                        }
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
                if (operation === 'update') {
                    for (let i = 0; i < length; i++) {
                        const pageId = (0, GenericFunctions_1.extractPageId)(this.getNodeParameter('pageId', i));
                        const simple = this.getNodeParameter('simple', i);
                        const properties = this.getNodeParameter('propertiesUi.propertyValues', i, []);
                        // tslint:disable-next-line: no-any
                        const body = {
                            properties: {},
                        };
                        if (properties.length !== 0) {
                            body.properties = (0, GenericFunctions_1.mapProperties)(properties, timezone, 2);
                        }
                        responseData = yield GenericFunctions_1.notionApiRequest.call(this, 'PATCH', `/pages/${pageId}`, body);
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, false);
                        }
                        returnData.push.apply(returnData, Array.isArray(responseData) ? responseData : [responseData]);
                    }
                }
            }
            if (resource === 'user') {
                if (operation === 'get') {
                    for (let i = 0; i < length; i++) {
                        const userId = this.getNodeParameter('userId', i);
                        responseData = yield GenericFunctions_1.notionApiRequest.call(this, 'GET', `/users/${userId}`);
                        returnData.push(responseData);
                    }
                }
                if (operation === 'getAll') {
                    for (let i = 0; i < length; i++) {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'GET', '/users');
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'GET', '/users');
                            responseData = responseData.splice(0, qs.limit);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
            }
            if (resource === 'page') {
                if (operation === 'archive') {
                    for (let i = 0; i < length; i++) {
                        const pageId = (0, GenericFunctions_1.extractPageId)(this.getNodeParameter('pageId', i));
                        const simple = this.getNodeParameter('simple', i);
                        responseData = yield GenericFunctions_1.notionApiRequest.call(this, 'PATCH', `/pages/${pageId}`, { archived: true });
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        returnData.push.apply(returnData, Array.isArray(responseData) ? responseData : [responseData]);
                    }
                }
                if (operation === 'create') {
                    for (let i = 0; i < length; i++) {
                        const simple = this.getNodeParameter('simple', i);
                        // tslint:disable-next-line: no-any
                        const body = {
                            parent: {},
                            properties: {},
                        };
                        body.parent['page_id'] = (0, GenericFunctions_1.extractPageId)(this.getNodeParameter('pageId', i));
                        body.properties = (0, GenericFunctions_1.formatTitle)(this.getNodeParameter('title', i));
                        body.children = (0, GenericFunctions_1.formatBlocks)(this.getNodeParameter('blockUi.blockValues', i, []));
                        responseData = yield GenericFunctions_1.notionApiRequest.call(this, 'POST', '/pages', body);
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        returnData.push.apply(returnData, Array.isArray(responseData) ? responseData : [responseData]);
                    }
                }
                if (operation === 'search') {
                    for (let i = 0; i < length; i++) {
                        const text = this.getNodeParameter('text', i);
                        const options = this.getNodeParameter('options', i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const simple = this.getNodeParameter('simple', i);
                        const body = {};
                        if (text) {
                            body['query'] = text;
                        }
                        if (options.filter) {
                            const filter = (options.filter || {}).filters || [];
                            body['filter'] = filter;
                        }
                        if (options.sort) {
                            const sort = (options.sort || {}).sortValue || {};
                            body['sort'] = sort;
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', '/search', body);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', '/search', body);
                            responseData = responseData.splice(0, qs.limit);
                        }
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
            }
            if (download === true) {
                return this.prepareOutputData(returnData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.NotionV2 = NotionV2;

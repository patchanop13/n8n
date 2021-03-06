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
exports.TableFieldMapper = exports.toOptions = exports.getFieldNamesAndIds = exports.getJwtToken = exports.baserowApiRequestAllItems = exports.baserowApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make a request to Baserow API.
 */
function baserowApiRequest(method, endpoint, body = {}, qs = {}, jwtToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('baserowApi');
        const options = {
            headers: {
                Authorization: `JWT ${jwtToken}`,
            },
            method,
            body,
            qs,
            uri: `${credentials.host}${endpoint}`,
            json: true,
        };
        if (Object.keys(qs).length === 0) {
            delete options.qs;
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.baserowApiRequest = baserowApiRequest;
/**
 * Get all results from a paginated query to Baserow API.
 */
function baserowApiRequestAllItems(method, endpoint, body, qs = {}, jwtToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        qs.page = 1;
        qs.size = 100;
        const returnAll = this.getNodeParameter('returnAll', 0, false);
        const limit = this.getNodeParameter('limit', 0, 0);
        do {
            responseData = yield baserowApiRequest.call(this, method, endpoint, body, qs, jwtToken);
            returnData.push(...responseData.results);
            if (!returnAll && returnData.length > limit) {
                return returnData.slice(0, limit);
            }
            qs.page += 1;
        } while (responseData.next !== null);
        return returnData;
    });
}
exports.baserowApiRequestAllItems = baserowApiRequestAllItems;
/**
 * Get a JWT token based on Baserow account username and password.
 */
function getJwtToken({ username, password, host }) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method: 'POST',
            body: {
                username,
                password,
            },
            uri: `${host}/api/user/token-auth/`,
            json: true,
        };
        try {
            const { token } = yield this.helpers.request(options);
            return token;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.getJwtToken = getJwtToken;
function getFieldNamesAndIds(tableId, jwtToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = `/api/database/fields/table/${tableId}/`;
        const response = yield baserowApiRequest.call(this, 'GET', endpoint, {}, {}, jwtToken);
        return {
            names: response.map((field) => field.name),
            ids: response.map((field) => `field_${field.id}`),
        };
    });
}
exports.getFieldNamesAndIds = getFieldNamesAndIds;
const toOptions = (items) => items.map(({ name, id }) => ({ name, value: id }));
exports.toOptions = toOptions;
/**
 * Responsible for mapping field IDs `field_n` to names and vice versa.
 */
class TableFieldMapper {
    constructor() {
        this.nameToIdMapping = {};
        this.idToNameMapping = {};
        this.mapIds = true;
    }
    getTableFields(table, jwtToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = `/api/database/fields/table/${table}/`;
            return yield baserowApiRequest.call(this, 'GET', endpoint, {}, {}, jwtToken);
        });
    }
    createMappings(tableFields) {
        this.nameToIdMapping = this.createNameToIdMapping(tableFields);
        this.idToNameMapping = this.createIdToNameMapping(tableFields);
    }
    createIdToNameMapping(responseData) {
        return responseData.reduce((acc, cur) => {
            acc[`field_${cur.id}`] = cur.name;
            return acc;
        }, {});
    }
    createNameToIdMapping(responseData) {
        return responseData.reduce((acc, cur) => {
            acc[cur.name] = `field_${cur.id}`;
            return acc;
        }, {});
    }
    setField(field) {
        var _a;
        return this.mapIds ? field : (_a = this.nameToIdMapping[field]) !== null && _a !== void 0 ? _a : field;
    }
    idsToNames(obj) {
        Object.entries(obj).forEach(([key, value]) => {
            if (this.idToNameMapping[key] !== undefined) {
                delete obj[key];
                obj[this.idToNameMapping[key]] = value;
            }
        });
    }
    namesToIds(obj) {
        Object.entries(obj).forEach(([key, value]) => {
            if (this.nameToIdMapping[key] !== undefined) {
                delete obj[key];
                obj[this.nameToIdMapping[key]] = value;
            }
        });
    }
}
exports.TableFieldMapper = TableFieldMapper;

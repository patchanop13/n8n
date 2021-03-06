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
exports.split = exports.updateAble = exports.dtableSchemaColumns = exports.dtableSchemaIsColumn = exports.rowExport = exports.rowMapKeyToName = exports.rowsFormatColumns = exports.rowFormatColumns = exports.rowsDeleteInternalColumns = exports.rowDeleteInternalColumns = exports.rowsSequence = exports.columnNamesGlob = exports.columnNamesToArray = exports.nameOfPredicate = exports.getDownloadableColumns = exports.getColumns = exports.simplify = exports.resolveBaseUri = exports.getBaseAccessToken = exports.getTableViews = exports.getTableColumns = exports.setableApiRequestAllItems = exports.seaTableApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const Schema_1 = require("./Schema");
function seaTableApiRequest(ctx, method, endpoint, body = {}, qs = {}, url = undefined, option = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('seaTableApi');
        ctx.credentials = credentials;
        yield getBaseAccessToken.call(this, ctx);
        const options = {
            headers: {
                Authorization: `Token ${(_a = ctx === null || ctx === void 0 ? void 0 : ctx.base) === null || _a === void 0 ? void 0 : _a.access_token}`,
            },
            method,
            qs,
            body,
            uri: url || `${resolveBaseUri(ctx)}${endpointCtxExpr(ctx, endpoint)}`,
            json: true,
        };
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        try {
            //@ts-ignore
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.seaTableApiRequest = seaTableApiRequest;
function setableApiRequestAllItems(ctx, propertyName, method, endpoint, body, query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (query === undefined) {
            query = {};
        }
        const segment = Schema_1.schema.rowFetchSegmentLimit;
        query.start = 0;
        query.limit = segment;
        const returnData = [];
        let responseData;
        do {
            responseData = (yield seaTableApiRequest.call(this, ctx, method, endpoint, body, query));
            //@ts-ignore
            returnData.push.apply(returnData, responseData[propertyName]);
            query.start = +query.start + segment;
        } while (responseData && responseData.length > segment - 1);
        return returnData;
    });
}
exports.setableApiRequestAllItems = setableApiRequestAllItems;
function getTableColumns(tableName, ctx = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { metadata: { tables } } = yield seaTableApiRequest.call(this, ctx, 'GET', `/dtable-server/api/v1/dtables/{{dtable_uuid}}/metadata`);
        for (const table of tables) {
            if (table.name === tableName) {
                return table.columns;
            }
        }
        return [];
    });
}
exports.getTableColumns = getTableColumns;
function getTableViews(tableName, ctx = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { views } = yield seaTableApiRequest.call(this, ctx, 'GET', `/dtable-server/api/v1/dtables/{{dtable_uuid}}/views`, {}, { table_name: tableName });
        return views;
    });
}
exports.getTableViews = getTableViews;
function getBaseAccessToken(ctx) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_a = ctx === null || ctx === void 0 ? void 0 : ctx.base) === null || _a === void 0 ? void 0 : _a.access_token) !== undefined) {
            return;
        }
        const options = {
            headers: {
                Authorization: `Token ${(_b = ctx === null || ctx === void 0 ? void 0 : ctx.credentials) === null || _b === void 0 ? void 0 : _b.token}`,
            },
            uri: `${resolveBaseUri(ctx)}/api/v2.1/dtable/app-access-token/`,
            json: true,
        };
        ctx.base = yield this.helpers.request(options);
    });
}
exports.getBaseAccessToken = getBaseAccessToken;
function resolveBaseUri(ctx) {
    var _a, _b;
    return (((_a = ctx === null || ctx === void 0 ? void 0 : ctx.credentials) === null || _a === void 0 ? void 0 : _a.environment) === 'cloudHosted')
        ? 'https://cloud.seatable.io' : userBaseUri((_b = ctx === null || ctx === void 0 ? void 0 : ctx.credentials) === null || _b === void 0 ? void 0 : _b.domain);
}
exports.resolveBaseUri = resolveBaseUri;
function simplify(data, metadata) {
    return data.results.map((row) => {
        for (const key of Object.keys(row)) {
            if (!key.startsWith('_')) {
                row[metadata[key]] = row[key];
                delete row[key];
            }
        }
        return row;
    });
}
exports.simplify = simplify;
function getColumns(data) {
    return data.metadata.reduce((obj, value) => Object.assign(obj, { [`${value.key}`]: value.name }), {});
}
exports.getColumns = getColumns;
function getDownloadableColumns(data) {
    return data.metadata.filter(row => (['image', 'file'].includes(row.type))).map(row => row.name);
}
exports.getDownloadableColumns = getDownloadableColumns;
const uniquePredicate = (current, index, all) => all.indexOf(current) === index;
const nonInternalPredicate = (name) => !Object.keys(Schema_1.schema.internalNames).includes(name);
const namePredicate = (name) => (named) => named.name === name;
const nameOfPredicate = (names) => (name) => names.find(namePredicate(name));
exports.nameOfPredicate = nameOfPredicate;
function columnNamesToArray(columnNames) {
    return columnNames
        ? (0, exports.split)(columnNames)
            .filter(nonInternalPredicate)
            .filter(uniquePredicate)
        : [];
}
exports.columnNamesToArray = columnNamesToArray;
function columnNamesGlob(columnNames, dtableColumns) {
    const buffer = [];
    const names = dtableColumns.map(c => c.name).filter(nonInternalPredicate);
    columnNames.forEach(columnName => {
        if (columnName !== '*') {
            buffer.push(columnName);
            return;
        }
        buffer.push(...names);
    });
    return buffer.filter(uniquePredicate);
}
exports.columnNamesGlob = columnNamesGlob;
/**
 * sequence rows on _seq
 */
function rowsSequence(rows) {
    const l = rows.length;
    if (l) {
        const [first] = rows;
        if (first && first._seq !== undefined) {
            return;
        }
    }
    for (let i = 0; i < l;) {
        rows[i]._seq = ++i;
    }
}
exports.rowsSequence = rowsSequence;
function rowDeleteInternalColumns(row) {
    Object.keys(Schema_1.schema.internalNames).forEach(columnName => delete row[columnName]);
    return row;
}
exports.rowDeleteInternalColumns = rowDeleteInternalColumns;
function rowsDeleteInternalColumns(rows) {
    rows = rows.map(rowDeleteInternalColumns);
}
exports.rowsDeleteInternalColumns = rowsDeleteInternalColumns;
function rowFormatColumn(input) {
    if (null === input || undefined === input) {
        return null;
    }
    if (typeof input === 'boolean' || typeof input === 'number' || typeof input === 'string') {
        return input;
    }
    if (Array.isArray(input) && input.every(i => (typeof i === 'string'))) {
        return input;
    }
    return null;
}
function rowFormatColumns(row, columnNames) {
    const outRow = {};
    columnNames.forEach((c) => (outRow[c] = rowFormatColumn(row[c])));
    return outRow;
}
exports.rowFormatColumns = rowFormatColumns;
function rowsFormatColumns(rows, columnNames) {
    rows = rows.map((row) => rowFormatColumns(row, columnNames));
}
exports.rowsFormatColumns = rowsFormatColumns;
function rowMapKeyToName(row, columns) {
    const mappedRow = {};
    // move internal columns first
    Object.keys(Schema_1.schema.internalNames).forEach((key) => {
        if (row[key]) {
            mappedRow[key] = row[key];
            delete row[key];
        }
    });
    // pick each by its key for name
    Object.keys(row).forEach(key => {
        const column = columns.find(c => c.key === key);
        if (column) {
            mappedRow[column.name] = row[key];
        }
    });
    return mappedRow;
}
exports.rowMapKeyToName = rowMapKeyToName;
function rowExport(row, columns) {
    for (const columnName of Object.keys(columns)) {
        if (!columns.find(namePredicate(columnName))) {
            delete row[columnName];
        }
    }
    return row;
}
exports.rowExport = rowExport;
const dtableSchemaIsColumn = (column) => !!Schema_1.schema.columnTypes[column.type];
exports.dtableSchemaIsColumn = dtableSchemaIsColumn;
const dtableSchemaIsUpdateAbleColumn = (column) => !!Schema_1.schema.columnTypes[column.type] && !Schema_1.schema.nonUpdateAbleColumnTypes[column.type];
const dtableSchemaColumns = (columns) => columns.filter(exports.dtableSchemaIsColumn);
exports.dtableSchemaColumns = dtableSchemaColumns;
const updateAble = (columns) => columns.filter(dtableSchemaIsUpdateAbleColumn);
exports.updateAble = updateAble;
function endpointCtxExpr(ctx, endpoint) {
    var _a, _b;
    const endpointVariables = {};
    endpointVariables.access_token = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.base) === null || _a === void 0 ? void 0 : _a.access_token;
    endpointVariables.dtable_uuid = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.base) === null || _b === void 0 ? void 0 : _b.dtable_uuid;
    return endpoint.replace(/({{ *(access_token|dtable_uuid|server) *}})/g, (match, expr, name) => {
        return endpointVariables[name] || match;
    });
}
const normalize = (subject) => subject ? subject.normalize() : '';
const split = (subject) => normalize(subject)
    .split(/\s*((?:[^\\,]*?(?:\\[\s\S])*)*?)\s*(?:,|$)/)
    .filter(s => s.length)
    .map(s => s.replace(/\\([\s\S])/gm, ($0, $1) => $1));
exports.split = split;
const userBaseUri = (uri) => {
    if (uri === undefined) {
        return uri;
    }
    if (uri.endsWith('/')) {
        return uri.slice(0, -1);
    }
    return uri;
};

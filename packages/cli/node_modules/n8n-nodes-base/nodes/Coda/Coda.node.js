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
exports.Coda = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const TableDescription_1 = require("./TableDescription");
const FormulaDescription_1 = require("./FormulaDescription");
const ControlDescription_1 = require("./ControlDescription");
const ViewDescription_1 = require("./ViewDescription");
class Coda {
    constructor() {
        this.description = {
            displayName: 'Coda',
            name: 'coda',
            icon: 'file:coda.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Coda API',
            defaults: {
                name: 'Coda',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'codaApi',
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
                            name: 'Control',
                            value: 'control',
                            description: 'Controls provide a user-friendly way to input a value that can affect other parts of the doc',
                        },
                        {
                            name: 'Formula',
                            value: 'formula',
                            description: 'Formulas can be great for performing one-off computations',
                        },
                        {
                            name: 'Table',
                            value: 'table',
                            description: 'Access data of tables in documents',
                        },
                        {
                            name: 'View',
                            value: 'view',
                            description: 'Access data of views in documents',
                        },
                    ],
                    default: 'table',
                },
                ...TableDescription_1.tableOperations,
                ...TableDescription_1.tableFields,
                ...FormulaDescription_1.formulaOperations,
                ...FormulaDescription_1.formulaFields,
                ...ControlDescription_1.controlOperations,
                ...ControlDescription_1.controlFields,
                ...ViewDescription_1.viewOperations,
                ...ViewDescription_1.viewFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available docs to display them to user so that he can
                // select them easily
                getDocs() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {};
                        const docs = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', `/docs`, {}, qs);
                        for (const doc of docs) {
                            const docName = doc.name;
                            const docId = doc.id;
                            returnData.push({
                                name: docName,
                                value: docId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available tables to display them to user so that he can
                // select them easily
                getTables() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const docId = this.getCurrentNodeParameter('docId');
                        const tables = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', `/docs/${docId}/tables`, {});
                        for (const table of tables) {
                            const tableName = table.name;
                            const tableId = table.id;
                            returnData.push({
                                name: tableName,
                                value: tableId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available columns to display them to user so that he can
                // select them easily
                getColumns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const docId = this.getCurrentNodeParameter('docId');
                        const tableId = this.getCurrentNodeParameter('tableId');
                        const columns = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', `/docs/${docId}/tables/${tableId}/columns`, {});
                        for (const column of columns) {
                            const columnName = column.name;
                            const columnId = column.id;
                            returnData.push({
                                name: columnName,
                                value: columnId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available views to display them to user so that he can
                // select them easily
                getViews() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const docId = this.getCurrentNodeParameter('docId');
                        const views = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', `/docs/${docId}/tables?tableTypes=view`, {});
                        for (const view of views) {
                            const viewName = view.name;
                            const viewId = view.id;
                            returnData.push({
                                name: viewName,
                                value: viewId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available formulas to display them to user so that he can
                // select them easily
                getFormulas() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const docId = this.getCurrentNodeParameter('docId');
                        const formulas = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', `/docs/${docId}/formulas`, {});
                        for (const formula of formulas) {
                            const formulaName = formula.name;
                            const formulaId = formula.id;
                            returnData.push({
                                name: formulaName,
                                value: formulaId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available view rows to display them to user so that he can
                // select them easily
                getViewRows() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const docId = this.getCurrentNodeParameter('docId');
                        const viewId = this.getCurrentNodeParameter('viewId');
                        const viewRows = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', `/docs/${docId}/tables/${viewId}/rows`, {});
                        for (const viewRow of viewRows) {
                            const viewRowName = viewRow.name;
                            const viewRowId = viewRow.id;
                            returnData.push({
                                name: viewRowName,
                                value: viewRowId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available view columns to display them to user so that he can
                // select them easily
                getViewColumns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const docId = this.getCurrentNodeParameter('docId');
                        const viewId = this.getCurrentNodeParameter('viewId');
                        const viewColumns = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', `/docs/${docId}/tables/${viewId}/columns`, {});
                        for (const viewColumn of viewColumns) {
                            const viewColumnName = viewColumn.name;
                            const viewColumnId = viewColumn.id;
                            returnData.push({
                                name: viewColumnName,
                                value: viewColumnId,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const returnData = [];
            const items = this.getInputData();
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let qs = {};
            if (resource === 'table') {
                // https://coda.io/developers/apis/v1beta1#operation/upsertRows
                if (operation === 'createRow') {
                    try {
                        const sendData = {};
                        for (let i = 0; i < items.length; i++) {
                            qs = {};
                            const docId = this.getNodeParameter('docId', i);
                            const tableId = this.getNodeParameter('tableId', i);
                            const options = this.getNodeParameter('options', i);
                            const endpoint = `/docs/${docId}/tables/${tableId}/rows`;
                            if (options.disableParsing) {
                                qs.disableParsing = options.disableParsing;
                            }
                            const cells = [];
                            cells.length = 0;
                            for (const key of Object.keys(items[i].json)) {
                                cells.push({
                                    column: key,
                                    value: items[i].json[key],
                                });
                            }
                            // Collect all the data for the different docs/tables
                            if (sendData[endpoint] === undefined) {
                                sendData[endpoint] = {
                                    rows: [],
                                    // TODO: This is not perfect as it ignores if qs changes between
                                    //       different items but should be OK for now
                                    qs,
                                };
                            }
                            sendData[endpoint].rows.push({ cells });
                            if (options.keyColumns) {
                                // @ts-ignore
                                sendData[endpoint].keyColumns = options.keyColumns.split(',');
                            }
                        }
                        // Now that all data got collected make all the requests
                        for (const endpoint of Object.keys(sendData)) {
                            yield GenericFunctions_1.codaApiRequest.call(this, 'POST', endpoint, sendData[endpoint], sendData[endpoint].qs);
                        }
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            return [this.helpers.returnJsonArray({ error: error.message })];
                        }
                        throw error;
                    }
                    // Return the incoming data
                    return [items];
                }
                // https://coda.io/developers/apis/v1beta1#operation/getRow
                if (operation === 'getRow') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const docId = this.getNodeParameter('docId', i);
                            const tableId = this.getNodeParameter('tableId', i);
                            const rowId = this.getNodeParameter('rowId', i);
                            const options = this.getNodeParameter('options', i);
                            const endpoint = `/docs/${docId}/tables/${tableId}/rows/${rowId}`;
                            if (options.useColumnNames === false) {
                                qs.useColumnNames = options.useColumnNames;
                            }
                            else {
                                qs.useColumnNames = true;
                            }
                            if (options.valueFormat) {
                                qs.valueFormat = options.valueFormat;
                            }
                            responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'GET', endpoint, {}, qs);
                            if (options.rawData === true) {
                                returnData.push(responseData);
                            }
                            else {
                                returnData.push(Object.assign({ id: responseData.id }, responseData.values));
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
                }
                // https://coda.io/developers/apis/v1beta1#operation/listRows
                if (operation === 'getAllRows') {
                    const docId = this.getNodeParameter('docId', 0);
                    const returnAll = this.getNodeParameter('returnAll', 0);
                    const tableId = this.getNodeParameter('tableId', 0);
                    const options = this.getNodeParameter('options', 0);
                    const endpoint = `/docs/${docId}/tables/${tableId}/rows`;
                    if (options.useColumnNames === false) {
                        qs.useColumnNames = options.useColumnNames;
                    }
                    else {
                        qs.useColumnNames = true;
                    }
                    if (options.valueFormat) {
                        qs.valueFormat = options.valueFormat;
                    }
                    if (options.sortBy) {
                        qs.sortBy = options.sortBy;
                    }
                    if (options.visibleOnly) {
                        qs.visibleOnly = options.visibleOnly;
                    }
                    if (options.query) {
                        qs.query = options.query;
                    }
                    try {
                        if (returnAll === true) {
                            responseData = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', endpoint, {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', 0);
                            responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'GET', endpoint, {}, qs);
                            responseData = responseData.items;
                        }
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            return [this.helpers.returnJsonArray({ error: error.message })];
                        }
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                    }
                    if (options.rawData === true) {
                        return [this.helpers.returnJsonArray(responseData)];
                    }
                    else {
                        for (const item of responseData) {
                            returnData.push(Object.assign({ id: item.id }, item.values));
                        }
                        return [this.helpers.returnJsonArray(returnData)];
                    }
                }
                // https://coda.io/developers/apis/v1beta1#operation/deleteRows
                if (operation === 'deleteRow') {
                    try {
                        const sendData = {};
                        for (let i = 0; i < items.length; i++) {
                            const docId = this.getNodeParameter('docId', i);
                            const tableId = this.getNodeParameter('tableId', i);
                            const rowId = this.getNodeParameter('rowId', i);
                            const endpoint = `/docs/${docId}/tables/${tableId}/rows`;
                            // Collect all the data for the different docs/tables
                            if (sendData[endpoint] === undefined) {
                                sendData[endpoint] = [];
                            }
                            sendData[endpoint].push(rowId);
                        }
                        // Now that all data got collected make all the requests
                        for (const endpoint of Object.keys(sendData)) {
                            yield GenericFunctions_1.codaApiRequest.call(this, 'DELETE', endpoint, { rowIds: sendData[endpoint] }, qs);
                        }
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            return [this.helpers.returnJsonArray({ error: error.message })];
                        }
                        throw error;
                    }
                    // Return the incoming data
                    return [items];
                }
                // https://coda.io/developers/apis/v1beta1#operation/pushButton
                if (operation === 'pushButton') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const docId = this.getNodeParameter('docId', i);
                            const tableId = this.getNodeParameter('tableId', i);
                            const rowId = this.getNodeParameter('rowId', i);
                            const columnId = this.getNodeParameter('columnId', i);
                            const endpoint = `/docs/${docId}/tables/${tableId}/rows/${rowId}/buttons/${columnId}`;
                            responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'POST', endpoint, {});
                            returnData.push(responseData);
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
                }
                //https://coda.io/developers/apis/v1beta1#operation/getColumn
                if (operation === 'getColumn') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const docId = this.getNodeParameter('docId', i);
                            const tableId = this.getNodeParameter('tableId', i);
                            const columnId = this.getNodeParameter('columnId', i);
                            const endpoint = `/docs/${docId}/tables/${tableId}/columns/${columnId}`;
                            responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'GET', endpoint, {});
                            returnData.push(responseData);
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
                }
                //https://coda.io/developers/apis/v1beta1#operation/listColumns
                if (operation === 'getAllColumns') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const docId = this.getNodeParameter('docId', i);
                            const tableId = this.getNodeParameter('tableId', i);
                            const endpoint = `/docs/${docId}/tables/${tableId}/columns`;
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', endpoint, {});
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'GET', endpoint, {}, qs);
                                responseData = responseData.items;
                            }
                            returnData.push.apply(returnData, responseData);
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
                }
            }
            if (resource === 'formula') {
                //https://coda.io/developers/apis/v1beta1#operation/getFormula
                if (operation === 'get') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const docId = this.getNodeParameter('docId', i);
                            const formulaId = this.getNodeParameter('formulaId', i);
                            const endpoint = `/docs/${docId}/formulas/${formulaId}`;
                            responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'GET', endpoint, {});
                            returnData.push(responseData);
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
                }
                //https://coda.io/developers/apis/v1beta1#operation/listFormulas
                if (operation === 'getAll') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const docId = this.getNodeParameter('docId', i);
                            const endpoint = `/docs/${docId}/formulas`;
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', endpoint, {});
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'GET', endpoint, {}, qs);
                                responseData = responseData.items;
                            }
                            returnData.push.apply(returnData, responseData);
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
                }
            }
            if (resource === 'control') {
                //https://coda.io/developers/apis/v1beta1#operation/getControl
                if (operation === 'get') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const docId = this.getNodeParameter('docId', i);
                            const controlId = this.getNodeParameter('controlId', i);
                            const endpoint = `/docs/${docId}/controls/${controlId}`;
                            responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'GET', endpoint, {});
                            returnData.push(responseData);
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
                }
                //https://coda.io/developers/apis/v1beta1#operation/listControls
                if (operation === 'getAll') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const docId = this.getNodeParameter('docId', i);
                            const endpoint = `/docs/${docId}/controls`;
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', endpoint, {});
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'GET', endpoint, {}, qs);
                                responseData = responseData.items;
                            }
                            returnData.push.apply(returnData, responseData);
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
                }
            }
            if (resource === 'view') {
                //https://coda.io/developers/apis/v1beta1#operation/getView
                if (operation === 'get') {
                    for (let i = 0; i < items.length; i++) {
                        const docId = this.getNodeParameter('docId', i);
                        const viewId = this.getNodeParameter('viewId', i);
                        const endpoint = `/docs/${docId}/tables/${viewId}`;
                        responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'GET', endpoint, {});
                        returnData.push(responseData);
                    }
                    return [this.helpers.returnJsonArray(returnData)];
                }
                //https://coda.io/developers/apis/v1beta1#operation/listViews
                if (operation === 'getAll') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const docId = this.getNodeParameter('docId', i);
                            const endpoint = `/docs/${docId}/tables?tableTypes=view`;
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', endpoint, {});
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'GET', endpoint, {}, qs);
                                responseData = responseData.items;
                            }
                            returnData.push.apply(returnData, responseData);
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
                }
                if (operation === 'getAllViewRows') {
                    const docId = this.getNodeParameter('docId', 0);
                    const returnAll = this.getNodeParameter('returnAll', 0);
                    const viewId = this.getNodeParameter('viewId', 0);
                    const options = this.getNodeParameter('options', 0);
                    const endpoint = `/docs/${docId}/tables/${viewId}/rows`;
                    if (options.useColumnNames === false) {
                        qs.useColumnNames = options.useColumnNames;
                    }
                    else {
                        qs.useColumnNames = true;
                    }
                    if (options.valueFormat) {
                        qs.valueFormat = options.valueFormat;
                    }
                    if (options.sortBy) {
                        qs.sortBy = options.sortBy;
                    }
                    if (options.query) {
                        qs.query = options.query;
                    }
                    try {
                        if (returnAll === true) {
                            responseData = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', endpoint, {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', 0);
                            responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'GET', endpoint, {}, qs);
                            responseData = responseData.items;
                        }
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            return [this.helpers.returnJsonArray({ error: error.message })];
                        }
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                    }
                    if (options.rawData === true) {
                        return [this.helpers.returnJsonArray(responseData)];
                    }
                    else {
                        for (const item of responseData) {
                            returnData.push(Object.assign({ id: item.id }, item.values));
                        }
                        return [this.helpers.returnJsonArray(returnData)];
                    }
                }
                //https://coda.io/developers/apis/v1beta1#operation/deleteViewRow
                if (operation === 'deleteViewRow') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const docId = this.getNodeParameter('docId', i);
                            const viewId = this.getNodeParameter('viewId', i);
                            const rowId = this.getNodeParameter('rowId', i);
                            const endpoint = `/docs/${docId}/tables/${viewId}/rows/${rowId}`;
                            responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'DELETE', endpoint);
                            returnData.push.apply(returnData, responseData);
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
                }
                //https://coda.io/developers/apis/v1beta1#operation/pushViewButton
                if (operation === 'pushViewButton') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const docId = this.getNodeParameter('docId', i);
                            const viewId = this.getNodeParameter('viewId', i);
                            const rowId = this.getNodeParameter('rowId', i);
                            const columnId = this.getNodeParameter('columnId', i);
                            const endpoint = `/docs/${docId}/tables/${viewId}/rows/${rowId}/buttons/${columnId}`;
                            responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'POST', endpoint);
                            returnData.push.apply(returnData, responseData);
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
                }
                if (operation === 'getAllViewColumns') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const docId = this.getNodeParameter('docId', i);
                            const viewId = this.getNodeParameter('viewId', i);
                            const endpoint = `/docs/${docId}/tables/${viewId}/columns`;
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.codaApiRequestAllItems.call(this, 'items', 'GET', endpoint, {});
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.codaApiRequest.call(this, 'GET', endpoint, {}, qs);
                                responseData = responseData.items;
                            }
                            returnData.push.apply(returnData, responseData);
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
                }
                //https://coda.io/developers/apis/v1beta1#operation/updateViewRow
                if (operation === 'updateViewRow') {
                    for (let i = 0; i < items.length; i++) {
                        try {
                            qs = {};
                            const docId = this.getNodeParameter('docId', i);
                            const viewId = this.getNodeParameter('viewId', i);
                            const rowId = this.getNodeParameter('rowId', i);
                            const keyName = this.getNodeParameter('keyName', i);
                            const options = this.getNodeParameter('options', i);
                            const body = {};
                            const endpoint = `/docs/${docId}/tables/${viewId}/rows/${rowId}`;
                            if (options.disableParsing) {
                                qs.disableParsing = options.disableParsing;
                            }
                            const cells = [];
                            cells.length = 0;
                            //@ts-ignore
                            for (const key of Object.keys(items[i].json[keyName])) {
                                cells.push({
                                    column: key,
                                    //@ts-ignore
                                    value: items[i].json[keyName][key],
                                });
                            }
                            body.row = {
                                cells,
                            };
                            yield GenericFunctions_1.codaApiRequest.call(this, 'PUT', endpoint, body, qs);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                items[i].json = { error: error.message };
                                continue;
                            }
                            throw error;
                        }
                    }
                    return [items];
                }
            }
            return [];
        });
    }
}
exports.Coda = Coda;

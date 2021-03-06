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
exports.MicrosoftExcel = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const WorkbookDescription_1 = require("./WorkbookDescription");
const WorksheetDescription_1 = require("./WorksheetDescription");
const TableDescription_1 = require("./TableDescription");
class MicrosoftExcel {
    constructor() {
        this.description = {
            displayName: 'Microsoft Excel',
            name: 'microsoftExcel',
            icon: 'file:excel.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Microsoft Excel API',
            defaults: {
                name: 'Microsoft Excel',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'microsoftExcelOAuth2Api',
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
                            name: 'Table',
                            value: 'table',
                            description: 'Represents an Excel table',
                        },
                        {
                            name: 'Workbook',
                            value: 'workbook',
                            description: 'Workbook is the top level object which contains related workbook objects such as worksheets, tables, ranges, etc',
                        },
                        {
                            name: 'Worksheet',
                            value: 'worksheet',
                            description: 'An Excel worksheet is a grid of cells. It can contain data, tables, charts, etc.',
                        },
                    ],
                    default: 'workbook',
                },
                ...WorkbookDescription_1.workbookOperations,
                ...WorkbookDescription_1.workbookFields,
                ...WorksheetDescription_1.worksheetOperations,
                ...WorksheetDescription_1.worksheetFields,
                ...TableDescription_1.tableOperations,
                ...TableDescription_1.tableFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the workbooks to display them to user so that he can
                // select them easily
                getWorkbooks() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const qs = {
                            select: 'id,name',
                        };
                        const returnData = [];
                        const workbooks = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/drive/root/search(q='.xlsx')`, {}, qs);
                        for (const workbook of workbooks) {
                            const workbookName = workbook.name;
                            const workbookId = workbook.id;
                            returnData.push({
                                name: workbookName,
                                value: workbookId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the worksheets to display them to user so that he can
                // select them easily
                getworksheets() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const workbookId = this.getCurrentNodeParameter('workbook');
                        const qs = {
                            select: 'id,name',
                        };
                        const returnData = [];
                        const worksheets = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/drive/items/${workbookId}/workbook/worksheets`, {}, qs);
                        for (const worksheet of worksheets) {
                            const worksheetName = worksheet.name;
                            const worksheetId = worksheet.id;
                            returnData.push({
                                name: worksheetName,
                                value: worksheetId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the tables to display them to user so that he can
                // select them easily
                getTables() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const workbookId = this.getCurrentNodeParameter('workbook');
                        const worksheetId = this.getCurrentNodeParameter('worksheet');
                        const qs = {
                            select: 'id,name',
                        };
                        const returnData = [];
                        const tables = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/tables`, {}, qs);
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
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let qs = {};
            const result = [];
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            if (resource === 'table') {
                //https://docs.microsoft.com/en-us/graph/api/table-post-rows?view=graph-rest-1.0&tabs=http
                if (operation === 'addRow') {
                    try {
                        // TODO: At some point it should be possible to use item dependent parameters.
                        //       Is however important to then not make one separate request each.
                        const workbookId = this.getNodeParameter('workbook', 0);
                        const worksheetId = this.getNodeParameter('worksheet', 0);
                        const tableId = this.getNodeParameter('table', 0);
                        const additionalFields = this.getNodeParameter('additionalFields', 0);
                        const body = {};
                        if (additionalFields.index) {
                            body.index = additionalFields.index;
                        }
                        // Get table columns to eliminate any columns not needed on the input
                        responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/tables/${tableId}/columns`, {}, qs);
                        const columns = responseData.value.map((column) => (column.name));
                        const rows = []; // tslint:disable-line:no-any
                        // Bring the items into the correct format
                        for (const item of items) {
                            const row = [];
                            for (const column of columns) {
                                row.push(item.json[column]);
                            }
                            rows.push(row);
                        }
                        body.values = rows;
                        const { id } = yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', `/drive/items/${workbookId}/workbook/createSession`, { persistChanges: true });
                        responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/tables/${tableId}/rows/add`, body, {}, '', { 'workbook-session-id': id });
                        yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', `/drive/items/${workbookId}/workbook/closeSession`, {}, {}, '', { 'workbook-session-id': id });
                        if (Array.isArray(responseData)) {
                            returnData.push.apply(returnData, responseData);
                        }
                        else if (responseData !== undefined) {
                            returnData.push(responseData);
                        }
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.message });
                        }
                        else {
                            throw error;
                        }
                    }
                }
                //https://docs.microsoft.com/en-us/graph/api/table-list-columns?view=graph-rest-1.0&tabs=http
                if (operation === 'getColumns') {
                    for (let i = 0; i < length; i++) {
                        try {
                            qs = {};
                            const workbookId = this.getNodeParameter('workbook', i);
                            const worksheetId = this.getNodeParameter('worksheet', i);
                            const tableId = this.getNodeParameter('table', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const rawData = this.getNodeParameter('rawData', i);
                            if (rawData) {
                                const filters = this.getNodeParameter('filters', i);
                                if (filters.fields) {
                                    qs['$select'] = filters.fields;
                                }
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.microsoftApiRequestAllItemsSkip.call(this, 'value', 'GET', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/tables/${tableId}/columns`, {}, qs);
                            }
                            else {
                                qs['$top'] = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/tables/${tableId}/columns`, {}, qs);
                                responseData = responseData.value;
                            }
                            if (!rawData) {
                                responseData = responseData.map((column) => ({ name: column.name }));
                            }
                            else {
                                const dataProperty = this.getNodeParameter('dataProperty', i);
                                responseData = { [dataProperty]: responseData };
                            }
                            if (Array.isArray(responseData)) {
                                returnData.push.apply(returnData, responseData);
                            }
                            else if (responseData !== undefined) {
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
                }
                //https://docs.microsoft.com/en-us/graph/api/table-list-rows?view=graph-rest-1.0&tabs=http
                if (operation === 'getRows') {
                    for (let i = 0; i < length; i++) {
                        qs = {};
                        try {
                            const workbookId = this.getNodeParameter('workbook', i);
                            const worksheetId = this.getNodeParameter('worksheet', i);
                            const tableId = this.getNodeParameter('table', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const rawData = this.getNodeParameter('rawData', i);
                            if (rawData) {
                                const filters = this.getNodeParameter('filters', i);
                                if (filters.fields) {
                                    qs['$select'] = filters.fields;
                                }
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.microsoftApiRequestAllItemsSkip.call(this, 'value', 'GET', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/tables/${tableId}/rows`, {}, qs);
                            }
                            else {
                                const rowsQs = Object.assign({}, qs);
                                rowsQs['$top'] = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/tables/${tableId}/rows`, {}, rowsQs);
                                responseData = responseData.value;
                            }
                            if (!rawData) {
                                const columnsQs = Object.assign({}, qs);
                                columnsQs['$select'] = 'name';
                                // TODO: That should probably be cached in the future
                                let columns = yield GenericFunctions_1.microsoftApiRequestAllItemsSkip.call(this, 'value', 'GET', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/tables/${tableId}/columns`, {}, columnsQs);
                                //@ts-ignore
                                columns = columns.map(column => column.name);
                                for (let i = 0; i < responseData.length; i++) {
                                    const object = {};
                                    for (let y = 0; y < columns.length; y++) {
                                        object[columns[y]] = responseData[i].values[0][y];
                                    }
                                    returnData.push(Object.assign({}, object));
                                }
                            }
                            else {
                                const dataProperty = this.getNodeParameter('dataProperty', i);
                                returnData.push({ [dataProperty]: responseData });
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
                }
                if (operation === 'lookup') {
                    for (let i = 0; i < length; i++) {
                        qs = {};
                        try {
                            const workbookId = this.getNodeParameter('workbook', i);
                            const worksheetId = this.getNodeParameter('worksheet', i);
                            const tableId = this.getNodeParameter('table', i);
                            const lookupColumn = this.getNodeParameter('lookupColumn', i);
                            const lookupValue = this.getNodeParameter('lookupValue', i);
                            const options = this.getNodeParameter('options', i);
                            responseData = yield GenericFunctions_1.microsoftApiRequestAllItemsSkip.call(this, 'value', 'GET', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/tables/${tableId}/rows`, {}, {});
                            qs['$select'] = 'name';
                            // TODO: That should probably be cached in the future
                            let columns = yield GenericFunctions_1.microsoftApiRequestAllItemsSkip.call(this, 'value', 'GET', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/tables/${tableId}/columns`, {}, qs);
                            columns = columns.map((column) => column.name);
                            if (!columns.includes(lookupColumn)) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, { message: `Column ${lookupColumn} does not exist on the table selected` });
                            }
                            result.length = 0;
                            for (let i = 0; i < responseData.length; i++) {
                                const object = {};
                                for (let y = 0; y < columns.length; y++) {
                                    object[columns[y]] = responseData[i].values[0][y];
                                }
                                result.push(Object.assign({}, object));
                            }
                            if (options.returnAllMatches) {
                                responseData = result.filter((data) => {
                                    var _a;
                                    return (((_a = data[lookupColumn]) === null || _a === void 0 ? void 0 : _a.toString()) === lookupValue);
                                });
                                returnData.push.apply(returnData, responseData);
                            }
                            else {
                                responseData = result.find((data) => {
                                    var _a;
                                    return (((_a = data[lookupColumn]) === null || _a === void 0 ? void 0 : _a.toString()) === lookupValue);
                                });
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
                }
            }
            if (resource === 'workbook') {
                for (let i = 0; i < length; i++) {
                    qs = {};
                    try {
                        //https://docs.microsoft.com/en-us/graph/api/worksheetcollection-add?view=graph-rest-1.0&tabs=http
                        if (operation === 'addWorksheet') {
                            const workbookId = this.getNodeParameter('workbook', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {};
                            if (additionalFields.name) {
                                body.name = additionalFields.name;
                            }
                            const { id } = yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', `/drive/items/${workbookId}/workbook/createSession`, { persistChanges: true });
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', `/drive/items/${workbookId}/workbook/worksheets/add`, body, {}, '', { 'workbook-session-id': id });
                            yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', `/drive/items/${workbookId}/workbook/closeSession`, {}, {}, '', { 'workbook-session-id': id });
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            if (filters.fields) {
                                qs['$select'] = filters.fields;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/drive/root/search(q='.xlsx')`, {}, qs);
                            }
                            else {
                                qs['$top'] = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/drive/root/search(q='.xlsx')`, {}, qs);
                                responseData = responseData.value;
                            }
                        }
                        if (Array.isArray(responseData)) {
                            returnData.push.apply(returnData, responseData);
                        }
                        else if (responseData !== undefined) {
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
            }
            if (resource === 'worksheet') {
                for (let i = 0; i < length; i++) {
                    qs = {};
                    try {
                        //https://docs.microsoft.com/en-us/graph/api/workbook-list-worksheets?view=graph-rest-1.0&tabs=http
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const workbookId = this.getNodeParameter('workbook', i);
                            const filters = this.getNodeParameter('filters', i);
                            if (filters.fields) {
                                qs['$select'] = filters.fields;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/drive/items/${workbookId}/workbook/worksheets`, {}, qs);
                            }
                            else {
                                qs['$top'] = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/drive/items/${workbookId}/workbook/worksheets`, {}, qs);
                                responseData = responseData.value;
                            }
                        }
                        //https://docs.microsoft.com/en-us/graph/api/worksheet-range?view=graph-rest-1.0&tabs=http
                        if (operation === 'getContent') {
                            const workbookId = this.getNodeParameter('workbook', i);
                            const worksheetId = this.getNodeParameter('worksheet', i);
                            const range = this.getNodeParameter('range', i);
                            const rawData = this.getNodeParameter('rawData', i);
                            if (rawData) {
                                const filters = this.getNodeParameter('filters', i);
                                if (filters.fields) {
                                    qs['$select'] = filters.fields;
                                }
                            }
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/range(address='${range}')`, {}, qs);
                            if (!rawData) {
                                const keyRow = this.getNodeParameter('keyRow', i);
                                const dataStartRow = this.getNodeParameter('dataStartRow', i);
                                if (responseData.values === null) {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, { message: 'Range did not return data' });
                                }
                                const keyValues = responseData.values[keyRow];
                                for (let i = dataStartRow; i < responseData.values.length; i++) {
                                    const object = {};
                                    for (let y = 0; y < keyValues.length; y++) {
                                        object[keyValues[y]] = responseData.values[i][y];
                                    }
                                    returnData.push(Object.assign({}, object));
                                }
                            }
                            else {
                                const dataProperty = this.getNodeParameter('dataProperty', i);
                                returnData.push({ [dataProperty]: responseData });
                            }
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
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.MicrosoftExcel = MicrosoftExcel;

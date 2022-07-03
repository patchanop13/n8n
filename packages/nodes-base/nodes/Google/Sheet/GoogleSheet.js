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
exports.GoogleSheet = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const xlsx_1 = require("xlsx");
const lodash_1 = require("lodash");
class GoogleSheet {
    constructor(spreadsheetId, executeFunctions, options) {
        // options = <SheetOptions>options || {};
        if (!options) {
            options = {};
        }
        this.executeFunctions = executeFunctions;
        this.id = spreadsheetId;
    }
    /**
     * Encodes the range that also none latin character work
     *
     * @param {string} range
     * @returns {string}
     * @memberof GoogleSheet
     */
    encodeRange(range) {
        if (range.includes('!')) {
            const [sheet, ranges] = range.split('!');
            range = `${encodeURIComponent(sheet)}!${ranges}`;
        }
        return range;
    }
    /**
     * Clears values from a sheet
     *
     * @param {string} range
     * @returns {Promise<object>}
     * @memberof GoogleSheet
     */
    clearData(range) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                spreadsheetId: this.id,
                range,
            };
            const response = yield GenericFunctions_1.googleApiRequest.call(this.executeFunctions, 'POST', `/v4/spreadsheets/${this.id}/values/${range}:clear`, body);
            return response;
        });
    }
    /**
     * Returns the cell values
     */
    getData(range, valueRenderMode) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                valueRenderOption: valueRenderMode,
            };
            const response = yield GenericFunctions_1.googleApiRequest.call(this.executeFunctions, 'GET', `/v4/spreadsheets/${this.id}/values/${range}`, {}, query);
            return response.values;
        });
    }
    /**
     * Returns the sheets in a Spreadsheet
     */
    spreadsheetGetSheets() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                fields: 'sheets.properties',
            };
            const response = yield GenericFunctions_1.googleApiRequest.call(this.executeFunctions, 'GET', `/v4/spreadsheets/${this.id}`, {}, query);
            return response;
        });
    }
    /**
     * Sets values in one or more ranges of a spreadsheet.
     */
    spreadsheetBatchUpdate(requests) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                requests,
            };
            const response = yield GenericFunctions_1.googleApiRequest.call(this.executeFunctions, 'POST', `/v4/spreadsheets/${this.id}:batchUpdate`, body);
            return response;
        });
    }
    /**
     * Sets the cell values
     */
    batchUpdate(updateData, valueInputMode) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                data: updateData,
                valueInputOption: valueInputMode,
            };
            const response = yield GenericFunctions_1.googleApiRequest.call(this.executeFunctions, 'POST', `/v4/spreadsheets/${this.id}/values:batchUpdate`, body);
            return response;
        });
    }
    /**
     * Sets the cell values
     */
    setData(range, data, valueInputMode) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                valueInputOption: valueInputMode,
                values: data,
            };
            const response = yield GenericFunctions_1.googleApiRequest.call(this.executeFunctions, 'POST', `/v4/spreadsheets/${this.id}/values/${range}`, body);
            return response;
        });
    }
    /**
     * Appends the cell values
     */
    appendData(range, data, valueInputMode) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                range: decodeURIComponent(range),
                values: data,
            };
            const query = {
                valueInputOption: valueInputMode,
            };
            const response = yield GenericFunctions_1.googleApiRequest.call(this.executeFunctions, 'POST', `/v4/spreadsheets/${this.id}/values/${range}:append`, body, query);
            return response;
        });
    }
    /**
     * Returns the given sheet data in a structured way
     */
    structureData(inputData, startRow, keys, addEmpty) {
        const returnData = [];
        let tempEntry, rowIndex, columnIndex, key;
        for (rowIndex = startRow; rowIndex < inputData.length; rowIndex++) {
            tempEntry = {};
            for (columnIndex = 0; columnIndex < inputData[rowIndex].length; columnIndex++) {
                key = keys[columnIndex];
                if (key) {
                    // Only add the data for which a key was given and ignore all others
                    tempEntry[key] = inputData[rowIndex][columnIndex];
                }
            }
            if (Object.keys(tempEntry).length || addEmpty === true) {
                // Only add the entry if data got found to not have empty ones
                returnData.push(tempEntry);
            }
        }
        return returnData;
    }
    /**
     * Returns the given sheet data in a structured way using
     * the startRow as the one with the name of the key
     */
    structureArrayDataByColumn(inputData, keyRow, dataStartRow) {
        const keys = [];
        if (keyRow < 0 || dataStartRow < keyRow || keyRow >= inputData.length) {
            // The key row does not exist so it is not possible to structure data
            return [];
        }
        // Create the keys array
        for (let columnIndex = 0; columnIndex < inputData[keyRow].length; columnIndex++) {
            keys.push(inputData[keyRow][columnIndex]);
        }
        return this.structureData(inputData, dataStartRow, keys);
    }
    appendSheetData(inputData, range, keyRowIndex, valueInputMode, usePathForKeyRow) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.convertStructuredDataToArray(inputData, range, keyRowIndex, usePathForKeyRow);
            return this.appendData(range, data, valueInputMode);
        });
    }
    getColumnWithOffset(startColumn, offset) {
        const columnIndex = xlsx_1.utils.decode_col(startColumn) + offset;
        return xlsx_1.utils.encode_col(columnIndex);
    }
    /**
     * Updates data in a sheet
     *
     * @param {IDataObject[]} inputData Data to update Sheet with
     * @param {string} indexKey The name of the key which gets used to know which rows to update
     * @param {string} range The range to look for data
     * @param {number} keyRowIndex Index of the row which contains the keys
     * @param {number} dataStartRowIndex Index of the first row which contains data
     * @returns {Promise<string[][]>}
     * @memberof GoogleSheet
     */
    updateSheetData(inputData, indexKey, range, keyRowIndex, dataStartRowIndex, valueInputMode, valueRenderMode, upsert = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get current data in Google Sheet
            let rangeStart, rangeEnd, rangeFull;
            let sheet = undefined;
            if (range.includes('!')) {
                [sheet, rangeFull] = range.split('!');
            }
            else {
                rangeFull = range;
            }
            [rangeStart, rangeEnd] = rangeFull.split(':');
            const rangeStartSplit = rangeStart.match(/([a-zA-Z]{1,10})([0-9]{0,10})/);
            const rangeEndSplit = rangeEnd.match(/([a-zA-Z]{1,10})([0-9]{0,10})/);
            if (rangeStartSplit === null || rangeStartSplit.length !== 3 || rangeEndSplit === null || rangeEndSplit.length !== 3) {
                throw new n8n_workflow_1.NodeOperationError(this.executeFunctions.getNode(), `The range "${range}" is not valid.`);
            }
            const keyRowRange = `${sheet ? sheet + '!' : ''}${rangeStartSplit[1]}${keyRowIndex + 1}:${rangeEndSplit[1]}${keyRowIndex + 1}`;
            const sheetDatakeyRow = yield this.getData(this.encodeRange(keyRowRange), valueRenderMode);
            if (sheetDatakeyRow === undefined) {
                throw new n8n_workflow_1.NodeOperationError(this.executeFunctions.getNode(), 'Could not retrieve the key row!');
            }
            const keyColumnOrder = sheetDatakeyRow[0];
            const keyIndex = keyColumnOrder.indexOf(indexKey);
            if (keyIndex === -1) {
                throw new n8n_workflow_1.NodeOperationError(this.executeFunctions.getNode(), `Could not find column for key "${indexKey}"!`);
            }
            const startRowIndex = rangeStartSplit[2] || dataStartRowIndex;
            const endRowIndex = rangeEndSplit[2] || '';
            const keyColumn = this.getColumnWithOffset(rangeStartSplit[1], keyIndex);
            const keyColumnRange = `${sheet ? sheet + '!' : ''}${keyColumn}${startRowIndex}:${keyColumn}${endRowIndex}`;
            const sheetDataKeyColumn = yield this.getData(this.encodeRange(keyColumnRange), valueRenderMode);
            if (sheetDataKeyColumn === undefined) {
                throw new n8n_workflow_1.NodeOperationError(this.executeFunctions.getNode(), 'Could not retrieve the key column!');
            }
            // TODO: The data till here can be cached optionally. Maybe add an option which can
            //       can be activated if it is used in a loop and nothing else updates the data.
            // Remove the first row which contains the key
            sheetDataKeyColumn.shift();
            // Create an Array which all the key-values of the Google Sheet
            const keyColumnIndexLookup = sheetDataKeyColumn.map((rowContent) => rowContent[0]);
            const updateData = [];
            let itemKey;
            let propertyName;
            let itemKeyIndex;
            let updateRowIndex;
            let updateColumnName;
            for (const inputItem of inputData) {
                itemKey = inputItem[indexKey];
                // if ([undefined, null].includes(inputItem[indexKey] as string | undefined | null)) {
                if (itemKey === undefined || itemKey === null) {
                    // Item does not have the indexKey so we can ignore it or append it if upsert true
                    if (upsert) {
                        const data = yield this.appendSheetData([inputItem], this.encodeRange(range), keyRowIndex, valueInputMode, false);
                    }
                    continue;
                }
                // Item does have the key so check if it exists in Sheet
                itemKeyIndex = keyColumnIndexLookup.indexOf(itemKey);
                if (itemKeyIndex === -1) {
                    // Key does not exist in the Sheet so it can not be updated so skip it or append it if upsert true
                    if (upsert) {
                        const data = yield this.appendSheetData([inputItem], this.encodeRange(range), keyRowIndex, valueInputMode, false);
                    }
                    continue;
                }
                // Get the row index in which the data should be updated
                updateRowIndex = keyColumnIndexLookup.indexOf(itemKey) + dataStartRowIndex + 1;
                // Check all the properties in the sheet and check which ones exist on the
                // item and should be updated
                for (propertyName of keyColumnOrder) {
                    if (propertyName === indexKey) {
                        // Ignore the key itself as that does not get changed it gets
                        // only used to find the correct row to update
                        continue;
                    }
                    if (inputItem[propertyName] === undefined || inputItem[propertyName] === null) {
                        // Property does not exist so skip it
                        continue;
                    }
                    // Property exists so add it to the data to update
                    // Get the column name in which the property data can be found
                    updateColumnName = this.getColumnWithOffset(rangeStartSplit[1], keyColumnOrder.indexOf(propertyName));
                    updateData.push({
                        range: `${sheet ? sheet + '!' : ''}${updateColumnName}${updateRowIndex}`,
                        values: [
                            [
                                inputItem[propertyName],
                            ],
                        ],
                    });
                }
            }
            return this.batchUpdate(updateData, valueInputMode);
        });
    }
    /**
     * Looks for a specific value in a column and if it gets found it returns the whole row
     *
     * @param {string[][]} inputData Data to to check for lookup value in
     * @param {number} keyRowIndex Index of the row which contains the keys
     * @param {number} dataStartRowIndex Index of the first row which contains data
     * @param {ILookupValues[]} lookupValues The lookup values which decide what data to return
     * @param {boolean} [returnAllMatches] Returns all the found matches instead of only the first one
     * @returns {Promise<IDataObject[]>}
     * @memberof GoogleSheet
     */
    lookupValues(inputData, keyRowIndex, dataStartRowIndex, lookupValues, returnAllMatches) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const keys = [];
            if (keyRowIndex < 0 || dataStartRowIndex < keyRowIndex || keyRowIndex >= inputData.length) {
                // The key row does not exist so it is not possible to look up the data
                throw new n8n_workflow_1.NodeOperationError(this.executeFunctions.getNode(), `The key row does not exist!`);
            }
            // Create the keys array
            for (let columnIndex = 0; columnIndex < inputData[keyRowIndex].length; columnIndex++) {
                keys.push(inputData[keyRowIndex][columnIndex]);
            }
            const returnData = [
                inputData[keyRowIndex],
            ];
            // Standardise values array, if rows is [[]], map it to [['']] (Keep the columns into consideration)
            for (let rowIndex = 0; rowIndex < (inputData === null || inputData === void 0 ? void 0 : inputData.length); rowIndex++) {
                if (inputData[rowIndex].length === 0) {
                    for (let i = 0; i < keys.length; i++) {
                        inputData[rowIndex][i] = '';
                    }
                }
                else if (inputData[rowIndex].length < keys.length) {
                    for (let i = 0; i < keys.length; i++) {
                        if (inputData[rowIndex][i] === undefined) {
                            inputData[rowIndex].push('');
                        }
                    }
                }
            }
            // Loop over all the lookup values and try to find a row to return
            let rowIndex;
            let returnColumnIndex;
            lookupLoop: for (const lookupValue of lookupValues) {
                returnColumnIndex = keys.indexOf(lookupValue.lookupColumn);
                if (returnColumnIndex === -1) {
                    throw new n8n_workflow_1.NodeOperationError(this.executeFunctions.getNode(), `The column "${lookupValue.lookupColumn}" could not be found!`);
                }
                // Loop over all the items and find the one with the matching value
                for (rowIndex = dataStartRowIndex; rowIndex < inputData.length; rowIndex++) {
                    if (((_a = inputData[rowIndex][returnColumnIndex]) === null || _a === void 0 ? void 0 : _a.toString()) === lookupValue.lookupValue.toString()) {
                        returnData.push(inputData[rowIndex]);
                        if (returnAllMatches !== true) {
                            continue lookupLoop;
                        }
                    }
                }
                // If value could not be found add an empty one that the order of
                // the returned items stays the same
                if (returnAllMatches !== true) {
                    returnData.push([]);
                }
            }
            return this.structureData(returnData, 1, keys, true);
        });
    }
    convertStructuredDataToArray(inputData, range, keyRowIndex, usePathForKeyRow) {
        return __awaiter(this, void 0, void 0, function* () {
            let startColumn, endColumn;
            let sheet = undefined;
            if (range.includes('!')) {
                [sheet, range] = range.split('!');
            }
            [startColumn, endColumn] = range.split(':');
            let getRange = `${startColumn}${keyRowIndex + 1}:${endColumn}${keyRowIndex + 1}`;
            if (sheet !== undefined) {
                getRange = `${sheet}!${getRange}`;
            }
            const keyColumnData = yield this.getData(getRange, 'UNFORMATTED_VALUE');
            if (keyColumnData === undefined) {
                throw new n8n_workflow_1.NodeOperationError(this.executeFunctions.getNode(), 'Could not retrieve the column data!');
            }
            const keyColumnOrder = keyColumnData[0];
            const setData = [];
            let rowData = [];
            inputData.forEach((item) => {
                rowData = [];
                keyColumnOrder.forEach((key) => {
                    const value = (0, lodash_1.get)(item, key);
                    if (usePathForKeyRow && value !== undefined && value !== null) { //match by key path
                        rowData.push(value.toString());
                    }
                    else if (!usePathForKeyRow && item.hasOwnProperty(key) && item[key] !== null && item[key] !== undefined) { //match by exact key name
                        rowData.push(item[key].toString());
                    }
                    else {
                        rowData.push('');
                    }
                });
                setData.push(rowData);
            });
            return setData;
        });
    }
}
exports.GoogleSheet = GoogleSheet;

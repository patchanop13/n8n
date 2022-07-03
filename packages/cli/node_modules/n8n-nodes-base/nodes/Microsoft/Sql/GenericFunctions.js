"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatColumns = exports.extractDeleteValues = exports.extractUpdateCondition = exports.extractUpdateSet = exports.extractValues = exports.executeQueryQueue = exports.createTableStruct = exports.copyInputItem = void 0;
/**
 * Returns a copy of the item which only contains the json data and
 * of that only the defined properties
 *
 * @param {INodeExecutionData} item The item to copy
 * @param {string[]} properties The properties it should include
 * @returns
 */
function copyInputItem(item, properties) {
    // Prepare the data to insert and copy it to be returned
    const newItem = {};
    for (const property of properties) {
        if (item.json[property] === undefined) {
            newItem[property] = null;
        }
        else {
            newItem[property] = JSON.parse(JSON.stringify(item.json[property]));
        }
    }
    return newItem;
}
exports.copyInputItem = copyInputItem;
/**
 * Creates an ITables with the columns for the operations
 *
 * @param {INodeExecutionData[]} items The items to extract the tables/columns for
 * @param {function} getNodeParam getter for the Node's Parameters
 * @returns {ITables} {tableName: {colNames: [items]}};
 */
function createTableStruct(getNodeParam, items, additionalProperties = [], keyName) {
    return items.reduce((tables, item, index) => {
        const table = getNodeParam('table', index);
        const columnString = getNodeParam('columns', index);
        const columns = columnString.split(',').map(column => column.trim());
        const itemCopy = copyInputItem(item, columns.concat(additionalProperties));
        const keyParam = keyName
            ? getNodeParam(keyName, index)
            : undefined;
        if (tables[table] === undefined) {
            tables[table] = {};
        }
        if (tables[table][columnString] === undefined) {
            tables[table][columnString] = [];
        }
        if (keyName) {
            itemCopy[keyName] = keyParam;
        }
        tables[table][columnString].push(itemCopy);
        return tables;
    }, {});
}
exports.createTableStruct = createTableStruct;
/**
 * Executes a queue of queries on given ITables.
 *
 * @param {ITables} tables The ITables to be processed.
 * @param {function} buildQueryQueue function that builds the queue of promises
 * @returns {Promise}
 */
function executeQueryQueue(tables, buildQueryQueue) {
    return Promise.all(Object.keys(tables).map(table => {
        const columnsResults = Object.keys(tables[table]).map(columnString => {
            return Promise.all(buildQueryQueue({
                table,
                columnString,
                items: tables[table][columnString],
            }));
        });
        return Promise.all(columnsResults);
    }));
}
exports.executeQueryQueue = executeQueryQueue;
/**
 * Extracts the values from the item for INSERT
 *
 * @param {IDataObject} item The item to extract
 * @returns {string} (Val1, Val2, ...)
 */
function extractValues(item) {
    return `(${Object.values(item) // tslint:disable-line:no-any
        .map(val => {
        //the column cannot be found in the input
        //so, set it to null in the sql query
        if (val === null) {
            return 'NULL';
        }
        else if (typeof val === 'string') {
            return `'${val.replace(/'/g, '\'\'')}'`;
        }
        else if (typeof val === 'boolean') {
            return +!!val;
        }
        return val;
    }) // maybe other types such as dates have to be handled as well
        .join(',')})`;
}
exports.extractValues = extractValues;
/**
 * Extracts the SET from the item for UPDATE
 *
 * @param {IDataObject} item The item to extract from
 * @param {string[]} columns The columns to update
 * @returns {string} col1 = val1, col2 = val2
 */
function extractUpdateSet(item, columns) {
    return columns
        .map(column => `"${column}" = ${typeof item[column] === 'string' ? `'${item[column]}'` : item[column]}`)
        .join(',');
}
exports.extractUpdateSet = extractUpdateSet;
/**
 * Extracts the WHERE condition from the item for UPDATE
 *
 * @param {IDataObject} item The item to extract from
 * @param {string} key The column name to build the condition with
 * @returns {string} id = '123'
 */
function extractUpdateCondition(item, key) {
    return `${key} = ${typeof item[key] === 'string' ? `'${item[key]}'` : item[key]}`;
}
exports.extractUpdateCondition = extractUpdateCondition;
/**
 * Extracts the WHERE condition from the items for DELETE
 *
 * @param {IDataObject[]} items The items to extract the values from
 * @param {string} key The column name to extract the value from for the delete condition
 * @returns {string} (Val1, Val2, ...)
 */
function extractDeleteValues(items, key) {
    return `(${items
        .map(item => (typeof item[key] === 'string' ? `'${item[key]}'` : item[key]))
        .join(',')})`;
}
exports.extractDeleteValues = extractDeleteValues;
function formatColumns(columns) {
    return columns.split(',')
        .map((column) => (`"${column.trim()}"`)).join(',');
}
exports.formatColumns = formatColumns;

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
exports.pgUpdate = exports.pgInsert = exports.pgQuery = exports.generateReturning = exports.getItemCopy = exports.getItemsCopy = void 0;
/**
 * Returns of a shallow copy of the items which only contains the json data and
 * of that only the define properties
 *
 * @param {INodeExecutionData[]} items The items to copy
 * @param {string[]} properties The properties it should include
 * @returns
 */
function getItemsCopy(items, properties, guardedColumns) {
    let newItem;
    return items.map(item => {
        newItem = {};
        if (guardedColumns) {
            Object.keys(guardedColumns).forEach(column => {
                newItem[column] = item.json[guardedColumns[column]];
            });
        }
        else {
            for (const property of properties) {
                newItem[property] = item.json[property];
            }
        }
        return newItem;
    });
}
exports.getItemsCopy = getItemsCopy;
/**
 * Returns of a shallow copy of the item which only contains the json data and
 * of that only the define properties
 *
 * @param {INodeExecutionData} item The item to copy
 * @param {string[]} properties The properties it should include
 * @returns
 */
function getItemCopy(item, properties, guardedColumns) {
    const newItem = {};
    if (guardedColumns) {
        Object.keys(guardedColumns).forEach(column => {
            newItem[column] = item.json[guardedColumns[column]];
        });
    }
    else {
        for (const property of properties) {
            newItem[property] = item.json[property];
        }
    }
    return newItem;
}
exports.getItemCopy = getItemCopy;
/**
 * Returns a returning clause from a comma separated string
 * @param {pgPromise.IMain<{}, pg.IClient>} pgp The pgPromise instance
 * @param string returning The comma separated string
 * @returns string
 */
function generateReturning(pgp, returning) {
    return ' RETURNING ' + returning.split(',').map(returnedField => pgp.as.name(returnedField.trim())).join(', ');
}
exports.generateReturning = generateReturning;
/**
 * Executes the given SQL query on the database.
 *
 * @param {Function} getNodeParam The getter for the Node's parameters
 * @param {pgPromise.IMain<{}, pg.IClient>} pgp The pgPromise instance
 * @param {pgPromise.IDatabase<{}, pg.IClient>} db The pgPromise database connection
 * @param {input[]} input The Node's input data
 * @returns Promise<Array<IDataObject>>
 */
function pgQuery(getNodeParam, pgp, db, items, continueOnFail, overrideMode) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const additionalFields = getNodeParam('additionalFields', 0);
        let valuesArray = [];
        if (additionalFields.queryParams) {
            const propertiesString = additionalFields.queryParams;
            const properties = propertiesString.split(',').map(column => column.trim());
            const paramsItems = getItemsCopy(items, properties);
            valuesArray = paramsItems.map((row) => properties.map(col => row[col]));
        }
        const allQueries = [];
        for (let i = 0; i < items.length; i++) {
            const query = getNodeParam('query', i);
            const values = valuesArray[i];
            const queryFormat = { query, values };
            allQueries.push(queryFormat);
        }
        const mode = overrideMode ? overrideMode : ((_a = additionalFields.mode) !== null && _a !== void 0 ? _a : 'multiple');
        if (mode === 'multiple') {
            return (yield db.multi(pgp.helpers.concat(allQueries))).flat(1);
        }
        else if (mode === 'transaction') {
            return db.tx((t) => __awaiter(this, void 0, void 0, function* () {
                const result = [];
                for (let i = 0; i < allQueries.length; i++) {
                    try {
                        Array.prototype.push.apply(result, yield t.any(allQueries[i].query, allQueries[i].values));
                    }
                    catch (err) {
                        if (continueOnFail === false)
                            throw err;
                        result.push(Object.assign(Object.assign({}, items[i].json), { code: err.code, message: err.message }));
                        return result;
                    }
                }
                return result;
            }));
        }
        else if (mode === 'independently') {
            return db.task((t) => __awaiter(this, void 0, void 0, function* () {
                const result = [];
                for (let i = 0; i < allQueries.length; i++) {
                    try {
                        Array.prototype.push.apply(result, yield t.any(allQueries[i].query, allQueries[i].values));
                    }
                    catch (err) {
                        if (continueOnFail === false)
                            throw err;
                        result.push(Object.assign(Object.assign({}, items[i].json), { code: err.code, message: err.message }));
                    }
                }
                return result;
            }));
        }
        throw new Error('multiple, independently or transaction are valid options');
    });
}
exports.pgQuery = pgQuery;
/**
 * Inserts the given items into the database.
 *
 * @param {Function} getNodeParam The getter for the Node's parameters
 * @param {pgPromise.IMain<{}, pg.IClient>} pgp The pgPromise instance
 * @param {pgPromise.IDatabase<{}, pg.IClient>} db The pgPromise database connection
 * @param {INodeExecutionData[]} items The items to be inserted
 * @returns Promise<Array<IDataObject>>
 */
function pgInsert(getNodeParam, pgp, db, items, continueOnFail, overrideMode) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const table = getNodeParam('table', 0);
        const schema = getNodeParam('schema', 0);
        const columnString = getNodeParam('columns', 0);
        const guardedColumns = {};
        const columns = columnString.split(',')
            .map(column => column.trim().split(':'))
            .map(([name, cast], i) => {
            guardedColumns[`column${i}`] = name;
            return { name, cast, prop: `column${i}` };
        });
        const columnNames = columns.map(column => column.name);
        const cs = new pgp.helpers.ColumnSet(columns, { table: { table, schema } });
        const additionalFields = getNodeParam('additionalFields', 0);
        const mode = overrideMode ? overrideMode : ((_a = additionalFields.mode) !== null && _a !== void 0 ? _a : 'multiple');
        const returning = generateReturning(pgp, getNodeParam('returnFields', 0));
        if (mode === 'multiple') {
            const query = pgp.helpers.insert(getItemsCopy(items, columnNames, guardedColumns), cs) + returning;
            return db.any(query);
        }
        else if (mode === 'transaction') {
            return db.tx((t) => __awaiter(this, void 0, void 0, function* () {
                const result = [];
                for (let i = 0; i < items.length; i++) {
                    const itemCopy = getItemCopy(items[i], columnNames, guardedColumns);
                    try {
                        result.push(yield t.one(pgp.helpers.insert(itemCopy, cs) + returning));
                    }
                    catch (err) {
                        if (continueOnFail === false)
                            throw err;
                        result.push(Object.assign(Object.assign({}, itemCopy), { code: err.code, message: err.message }));
                        return result;
                    }
                }
                return result;
            }));
        }
        else if (mode === 'independently') {
            return db.task((t) => __awaiter(this, void 0, void 0, function* () {
                const result = [];
                for (let i = 0; i < items.length; i++) {
                    const itemCopy = getItemCopy(items[i], columnNames, guardedColumns);
                    try {
                        const insertResult = yield t.oneOrNone(pgp.helpers.insert(itemCopy, cs) + returning);
                        if (insertResult !== null) {
                            result.push(insertResult);
                        }
                    }
                    catch (err) {
                        if (continueOnFail === false) {
                            throw err;
                        }
                        result.push(Object.assign(Object.assign({}, itemCopy), { code: err.code, message: err.message }));
                    }
                }
                return result;
            }));
        }
        throw new Error('multiple, independently or transaction are valid options');
    });
}
exports.pgInsert = pgInsert;
/**
 * Updates the given items in the database.
 *
 * @param {Function} getNodeParam The getter for the Node's parameters
 * @param {pgPromise.IMain<{}, pg.IClient>} pgp The pgPromise instance
 * @param {pgPromise.IDatabase<{}, pg.IClient>} db The pgPromise database connection
 * @param {INodeExecutionData[]} items The items to be updated
 * @returns Promise<Array<IDataObject>>
 */
function pgUpdate(getNodeParam, pgp, db, items, continueOnFail = false) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const table = getNodeParam('table', 0);
        const schema = getNodeParam('schema', 0);
        const updateKey = getNodeParam('updateKey', 0);
        const columnString = getNodeParam('columns', 0);
        const guardedColumns = {};
        const columns = columnString.split(',')
            .map(column => column.trim().split(':'))
            .map(([name, cast], i) => {
            guardedColumns[`column${i}`] = name;
            return { name, cast, prop: `column${i}` };
        });
        const updateKeys = updateKey.split(',').map((key, i) => {
            const [name, cast] = key.trim().split(':');
            const targetCol = columns.find((column) => column.name === name);
            const updateColumn = { name, cast, prop: targetCol ? targetCol.prop : `updateColumn${i}` };
            if (!targetCol) {
                guardedColumns[updateColumn.prop] = name;
                columns.unshift(updateColumn);
            }
            else if (!targetCol.cast) {
                targetCol.cast = updateColumn.cast || targetCol.cast;
            }
            return updateColumn;
        });
        const additionalFields = getNodeParam('additionalFields', 0);
        const mode = (_a = additionalFields.mode) !== null && _a !== void 0 ? _a : 'multiple';
        const cs = new pgp.helpers.ColumnSet(columns, { table: { table, schema } });
        // Prepare the data to update and copy it to be returned
        const columnNames = columns.map(column => column.name);
        const updateItems = getItemsCopy(items, columnNames, guardedColumns);
        const returning = generateReturning(pgp, getNodeParam('returnFields', 0));
        if (mode === 'multiple') {
            const query = pgp.helpers.update(updateItems, cs)
                + ' WHERE ' + updateKeys.map(updateKey => {
                const key = pgp.as.name(updateKey.name);
                return 'v.' + key + ' = t.' + key;
            }).join(' AND ')
                + returning;
            return yield db.any(query);
        }
        else {
            const where = ' WHERE ' +
                updateKeys.map(updateKey => pgp.as.name(updateKey.name) +
                    ' = ${' + updateKey.prop + '}').join(' AND ');
            if (mode === 'transaction') {
                return db.tx((t) => __awaiter(this, void 0, void 0, function* () {
                    const result = [];
                    for (let i = 0; i < items.length; i++) {
                        const itemCopy = getItemCopy(items[i], columnNames, guardedColumns);
                        try {
                            Array.prototype.push.apply(result, yield t.any(pgp.helpers.update(itemCopy, cs) + pgp.as.format(where, itemCopy) + returning));
                        }
                        catch (err) {
                            if (continueOnFail === false)
                                throw err;
                            result.push(Object.assign(Object.assign({}, itemCopy), { code: err.code, message: err.message }));
                            return result;
                        }
                    }
                    return result;
                }));
            }
            else if (mode === 'independently') {
                return db.task((t) => __awaiter(this, void 0, void 0, function* () {
                    const result = [];
                    for (let i = 0; i < items.length; i++) {
                        const itemCopy = getItemCopy(items[i], columnNames, guardedColumns);
                        try {
                            Array.prototype.push.apply(result, yield t.any(pgp.helpers.update(itemCopy, cs) + pgp.as.format(where, itemCopy) + returning));
                        }
                        catch (err) {
                            if (continueOnFail === false)
                                throw err;
                            result.push(Object.assign(Object.assign({}, itemCopy), { code: err.code, message: err.message }));
                        }
                    }
                    return result;
                }));
            }
        }
        throw new Error('multiple, independently or transaction are valid options');
    });
}
exports.pgUpdate = pgUpdate;

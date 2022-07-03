"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSQL = exports.processNames = void 0;
const lodash_1 = require("lodash");
const ensureName = (docFields) => docFields.filter(o => o.name);
const sortByName = (docFields) => (0, lodash_1.sortBy)(docFields, ['name']);
const uniqueByName = (docFields) => (0, lodash_1.uniqBy)(docFields, o => o.name);
exports.processNames = (0, lodash_1.flow)(ensureName, sortByName, uniqueByName);
const toSQL = (operator) => {
    const operators = {
        'is': '=',
        'isNot': '!=',
        'greater': '>',
        'less': '<',
        'equalsGreater': '>=',
        'equalsLess': '<=',
    };
    return operators[operator];
};
exports.toSQL = toSQL;

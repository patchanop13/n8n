"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectRetriever = exports.lowerCaser = exports.idStringifier = void 0;
exports.idStringifier = {
    from: (value) => (typeof value === 'number' ? value.toString() : value),
    to: (value) => (typeof value === 'string' ? Number(value) : value),
};
exports.lowerCaser = {
    from: (value) => value,
    to: (value) => (typeof value === 'string' ? value.toLowerCase() : value),
};
/**
 * Unmarshal JSON as JS object.
 */
exports.objectRetriever = {
    to: (value) => value,
    from: (value) => typeof value === 'string' ? JSON.parse(value) : value,
};

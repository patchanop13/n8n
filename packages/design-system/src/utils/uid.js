"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uid = void 0;
/**
 * Math.random should be unique because of its seeding algorithm.
 * Convert it to base 36 (numbers + letters), and grab the first 9 characters after the decimal.
 *
 * @param baseId
 */
function uid(baseId) {
    return `${baseId ? `${baseId}-` : ''}${Math.random().toString(36).substring(2, 11)}`;
}
exports.uid = uid;

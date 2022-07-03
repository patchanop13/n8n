"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = exports.chunk = void 0;
/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * chunk(['a', 'b', 'c', 'd'], 2)
 * // => [['a', 'b'], ['c', 'd']]
 *
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size = 1) {
    const length = array == null ? 0 : array.length;
    if (!length || size < 1) {
        return [];
    }
    let index = 0;
    let resIndex = 0;
    const result = new Array(Math.ceil(length / size));
    while (index < length) {
        result[resIndex++] = array.slice(index, (index += size));
    }
    return result;
}
exports.chunk = chunk;
/**
 * Takes a multidimensional array and converts it to a one-dimensional array.
 *
 * @param {Array} nestedArray The array to be flattened.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * flatten([['a', 'b'], ['c', 'd']])
 * // => ['a', 'b', 'c', 'd']
 *
 */
function flatten(nestedArray) {
    const result = [];
    (function loop(array) {
        for (let i = 0; i < array.length; i++) {
            if (Array.isArray(array[i])) {
                loop(array[i]);
            }
            else {
                result.push(array[i]);
            }
        }
    })(nestedArray);
    return result;
}
exports.flatten = flatten;

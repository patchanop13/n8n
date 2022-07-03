"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceNullValues = void 0;
const replaceNullValues = (item) => {
    if (item.json === null) {
        item.json = {};
    }
    return item;
};
exports.replaceNullValues = replaceNullValues;

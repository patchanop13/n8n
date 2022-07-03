"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChildOf = void 0;
function isChildOf(parent, child) {
    if (child.parentElement === null) {
        return false;
    }
    if (child.parentElement === parent) {
        return true;
    }
    return isChildOf(parent, child.parentElement);
}
exports.isChildOf = isChildOf;

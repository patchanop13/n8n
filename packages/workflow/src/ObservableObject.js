"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
function create(target, parent, option, depth) {
    // eslint-disable-next-line no-param-reassign, @typescript-eslint/prefer-nullish-coalescing
    depth = depth || 0;
    // Make all the children of target also observeable
    // eslint-disable-next-line no-restricted-syntax
    for (const key in target) {
        if (typeof target[key] === 'object' && target[key] !== null) {
            // eslint-disable-next-line no-param-reassign
            target[key] = create(target[key], 
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            (parent || target), option, depth + 1);
        }
    }
    Object.defineProperty(target, '__dataChanged', {
        value: false,
        writable: true,
    });
    return new Proxy(target, {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        deleteProperty(target, name) {
            if (parent === undefined) {
                // If no parent is given mark current data as changed
                target.__dataChanged = true;
            }
            else {
                // If parent is given mark the parent data as changed
                parent.__dataChanged = true;
            }
            return Reflect.deleteProperty(target, name);
        },
        get(target, name, receiver) {
            return Reflect.get(target, name, receiver);
        },
        set(target, name, value) {
            if (parent === undefined) {
                // If no parent is given mark current data as changed
                if (option !== undefined &&
                    option.ignoreEmptyOnFirstChild === true &&
                    depth === 0 &&
                    target[name.toString()] === undefined &&
                    typeof value === 'object' &&
                    Object.keys(value).length === 0
                // eslint-disable-next-line no-empty
                ) {
                }
                else {
                    target.__dataChanged = true;
                }
            }
            else {
                // If parent is given mark the parent data as changed
                parent.__dataChanged = true;
            }
            return Reflect.set(target, name, value);
        },
    });
}
exports.create = create;

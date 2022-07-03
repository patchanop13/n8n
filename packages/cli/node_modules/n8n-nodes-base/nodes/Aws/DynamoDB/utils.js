"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeItem = exports.mapToAttributeValues = exports.copyInputItem = exports.validateJSON = exports.simplify = exports.adjustPutItem = exports.adjustExpressionAttributeName = exports.adjustExpressionAttributeValues = void 0;
const addColon = (attribute) => attribute = attribute.charAt(0) === ':' ? attribute : `:${attribute}`;
const addPound = (key) => key = key.charAt(0) === '#' ? key : `#${key}`;
function adjustExpressionAttributeValues(eavUi) {
    const eav = {};
    eavUi.forEach(({ attribute, type, value }) => {
        eav[addColon(attribute)] = { [type]: value };
    });
    return eav;
}
exports.adjustExpressionAttributeValues = adjustExpressionAttributeValues;
function adjustExpressionAttributeName(eanUi) {
    // tslint:disable-next-line: no-any
    const ean = {};
    eanUi.forEach(({ key, value }) => {
        ean[addPound(key)] = { value };
    });
    return ean;
}
exports.adjustExpressionAttributeName = adjustExpressionAttributeName;
function adjustPutItem(putItemUi) {
    const adjustedPutItem = {};
    Object.entries(putItemUi).forEach(([attribute, value]) => {
        let type;
        if (typeof value === 'boolean') {
            type = 'BOOL';
        }
        else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            type = 'M';
            // @ts-ignore
        }
        else if (isNaN(value)) {
            type = 'S';
        }
        else {
            type = 'N';
        }
        adjustedPutItem[attribute] = { [type]: value.toString() };
    });
    return adjustedPutItem;
}
exports.adjustPutItem = adjustPutItem;
function simplify(item) {
    const output = {};
    for (const [attribute, value] of Object.entries(item)) {
        const [type, content] = Object.entries(value)[0];
        output[attribute] = decodeAttribute(type, content);
    }
    return output;
}
exports.simplify = simplify;
function decodeAttribute(type, attribute) {
    switch (type) {
        case 'BOOL':
            return Boolean(attribute);
        case 'N':
            return Number(attribute);
        case 'S':
            return String(attribute);
        case 'SS':
        case 'NS':
            return attribute;
        default:
            return null;
    }
}
// tslint:disable-next-line: no-any
function validateJSON(input) {
    try {
        return JSON.parse(input);
    }
    catch (error) {
        throw new Error('Items must be a valid JSON');
    }
}
exports.validateJSON = validateJSON;
function copyInputItem(item, properties) {
    // Prepare the data to insert and copy it to be returned
    let newItem;
    newItem = {};
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
function mapToAttributeValues(item) {
    for (const key of Object.keys(item)) {
        if (!key.startsWith(':')) {
            item[`:${key}`] = item[key];
            delete item[key];
        }
    }
}
exports.mapToAttributeValues = mapToAttributeValues;
function decodeItem(item) {
    const _item = {};
    for (const entry of Object.entries(item)) {
        const [attribute, value] = entry;
        const [type, content] = Object.entries(value)[0];
        _item[attribute] = decodeAttribute(type, content);
    }
    return _item;
}
exports.decodeItem = decodeItem;

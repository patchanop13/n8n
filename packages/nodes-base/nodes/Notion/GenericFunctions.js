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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJSON = exports.getSearchFilters = exports.getPropertyTitle = exports.extractDatabaseId = exports.extractPageId = exports.downloadFiles = exports.validateCredentials = exports.getConditions = exports.getFormattedChildren = exports.simplifyObjects = exports.simplifyProperties = exports.mapFilters = exports.mapSorting = exports.mapProperties = exports.formatBlocks = exports.formatText = exports.formatTitle = exports.getBlockTypes = exports.notionApiRequestAllItems = exports.notionApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const change_case_1 = require("change-case");
const Filters_1 = require("./Filters");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const uuid_1 = require("uuid");
const change_case_2 = require("change-case");
const apiVersion = {
    1: '2021-05-13',
    2: '2021-08-16',
};
function notionApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let options = {
                headers: {
                    'Notion-Version': apiVersion[this.getNode().typeVersion],
                },
                method,
                qs,
                body,
                uri: uri || `https://api.notion.com/v1${resource}`,
                json: true,
            };
            options = Object.assign({}, options, option);
            const credentials = yield this.getCredentials('notionApi');
            if (!uri) {
                //do not include the API Key when downloading files, else the request fails
                options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            return this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.notionApiRequest = notionApiRequest;
function notionApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const resource = this.getNodeParameter('resource', 0);
        const returnData = [];
        let responseData;
        do {
            responseData = yield notionApiRequest.call(this, method, endpoint, body, query);
            const { next_cursor } = responseData;
            if (resource === 'block' || resource === 'user') {
                query['start_cursor'] = next_cursor;
            }
            else {
                body['start_cursor'] = next_cursor;
            }
            returnData.push.apply(returnData, responseData[propertyName]);
            if (query.limit && query.limit <= returnData.length) {
                return returnData;
            }
        } while (responseData.has_more !== false);
        return returnData;
    });
}
exports.notionApiRequestAllItems = notionApiRequestAllItems;
function getBlockTypes() {
    return [
        {
            name: 'Paragraph',
            value: 'paragraph',
        },
        {
            name: 'Heading 1',
            value: 'heading_1',
        },
        {
            name: 'Heading 2',
            value: 'heading_2',
        },
        {
            name: 'Heading 3',
            value: 'heading_3',
        },
        {
            name: 'Toggle',
            value: 'toggle',
        },
        {
            name: 'To-Do',
            value: 'to_do',
        },
        // {
        // 	name: 'Child Page',
        // 	value: 'child_page',
        // },
        {
            name: 'Bulleted List Item',
            value: 'bulleted_list_item',
        },
        {
            name: 'Numbered List Item',
            value: 'numbered_list_item',
        },
    ];
}
exports.getBlockTypes = getBlockTypes;
function textContent(content) {
    return {
        text: {
            content,
        },
    };
}
function formatTitle(content) {
    return {
        title: [
            textContent(content),
        ],
    };
}
exports.formatTitle = formatTitle;
function formatText(content) {
    return {
        text: [
            textContent(content),
        ],
    };
}
exports.formatText = formatText;
function getLink(text) {
    if (text.isLink === true && text.textLink !== '') {
        return {
            link: {
                url: text.textLink,
            },
        };
    }
    return {};
}
function getTexts(texts) {
    const results = [];
    for (const text of texts) {
        if (text.textType === 'text') {
            results.push({
                type: 'text',
                text: Object.assign({ content: text.text }, getLink(text)),
                annotations: text.annotationUi,
            });
        }
        else if (text.textType === 'mention') {
            if (text.mentionType === 'date') {
                results.push({
                    type: 'mention',
                    mention: {
                        type: text.mentionType,
                        [text.mentionType]: (text.range === true)
                            ? { start: text.dateStart, end: text.dateEnd }
                            : { start: text.date, end: null },
                    },
                    annotations: text.annotationUi,
                });
            }
            else {
                //@ts-ignore
                results.push({
                    type: 'mention',
                    mention: {
                        type: text.mentionType,
                        //@ts-ignore
                        [text.mentionType]: { id: text[text.mentionType] },
                    },
                    annotations: text.annotationUi,
                });
            }
        }
        else if (text.textType === 'equation') {
            results.push({
                type: 'equation',
                equation: {
                    expression: text.expression,
                },
                annotations: text.annotationUi,
            });
        }
    }
    return results;
}
function formatBlocks(blocks) {
    const results = [];
    for (const block of blocks) {
        results.push({
            object: 'block',
            type: block.type,
            [block.type]: Object.assign(Object.assign({}, (block.type === 'to_do') ? { checked: block.checked } : {}), { 
                //@ts-expect-error
                // tslint:disable-next-line: no-any
                text: (block.richText === false) ? formatText(block.textContent).text : getTexts(block.text.text || []) }),
        });
    }
    return results;
}
exports.formatBlocks = formatBlocks;
// tslint:disable-next-line: no-any
function getPropertyKeyValue(value, type, timezone, version = 1) {
    let result = {};
    switch (type) {
        case 'rich_text':
            if (value.richText === false) {
                result = { rich_text: [{ text: { content: value.textContent } }] };
            }
            else {
                result = { rich_text: getTexts(value.text.text) };
            }
            break;
        case 'title':
            result = { title: [{ text: { content: value.title } }] };
            break;
        case 'number':
            result = { type: 'number', number: value.numberValue };
            break;
        case 'url':
            result = { type: 'url', url: value.urlValue };
            break;
        case 'checkbox':
            result = { type: 'checkbox', checkbox: value.checkboxValue };
            break;
        case 'relation':
            result = {
                // tslint:disable-next-line: no-any
                type: 'relation', relation: (value.relationValue).reduce((acc, cur) => {
                    return acc.concat(cur.split(',').map((relation) => ({ id: relation.trim() })));
                }, []),
            };
            break;
        case 'multi_select':
            const multiSelectValue = value.multiSelectValue;
            result = {
                type: 'multi_select',
                // tslint:disable-next-line: no-any
                multi_select: (Array.isArray(multiSelectValue) ? multiSelectValue : multiSelectValue.split(',').map((v) => v.trim()))
                    // tslint:disable-next-line: no-any
                    .filter((value) => value !== null)
                    .map((option) => ((!(0, uuid_1.validate)(option)) ? { name: option } : { id: option })),
            };
            break;
        case 'email':
            result = {
                type: 'email', email: value.emailValue,
            };
            break;
        case 'people':
            //if expression it's a single value, make it an array
            if (!Array.isArray(value.peopleValue)) {
                value.peopleValue = [value.peopleValue];
            }
            result = {
                type: 'people', people: value.peopleValue.map((option) => ({ id: option })),
            };
            break;
        case 'phone_number':
            result = {
                type: 'phone_number', phone_number: value.phoneValue,
            };
            break;
        case 'select':
            result = {
                type: 'select', select: (version === 1) ? { id: value.selectValue } : { name: value.selectValue },
            };
            break;
        case 'date':
            const format = getDateFormat(value.includeTime);
            const timezoneValue = (value.timezone === 'default') ? timezone : value.timezone;
            if (value.range === true) {
                result = {
                    type: 'date',
                    date: {
                        start: moment_timezone_1.default.tz(value.dateStart, timezoneValue).format(format),
                        end: moment_timezone_1.default.tz(value.dateEnd, timezoneValue).format(format),
                    },
                };
            }
            else {
                result = {
                    type: 'date',
                    date: {
                        start: moment_timezone_1.default.tz(value.date, timezoneValue).format(format),
                        end: null,
                    },
                };
            }
            //if the date was left empty, set it to null so it resets the value in notion
            if (value.date === '' ||
                (value.dateStart === '' && value.dateEnd === '')) {
                //@ts-ignore
                result.date = null;
            }
            break;
        case 'files':
            result = {
                type: 'files', files: value.fileUrls.fileUrl
                    .map((file) => ({ name: file.name, type: 'external', external: { url: file.url } })),
            };
            break;
        default:
    }
    return result;
}
function getDateFormat(includeTime) {
    if (includeTime === false) {
        return 'yyyy-MM-DD';
    }
    return '';
}
function getNameAndType(key) {
    const [name, type] = key.split('|');
    return {
        name,
        type,
    };
}
function mapProperties(properties, timezone, version = 1) {
    return properties.reduce((obj, value) => Object.assign(obj, {
        [`${value.key.split('|')[0]}`]: getPropertyKeyValue(value, value.key.split('|')[1], timezone, version),
    }), {});
}
exports.mapProperties = mapProperties;
function mapSorting(data) {
    return data.map((sort) => {
        return {
            direction: sort.direction,
            [(sort.timestamp) ? 'timestamp' : 'property']: sort.key.split('|')[0],
        };
    });
}
exports.mapSorting = mapSorting;
function mapFilters(filters, timezone) {
    // tslint:disable-next-line: no-any
    return filters.reduce((obj, value) => {
        let key = getNameAndType(value.key).type;
        let valuePropertyName = key === 'last_edited_time'
            ? value[(0, change_case_1.camelCase)(key)]
            : value[`${(0, change_case_1.camelCase)(key)}Value`];
        if (['is_empty', 'is_not_empty'].includes(value.condition)) {
            valuePropertyName = true;
        }
        else if (['past_week', 'past_month', 'past_year', 'next_week', 'next_month', 'next_year'].includes(value.condition)) {
            valuePropertyName = {};
        }
        if (key === 'rich_text' || key === 'text') {
            key = 'text';
        }
        else if (key === 'phone_number') {
            key = 'phone';
        }
        else if (key === 'date' && !['is_empty', 'is_not_empty'].includes(value.condition)) {
            valuePropertyName = (value.date === '') ? {} : moment_timezone_1.default.tz(value.date, timezone).utc().format();
        }
        else if (key === 'boolean') {
            key = 'checkbox';
        }
        if (value.type === 'formula') {
            const valuePropertyName = value[`${(0, change_case_1.camelCase)(value.returnType)}Value`];
            return Object.assign(obj, {
                ['property']: getNameAndType(value.key).name,
                [key]: { [value.returnType]: { [`${value.condition}`]: valuePropertyName } },
            });
        }
        return Object.assign(obj, {
            ['property']: getNameAndType(value.key).name,
            [key]: { [`${value.condition}`]: valuePropertyName },
        });
    }, {});
}
exports.mapFilters = mapFilters;
// tslint:disable-next-line: no-any
function simplifyProperty(property) {
    // tslint:disable-next-line: no-any
    let result;
    const type = property.type;
    if (['text'].includes(property.type)) {
        result = property.plain_text;
    }
    else if (['rich_text', 'title'].includes(property.type)) {
        if (Array.isArray(property[type]) && property[type].length !== 0) {
            // tslint:disable-next-line: no-any
            result = property[type].map((text) => simplifyProperty(text)).join('');
        }
        else {
            result = '';
        }
    }
    else if (['url', 'created_time', 'checkbox', 'number', 'last_edited_time', 'email', 'phone_number', 'date'].includes(property.type)) {
        // tslint:disable-next-line: no-any
        result = property[type];
    }
    else if (['created_by', 'last_edited_by', 'select'].includes(property.type)) {
        result = (property[type]) ? property[type].name : null;
    }
    else if (['people'].includes(property.type)) {
        if (Array.isArray(property[type])) {
            // tslint:disable-next-line: no-any
            result = property[type].map((person) => { var _a; return ((_a = person.person) === null || _a === void 0 ? void 0 : _a.email) || {}; });
        }
        else {
            result = property[type];
        }
    }
    else if (['multi_select'].includes(property.type)) {
        if (Array.isArray(property[type])) {
            result = property[type].map((e) => e.name || {});
        }
        else {
            result = property[type].options.map((e) => e.name || {});
        }
    }
    else if (['relation'].includes(property.type)) {
        if (Array.isArray(property[type])) {
            result = property[type].map((e) => e.id || {});
        }
        else {
            result = property[type].database_id;
        }
    }
    else if (['formula'].includes(property.type)) {
        result = property[type][property[type].type];
    }
    else if (['rollup'].includes(property.type)) {
        const rollupFunction = property[type].function;
        if (rollupFunction.startsWith('count') || rollupFunction.includes('empty')) {
            result = property[type].number;
            if (rollupFunction.includes('percent')) {
                result = result * 100;
            }
        }
        else if (rollupFunction.startsWith('show') && property[type].type === 'array') {
            const elements = property[type].array.map(simplifyProperty).flat();
            result = rollupFunction === 'show_unique' ? [...new Set(elements)] : elements;
        }
    }
    else if (['files'].includes(property.type)) {
        // tslint:disable-next-line: no-any
        result = property[type].map((file) => (file[file.type].url));
    }
    return result;
}
// tslint:disable-next-line: no-any
function simplifyProperties(properties) {
    // tslint:disable-next-line: no-any
    const results = {};
    for (const key of Object.keys(properties)) {
        results[`${key}`] = simplifyProperty(properties[key]);
    }
    return results;
}
exports.simplifyProperties = simplifyProperties;
// tslint:disable-next-line: no-any
function simplifyObjects(objects, download = false, version = 2) {
    var _a, _b;
    if (!Array.isArray(objects)) {
        objects = [objects];
    }
    const results = [];
    for (const { object, id, properties, parent, title, json, binary, url } of objects) {
        if (object === 'page' && (parent.type === 'page_id' || parent.type === 'workspace')) {
            results.push(Object.assign({ id, name: properties.title.title[0].plain_text }, version === 2 ? { url } : {}));
        }
        else if (object === 'page' && parent.type === 'database_id') {
            results.push(Object.assign(Object.assign(Object.assign({ id }, (version === 2) ? { name: getPropertyTitle(properties) } : {}), (version === 2) ? { url } : {}), (version === 2) ? Object.assign({}, prepend('property', simplifyProperties(properties))) : Object.assign({}, simplifyProperties(properties))));
        }
        else if (download && json.object === 'page' && json.parent.type === 'database_id') {
            results.push({
                json: Object.assign(Object.assign(Object.assign({ id: json.id }, (version === 2) ? { name: getPropertyTitle(json.properties) } : {}), (version === 2) ? { url: json.url } : {}), (version === 2) ? Object.assign({}, prepend('property', simplifyProperties(json.properties))) : Object.assign({}, simplifyProperties(json.properties))),
                binary,
            });
        }
        else if (object === 'database') {
            results.push(Object.assign(Object.assign({ id }, version === 2 ? { name: ((_a = title[0]) === null || _a === void 0 ? void 0 : _a.plain_text) || '' } : { title: ((_b = title[0]) === null || _b === void 0 ? void 0 : _b.plain_text) || '' }), version === 2 ? { url } : {}));
        }
    }
    return results;
}
exports.simplifyObjects = simplifyObjects;
function getFormattedChildren(children) {
    const results = [];
    for (const child of children) {
        const type = child.type;
        results.push({ [`${type}`]: child, object: 'block', type });
    }
    return results;
}
exports.getFormattedChildren = getFormattedChildren;
function getConditions() {
    const elements = [];
    const types = {
        title: 'rich_text',
        rich_text: 'rich_text',
        number: 'number',
        checkbox: 'checkbox',
        select: 'select',
        multi_select: 'multi_select',
        date: 'date',
        people: 'people',
        files: 'files',
        url: 'rich_text',
        email: 'rich_text',
        phone_number: 'rich_text',
        relation: 'relation',
        //formula: 'formula',
        created_by: 'people',
        created_time: 'date',
        last_edited_by: 'people',
        last_edited_time: 'date',
    };
    const typeConditions = {
        rich_text: [
            'equals',
            'does_not_equal',
            'contains',
            'does_not_contain',
            'starts_with',
            'ends_with',
            'is_empty',
            'is_not_empty',
        ],
        number: [
            'equals',
            'does_not_equal',
            'grater_than',
            'less_than',
            'greater_than_or_equal_to',
            'less_than_or_equal_to',
            'is_empty',
            'is_not_empty',
        ],
        checkbox: [
            'equals',
            'does_not_equal',
        ],
        select: [
            'equals',
            'does_not_equal',
            'is_empty',
            'is_not_empty',
        ],
        multi_select: [
            'contains',
            'does_not_equal',
            'is_empty',
            'is_not_empty',
        ],
        date: [
            'equals',
            'before',
            'after',
            'on_or_before',
            'is_empty',
            'is_not_empty',
            'on_or_after',
            'past_week',
            'past_month',
            'past_year',
            'next_week',
            'next_month',
            'next_year',
        ],
        people: [
            'contains',
            'does_not_contain',
            'is_empty',
            'is_not_empty',
        ],
        files: [
            'is_empty',
            'is_not_empty',
        ],
        relation: [
            'contains',
            'does_not_contain',
            'is_empty',
            'is_not_empty',
        ],
    };
    const formula = {
        text: [
            ...typeConditions.rich_text,
        ],
        checkbox: [
            ...typeConditions.checkbox,
        ],
        number: [
            ...typeConditions.number,
        ],
        date: [
            ...typeConditions.date,
        ],
    };
    for (const type of Object.keys(types)) {
        elements.push({
            displayName: 'Condition',
            name: 'condition',
            type: 'options',
            displayOptions: {
                show: {
                    type: [
                        type,
                    ],
                },
            },
            options: typeConditions[types[type]].map((type) => ({ name: (0, change_case_1.capitalCase)(type), value: type })),
            default: '',
            description: 'The value of the property to filter by',
        });
    }
    elements.push({
        displayName: 'Return Type',
        name: 'returnType',
        type: 'options',
        displayOptions: {
            show: {
                type: [
                    'formula',
                ],
            },
        },
        options: Object.keys(formula).map((key) => ({ name: (0, change_case_1.capitalCase)(key), value: key })),
        default: '',
        description: 'The formula return type',
    });
    for (const key of Object.keys(formula)) {
        elements.push({
            displayName: 'Condition',
            name: 'condition',
            type: 'options',
            displayOptions: {
                show: {
                    type: [
                        'formula',
                    ],
                    returnType: [
                        key,
                    ],
                },
            },
            options: formula[key].map((key) => ({ name: (0, change_case_1.capitalCase)(key), value: key })),
            default: '',
            description: 'The value of the property to filter by',
        });
    }
    return elements;
}
exports.getConditions = getConditions;
function validateCredentials(credentials) {
    const options = {
        headers: {
            'Authorization': `Bearer ${credentials.apiKey}`,
            'Notion-Version': apiVersion[2],
        },
        method: 'GET',
        uri: `https://api.notion.com/v1/users/me`,
        json: true,
    };
    return this.helpers.request(options);
}
exports.validateCredentials = validateCredentials;
// tslint:disable-next-line: no-any
function downloadFiles(records) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const elements = [];
        for (const record of records) {
            const element = { json: {}, binary: {} };
            element.json = record;
            for (const key of Object.keys(record.properties)) {
                if (record.properties[key].type === 'files') {
                    if (record.properties[key].files.length) {
                        for (const [index, file] of record.properties[key].files.entries()) {
                            const data = yield notionApiRequest.call(this, 'GET', '', {}, {}, ((_a = file === null || file === void 0 ? void 0 : file.file) === null || _a === void 0 ? void 0 : _a.url) || ((_b = file === null || file === void 0 ? void 0 : file.external) === null || _b === void 0 ? void 0 : _b.url), { json: false, encoding: null });
                            element.binary[`${key}_${index}`] = yield this.helpers.prepareBinaryData(data);
                        }
                    }
                }
            }
            if (Object.keys(element.binary).length === 0) {
                delete element.binary;
            }
            elements.push(element);
        }
        return elements;
    });
}
exports.downloadFiles = downloadFiles;
function extractPageId(page) {
    if (page.includes('p=')) {
        return page.split('p=')[1];
    }
    else if (page.includes('-') && page.includes('https')) {
        return page.split('-')[page.split('-').length - 1];
    }
    return page;
}
exports.extractPageId = extractPageId;
function extractDatabaseId(database) {
    if (database.includes('?v=')) {
        const data = database.split('?v=')[0].split('/');
        const index = data.length - 1;
        return data[index];
    }
    else if (database.includes('/')) {
        const index = database.split('/').length - 1;
        return database.split('/')[index];
    }
    else {
        return database;
    }
}
exports.extractDatabaseId = extractDatabaseId;
// tslint:disable-next-line: no-any
function prepend(stringKey, properties) {
    for (const key of Object.keys(properties)) {
        properties[`${stringKey}_${(0, change_case_2.snakeCase)(key)}`] = properties[key];
        delete properties[key];
    }
    return properties;
}
// tslint:disable-next-line: no-any
function getPropertyTitle(properties) {
    var _a;
    return ((_a = Object.values(properties).filter(property => property.type === 'title')[0].title[0]) === null || _a === void 0 ? void 0 : _a.plain_text) || '';
}
exports.getPropertyTitle = getPropertyTitle;
function getSearchFilters(resource) {
    return [
        {
            displayName: 'Filter',
            name: 'filterType',
            type: 'options',
            options: [
                {
                    name: 'None',
                    value: 'none',
                },
                {
                    name: 'Build Manually',
                    value: 'manual',
                },
                {
                    name: 'JSON',
                    value: 'json',
                },
            ],
            displayOptions: {
                show: {
                    version: [
                        2,
                    ],
                    resource: [
                        resource,
                    ],
                    operation: [
                        'getAll',
                    ],
                },
            },
            default: 'none',
        },
        {
            displayName: 'Must Match',
            name: 'matchType',
            type: 'options',
            options: [
                {
                    name: 'Any filter',
                    value: 'anyFilter',
                },
                {
                    name: 'All Filters',
                    value: 'allFilters',
                },
            ],
            displayOptions: {
                show: {
                    version: [
                        2,
                    ],
                    resource: [
                        resource,
                    ],
                    operation: [
                        'getAll',
                    ],
                    filterType: [
                        'manual',
                    ],
                },
            },
            default: 'anyFilter',
        },
        {
            displayName: 'Filters',
            name: 'filters',
            type: 'fixedCollection',
            typeOptions: {
                multipleValues: true,
            },
            displayOptions: {
                show: {
                    version: [
                        2,
                    ],
                    resource: [
                        resource,
                    ],
                    operation: [
                        'getAll',
                    ],
                    filterType: [
                        'manual',
                    ],
                },
            },
            default: {},
            placeholder: 'Add Condition',
            options: [
                {
                    displayName: 'Conditions',
                    name: 'conditions',
                    values: [
                        ...(0, Filters_1.filters)(getConditions()),
                    ],
                },
            ],
        },
        {
            displayName: 'See <a href="https://developers.notion.com/reference/post-database-query#post-database-query-filter" target="_blank">Notion guide</a> to creating filters',
            name: 'jsonNotice',
            type: 'notice',
            displayOptions: {
                show: {
                    version: [
                        2,
                    ],
                    resource: [
                        resource,
                    ],
                    operation: [
                        'getAll',
                    ],
                    filterType: [
                        'json',
                    ],
                },
            },
            default: '',
        },
        {
            displayName: 'Filters (JSON)',
            name: 'filterJson',
            type: 'string',
            typeOptions: {
                alwaysOpenEditWindow: true,
            },
            displayOptions: {
                show: {
                    version: [
                        2,
                    ],
                    resource: [
                        resource,
                    ],
                    operation: [
                        'getAll',
                    ],
                    filterType: [
                        'json',
                    ],
                },
            },
            default: '',
        },
    ];
}
exports.getSearchFilters = getSearchFilters;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = undefined;
    }
    return result;
}
exports.validateJSON = validateJSON;

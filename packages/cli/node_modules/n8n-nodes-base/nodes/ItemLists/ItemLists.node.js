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
exports.ItemLists = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
const { NodeVM, } = require('vm2');
class ItemLists {
    constructor() {
        this.description = {
            displayName: 'Item Lists',
            name: 'itemLists',
            icon: 'file:itemLists.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Helper for working with lists of items and transforming arrays',
            defaults: {
                name: 'Item Lists',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'hidden',
                    options: [
                        {
                            name: 'Item List',
                            value: 'itemList',
                        },
                    ],
                    default: 'itemList',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Aggregate Items',
                            value: 'aggregateItems',
                            description: 'Merge fields into a single new item',
                        },
                        {
                            name: 'Limit',
                            value: 'limit',
                            description: 'Remove items if there are too many',
                        },
                        {
                            name: 'Remove Duplicates',
                            value: 'removeDuplicates',
                            description: 'Remove extra items that are similar',
                        },
                        {
                            name: 'Sort',
                            value: 'sort',
                            description: 'Change the item order',
                        },
                        {
                            name: 'Split Out Items',
                            value: 'splitOutItems',
                            description: 'Turn a list inside item(s) into separate items',
                        },
                    ],
                    default: 'splitOutItems',
                },
                // Split out items - Fields
                {
                    displayName: 'Field To Split Out',
                    name: 'fieldToSplitOut',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'splitOutItems',
                            ],
                        },
                    },
                    description: 'The name of the input field to break out into separate items',
                },
                {
                    displayName: 'Include',
                    name: 'include',
                    type: 'options',
                    options: [
                        {
                            name: 'No Other Fields',
                            value: 'noOtherFields',
                        },
                        {
                            name: 'All Other Fields',
                            value: 'allOtherFields',
                        },
                        {
                            name: 'Selected Other Fields',
                            value: 'selectedOtherFields',
                        },
                    ],
                    default: 'noOtherFields',
                    description: 'Whether to copy any other fields into the new items',
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'splitOutItems',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Fields To Include',
                    name: 'fieldsToInclude',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    placeholder: 'Add Field To Include',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'splitOutItems',
                            ],
                            include: [
                                'selectedOtherFields',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: '',
                            name: 'fields',
                            values: [
                                {
                                    displayName: 'Field Name',
                                    name: 'fieldName',
                                    type: 'string',
                                    default: '',
                                    description: 'A field in the input items to aggregate together',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Fields To Aggregate',
                    name: 'fieldsToAggregate',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    placeholder: 'Add Field To Aggregate',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'aggregateItems',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: '',
                            name: 'fieldToAggregate',
                            values: [
                                {
                                    displayName: 'Input Field Name',
                                    name: 'fieldToAggregate',
                                    type: 'string',
                                    default: '',
                                    description: 'The name of a field in the input items to aggregate together',
                                },
                                {
                                    displayName: 'Rename Field',
                                    name: 'renameField',
                                    type: 'boolean',
                                    default: false,
                                    description: 'Whether to give the field a different name in the output',
                                },
                                {
                                    displayName: 'Output Field Name',
                                    name: 'outputFieldName',
                                    displayOptions: {
                                        show: {
                                            renameField: [
                                                true,
                                            ],
                                        },
                                    },
                                    type: 'string',
                                    default: '',
                                    description: 'The name of the field to put the aggregated data in. Leave blank to use the input field name.',
                                },
                            ],
                        },
                    ],
                },
                // Remove duplicates - Fields
                {
                    displayName: 'Compare',
                    name: 'compare',
                    type: 'options',
                    options: [
                        {
                            name: 'All Fields',
                            value: 'allFields',
                        },
                        {
                            name: 'All Fields Except',
                            value: 'allFieldsExcept',
                        },
                        {
                            name: 'Selected Fields',
                            value: 'selectedFields',
                        },
                    ],
                    default: 'allFields',
                    description: 'The fields of the input items to compare to see if they are the same',
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'removeDuplicates',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Fields To Exclude',
                    name: 'fieldsToExclude',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    placeholder: 'Add Field To Exclude',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'removeDuplicates',
                            ],
                            compare: [
                                'allFieldsExcept',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: '',
                            name: 'fields',
                            values: [
                                {
                                    displayName: 'Field Name',
                                    name: 'fieldName',
                                    type: 'string',
                                    default: '',
                                    description: 'A field in the input to exclude from the comparison',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Fields To Compare',
                    name: 'fieldsToCompare',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    placeholder: 'Add Field To Compare',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'removeDuplicates',
                            ],
                            compare: [
                                'selectedFields',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: '',
                            name: 'fields',
                            values: [
                                {
                                    displayName: 'Field Name',
                                    name: 'fieldName',
                                    type: 'string',
                                    default: '',
                                    description: 'A field in the input to add to the comparison',
                                },
                            ],
                        },
                    ],
                },
                // Sort - Fields
                {
                    displayName: 'Type',
                    name: 'type',
                    type: 'options',
                    options: [
                        {
                            name: 'Simple',
                            value: 'simple',
                        },
                        {
                            name: 'Random',
                            value: 'random',
                        },
                        {
                            name: 'Code',
                            value: 'code',
                        },
                    ],
                    default: 'simple',
                    description: 'The fields of the input items to compare to see if they are the same',
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'sort',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Fields To Sort By',
                    name: 'sortFieldsUi',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    placeholder: 'Add Field To Sort By',
                    options: [
                        {
                            displayName: '',
                            name: 'sortField',
                            values: [
                                {
                                    displayName: 'Field Name',
                                    name: 'fieldName',
                                    type: 'string',
                                    required: true,
                                    default: '',
                                    description: 'The field to sort by',
                                },
                                {
                                    displayName: 'Order',
                                    name: 'order',
                                    type: 'options',
                                    options: [
                                        {
                                            name: 'Ascending',
                                            value: 'ascending',
                                        },
                                        {
                                            name: 'Descending',
                                            value: 'descending',
                                        },
                                    ],
                                    default: 'ascending',
                                    description: 'The order to sort by',
                                },
                            ],
                        },
                    ],
                    default: {},
                    description: 'The fields of the input items to compare to see if they are the same',
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'sort',
                            ],
                            type: [
                                'simple',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Code',
                    name: 'code',
                    type: 'string',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                        editor: 'code',
                        rows: 10,
                    },
                    default: `// The two items to compare are in the variables a and b
// Access the fields in a.json and b.json
// Return -1 if a should go before b
// Return 1 if b should go before a
// Return 0 if there's no difference

fieldName = 'myField';

if (a.json[fieldName] < b.json[fieldName]) {
		return -1;
}
if (a.json[fieldName] > b.json[fieldName]) {
		return 1;
}
return 0;`,
                    description: 'Javascript code to determine the order of any two items',
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'sort',
                            ],
                            type: [
                                'code',
                            ],
                        },
                    },
                },
                // Limit - Fields
                {
                    displayName: 'Max Items',
                    name: 'maxItems',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                    },
                    default: 1,
                    description: 'If there are more items than this number, some are removed',
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'limit',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Keep',
                    name: 'keep',
                    type: 'options',
                    options: [
                        {
                            name: 'First Items',
                            value: 'firstItems',
                        },
                        {
                            name: 'Last Items',
                            value: 'lastItems',
                        },
                    ],
                    default: 'firstItems',
                    description: 'When removing items, whether to keep the ones at the start or the ending',
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'limit',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'removeDuplicates',
                            ],
                            compare: [
                                'allFieldsExcept',
                                'selectedFields',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Remove Other Fields',
                            name: 'removeOtherFields',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to remove any fields that are not being compared. If disabled, will keep the values from the first of the duplicates.',
                        },
                        {
                            displayName: 'Disable Dot Notation',
                            name: 'disableDotNotation',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to disallow referencing child fields using `parent.child` in the field name',
                        },
                    ],
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'sort',
                            ],
                            type: [
                                'simple',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Disable Dot Notation',
                            name: 'disableDotNotation',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to disallow referencing child fields using `parent.child` in the field name',
                        },
                    ],
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'itemList',
                            ],
                            operation: [
                                'splitOutItems',
                                'aggregateItems',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Disable Dot Notation',
                            name: 'disableDotNotation',
                            type: 'boolean',
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'splitOutItems',
                                        'aggregateItems',
                                    ],
                                },
                            },
                            default: false,
                            description: 'Whether to disallow referencing child fields using `parent.child` in the field name',
                        },
                        {
                            displayName: 'Destination Field Name',
                            name: 'destinationFieldName',
                            type: 'string',
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'splitOutItems',
                                    ],
                                },
                            },
                            default: '',
                            description: 'The field in the output under which to put the split field contents',
                        },
                        {
                            displayName: 'Merge Lists',
                            name: 'mergeLists',
                            type: 'boolean',
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'aggregateItems',
                                    ],
                                },
                            },
                            default: false,
                            description: 'Whether to merge the output into a single flat list (rather than a list of lists), if the field to aggregate is a list',
                        },
                        {
                            displayName: 'Keep Missing And Null Values',
                            name: 'keepMissing',
                            type: 'boolean',
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'aggregateItems',
                                    ],
                                },
                            },
                            default: false,
                            description: 'Whether to add a null entry to the aggregated list when there is a missing or null value',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const length = items.length;
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            if (resource === 'itemList') {
                if (operation === 'splitOutItems') {
                    for (let i = 0; i < length; i++) {
                        const fieldToSplitOut = this.getNodeParameter('fieldToSplitOut', i);
                        const disableDotNotation = this.getNodeParameter('options.disableDotNotation', 0, false);
                        const destinationFieldName = this.getNodeParameter('options.destinationFieldName', i, '');
                        const include = this.getNodeParameter('include', i);
                        let arrayToSplit;
                        if (disableDotNotation === false) {
                            arrayToSplit = (0, lodash_1.get)(items[i].json, fieldToSplitOut);
                        }
                        else {
                            arrayToSplit = items[i].json[fieldToSplitOut];
                        }
                        if (arrayToSplit === undefined) {
                            if (fieldToSplitOut.includes('.') && disableDotNotation === true) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Couldn't find the field '${fieldToSplitOut}' in the input data`, { description: `If you're trying to use a nested field, make sure you turn off 'disable dot notation' in the node options` });
                            }
                            else {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Couldn't find the field '${fieldToSplitOut}' in the input data`);
                            }
                        }
                        if (!Array.isArray(arrayToSplit)) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The provided field '${fieldToSplitOut}' is not an array`);
                        }
                        else {
                            for (const element of arrayToSplit) {
                                let newItem = {};
                                if (include === 'selectedOtherFields') {
                                    const fieldsToInclude = this.getNodeParameter('fieldsToInclude.fields', i, []).map(field => field.fieldName);
                                    if (!fieldsToInclude.length) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No fields specified', { description: 'Please add a field to include' });
                                    }
                                    newItem = Object.assign({}, fieldsToInclude.reduce((prev, field) => {
                                        if (field === fieldToSplitOut) {
                                            return prev;
                                        }
                                        let value;
                                        if (disableDotNotation === false) {
                                            value = (0, lodash_1.get)(items[i].json, field);
                                        }
                                        else {
                                            value = items[i].json[field];
                                        }
                                        prev = Object.assign(Object.assign({}, prev), { [field]: value });
                                        return prev;
                                    }, {}));
                                }
                                else if (include === 'allOtherFields') {
                                    const keys = Object.keys(items[i].json);
                                    newItem = Object.assign({}, keys.reduce((prev, field) => {
                                        let value;
                                        if (disableDotNotation === false) {
                                            value = (0, lodash_1.get)(items[i].json, field);
                                        }
                                        else {
                                            value = items[i].json[field];
                                        }
                                        prev = Object.assign(Object.assign({}, prev), { [field]: value });
                                        return prev;
                                    }, {}));
                                    (0, lodash_1.unset)(newItem, fieldToSplitOut);
                                }
                                if (typeof element === 'object' && include === 'noOtherFields' && destinationFieldName === '') {
                                    newItem = Object.assign(Object.assign({}, newItem), element);
                                }
                                else {
                                    newItem = Object.assign(Object.assign({}, newItem), { [destinationFieldName || fieldToSplitOut]: element });
                                }
                                returnData.push({
                                    json: newItem,
                                    pairedItem: {
                                        item: i,
                                    },
                                });
                            }
                        }
                    }
                    return this.prepareOutputData(returnData);
                }
                else if (operation === 'aggregateItems') {
                    const disableDotNotation = this.getNodeParameter('options.disableDotNotation', 0, false);
                    const mergeLists = this.getNodeParameter('options.mergeLists', 0, false);
                    const fieldsToAggregate = this.getNodeParameter('fieldsToAggregate.fieldToAggregate', 0, []);
                    const keepMissing = this.getNodeParameter('options.keepMissing', 0, false);
                    if (!fieldsToAggregate.length) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No fields specified', { description: 'Please add a field to aggregate' });
                    }
                    for (const { fieldToAggregate } of fieldsToAggregate) {
                        let found = false;
                        for (const item of items) {
                            if (fieldToAggregate === '') {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Field to aggregate is blank', { description: 'Please add a field to aggregate' });
                            }
                            if (disableDotNotation === false) {
                                if ((0, lodash_1.get)(item.json, fieldToAggregate) !== undefined) {
                                    found = true;
                                }
                            }
                            else if (item.json.hasOwnProperty(fieldToAggregate)) {
                                found = true;
                            }
                        }
                        if (found === false && disableDotNotation && fieldToAggregate.includes('.')) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Couldn't find the field '${fieldToAggregate}' in the input data`, { description: `If you're trying to use a nested field, make sure you turn off 'disable dot notation' in the node options` });
                        }
                        else if (found === false && keepMissing === false) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Couldn't find the field '${fieldToAggregate}' in the input data`);
                        }
                    }
                    let newItem;
                    newItem = {
                        json: {},
                        pairedItem: Array.from({ length }, (_, i) => i).map(index => {
                            return {
                                item: index,
                            };
                        }),
                    };
                    // tslint:disable-next-line: no-any
                    const values = {};
                    const outputFields = [];
                    for (const { fieldToAggregate, outputFieldName, renameField } of fieldsToAggregate) {
                        const field = (renameField) ? outputFieldName : fieldToAggregate;
                        if (outputFields.includes(field)) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The '${field}' output field is used more than once`, { description: `Please make sure each output field name is unique` });
                        }
                        else {
                            outputFields.push(field);
                        }
                        const getFieldToAggregate = () => ((disableDotNotation === false && fieldToAggregate.includes('.')) ? fieldToAggregate.split('.').pop() : fieldToAggregate);
                        const _outputFieldName = (outputFieldName) ? (outputFieldName) : getFieldToAggregate();
                        if (fieldToAggregate !== '') {
                            values[_outputFieldName] = [];
                            for (let i = 0; i < length; i++) {
                                if (disableDotNotation === false) {
                                    let value = (0, lodash_1.get)(items[i].json, fieldToAggregate);
                                    if (!keepMissing) {
                                        if (Array.isArray(value)) {
                                            value = value.filter(value => value !== null);
                                        }
                                        else if (value === null || value === undefined) {
                                            continue;
                                        }
                                    }
                                    if (Array.isArray(value) && mergeLists) {
                                        values[_outputFieldName].push(...value);
                                    }
                                    else {
                                        values[_outputFieldName].push(value);
                                    }
                                }
                                else {
                                    let value = items[i].json[fieldToAggregate];
                                    if (!keepMissing) {
                                        if (Array.isArray(value)) {
                                            value = value.filter(value => value !== null);
                                        }
                                        else if (value === null || value === undefined) {
                                            continue;
                                        }
                                    }
                                    if (Array.isArray(value) && mergeLists) {
                                        values[_outputFieldName].push(...value);
                                    }
                                    else {
                                        values[_outputFieldName].push(value);
                                    }
                                }
                            }
                        }
                    }
                    for (const key of Object.keys(values)) {
                        if (disableDotNotation === false) {
                            (0, lodash_1.set)(newItem.json, key, values[key]);
                        }
                        else {
                            newItem.json[key] = values[key];
                        }
                    }
                    returnData.push(newItem);
                    return this.prepareOutputData(returnData);
                }
                else if (operation === 'removeDuplicates') {
                    const compare = this.getNodeParameter('compare', 0);
                    const disableDotNotation = this.getNodeParameter('options.disableDotNotation', 0, false);
                    const removeOtherFields = this.getNodeParameter('options.removeOtherFields', 0, false);
                    let keys = (disableDotNotation) ? Object.keys(items[0].json) : Object.keys(flattenKeys(items[0].json));
                    for (const item of items) {
                        for (const key of (disableDotNotation) ? Object.keys(item.json) : Object.keys(flattenKeys(item.json))) {
                            if (!keys.includes(key)) {
                                keys.push(key);
                            }
                        }
                    }
                    if (compare === 'allFieldsExcept') {
                        const fieldsToExclude = this.getNodeParameter('fieldsToExclude.fields', 0, []).map(field => field.fieldName);
                        if (!fieldsToExclude.length) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No fields specified. Please add a field to exclude from comparison');
                        }
                        if (disableDotNotation === false) {
                            keys = Object.keys(flattenKeys(items[0].json));
                        }
                        keys = keys.filter(key => !fieldsToExclude.includes(key));
                    }
                    if (compare === 'selectedFields') {
                        const fieldsToCompare = this.getNodeParameter('fieldsToCompare.fields', 0, []).map(field => field.fieldName);
                        if (!fieldsToCompare.length) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No fields specified. Please add a field to compare on');
                        }
                        if (disableDotNotation === false) {
                            keys = Object.keys(flattenKeys(items[0].json));
                        }
                        keys = fieldsToCompare.map(key => (key.trim()));
                    }
                    // This solution is O(nlogn)
                    // add original index to the items
                    const newItems = items.map((item, index) => ({ json: Object.assign(Object.assign({}, item['json']), { __INDEX: index }), pairedItem: { item: index, } }));
                    //sort items using the compare keys
                    newItems.sort((a, b) => {
                        let result = 0;
                        for (const key of keys) {
                            let equal;
                            if (disableDotNotation === false) {
                                equal = (0, lodash_1.isEqual)((0, lodash_1.get)(a.json, key), (0, lodash_1.get)(b.json, key));
                            }
                            else {
                                equal = (0, lodash_1.isEqual)(a.json[key], b.json[key]);
                            }
                            if (!equal) {
                                let lessThan;
                                if (disableDotNotation === false) {
                                    lessThan = (0, lodash_1.lt)((0, lodash_1.get)(a.json, key), (0, lodash_1.get)(b.json, key));
                                }
                                else {
                                    lessThan = (0, lodash_1.lt)(a.json[key], b.json[key]);
                                }
                                result = lessThan ? -1 : 1;
                                break;
                            }
                        }
                        return result;
                    });
                    for (const key of keys) {
                        // tslint:disable-next-line: no-any
                        let type = undefined;
                        for (const item of newItems) {
                            if (key === '') {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Name of field to compare is blank`);
                            }
                            const value = ((!disableDotNotation) ? (0, lodash_1.get)(item.json, key) : item.json[key]);
                            if (value === undefined && disableDotNotation && key.includes('.')) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `'${key}' field is missing from some input items`, { description: `If you're trying to use a nested field, make sure you turn off 'disable dot notation' in the node options` });
                            }
                            else if (value === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `'${key}' field is missing from some input items`);
                            }
                            if (type !== undefined && value !== undefined && type !== typeof value) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `'${key}' isn't always the same type`, { description: 'The type of this field varies between items' });
                            }
                            else {
                                type = typeof value;
                            }
                        }
                    }
                    // collect the original indexes of items to be removed
                    const removedIndexes = [];
                    let temp = newItems[0];
                    for (let index = 1; index < newItems.length; index++) {
                        if (compareItems(newItems[index], temp, keys, disableDotNotation, this.getNode())) {
                            removedIndexes.push(newItems[index].json.__INDEX);
                        }
                        else {
                            temp = newItems[index];
                        }
                    }
                    let data = items.filter((_, index) => !removedIndexes.includes(index));
                    if (removeOtherFields) {
                        data = data.map((item, index) => ({ json: (0, lodash_1.pick)(item.json, ...keys), pairedItem: { item: index, } }));
                    }
                    // return the filtered items
                    return this.prepareOutputData(data);
                }
                else if (operation === 'sort') {
                    let newItems = [...items];
                    const type = this.getNodeParameter('type', 0);
                    const disableDotNotation = this.getNodeParameter('options.disableDotNotation', 0, false);
                    if (type === 'random') {
                        shuffleArray(newItems);
                        return this.prepareOutputData(newItems);
                    }
                    if (type === 'simple') {
                        const sortFieldsUi = this.getNodeParameter('sortFieldsUi', 0);
                        const sortFields = sortFieldsUi.sortField;
                        if (!sortFields || !sortFields.length) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No sorting specified. Please add a field to sort by');
                        }
                        for (const { fieldName } of sortFields) {
                            let found = false;
                            for (const item of items) {
                                if (disableDotNotation === false) {
                                    if ((0, lodash_1.get)(item.json, fieldName) !== undefined) {
                                        found = true;
                                    }
                                }
                                else if (item.json.hasOwnProperty(fieldName)) {
                                    found = true;
                                }
                            }
                            if (found === false && disableDotNotation && fieldName.includes('.')) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Couldn't find the field '${fieldName}' in the input data`, { description: `If you're trying to use a nested field, make sure you turn off 'disable dot notation' in the node options` });
                            }
                            else if (found === false) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Couldn't find the field '${fieldName}' in the input data`);
                            }
                        }
                        const sortFieldsWithDirection = sortFields.map(field => ({ name: field.fieldName, dir: field.order === 'ascending' ? 1 : -1 }));
                        newItems.sort((a, b) => {
                            let result = 0;
                            for (const field of sortFieldsWithDirection) {
                                let equal;
                                if (disableDotNotation === false) {
                                    const _a = (typeof (0, lodash_1.get)(a.json, field.name) === 'string') ? (0, lodash_1.get)(a.json, field.name).toLowerCase() : (0, lodash_1.get)(a.json, field.name);
                                    const _b = (typeof (0, lodash_1.get)(b.json, field.name) === 'string') ? (0, lodash_1.get)(b.json, field.name).toLowerCase() : (0, lodash_1.get)(b.json, field.name);
                                    equal = (0, lodash_1.isEqual)(_a, _b);
                                }
                                else {
                                    const _a = (typeof a.json[field.name] === 'string') ? a.json[field.name].toLowerCase() : a.json[field.name];
                                    const _b = (typeof b.json[field.name] === 'string') ? b.json[field.name].toLowerCase() : b.json[field.name];
                                    equal = (0, lodash_1.isEqual)(_a, _b);
                                }
                                if (!equal) {
                                    let lessThan;
                                    if (disableDotNotation === false) {
                                        const _a = (typeof (0, lodash_1.get)(a.json, field.name) === 'string') ? (0, lodash_1.get)(a.json, field.name).toLowerCase() : (0, lodash_1.get)(a.json, field.name);
                                        const _b = (typeof (0, lodash_1.get)(b.json, field.name) === 'string') ? (0, lodash_1.get)(b.json, field.name).toLowerCase() : (0, lodash_1.get)(b.json, field.name);
                                        lessThan = (0, lodash_1.lt)(_a, _b);
                                    }
                                    else {
                                        const _a = (typeof a.json[field.name] === 'string') ? a.json[field.name].toLowerCase() : a.json[field.name];
                                        const _b = (typeof b.json[field.name] === 'string') ? b.json[field.name].toLowerCase() : b.json[field.name];
                                        lessThan = (0, lodash_1.lt)(_a, _b);
                                    }
                                    if (lessThan) {
                                        result = -1 * field.dir;
                                    }
                                    else {
                                        result = 1 * field.dir;
                                    }
                                    break;
                                }
                            }
                            return result;
                        });
                    }
                    else {
                        const code = this.getNodeParameter('code', 0);
                        const regexCheck = /\breturn\b/g.exec(code);
                        if (regexCheck && regexCheck.length) {
                            const sandbox = {
                                newItems,
                            };
                            const mode = this.getMode();
                            const options = {
                                console: (mode === 'manual') ? 'redirect' : 'inherit',
                                sandbox,
                            };
                            const vm = new NodeVM(options);
                            newItems = (yield vm.run(`
						module.exports = async function() {
							newItems.sort( (a,b) => {
								${code}
							})
							return newItems;
						}()`, __dirname));
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Sort code doesn't return. Please add a 'return' statement to your code`);
                        }
                    }
                    return this.prepareOutputData(newItems);
                }
                else if (operation === 'limit') {
                    let newItems = items;
                    const maxItems = this.getNodeParameter('maxItems', 0);
                    const keep = this.getNodeParameter('keep', 0);
                    if (maxItems > items.length) {
                        return this.prepareOutputData(newItems);
                    }
                    if (keep === 'firstItems') {
                        newItems = items.slice(0, maxItems);
                    }
                    else {
                        newItems = items.slice(items.length - maxItems, items.length);
                    }
                    return this.prepareOutputData(newItems);
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Operation '${operation}' is not recognized`);
                }
            }
            else {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Resource '${resource}' is not recognized`);
            }
        });
    }
}
exports.ItemLists = ItemLists;
const compareItems = (obj, obj2, keys, disableDotNotation, node) => {
    let result = true;
    for (const key of keys) {
        if (disableDotNotation === false) {
            if (!(0, lodash_1.isEqual)((0, lodash_1.get)(obj.json, key), (0, lodash_1.get)(obj2.json, key))) {
                result = false;
                break;
            }
        }
        else {
            if (!(0, lodash_1.isEqual)(obj.json[key], obj2.json[key])) {
                result = false;
                break;
            }
        }
    }
    return result;
};
const flattenKeys = (obj, path = []) => {
    return !(0, lodash_1.isObject)(obj)
        ? { [path.join('.')]: obj }
        : (0, lodash_1.reduce)(obj, (cum, next, key) => (0, lodash_1.merge)(cum, flattenKeys(next, [...path, key])), {});
};
// tslint:disable-next-line: no-any
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

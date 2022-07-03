"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Set = void 0;
const lodash_1 = require("lodash");
class Set {
    constructor() {
        this.description = {
            displayName: 'Set',
            name: 'set',
            icon: 'fa:pen',
            group: ['input'],
            version: 1,
            description: 'Sets values on items and optionally remove other values',
            defaults: {
                name: 'Set',
                color: '#0000FF',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Keep Only Set',
                    name: 'keepOnlySet',
                    type: 'boolean',
                    default: false,
                    description: 'Whether only the values set on this node should be kept and all others removed',
                },
                {
                    displayName: 'Values to Set',
                    name: 'values',
                    placeholder: 'Add Value',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                        sortable: true,
                    },
                    description: 'The value to set',
                    default: {},
                    options: [
                        {
                            name: 'boolean',
                            displayName: 'Boolean',
                            values: [
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'string',
                                    default: 'propertyName',
                                    description: 'Name of the property to write data to. Supports dot-notation. Example: "data.person[0].name"',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'boolean',
                                    default: false,
                                    // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                                    description: 'The boolean value to write in the property',
                                },
                            ],
                        },
                        {
                            name: 'number',
                            displayName: 'Number',
                            values: [
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'string',
                                    default: 'propertyName',
                                    description: 'Name of the property to write data to. Supports dot-notation. Example: "data.person[0].name"',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'number',
                                    default: 0,
                                    description: 'The number value to write in the property',
                                },
                            ],
                        },
                        {
                            name: 'string',
                            displayName: 'String',
                            values: [
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'string',
                                    default: 'propertyName',
                                    description: 'Name of the property to write data to. Supports dot-notation. Example: "data.person[0].name"',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'string',
                                    default: '',
                                    description: 'The string value to write in the property',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Dot Notation',
                            name: 'dotNotation',
                            type: 'boolean',
                            default: true,
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                            description: '<p>By default, dot-notation is used in property names. This means that "a.b" will set the property "b" underneath "a" so { "a": { "b": value} }.<p></p>If that is not intended this can be deactivated, it will then set { "a.b": value } instead.</p>.',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        const items = this.getInputData();
        if (items.length === 0) {
            items.push({ json: {} });
        }
        const returnData = [];
        let item;
        let keepOnlySet;
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            keepOnlySet = this.getNodeParameter('keepOnlySet', itemIndex, false);
            item = items[itemIndex];
            const options = this.getNodeParameter('options', itemIndex, {});
            const newItem = {
                json: {},
                pairedItem: item.pairedItem,
            };
            if (keepOnlySet !== true) {
                if (item.binary !== undefined) {
                    // Create a shallow copy of the binary data so that the old
                    // data references which do not get changed still stay behind
                    // but the incoming data does not get changed.
                    newItem.binary = {};
                    Object.assign(newItem.binary, item.binary);
                }
                newItem.json = JSON.parse(JSON.stringify(item.json));
            }
            // Add boolean values
            this.getNodeParameter('values.boolean', itemIndex, []).forEach((setItem) => {
                if (options.dotNotation === false) {
                    newItem.json[setItem.name] = !!setItem.value;
                }
                else {
                    (0, lodash_1.set)(newItem.json, setItem.name, !!setItem.value);
                }
            });
            // Add number values
            this.getNodeParameter('values.number', itemIndex, []).forEach((setItem) => {
                if (options.dotNotation === false) {
                    newItem.json[setItem.name] = setItem.value;
                }
                else {
                    (0, lodash_1.set)(newItem.json, setItem.name, setItem.value);
                }
            });
            // Add string values
            this.getNodeParameter('values.string', itemIndex, []).forEach((setItem) => {
                if (options.dotNotation === false) {
                    newItem.json[setItem.name] = setItem.value;
                }
                else {
                    (0, lodash_1.set)(newItem.json, setItem.name, setItem.value);
                }
            });
            returnData.push(newItem);
        }
        return this.prepareOutputData(returnData);
    }
}
exports.Set = Set;

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
exports.RenameKeys = void 0;
const lodash_1 = require("lodash");
class RenameKeys {
    constructor() {
        this.description = {
            displayName: 'Rename Keys',
            name: 'renameKeys',
            icon: 'fa:edit',
            group: ['transform'],
            version: 1,
            description: 'Renames keys',
            defaults: {
                name: 'Rename Keys',
                color: '#772244',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Keys',
                    name: 'keys',
                    placeholder: 'Add new key',
                    description: 'Adds a key which should be renamed',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                        sortable: true,
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Key',
                            name: 'key',
                            values: [
                                {
                                    displayName: 'Current Key Name',
                                    name: 'currentKey',
                                    type: 'string',
                                    default: '',
                                    placeholder: 'currentKey',
                                    description: 'The current name of the key. It is also possible to define deep keys by using dot-notation like for example: "level1.level2.currentKey".',
                                },
                                {
                                    displayName: 'New Key Name',
                                    name: 'newKey',
                                    type: 'string',
                                    default: '',
                                    placeholder: 'newKey',
                                    description: 'The name the key should be renamed to. It is also possible to define deep keys by using dot-notation like for example: "level1.level2.newKey".',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let item;
            let newItem;
            let renameKeys;
            let value; // tslint:disable-line:no-any
            for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                renameKeys = this.getNodeParameter('keys.key', itemIndex, []);
                item = items[itemIndex];
                // Copy the whole JSON data as data on any level can be renamed
                newItem = {
                    json: JSON.parse(JSON.stringify(item.json)),
                    pairedItem: {
                        item: itemIndex,
                    },
                };
                if (item.binary !== undefined) {
                    // Reference binary data if any exists. We can reference it
                    // as this nodes does not change it
                    newItem.binary = item.binary;
                }
                renameKeys.forEach((renameKey) => {
                    if (renameKey.currentKey === '' || renameKey.newKey === '' || renameKey.currentKey === renameKey.newKey) {
                        // Ignore all which do not have all the values set or if the new key is equal to the current key
                        return;
                    }
                    value = (0, lodash_1.get)(item.json, renameKey.currentKey);
                    if (value === undefined) {
                        return;
                    }
                    (0, lodash_1.set)(newItem.json, renameKey.newKey, value);
                    (0, lodash_1.unset)(newItem.json, renameKey.currentKey);
                });
                returnData.push(newItem);
            }
            return [returnData];
        });
    }
}
exports.RenameKeys = RenameKeys;

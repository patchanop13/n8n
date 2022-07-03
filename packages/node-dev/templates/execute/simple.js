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
exports.ClassNameReplace = void 0;
class ClassNameReplace {
    constructor() {
        this.description = {
            displayName: 'DisplayNameReplace',
            name: 'N8nNameReplace',
            group: ['transform'],
            version: 1,
            description: 'NodeDescriptionReplace',
            defaults: {
                name: 'DisplayNameReplace',
                color: '#772244',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                // Node properties which the user gets displayed and
                // can change on the node.
                {
                    displayName: 'My String',
                    name: 'myString',
                    type: 'string',
                    default: '',
                    placeholder: 'Placeholder value',
                    description: 'The description text',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            let item;
            let myString;
            // Itterates over all input items and add the key "myString" with the
            // value the parameter "myString" resolves to.
            // (This could be a different value for each item in case it contains an expression)
            for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                myString = this.getNodeParameter('myString', itemIndex, '');
                item = items[itemIndex];
                item.json.myString = myString;
            }
            return this.prepareOutputData(items);
        });
    }
}
exports.ClassNameReplace = ClassNameReplace;

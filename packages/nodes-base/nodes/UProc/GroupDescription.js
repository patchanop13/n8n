"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupOptions = void 0;
const Groups_1 = require("./Json/Groups");
const finalGroups = {
    displayName: 'Resource',
    name: 'group',
    type: 'options',
    default: 'communication',
    options: [],
};
const options = [];
for (const group of Groups_1.groups.groups) {
    const item = {
        name: group.translated,
        value: group.name,
        description: 'The ' + group.translated + ' Resource allows you to get tools from this resource',
    };
    options.push(item);
}
//@ts-ignore
finalGroups.options = options;
const mappedGroups = [finalGroups];
exports.groupOptions = mappedGroups;

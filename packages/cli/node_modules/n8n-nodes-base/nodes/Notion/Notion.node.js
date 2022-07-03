"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notion = void 0;
const NotionV1_node_1 = require("./v1/NotionV1.node");
const NotionV2_node_1 = require("./v2/NotionV2.node");
const NodeVersionedType_1 = require("../../src/NodeVersionedType");
class Notion extends NodeVersionedType_1.NodeVersionedType {
    constructor() {
        const baseDescription = {
            displayName: 'Notion (Beta)',
            name: 'notion',
            icon: 'file:notion.svg',
            group: ['output'],
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Notion API (Beta)',
            defaultVersion: 2,
        };
        const nodeVersions = {
            1: new NotionV1_node_1.NotionV1(baseDescription),
            2: new NotionV2_node_1.NotionV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.Notion = Notion;

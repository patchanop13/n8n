"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncroMsp = void 0;
const NodeVersionedType_1 = require("../../src/NodeVersionedType");
const SyncroMspV1_node_1 = require("./v1/SyncroMspV1.node");
class SyncroMsp extends NodeVersionedType_1.NodeVersionedType {
    constructor() {
        const baseDescription = {
            displayName: 'SyncroMSP',
            name: 'syncroMsp',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:syncromsp.png',
            group: ['output'],
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Manage contacts, tickets and more from Syncro MSP',
            defaultVersion: 1,
        };
        const nodeVersions = {
            1: new SyncroMspV1_node_1.SyncroMspV1(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.SyncroMsp = SyncroMsp;

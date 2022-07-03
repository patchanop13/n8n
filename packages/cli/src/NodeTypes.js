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
exports.NodeTypes = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const n8n_workflow_1 = require("n8n-workflow");
class NodeTypesClass {
    constructor() {
        this.nodeTypes = {};
    }
    init(nodeTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            // Some nodeTypes need to get special parameters applied like the
            // polling nodes the polling times
            // eslint-disable-next-line no-restricted-syntax
            for (const nodeTypeData of Object.values(nodeTypes)) {
                const nodeType = n8n_workflow_1.NodeHelpers.getVersionedNodeType(nodeTypeData.type);
                const applyParameters = n8n_workflow_1.NodeHelpers.getSpecialNodeParameters(nodeType);
                if (applyParameters.length) {
                    nodeType.description.properties.unshift(...applyParameters);
                }
            }
            this.nodeTypes = nodeTypes;
        });
    }
    getAll() {
        return Object.values(this.nodeTypes).map((data) => data.type);
    }
    /**
     * Variant of `getByNameAndVersion` that includes the node's source path, used to locate a node's translations.
     */
    getWithSourcePath(nodeTypeName, version) {
        const nodeType = this.nodeTypes[nodeTypeName];
        if (!nodeType) {
            throw new Error(`Unknown node type: ${nodeTypeName}`);
        }
        const { description } = n8n_workflow_1.NodeHelpers.getVersionedNodeType(nodeType.type, version);
        return { description: Object.assign({}, description), sourcePath: nodeType.sourcePath };
    }
    getByNameAndVersion(nodeType, version) {
        if (this.nodeTypes[nodeType] === undefined) {
            throw new Error(`The node-type "${nodeType}" is not known!`);
        }
        return n8n_workflow_1.NodeHelpers.getVersionedNodeType(this.nodeTypes[nodeType].type, version);
    }
}
let nodeTypesInstance;
// eslint-disable-next-line @typescript-eslint/naming-convention
function NodeTypes() {
    if (nodeTypesInstance === undefined) {
        nodeTypesInstance = new NodeTypesClass();
    }
    return nodeTypesInstance;
}
exports.NodeTypes = NodeTypes;

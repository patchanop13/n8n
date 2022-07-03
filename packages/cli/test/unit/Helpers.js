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
const n8n_workflow_1 = require("n8n-workflow");
class NodeTypesClass {
    constructor() {
        this.nodeTypes = {
            'test.set': {
                sourcePath: '',
                type: {
                    description: {
                        displayName: 'Set',
                        name: 'set',
                        group: ['input'],
                        version: 1,
                        description: 'Sets a value',
                        defaults: {
                            name: 'Set',
                            color: '#0000FF',
                        },
                        inputs: ['main'],
                        outputs: ['main'],
                        properties: [
                            {
                                displayName: 'Value1',
                                name: 'value1',
                                type: 'string',
                                default: 'default-value1',
                            },
                            {
                                displayName: 'Value2',
                                name: 'value2',
                                type: 'string',
                                default: 'default-value2',
                            },
                        ],
                    },
                },
            },
        };
    }
    init(nodeTypes) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getAll() {
        console.log('1234');
        return Object.values(this.nodeTypes).map((data) => n8n_workflow_1.NodeHelpers.getVersionedNodeType(data.type));
    }
    getByName(nodeType) {
        return this.getByNameAndVersion(nodeType);
    }
    getByNameAndVersion(nodeType, version) {
        return n8n_workflow_1.NodeHelpers.getVersionedNodeType(this.nodeTypes[nodeType].type, version);
    }
}
let nodeTypesInstance;
function NodeTypes() {
    if (nodeTypesInstance === undefined) {
        nodeTypesInstance = new NodeTypesClass();
    }
    return nodeTypesInstance;
}
exports.NodeTypes = NodeTypes;

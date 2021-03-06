"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const n8n_workflow_1 = require("n8n-workflow");
const src_1 = require("../src");
const Helpers = __importStar(require("./Helpers"));
describe('WorkflowExecute', () => {
    describe('run', () => {
        const tests = [
            {
                description: 'should run basic two node workflow',
                input: {
                    // Leave the workflowData in regular JSON to be able to easily
                    // copy it from/in the UI
                    workflowData: {
                        nodes: [
                            {
                                parameters: {},
                                name: 'Start',
                                type: 'n8n-nodes-base.start',
                                typeVersion: 1,
                                position: [100, 300],
                            },
                            {
                                parameters: {
                                    values: {
                                        number: [
                                            {
                                                name: 'value1',
                                                value: 1,
                                            },
                                        ],
                                    },
                                },
                                name: 'Set',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [280, 300],
                            },
                        ],
                        connections: {
                            Start: {
                                main: [
                                    [
                                        {
                                            node: 'Set',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                },
                output: {
                    nodeExecutionOrder: ['Start', 'Set'],
                    nodeData: {
                        Set: [
                            [
                                {
                                    value1: 1,
                                },
                            ],
                        ],
                    },
                },
            },
            {
                description: 'should run node twice when it has two input connections',
                input: {
                    // Leave the workflowData in regular JSON to be able to easily
                    // copy it from/in the UI
                    workflowData: {
                        nodes: [
                            {
                                parameters: {},
                                name: 'Start',
                                type: 'n8n-nodes-base.start',
                                typeVersion: 1,
                                position: [100, 300],
                            },
                            {
                                parameters: {
                                    values: {
                                        number: [
                                            {
                                                name: 'value1',
                                                value: 1,
                                            },
                                        ],
                                    },
                                },
                                name: 'Set1',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [300, 250],
                            },
                            {
                                parameters: {
                                    values: {
                                        number: [
                                            {
                                                name: 'value2',
                                                value: 2,
                                            },
                                        ],
                                    },
                                },
                                name: 'Set2',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [500, 400],
                            },
                        ],
                        connections: {
                            Start: {
                                main: [
                                    [
                                        {
                                            node: 'Set1',
                                            type: 'main',
                                            index: 0,
                                        },
                                        {
                                            node: 'Set2',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            Set1: {
                                main: [
                                    [
                                        {
                                            node: 'Set2',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                },
                output: {
                    nodeExecutionOrder: ['Start', 'Set1', 'Set2', 'Set2'],
                    nodeData: {
                        Set1: [
                            [
                                {
                                    value1: 1,
                                },
                            ],
                        ],
                        Set2: [
                            [
                                {
                                    value2: 2,
                                },
                            ],
                            [
                                {
                                    value1: 1,
                                    value2: 2,
                                },
                            ],
                        ],
                    },
                },
            },
            {
                description: 'should run complicated multi node workflow',
                input: {
                    // Leave the workflowData in regular JSON to be able to easily
                    // copy it from/in the UI
                    workflowData: {
                        nodes: [
                            {
                                parameters: {
                                    mode: 'passThrough',
                                },
                                name: 'Merge4',
                                type: 'n8n-nodes-base.merge',
                                typeVersion: 1,
                                position: [1150, 500],
                            },
                            {
                                parameters: {
                                    values: {
                                        number: [
                                            {
                                                name: 'value2',
                                                value: 2,
                                            },
                                        ],
                                    },
                                },
                                name: 'Set2',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [290, 400],
                            },
                            {
                                parameters: {
                                    values: {
                                        number: [
                                            {
                                                name: 'value4',
                                                value: 4,
                                            },
                                        ],
                                    },
                                },
                                name: 'Set4',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [850, 200],
                            },
                            {
                                parameters: {
                                    values: {
                                        number: [
                                            {
                                                name: 'value3',
                                                value: 3,
                                            },
                                        ],
                                    },
                                },
                                name: 'Set3',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [650, 200],
                            },
                            {
                                parameters: {
                                    mode: 'passThrough',
                                },
                                name: 'Merge4',
                                type: 'n8n-nodes-base.merge',
                                typeVersion: 1,
                                position: [1150, 500],
                            },
                            {
                                parameters: {},
                                name: 'Merge3',
                                type: 'n8n-nodes-base.merge',
                                typeVersion: 1,
                                position: [1000, 400],
                            },
                            {
                                parameters: {
                                    mode: 'passThrough',
                                    output: 'input2',
                                },
                                name: 'Merge2',
                                type: 'n8n-nodes-base.merge',
                                typeVersion: 1,
                                position: [700, 400],
                            },
                            {
                                parameters: {},
                                name: 'Merge1',
                                type: 'n8n-nodes-base.merge',
                                typeVersion: 1,
                                position: [500, 300],
                            },
                            {
                                parameters: {
                                    values: {
                                        number: [
                                            {
                                                name: 'value1',
                                                value: 1,
                                            },
                                        ],
                                    },
                                },
                                name: 'Set1',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [300, 200],
                            },
                            {
                                parameters: {},
                                name: 'Start',
                                type: 'n8n-nodes-base.start',
                                typeVersion: 1,
                                position: [100, 300],
                            },
                        ],
                        connections: {
                            Set2: {
                                main: [
                                    [
                                        {
                                            node: 'Merge1',
                                            type: 'main',
                                            index: 1,
                                        },
                                        {
                                            node: 'Merge2',
                                            type: 'main',
                                            index: 1,
                                        },
                                    ],
                                ],
                            },
                            Set4: {
                                main: [
                                    [
                                        {
                                            node: 'Merge3',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            Set3: {
                                main: [
                                    [
                                        {
                                            node: 'Set4',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            Merge3: {
                                main: [
                                    [
                                        {
                                            node: 'Merge4',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            Merge2: {
                                main: [
                                    [
                                        {
                                            node: 'Merge3',
                                            type: 'main',
                                            index: 1,
                                        },
                                    ],
                                ],
                            },
                            Merge1: {
                                main: [
                                    [
                                        {
                                            node: 'Merge2',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            Set1: {
                                main: [
                                    [
                                        {
                                            node: 'Merge1',
                                            type: 'main',
                                            index: 0,
                                        },
                                        {
                                            node: 'Set3',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            Start: {
                                main: [
                                    [
                                        {
                                            node: 'Set1',
                                            type: 'main',
                                            index: 0,
                                        },
                                        {
                                            node: 'Set2',
                                            type: 'main',
                                            index: 0,
                                        },
                                        {
                                            node: 'Merge4',
                                            type: 'main',
                                            index: 1,
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                },
                output: {
                    nodeExecutionOrder: [
                        'Start',
                        'Set1',
                        'Set2',
                        'Set3',
                        'Merge1',
                        'Set4',
                        'Merge2',
                        'Merge3',
                        'Merge4',
                    ],
                    nodeData: {
                        Set1: [
                            [
                                {
                                    value1: 1,
                                },
                            ],
                        ],
                        Set2: [
                            [
                                {
                                    value2: 2,
                                },
                            ],
                        ],
                        Set3: [
                            [
                                {
                                    value1: 1,
                                    value3: 3,
                                },
                            ],
                        ],
                        Set4: [
                            [
                                {
                                    value1: 1,
                                    value3: 3,
                                    value4: 4,
                                },
                            ],
                        ],
                        Merge1: [
                            [
                                {
                                    value1: 1,
                                },
                                {
                                    value2: 2,
                                },
                            ],
                        ],
                        Merge2: [
                            [
                                {
                                    value2: 2,
                                },
                            ],
                        ],
                        Merge3: [
                            [
                                {
                                    value1: 1,
                                    value3: 3,
                                    value4: 4,
                                },
                                {
                                    value2: 2,
                                },
                            ],
                        ],
                        Merge4: [
                            [
                                {
                                    value1: 1,
                                    value3: 3,
                                    value4: 4,
                                },
                                {
                                    value2: 2,
                                },
                            ],
                        ],
                    },
                },
            },
            {
                description: 'should run workflow also if node has multiple input connections and one is empty',
                input: {
                    // Leave the workflowData in regular JSON to be able to easily
                    // copy it from/in the UI
                    workflowData: {
                        nodes: [
                            {
                                parameters: {},
                                name: 'Start',
                                type: 'n8n-nodes-base.start',
                                typeVersion: 1,
                                position: [250, 450],
                            },
                            {
                                parameters: {
                                    conditions: {
                                        boolean: [],
                                        number: [
                                            {
                                                value1: '={{Object.keys($json).length}}',
                                                operation: 'notEqual',
                                            },
                                        ],
                                    },
                                },
                                name: 'IF',
                                type: 'n8n-nodes-base.if',
                                typeVersion: 1,
                                position: [650, 350],
                            },
                            {
                                parameters: {},
                                name: 'Merge1',
                                type: 'n8n-nodes-base.merge',
                                typeVersion: 1,
                                position: [1150, 450],
                            },
                            {
                                parameters: {
                                    values: {
                                        string: [
                                            {
                                                name: 'test1',
                                                value: 'a',
                                            },
                                        ],
                                    },
                                    options: {},
                                },
                                name: 'Set1',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [450, 450],
                            },
                            {
                                parameters: {
                                    values: {
                                        string: [
                                            {
                                                name: 'test2',
                                                value: 'b',
                                            },
                                        ],
                                    },
                                    options: {},
                                },
                                name: 'Set2',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [800, 250],
                            },
                        ],
                        connections: {
                            Start: {
                                main: [
                                    [
                                        {
                                            node: 'Set1',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            IF: {
                                main: [
                                    [
                                        {
                                            node: 'Set2',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                    [
                                        {
                                            node: 'Merge1',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            Set1: {
                                main: [
                                    [
                                        {
                                            node: 'IF',
                                            type: 'main',
                                            index: 0,
                                        },
                                        {
                                            node: 'Merge1',
                                            type: 'main',
                                            index: 1,
                                        },
                                    ],
                                ],
                            },
                            Set2: {
                                main: [
                                    [
                                        {
                                            node: 'Merge1',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                },
                output: {
                    nodeExecutionOrder: ['Start', 'Set1', 'IF', 'Set2', 'Merge1'],
                    nodeData: {
                        Merge1: [
                            [
                                {
                                    test1: 'a',
                                    test2: 'b',
                                },
                                {
                                    test1: 'a',
                                },
                            ],
                        ],
                    },
                },
            },
            {
                description: 'should use empty data if second input does not have any data',
                input: {
                    // Leave the workflowData in regular JSON to be able to easily
                    // copy it from/in the UI
                    workflowData: {
                        nodes: [
                            {
                                parameters: {},
                                name: 'Start',
                                type: 'n8n-nodes-base.start',
                                typeVersion: 1,
                                position: [250, 300],
                            },
                            {
                                parameters: {},
                                name: 'Merge',
                                type: 'n8n-nodes-base.merge',
                                typeVersion: 1,
                                position: [800, 450],
                            },
                            {
                                parameters: {},
                                name: 'Merge1',
                                type: 'n8n-nodes-base.merge',
                                typeVersion: 1,
                                position: [1000, 300],
                            },
                            {
                                parameters: {
                                    conditions: {
                                        boolean: [
                                            {
                                                value2: true,
                                            },
                                        ],
                                        string: [
                                            {
                                                value1: '={{$json["key"]}}',
                                                value2: 'a',
                                            },
                                        ],
                                    },
                                    combineOperation: 'any',
                                },
                                name: 'IF',
                                type: 'n8n-nodes-base.if',
                                typeVersion: 1,
                                position: [600, 600],
                                alwaysOutputData: false,
                            },
                            {
                                parameters: {
                                    values: {
                                        number: [
                                            {
                                                name: 'number0',
                                            },
                                        ],
                                        string: [
                                            {
                                                name: 'key',
                                                value: 'a',
                                            },
                                        ],
                                    },
                                    options: {},
                                },
                                name: 'Set0',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [450, 300],
                            },
                            {
                                parameters: {
                                    values: {
                                        number: [
                                            {
                                                name: 'number1',
                                                value: 1,
                                            },
                                        ],
                                        string: [
                                            {
                                                name: 'key',
                                                value: 'b',
                                            },
                                        ],
                                    },
                                    options: {},
                                },
                                name: 'Set1',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [450, 450],
                            },
                            {
                                parameters: {
                                    values: {
                                        number: [
                                            {
                                                name: 'number2',
                                                value: 2,
                                            },
                                        ],
                                        string: [
                                            {
                                                name: 'key',
                                                value: 'c',
                                            },
                                        ],
                                    },
                                    options: {},
                                },
                                name: 'Set2',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [450, 600],
                            },
                        ],
                        connections: {
                            Start: {
                                main: [
                                    [
                                        {
                                            node: 'Set0',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            Merge: {
                                main: [
                                    [
                                        {
                                            node: 'Merge1',
                                            type: 'main',
                                            index: 1,
                                        },
                                    ],
                                ],
                            },
                            IF: {
                                main: [
                                    [
                                        {
                                            node: 'Merge',
                                            type: 'main',
                                            index: 1,
                                        },
                                    ],
                                ],
                            },
                            Set0: {
                                main: [
                                    [
                                        {
                                            node: 'Merge1',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            Set1: {
                                main: [
                                    [
                                        {
                                            node: 'Merge',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            Set2: {
                                main: [
                                    [
                                        {
                                            node: 'IF',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                },
                output: {
                    nodeExecutionOrder: ['Start', 'Set0', 'Set2', 'IF', 'Set1', 'Merge', 'Merge1'],
                    nodeData: {
                        Merge: [
                            [
                                {
                                    number1: 1,
                                    key: 'b',
                                },
                            ],
                        ],
                        Merge1: [
                            [
                                {
                                    number0: 0,
                                    key: 'a',
                                },
                                {
                                    number1: 1,
                                    key: 'b',
                                },
                            ],
                        ],
                    },
                },
            },
            {
                description: 'should use empty data if input of sibling does not receive any data from parent',
                input: {
                    // Leave the workflowData in regular JSON to be able to easily
                    // copy it from/in the UI
                    workflowData: {
                        nodes: [
                            {
                                parameters: {},
                                name: 'Start',
                                type: 'n8n-nodes-base.start',
                                typeVersion: 1,
                                position: [250, 300],
                            },
                            {
                                parameters: {
                                    conditions: {
                                        number: [
                                            {
                                                value1: '={{$json["value1"]}}',
                                                operation: 'equal',
                                                value2: 1,
                                            },
                                        ],
                                    },
                                },
                                name: 'IF',
                                type: 'n8n-nodes-base.if',
                                typeVersion: 1,
                                position: [650, 300],
                            },
                            {
                                parameters: {
                                    values: {
                                        string: [],
                                        number: [
                                            {
                                                name: 'value2',
                                                value: 2,
                                            },
                                        ],
                                    },
                                    options: {},
                                },
                                name: 'Set2',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [850, 450],
                            },
                            {
                                parameters: {
                                    values: {
                                        number: [
                                            {
                                                name: 'value1',
                                                value: 1,
                                            },
                                        ],
                                    },
                                    options: {},
                                },
                                name: 'Set1',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [450, 300],
                            },
                            {
                                parameters: {},
                                name: 'Merge',
                                type: 'n8n-nodes-base.merge',
                                typeVersion: 1,
                                position: [1050, 300],
                            },
                        ],
                        connections: {
                            Start: {
                                main: [
                                    [
                                        {
                                            node: 'Set1',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            IF: {
                                main: [
                                    [
                                        {
                                            node: 'Merge',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                    [
                                        {
                                            node: 'Set2',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            Set2: {
                                main: [
                                    [
                                        {
                                            node: 'Merge',
                                            type: 'main',
                                            index: 1,
                                        },
                                    ],
                                ],
                            },
                            Set1: {
                                main: [
                                    [
                                        {
                                            node: 'IF',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                },
                output: {
                    nodeExecutionOrder: ['Start', 'Set1', 'IF', 'Set2', 'Merge'],
                    nodeData: {
                        Merge: [
                            [
                                {
                                    value1: 1,
                                },
                                {
                                    value2: 2,
                                },
                            ],
                        ],
                    },
                },
            },
            {
                description: 'should not use empty data in sibling if parent did not send any data',
                input: {
                    // Leave the workflowData in regular JSON to be able to easily
                    // copy it from/in the UI
                    workflowData: {
                        nodes: [
                            {
                                parameters: {},
                                name: 'Start',
                                type: 'n8n-nodes-base.start',
                                typeVersion: 1,
                                position: [250, 300],
                            },
                            {
                                parameters: {
                                    values: {
                                        number: [
                                            {
                                                name: 'value1',
                                            },
                                        ],
                                    },
                                    options: {},
                                },
                                name: 'Set',
                                type: 'n8n-nodes-base.set',
                                typeVersion: 1,
                                position: [450, 300],
                            },
                            {
                                parameters: {},
                                name: 'Merge',
                                type: 'n8n-nodes-base.merge',
                                typeVersion: 1,
                                position: [1050, 250],
                            },
                            {
                                parameters: {
                                    conditions: {
                                        number: [
                                            {
                                                value1: '={{$json["value1"]}}',
                                                operation: 'equal',
                                                value2: 1,
                                            },
                                        ],
                                    },
                                },
                                name: 'IF',
                                type: 'n8n-nodes-base.if',
                                typeVersion: 1,
                                position: [650, 300],
                            },
                            {
                                parameters: {},
                                name: 'NoOpTrue',
                                type: 'n8n-nodes-base.noOp',
                                typeVersion: 1,
                                position: [850, 150],
                            },
                            {
                                parameters: {},
                                name: 'NoOpFalse',
                                type: 'n8n-nodes-base.noOp',
                                typeVersion: 1,
                                position: [850, 400],
                            },
                        ],
                        connections: {
                            Start: {
                                main: [
                                    [
                                        {
                                            node: 'Set',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            Set: {
                                main: [
                                    [
                                        {
                                            node: 'IF',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            IF: {
                                main: [
                                    [
                                        {
                                            node: 'NoOpTrue',
                                            type: 'main',
                                            index: 0,
                                        },
                                        {
                                            node: 'Merge',
                                            type: 'main',
                                            index: 1,
                                        },
                                    ],
                                    [
                                        {
                                            node: 'NoOpFalse',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            NoOpTrue: {
                                main: [
                                    [
                                        {
                                            node: 'Merge',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                },
                output: {
                    nodeExecutionOrder: ['Start', 'Set', 'IF', 'NoOpFalse'],
                    nodeData: {
                        IF: [[]],
                        NoOpFalse: [
                            [
                                {
                                    value1: 0,
                                },
                            ],
                        ],
                    },
                },
            },
            {
                description: 'should display the correct parameters and so correct data when simplified node-versioning is used',
                input: {
                    workflowData: {
                        nodes: [
                            {
                                parameters: {},
                                name: 'Start',
                                type: 'n8n-nodes-base.start',
                                typeVersion: 1,
                                position: [240, 300],
                            },
                            {
                                parameters: {},
                                name: 'VersionTest1a',
                                type: 'n8n-nodes-base.versionTest',
                                typeVersion: 1,
                                position: [460, 300],
                            },
                            {
                                parameters: {
                                    versionTest: 11,
                                },
                                name: 'VersionTest1b',
                                type: 'n8n-nodes-base.versionTest',
                                typeVersion: 1,
                                position: [680, 300],
                            },
                            {
                                parameters: {},
                                name: 'VersionTest2a',
                                type: 'n8n-nodes-base.versionTest',
                                typeVersion: 2,
                                position: [880, 300],
                            },
                            {
                                parameters: {
                                    versionTest: 22,
                                },
                                name: 'VersionTest2b',
                                type: 'n8n-nodes-base.versionTest',
                                typeVersion: 2,
                                position: [1080, 300],
                            },
                        ],
                        connections: {
                            Start: {
                                main: [
                                    [
                                        {
                                            node: 'VersionTest1a',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            VersionTest1a: {
                                main: [
                                    [
                                        {
                                            node: 'VersionTest1b',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            VersionTest1b: {
                                main: [
                                    [
                                        {
                                            node: 'VersionTest2a',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                            VersionTest2a: {
                                main: [
                                    [
                                        {
                                            node: 'VersionTest2b',
                                            type: 'main',
                                            index: 0,
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                },
                output: {
                    nodeExecutionOrder: [
                        'Start',
                        'VersionTest1a',
                        'VersionTest1b',
                        'VersionTest2a',
                        'VersionTest2b',
                    ],
                    nodeData: {
                        VersionTest1a: [
                            [
                                {
                                    versionFromNode: 1,
                                    versionFromParameter: 1,
                                },
                            ],
                        ],
                        VersionTest1b: [
                            [
                                {
                                    versionFromNode: 1,
                                    versionFromParameter: 11,
                                },
                            ],
                        ],
                        VersionTest2a: [
                            [
                                {
                                    versionFromNode: 2,
                                    versionFromParameter: 2,
                                },
                            ],
                        ],
                        VersionTest2b: [
                            [
                                {
                                    versionFromNode: 2,
                                    versionFromParameter: 22,
                                },
                            ],
                        ],
                    },
                },
            },
        ];
        const fakeLogger = {
            log: () => { },
            debug: () => { },
            verbose: () => { },
            info: () => { },
            warn: () => { },
            error: () => { },
        };
        const executionMode = 'manual';
        const nodeTypes = Helpers.NodeTypes();
        n8n_workflow_1.LoggerProxy.init(fakeLogger);
        for (const testData of tests) {
            test(testData.description, () => __awaiter(void 0, void 0, void 0, function* () {
                const workflowInstance = new n8n_workflow_1.Workflow({
                    id: 'test',
                    nodes: testData.input.workflowData.nodes,
                    connections: testData.input.workflowData.connections,
                    active: false,
                    nodeTypes,
                });
                const waitPromise = yield (0, n8n_workflow_1.createDeferredPromise)();
                const nodeExecutionOrder = [];
                const additionalData = Helpers.WorkflowExecuteAdditionalData(waitPromise, nodeExecutionOrder);
                const workflowExecute = new src_1.WorkflowExecute(additionalData, executionMode);
                const executionData = yield workflowExecute.run(workflowInstance);
                const result = yield waitPromise.promise();
                // Check if the data from WorkflowExecute is identical to data received
                // by the webhooks
                expect(executionData).toEqual(result);
                // Check if the output data of the nodes is correct
                for (const nodeName of Object.keys(testData.output.nodeData)) {
                    if (result.data.resultData.runData[nodeName] === undefined) {
                        throw new Error(`Data for node "${nodeName}" is missing!`);
                    }
                    const resultData = result.data.resultData.runData[nodeName].map((nodeData) => {
                        if (nodeData.data === undefined) {
                            return null;
                        }
                        return nodeData.data.main[0].map((entry) => entry.json);
                    });
                    // expect(resultData).toEqual(testData.output.nodeData[nodeName]);
                    expect(resultData).toEqual(testData.output.nodeData[nodeName]);
                }
                // Check if the nodes did execute in the correct order
                expect(nodeExecutionOrder).toEqual(testData.output.nodeExecutionOrder);
                // Check if other data has correct value
                expect(result.finished).toEqual(true);
                expect(result.data.executionData.contextData).toEqual({});
                expect(result.data.executionData.nodeExecutionStack).toEqual([]);
            }));
        }
    });
});

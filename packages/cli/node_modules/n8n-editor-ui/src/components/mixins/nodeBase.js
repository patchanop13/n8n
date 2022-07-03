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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeBase = void 0;
const vue_typed_mixins_1 = __importDefault(require("vue-typed-mixins"));
const deviceSupportHelpers_1 = require("@/components/mixins/deviceSupportHelpers");
const nodeIndex_1 = require("@/components/mixins/nodeIndex");
const constants_1 = require("@/constants");
const CanvasHelpers = __importStar(require("@/views/canvasHelpers"));
const helpers_1 = require("../helpers");
exports.nodeBase = (0, vue_typed_mixins_1.default)(deviceSupportHelpers_1.deviceSupportHelpers, nodeIndex_1.nodeIndex).extend({
    mounted() {
        // Initialize the node
        if (this.data !== null) {
            this.__addNode(this.data);
        }
    },
    computed: {
        data() {
            return this.$store.getters.getNodeByName(this.name);
        },
        nodeId() {
            return constants_1.NODE_NAME_PREFIX + this.nodeIndex;
        },
        nodeIndex() {
            return this.$store.getters.getNodeIndex(this.data.name).toString();
        },
    },
    props: [
        'name',
        'instance',
        'isReadOnly',
        'isActive',
        'hideActions',
    ],
    methods: {
        __addInputEndpoints(node, nodeTypeData) {
            // Add Inputs
            let index;
            const indexData = {};
            nodeTypeData.inputs.forEach((inputName, i) => {
                // Increment the index for inputs with current name
                if (indexData.hasOwnProperty(inputName)) {
                    indexData[inputName]++;
                }
                else {
                    indexData[inputName] = 0;
                }
                index = indexData[inputName];
                // Get the position of the anchor depending on how many it has
                const anchorPosition = CanvasHelpers.ANCHOR_POSITIONS.input[nodeTypeData.inputs.length][index];
                const newEndpointData = {
                    uuid: CanvasHelpers.getInputEndpointUUID(this.nodeIndex, index),
                    anchor: anchorPosition,
                    maxConnections: -1,
                    endpoint: 'Rectangle',
                    endpointStyle: CanvasHelpers.getInputEndpointStyle(nodeTypeData, '--color-foreground-xdark'),
                    endpointHoverStyle: CanvasHelpers.getInputEndpointStyle(nodeTypeData, '--color-primary'),
                    isSource: false,
                    isTarget: !this.isReadOnly && nodeTypeData.inputs.length > 1,
                    parameters: {
                        nodeIndex: this.nodeIndex,
                        type: inputName,
                        index,
                    },
                    enabled: !this.isReadOnly,
                    cssClass: 'rect-input-endpoint',
                    dragAllowedWhenFull: true,
                    dropOptions: {
                        tolerance: 'touch',
                        hoverClass: 'dropHover',
                    },
                };
                if (nodeTypeData.inputNames) {
                    // Apply input names if they got set
                    newEndpointData.overlays = [
                        CanvasHelpers.getInputNameOverlay(nodeTypeData.inputNames[index]),
                    ];
                }
                const endpoint = this.instance.addEndpoint(this.nodeId, newEndpointData);
                endpoint.__meta = {
                    nodeName: node.name,
                    nodeId: this.nodeId,
                    index: i,
                    totalEndpoints: nodeTypeData.inputs.length,
                };
                // TODO: Activate again if it makes sense. Currently makes problems when removing
                //       connection on which the input has a name. It does not get hidden because
                //       the endpoint to which it connects when letting it go over the node is
                //       different to the regular one (have different ids). So that seems to make
                //       problems when hiding the input-name.
                // if (index === 0 && inputName === 'main') {
                // 	// Make the first main-input the default one to connect to when connection gets dropped on node
                // 	this.instance.makeTarget(this.nodeId, newEndpointData);
                // }
            });
        },
        __addOutputEndpoints(node, nodeTypeData) {
            let index;
            const indexData = {};
            nodeTypeData.outputs.forEach((inputName, i) => {
                // Increment the index for outputs with current name
                if (indexData.hasOwnProperty(inputName)) {
                    indexData[inputName]++;
                }
                else {
                    indexData[inputName] = 0;
                }
                index = indexData[inputName];
                // Get the position of the anchor depending on how many it has
                const anchorPosition = CanvasHelpers.ANCHOR_POSITIONS.output[nodeTypeData.outputs.length][index];
                const newEndpointData = {
                    uuid: CanvasHelpers.getOutputEndpointUUID(this.nodeIndex, index),
                    anchor: anchorPosition,
                    maxConnections: -1,
                    endpoint: 'Dot',
                    endpointStyle: CanvasHelpers.getOutputEndpointStyle(nodeTypeData, '--color-foreground-xdark'),
                    endpointHoverStyle: CanvasHelpers.getOutputEndpointStyle(nodeTypeData, '--color-primary'),
                    isSource: true,
                    isTarget: false,
                    enabled: !this.isReadOnly,
                    parameters: {
                        nodeIndex: this.nodeIndex,
                        type: inputName,
                        index,
                    },
                    cssClass: 'dot-output-endpoint',
                    dragAllowedWhenFull: false,
                    dragProxy: ['Rectangle', { width: 1, height: 1, strokeWidth: 0 }],
                };
                if (nodeTypeData.outputNames) {
                    // Apply output names if they got set
                    newEndpointData.overlays = [
                        CanvasHelpers.getOutputNameOverlay(nodeTypeData.outputNames[index]),
                    ];
                }
                const endpoint = this.instance.addEndpoint(this.nodeId, Object.assign({}, newEndpointData));
                endpoint.__meta = {
                    nodeName: node.name,
                    nodeId: this.nodeId,
                    index: i,
                    totalEndpoints: nodeTypeData.outputs.length,
                };
                if (!this.isReadOnly) {
                    const plusEndpointData = {
                        uuid: CanvasHelpers.getOutputEndpointUUID(this.nodeIndex, index),
                        anchor: anchorPosition,
                        maxConnections: -1,
                        endpoint: 'N8nPlus',
                        isSource: true,
                        isTarget: false,
                        enabled: !this.isReadOnly,
                        endpointStyle: {
                            fill: (0, helpers_1.getStyleTokenValue)('--color-xdark'),
                            outlineStroke: 'none',
                            hover: false,
                            showOutputLabel: nodeTypeData.outputs.length === 1,
                            size: nodeTypeData.outputs.length >= 3 ? 'small' : 'medium',
                            hoverMessage: this.$locale.baseText('nodeBase.clickToAddNodeOrDragToConnect'),
                        },
                        endpointHoverStyle: {
                            fill: (0, helpers_1.getStyleTokenValue)('--color-primary'),
                            outlineStroke: 'none',
                            hover: true, // hack to distinguish hover state
                        },
                        parameters: {
                            nodeIndex: this.nodeIndex,
                            type: inputName,
                            index,
                        },
                        cssClass: 'plus-draggable-endpoint',
                        dragAllowedWhenFull: false,
                        dragProxy: ['Rectangle', { width: 1, height: 1, strokeWidth: 0 }],
                    };
                    const plusEndpoint = this.instance.addEndpoint(this.nodeId, plusEndpointData);
                    plusEndpoint.__meta = {
                        nodeName: node.name,
                        nodeId: this.nodeId,
                        index: i,
                        totalEndpoints: nodeTypeData.outputs.length,
                    };
                }
            });
        },
        __makeInstanceDraggable(node) {
            // TODO: This caused problems with displaying old information
            //       https://github.com/jsplumb/katavorio/wiki
            //       https://jsplumb.github.io/jsplumb/home.html
            // Make nodes draggable
            this.instance.draggable(this.nodeId, {
                grid: [CanvasHelpers.GRID_SIZE, CanvasHelpers.GRID_SIZE],
                start: (params) => {
                    if (this.isReadOnly === true) {
                        // Do not allow to move nodes in readOnly mode
                        return false;
                    }
                    // @ts-ignore
                    this.dragging = true;
                    const isSelected = this.$store.getters.isNodeSelected(this.data.name);
                    const nodeName = this.data.name;
                    if (this.data.type === constants_1.STICKY_NODE_TYPE && !isSelected) {
                        setTimeout(() => {
                            this.$emit('nodeSelected', nodeName, false, true);
                        }, 0);
                    }
                    if (params.e && !isSelected) {
                        // Only the node which gets dragged directly gets an event, for all others it is
                        // undefined. So check if the currently dragged node is selected and if not clear
                        // the drag-selection.
                        this.instance.clearDragSelection();
                        this.$store.commit('resetSelectedNodes');
                    }
                    this.$store.commit('addActiveAction', 'dragActive');
                    return true;
                },
                stop: (params) => {
                    // @ts-ignore
                    this.dragging = false;
                    if (this.$store.getters.isActionActive('dragActive')) {
                        const moveNodes = this.$store.getters.getSelectedNodes.slice();
                        const selectedNodeNames = moveNodes.map((node) => node.name);
                        if (!selectedNodeNames.includes(this.data.name)) {
                            // If the current node is not in selected add it to the nodes which
                            // got moved manually
                            moveNodes.push(this.data);
                        }
                        // This does for some reason just get called once for the node that got clicked
                        // even though "start" and "drag" gets called for all. So lets do for now
                        // some dirty DOM query to get the new positions till I have more time to
                        // create a proper solution
                        let newNodePositon;
                        moveNodes.forEach((node) => {
                            const nodeElement = `node-${this.getNodeIndex(node.name)}`;
                            const element = document.getElementById(nodeElement);
                            if (element === null) {
                                return;
                            }
                            newNodePositon = [
                                parseInt(element.style.left.slice(0, -2), 10),
                                parseInt(element.style.top.slice(0, -2), 10),
                            ];
                            const updateInformation = {
                                name: node.name,
                                properties: {
                                    // @ts-ignore, draggable does not have definitions
                                    position: newNodePositon,
                                },
                            };
                            this.$store.commit('updateNodeProperties', updateInformation);
                        });
                        this.$emit('moved', node);
                    }
                },
                filter: '.node-description, .node-description .node-name, .node-description .node-subtitle',
            });
        },
        __addNode(node) {
            let nodeTypeData = this.$store.getters.nodeType(node.type, node.typeVersion);
            if (!nodeTypeData) {
                // If node type is not know use by default the base.noOp data to display it
                nodeTypeData = this.$store.getters.nodeType(constants_1.NO_OP_NODE_TYPE);
            }
            this.__addInputEndpoints(node, nodeTypeData);
            this.__addOutputEndpoints(node, nodeTypeData);
            this.__makeInstanceDraggable(node);
        },
        touchEnd(e) {
            if (this.isTouchDevice) {
                if (this.$store.getters.isActionActive('dragActive')) {
                    this.$store.commit('removeActiveAction', 'dragActive');
                }
            }
        },
        mouseLeftClick(e) {
            // @ts-ignore
            const path = e.path || (e.composedPath && e.composedPath());
            for (let index = 0; index < path.length; index++) {
                if (path[index].className && typeof path[index].className === 'string' && path[index].className.includes('no-select-on-click')) {
                    return;
                }
            }
            if (!this.isTouchDevice) {
                if (this.$store.getters.isActionActive('dragActive')) {
                    this.$store.commit('removeActiveAction', 'dragActive');
                }
                else {
                    if (this.isCtrlKeyPressed(e) === false) {
                        this.$emit('deselectAllNodes');
                    }
                    if (this.$store.getters.isNodeSelected(this.data.name)) {
                        this.$emit('deselectNode', this.name);
                    }
                    else {
                        this.$emit('nodeSelected', this.name);
                    }
                }
            }
        },
    },
});

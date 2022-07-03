"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mouseSelect = void 0;
const vue_typed_mixins_1 = __importDefault(require("vue-typed-mixins"));
const deviceSupportHelpers_1 = require("@/components/mixins/deviceSupportHelpers");
const nodeIndex_1 = require("@/components/mixins/nodeIndex");
const canvasHelpers_1 = require("@/views/canvasHelpers");
exports.mouseSelect = (0, vue_typed_mixins_1.default)(deviceSupportHelpers_1.deviceSupportHelpers, nodeIndex_1.nodeIndex).extend({
    data() {
        return {
            selectActive: false,
            selectBox: document.createElement('span'),
        };
    },
    mounted() {
        this.createSelectBox();
    },
    methods: {
        createSelectBox() {
            this.selectBox.id = 'select-box';
            this.selectBox.style.margin = '0px auto';
            this.selectBox.style.border = '2px dotted #FF0000';
            // Positioned absolutely within #node-view. This is consistent with how nodes are positioned.
            this.selectBox.style.position = 'absolute';
            this.selectBox.style.zIndex = '100';
            this.selectBox.style.visibility = 'hidden';
            this.selectBox.addEventListener('mouseup', this.mouseUpMouseSelect);
            const nodeViewEl = this.$el.querySelector('#node-view');
            nodeViewEl.appendChild(this.selectBox);
        },
        isCtrlKeyPressed(e) {
            if (this.isTouchDevice === true) {
                return true;
            }
            if (this.isMacOs) {
                return e.metaKey;
            }
            return e.ctrlKey;
        },
        getMousePositionWithinNodeView(event) {
            const [x, y] = (0, canvasHelpers_1.getMousePosition)(event);
            // @ts-ignore
            return (0, canvasHelpers_1.getRelativePosition)(x, y, this.nodeViewScale, this.$store.getters.getNodeViewOffsetPosition);
        },
        showSelectBox(event) {
            const [x, y] = this.getMousePositionWithinNodeView(event);
            this.selectBox = Object.assign(this.selectBox, { x, y });
            // @ts-ignore
            this.selectBox.style.left = this.selectBox.x + 'px';
            // @ts-ignore
            this.selectBox.style.top = this.selectBox.y + 'px';
            this.selectBox.style.visibility = 'visible';
            this.selectActive = true;
        },
        updateSelectBox(event) {
            const selectionBox = this.getSelectionBox(event);
            this.selectBox.style.left = selectionBox.x + 'px';
            this.selectBox.style.top = selectionBox.y + 'px';
            this.selectBox.style.width = selectionBox.width + 'px';
            this.selectBox.style.height = selectionBox.height + 'px';
        },
        hideSelectBox() {
            this.selectBox.style.visibility = 'hidden';
            // @ts-ignore
            this.selectBox.x = 0;
            // @ts-ignore
            this.selectBox.y = 0;
            this.selectBox.style.left = '0px';
            this.selectBox.style.top = '0px';
            this.selectBox.style.width = '0px';
            this.selectBox.style.height = '0px';
            this.selectActive = false;
        },
        getSelectionBox(event) {
            const [x, y] = this.getMousePositionWithinNodeView(event);
            return {
                // @ts-ignore
                x: Math.min(x, this.selectBox.x),
                // @ts-ignore
                y: Math.min(y, this.selectBox.y),
                // @ts-ignore
                width: Math.abs(x - this.selectBox.x),
                // @ts-ignore
                height: Math.abs(y - this.selectBox.y),
            };
        },
        getNodesInSelection(event) {
            const returnNodes = [];
            const selectionBox = this.getSelectionBox(event);
            // Go through all nodes and check if they are selected
            this.$store.getters.allNodes.forEach((node) => {
                // TODO: Currently always uses the top left corner for checking. Should probably use the center instead
                if (node.position[0] < selectionBox.x || node.position[0] > (selectionBox.x + selectionBox.width)) {
                    return;
                }
                if (node.position[1] < selectionBox.y || node.position[1] > (selectionBox.y + selectionBox.height)) {
                    return;
                }
                returnNodes.push(node);
            });
            return returnNodes;
        },
        mouseDownMouseSelect(e) {
            if (this.isCtrlKeyPressed(e) === true) {
                // We only care about it when the ctrl key is not pressed at the same time.
                // So we exit when it is pressed.
                return;
            }
            if (this.$store.getters.isActionActive('dragActive')) {
                // If a node does currently get dragged we do not activate the selection
                return;
            }
            this.showSelectBox(e);
            // @ts-ignore // Leave like this. Do not add a anonymous function because then remove would not work anymore
            this.$el.addEventListener('mousemove', this.mouseMoveSelect);
        },
        mouseUpMouseSelect(e) {
            if (this.selectActive === false) {
                if (this.isTouchDevice === true) {
                    // @ts-ignore
                    if (e.target && e.target.id.includes('node-view')) {
                        // Deselect all nodes
                        this.deselectAllNodes();
                    }
                }
                // If it is not active return direcly.
                // Else normal node dragging will not work.
                return;
            }
            // @ts-ignore
            this.$el.removeEventListener('mousemove', this.mouseMoveSelect);
            // Deselect all nodes
            this.deselectAllNodes();
            // Select the nodes which are in the selection box
            const selectedNodes = this.getNodesInSelection(e);
            selectedNodes.forEach((node) => {
                this.nodeSelected(node);
            });
            if (selectedNodes.length === 1) {
                this.$store.commit('setLastSelectedNode', selectedNodes[0].name);
            }
            this.hideSelectBox();
        },
        mouseMoveSelect(e) {
            if (e.buttons === 0) {
                // Mouse button is not pressed anymore so stop selection mode
                // Happens normally when mouse leave the view pressed and then
                // comes back unpressed.
                this.mouseUpMouseSelect(e);
                return;
            }
            this.updateSelectBox(e);
        },
        nodeDeselected(node) {
            this.$store.commit('removeNodeFromSelection', node);
            const nodeElement = `node-${this.getNodeIndex(node.name)}`;
            // @ts-ignore
            this.instance.removeFromDragSelection(nodeElement);
        },
        nodeSelected(node) {
            this.$store.commit('addSelectedNode', node);
            const nodeElement = `node-${this.getNodeIndex(node.name)}`;
            // @ts-ignore
            this.instance.addToDragSelection(nodeElement);
        },
        deselectAllNodes() {
            // @ts-ignore
            this.instance.clearDragSelection();
            this.$store.commit('resetSelectedNodes');
            this.$store.commit('setLastSelectedNode', null);
            this.$store.commit('setLastSelectedNodeOutputIndex', null);
            // @ts-ignore
            this.lastSelectedConnection = null;
            // @ts-ignore
            this.newNodeInsertPosition = null;
        },
    },
});

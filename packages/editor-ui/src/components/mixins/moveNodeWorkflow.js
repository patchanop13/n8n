"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveNodeWorkflow = void 0;
const vue_typed_mixins_1 = __importDefault(require("vue-typed-mixins"));
// @ts-ignore
const normalize_wheel_1 = __importDefault(require("normalize-wheel"));
const deviceSupportHelpers_1 = require("@/components/mixins/deviceSupportHelpers");
const nodeIndex_1 = require("@/components/mixins/nodeIndex");
const canvasHelpers_1 = require("@/views/canvasHelpers");
exports.moveNodeWorkflow = (0, vue_typed_mixins_1.default)(deviceSupportHelpers_1.deviceSupportHelpers, nodeIndex_1.nodeIndex).extend({
    data() {
        return {
            moveLastPosition: [0, 0],
        };
    },
    methods: {
        moveWorkflow(e) {
            const offsetPosition = this.$store.getters.getNodeViewOffsetPosition;
            const [x, y] = (0, canvasHelpers_1.getMousePosition)(e);
            const nodeViewOffsetPositionX = offsetPosition[0] + (x - this.moveLastPosition[0]);
            const nodeViewOffsetPositionY = offsetPosition[1] + (y - this.moveLastPosition[1]);
            this.$store.commit('setNodeViewOffsetPosition', { newOffset: [nodeViewOffsetPositionX, nodeViewOffsetPositionY] });
            // Update the last position
            this.moveLastPosition[0] = x;
            this.moveLastPosition[1] = y;
        },
        mouseDownMoveWorkflow(e) {
            if (this.isCtrlKeyPressed(e) === false) {
                // We only care about it when the ctrl key is pressed at the same time.
                // So we exit when it is not pressed.
                return;
            }
            if (this.$store.getters.isActionActive('dragActive')) {
                // If a node does currently get dragged we do not activate the selection
                return;
            }
            this.$store.commit('setNodeViewMoveInProgress', true);
            const [x, y] = (0, canvasHelpers_1.getMousePosition)(e);
            this.moveLastPosition[0] = x;
            this.moveLastPosition[1] = y;
            // @ts-ignore
            this.$el.addEventListener('mousemove', this.mouseMoveNodeWorkflow);
        },
        mouseUpMoveWorkflow(e) {
            if (this.$store.getters.isNodeViewMoveInProgress === false) {
                // If it is not active return direcly.
                // Else normal node dragging will not work.
                return;
            }
            // @ts-ignore
            this.$el.removeEventListener('mousemove', this.mouseMoveNodeWorkflow);
            this.$store.commit('setNodeViewMoveInProgress', false);
            // Nothing else to do. Simply leave the node view at the current offset
        },
        mouseMoveNodeWorkflow(e) {
            // @ts-ignore
            if (e.target && !e.target.id.includes('node-view')) {
                return;
            }
            if (this.$store.getters.isActionActive('dragActive')) {
                return;
            }
            if (e.buttons === 0) {
                // Mouse button is not pressed anymore so stop selection mode
                // Happens normally when mouse leave the view pressed and then
                // comes back unpressed.
                // @ts-ignore
                this.mouseUp(e);
                return;
            }
            this.moveWorkflow(e);
        },
        wheelMoveWorkflow(e) {
            const normalized = (0, normalize_wheel_1.default)(e);
            const offsetPosition = this.$store.getters.getNodeViewOffsetPosition;
            const nodeViewOffsetPositionX = offsetPosition[0] - (e.shiftKey ? normalized.pixelY : normalized.pixelX);
            const nodeViewOffsetPositionY = offsetPosition[1] - (e.shiftKey ? normalized.pixelX : normalized.pixelY);
            this.$store.commit('setNodeViewOffsetPosition', { newOffset: [nodeViewOffsetPositionX, nodeViewOffsetPositionY] });
        },
    },
});

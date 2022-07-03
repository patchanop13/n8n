"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeIndex = void 0;
const vue_1 = __importDefault(require("vue"));
exports.nodeIndex = vue_1.default.extend({
    methods: {
        getNodeIndex(nodeName) {
            let uniqueId = this.$store.getters.getNodeIndex(nodeName);
            if (uniqueId === -1) {
                this.$store.commit('addToNodeIndex', nodeName);
                uniqueId = this.$store.getters.getNodeIndex(nodeName);
            }
            // We return as string as draggable and jsplumb seems to make problems
            // when numbers are given
            return uniqueId.toString();
        },
    },
});

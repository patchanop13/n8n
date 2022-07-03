"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceSupportHelpers = void 0;
const vue_1 = __importDefault(require("vue"));
exports.deviceSupportHelpers = vue_1.default.extend({
    data() {
        return {
            // @ts-ignore msMaxTouchPoints is deprecated but must fix tablet bugs before fixing this.. otherwise breaks touchscreen computers
            isTouchDevice: 'ontouchstart' in window || navigator.msMaxTouchPoints,
            isMacOs: /(ipad|iphone|ipod|mac)/i.test(navigator.platform), // TODO: `platform` deprecated
        };
    },
    computed: {
        // TODO: Check if used anywhere
        controlKeyCode() {
            if (this.isMacOs) {
                return 'Meta';
            }
            return 'Control';
        },
    },
    methods: {
        isCtrlKeyPressed(e) {
            if (this.isTouchDevice === true) {
                return true;
            }
            if (this.isMacOs) {
                return e.metaKey;
            }
            return e.ctrlKey;
        },
    },
});

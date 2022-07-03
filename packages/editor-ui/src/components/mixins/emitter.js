"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
function broadcast(componentName, eventName, params) {
    // @ts-ignore
    this.$children.forEach(child => {
        const name = child.$options.name;
        if (name === componentName) {
            // @ts-ignore
            // eslint-disable-next-line prefer-spread
            child.$emit.apply(child, [eventName].concat(params));
        }
        else {
            // @ts-ignore
            broadcast.apply(child, [componentName, eventName].concat([params]));
        }
    });
}
exports.default = vue_1.default.extend({
    methods: {
        $dispatch(componentName, eventName, params) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.name;
            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;
                if (parent) {
                    name = parent.$options.name;
                }
            }
            if (parent) {
                // @ts-ignore
                // eslint-disable-next-line prefer-spread
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },
        $broadcast(componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params);
        },
    },
});

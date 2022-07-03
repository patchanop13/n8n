"use strict";
/* tslint:disable:variable-name */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const Pulse_vue_1 = __importDefault(require("./Pulse.vue"));
exports.default = {
    title: 'Atoms/Pulse',
    component: Pulse_vue_1.default,
    argTypes: {},
    parameters: {
        backgrounds: { default: '--color-background-light' },
    },
};
const Default = (args, { argTypes }) => ({
    components: {
        N8nPulse: Pulse_vue_1.default,
    },
    template: '<n8n-pulse> yo </n8n-pulse>',
});
exports.Default = Default;

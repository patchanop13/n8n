"use strict";
/* tslint:disable:variable-name */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const InfoAccordion_vue_1 = __importDefault(require("./InfoAccordion.vue"));
exports.default = {
    title: 'Atoms/Info Accordion',
    component: InfoAccordion_vue_1.default,
    argTypes: {},
    parameters: {
        backgrounds: { default: '--color-background-light' },
    },
};
const Default = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        N8nInfoAccordion: InfoAccordion_vue_1.default,
    },
    template: '<n8n-info-accordion v-bind="$props" @click="onClick" />',
});
exports.Default = Default;
exports.Default.args = {
    title: 'my title',
    description: 'my description',
};

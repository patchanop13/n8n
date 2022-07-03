"use strict";
/* tslint:disable:variable-name */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlEdgeCase = exports.Truncated = exports.Sanitized = exports.Info = exports.Success = exports.Danger = exports.Warning = void 0;
const Notice_vue_1 = __importDefault(require("./Notice.vue"));
exports.default = {
    title: 'Atoms/Notice',
    component: Notice_vue_1.default,
    argTypes: {
        theme: {
            control: 'select',
            options: ['success', 'warning', 'danger', 'info'],
        },
    },
};
const SlotTemplate = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        N8nNotice: Notice_vue_1.default,
    },
    template: `<n8n-notice v-bind="$props">This is a notice! Thread carefully from this point forward.</n8n-notice>`,
});
const PropTemplate = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        N8nNotice: Notice_vue_1.default,
    },
    template: `<n8n-notice v-bind="$props"/>`,
});
exports.Warning = SlotTemplate.bind({});
exports.Warning.args = {
    theme: 'warning',
};
exports.Danger = SlotTemplate.bind({});
exports.Danger.args = {
    theme: 'danger',
};
exports.Success = SlotTemplate.bind({});
exports.Success.args = {
    theme: 'success',
};
exports.Info = SlotTemplate.bind({});
exports.Info.args = {
    theme: 'info',
};
exports.Sanitized = PropTemplate.bind({});
exports.Sanitized.args = {
    theme: 'warning',
    content: '<script>alert(1)</script> This content contains a script tag and is <strong>sanitized</strong>.',
};
exports.Truncated = PropTemplate.bind({});
exports.Truncated.args = {
    theme: 'warning',
    truncate: true,
    content: 'This content is long and will be truncated at 150 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
};
exports.HtmlEdgeCase = PropTemplate.bind({});
exports.HtmlEdgeCase.args = {
    theme: 'warning',
    truncate: true,
    content: 'This content is long and will be truncated at 150 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <a href="">read the documentation</a> ut labore et dolore magna aliqua.',
};

"use strict";
/* tslint:disable:variable-name */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarginLeft = exports.MarginBottom = exports.MarginRight = exports.MarginTop = exports.Margin = exports.PaddingLeft = exports.PaddingBottom = exports.PaddingRight = exports.PaddingTop = exports.Padding = void 0;
const SpacingPreview_vue_1 = __importDefault(require("../styleguide/SpacingPreview.vue"));
exports.default = {
    title: 'Utilities/Spacing',
};
const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        SpacingPreview: SpacingPreview_vue_1.default,
    },
    template: `<spacing-preview v-bind="$props" />`,
});
exports.Padding = Template.bind({});
exports.Padding.args = { property: 'padding' };
exports.PaddingTop = Template.bind({});
exports.PaddingTop.args = { property: 'padding', side: 'top' };
exports.PaddingRight = Template.bind({});
exports.PaddingRight.args = { property: 'padding', side: 'right' };
exports.PaddingBottom = Template.bind({});
exports.PaddingBottom.args = { property: 'padding', side: 'bottom' };
exports.PaddingLeft = Template.bind({});
exports.PaddingLeft.args = { property: 'padding', side: 'left' };
exports.Margin = Template.bind({});
exports.Margin.args = { property: 'margin' };
exports.MarginTop = Template.bind({});
exports.MarginTop.args = { property: 'margin', side: 'top' };
exports.MarginRight = Template.bind({});
exports.MarginRight.args = { property: 'margin', side: 'right' };
exports.MarginBottom = Template.bind({});
exports.MarginBottom.args = { property: 'margin', side: 'bottom' };
exports.MarginLeft = Template.bind({});
exports.MarginLeft.args = { property: 'margin', side: 'left' };

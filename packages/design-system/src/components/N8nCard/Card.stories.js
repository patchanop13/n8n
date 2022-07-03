"use strict";
/* tslint:disable:variable-name */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithHeaderAndFooter = exports.Default = void 0;
const Card_vue_1 = __importDefault(require("./Card.vue"));
exports.default = {
    title: 'Atoms/Card',
    component: Card_vue_1.default,
};
const Default = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        N8nCard: Card_vue_1.default,
    },
    template: `<n8n-card v-bind="$props">This is a card.</n8n-card>`,
});
exports.Default = Default;
const WithHeaderAndFooter = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        N8nCard: Card_vue_1.default,
    },
    template: `<n8n-card v-bind="$props">
		<template #header>Header</template>
		This is a card.
		<template #footer>Footer</template>
	</n8n-card>`,
});
exports.WithHeaderAndFooter = WithHeaderAndFooter;

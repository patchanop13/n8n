"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("@testing-library/vue");
const Badge_vue_1 = __importDefault(require("../Badge.vue"));
describe('components', () => {
    describe('N8nBadge', () => {
        describe('props', () => {
            it('should render default theme correctly', () => {
                const wrapper = (0, vue_1.render)(Badge_vue_1.default, {
                    props: {
                        theme: 'default',
                        size: 'large',
                        bold: true,
                    },
                    slots: {
                        default: '<n8n-text>Default badge</n8n-text>',
                    },
                    stubs: ['n8n-text'],
                });
                expect(wrapper.html()).toMatchSnapshot();
            });
            it('should render secondary theme correctly', () => {
                const wrapper = (0, vue_1.render)(Badge_vue_1.default, {
                    props: {
                        theme: 'secondary',
                        size: 'medium',
                        bold: false,
                    },
                    slots: {
                        default: '<n8n-text>Secondary badge</n8n-text>',
                    },
                    stubs: ['n8n-text'],
                });
                expect(wrapper.html()).toMatchSnapshot();
            });
            it('should render with default values correctly', () => {
                const wrapper = (0, vue_1.render)(Badge_vue_1.default, {
                    slots: {
                        default: '<n8n-text>A Badge</n8n-text>',
                    },
                    stubs: ['n8n-text'],
                });
                expect(wrapper.html()).toMatchSnapshot();
            });
        });
    });
});

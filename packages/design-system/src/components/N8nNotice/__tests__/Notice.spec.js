"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("@testing-library/vue");
const Notice_vue_1 = __importDefault(require("../Notice.vue"));
describe('components', () => {
    describe('N8nNotice', () => {
        it('should render correctly', () => {
            const wrapper = (0, vue_1.render)(Notice_vue_1.default, {
                props: {
                    id: 'notice',
                },
                slots: {
                    default: 'This is a notice.',
                },
                stubs: ['n8n-text'],
            });
            expect(wrapper.html()).toMatchSnapshot();
        });
        describe('props', () => {
            describe('content', () => {
                it('should render correctly with content prop', () => {
                    const wrapper = (0, vue_1.render)(Notice_vue_1.default, {
                        props: {
                            id: 'notice',
                            content: 'This is a notice.',
                        },
                        stubs: ['n8n-text'],
                    });
                    expect(wrapper.html()).toMatchSnapshot();
                });
                it('should render HTML', () => {
                    const wrapper = (0, vue_1.render)(Notice_vue_1.default, {
                        props: {
                            id: 'notice',
                            content: '<strong>Hello world!</strong> This is a notice.',
                        },
                        stubs: ['n8n-text'],
                    });
                    expect(wrapper.container.querySelectorAll('strong')).toHaveLength(1);
                    expect(wrapper.html()).toMatchSnapshot();
                });
                it('should sanitize rendered HTML', () => {
                    const wrapper = (0, vue_1.render)(Notice_vue_1.default, {
                        props: {
                            id: 'notice',
                            content: '<script>alert(1);</script> This is a notice.',
                        },
                        stubs: ['n8n-text'],
                    });
                    expect(wrapper.container.querySelector('script')).not.toBeTruthy();
                    expect(wrapper.html()).toMatchSnapshot();
                });
            });
        });
    });
});

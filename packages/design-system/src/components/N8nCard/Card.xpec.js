"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("@testing-library/vue");
const Card_vue_1 = __importDefault(require("../Card.vue"));
describe('components', () => {
    describe('N8nCard', () => {
        it('should render correctly', () => {
            const wrapper = (0, vue_1.render)(Card_vue_1.default, {
                slots: {
                    default: 'This is a card.',
                },
            });
            expect(wrapper.html()).toMatchSnapshot();
        });
        it('should render correctly with header and footer', () => {
            const wrapper = (0, vue_1.render)(Card_vue_1.default, {
                slots: {
                    header: 'Header',
                    default: 'This is a card.',
                    footer: 'Footer',
                },
            });
            expect(wrapper.html()).toMatchSnapshot();
        });
    });
});

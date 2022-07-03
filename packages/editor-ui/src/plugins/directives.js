"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
const vue2_touch_events_1 = __importDefault(require("vue2-touch-events"));
// @ts-ignore
const v_click_outside_1 = __importDefault(require("v-click-outside"));
vue_1.default.use(vue2_touch_events_1.default);
vue_1.default.use(v_click_outside_1.default);

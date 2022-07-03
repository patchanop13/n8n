"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale_1 = require("../locale");
exports.default = {
    methods: {
        t(...args) {
            return locale_1.t.apply(this, args);
        },
    },
};

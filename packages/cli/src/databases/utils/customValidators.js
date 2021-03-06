"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoXss = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const class_validator_1 = require("class-validator");
function NoXss() {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'NoXss',
            target: object.constructor,
            propertyName,
            constraints: [propertyName],
            options: { message: `Malicious ${propertyName}` },
            validator: {
                validate(value) {
                    return !/<(\s*)?(script|a|http)/.test(value);
                },
            },
        });
    };
}
exports.NoXss = NoXss;

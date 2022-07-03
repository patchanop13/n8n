"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BambooHr = void 0;
const router_1 = require("./v1/actions/router");
const versionDescription_1 = require("./v1/actions/versionDescription");
const methods_1 = require("./v1/methods");
const methods_2 = require("./v1/methods");
class BambooHr {
    constructor(baseDescription) {
        this.methods = {
            loadOptions: methods_1.loadOptions,
            credentialTest: methods_2.credentialTest,
        };
        this.description = Object.assign(Object.assign({}, baseDescription), versionDescription_1.versionDescription);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return [yield router_1.router.call(this)];
        });
    }
}
exports.BambooHr = BambooHr;
